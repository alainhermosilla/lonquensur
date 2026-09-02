import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadKnowledge } from '../src/knowledge.mjs';
import { asksAboutClothing, asksAboutHealthEmergency, asksAboutTourPurpose, asksWhatToBringToVisits, createRetriever, matchDirectFaq, programDateForWeekdayQuestion } from '../src/retrieval.mjs';
import { expandTemporalQuery, resolveRelativeDate } from '../src/temporal.mjs';
import { classifyQuestion } from '../src/guardrails.mjs';

const corpusPath = resolve(process.env.KNOWLEDGE_PATH ?? '../gira-innovacion/dist/conocimiento.json');
const casesPath = new URL('./casos.json', import.meta.url);
const corpus = await loadKnowledge(corpusPath);
const cases = JSON.parse(await readFile(casesPath, 'utf8'));
const retrieve = createRetriever(corpus.fragmentos);
const minScore = Number(process.env.MIN_SCORE ?? 0.16);
const failures = [];
const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function explicitProgramDate(question) {
	const normalized = String(question).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
	if (!/\b(que hacemos|programa|actividades|itinerario|donde (?:vamos|iremos|estaremos)|que (?:se )?(?:visita|visitamos|veremos))\b/.test(normalized)) return null;
	const dates = new Set(corpus.fragmentos.filter((fragment) => fragment.tipo === 'programa').map((fragment) => fragment.fecha).filter(Boolean));
	for (const date of dates) {
		const [, month, day] = date.split('-').map(Number);
		if (new RegExp(`\\b0?${day}\\s+de\\s+${monthNames[month - 1]}\\b`).test(normalized)) return date;
	}
	return null;
}

for (const testCase of cases) {
	const now = testCase.ahora ? new Date(testCase.ahora) : new Date('2026-09-01T12:00:00-04:00');
	const allowed = classifyQuestion(testCase.pregunta).allowed;
	const query = expandTemporalQuery(testCase.pregunta, now);
	const directFaq = allowed ? matchDirectFaq(testCase.pregunta, corpus.fragmentos) : null;
	const normalizedQuestion = String(testCase.pregunta).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
	const asksRelativeProgram = /\b(que hacemos|programa|actividades|itinerario|donde (?:vamos|iremos|estaremos)|que (?:se )?(?:visita|visitamos|veremos))\b/.test(normalizedQuestion);
	const relativeDate = allowed && asksRelativeProgram ? resolveRelativeDate(testCase.pregunta, now) : null;
	const explicitDate = allowed ? explicitProgramDate(testCase.pregunta) : null;
	const weekdayDate = allowed ? programDateForWeekdayQuestion(testCase.pregunta) : null;
	const clothing = allowed && asksAboutClothing(testCase.pregunta);
	const whatToBring = allowed && asksWhatToBringToVisits(testCase.pregunta);
	let results = !allowed
		? []
		: relativeDate || explicitDate || weekdayDate
			? corpus.fragmentos
				.filter((fragmento) => fragmento.tipo === 'programa' && fragmento.fecha === (relativeDate ?? explicitDate ?? weekdayDate))
				.map((fragmento) => ({ ...fragmento, score: 2 }))
		: asksAboutHealthEmergency(testCase.pregunta)
			? corpus.fragmentos
				.filter((fragmento) => fragmento.id === 'faq:emergencia-salud')
				.map((fragmento) => ({ ...fragmento, score: 2 }))
			: asksAboutTourPurpose(testCase.pregunta)
				? corpus.fragmentos
					.filter((fragmento) => fragmento.id === 'faq:objetivo-gira')
					.map((fragmento) => ({ ...fragmento, score: 2 }))
			: directFaq
				? [{ ...directFaq, score: 2 }]
			: clothing
				? corpus.fragmentos.filter((fragmento) => fragmento.id === 'faq:vestimenta').map((fragmento) => ({ ...fragmento, score: 2 }))
			: whatToBring
				? corpus.fragmentos.filter((fragmento) => fragmento.id === 'faq:agua-mochila').map((fragmento) => ({ ...fragmento, score: 2 }))
			: retrieve(query, { topK: 5 });
	if (allowed && !relativeDate && !explicitDate && !weekdayDate && !directFaq && !clothing && !whatToBring && !asksAboutHealthEmergency(testCase.pregunta) && !asksAboutTourPurpose(testCase.pregunta)) {
		results = results.filter((result) => result.tipo !== 'faq' && result.matchedDistinctTokens >= 2);
	}
	const abstains = !allowed || !results.length || results[0].score < minScore;

	if (testCase.debeAbstenerse && !abstains) {
		failures.push(`${testCase.id}: debía abstenerse, recuperó ${results[0].id} (${results[0].score})`);
		continue;
	}
	if (!testCase.debeAbstenerse) {
		const expected = testCase.esperaFuentes ?? [testCase.esperaFuente];
		const found = results.some((result) => expected.includes(result.id) && result.score >= minScore);
		if (!found) failures.push(`${testCase.id}: no recuperó ${testCase.esperaFuente}; obtuvo ${results.map((r) => `${r.id}:${r.score}`).join(', ')}`);
		if (testCase.soloTipo && results.some((result) => result.tipo !== testCase.soloTipo)) {
			failures.push(`${testCase.id}: mezcló tipos distintos de ${testCase.soloTipo}: ${results.map((result) => `${result.id}:${result.tipo}`).join(', ')}`);
		}
	}
}

let aliasCases = 0;
for (const fragment of corpus.fragmentos.filter((item) => item.tipo === 'faq')) {
	for (const consulta of fragment.consultas ?? []) {
		const forms = new Set([
			consulta,
			consulta.toLowerCase().replace(/[¿?.,]/g, ''),
			`Hola, necesito saber: ${consulta} por favor`,
		]);
		for (const form of forms) {
			aliasCases += 1;
			const match = matchDirectFaq(form, corpus.fragmentos);
			if (match?.id !== fragment.id) {
				failures.push(`alias ${fragment.id}: "${form}" recuperó ${match?.id ?? 'ningún FAQ'}`);
			}
		}
	}
}

console.log(`Evaluados ${cases.length} casos generales y ${aliasCases} variantes FAQ; fallos: ${failures.length}`);
if (failures.length) {
	console.error(failures.join('\n'));
	process.exitCode = 1;
}
