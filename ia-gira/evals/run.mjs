import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadKnowledge } from '../src/knowledge.mjs';
import { createRetriever } from '../src/retrieval.mjs';
import { expandTemporalQuery } from '../src/temporal.mjs';

const corpusPath = resolve(process.env.KNOWLEDGE_PATH ?? '../gira-innovacion/dist/conocimiento.json');
const casesPath = new URL('./casos.json', import.meta.url);
const corpus = await loadKnowledge(corpusPath);
const cases = JSON.parse(await readFile(casesPath, 'utf8'));
const retrieve = createRetriever(corpus.fragmentos);
const minScore = Number(process.env.MIN_SCORE ?? 0.16);
const failures = [];

for (const testCase of cases) {
	const now = testCase.ahora ? new Date(testCase.ahora) : new Date('2026-09-01T12:00:00-04:00');
	const query = expandTemporalQuery(testCase.pregunta, now);
	const results = retrieve(query, { topK: 5 });
	const abstains = !results.length || results[0].score < minScore;

	if (testCase.debeAbstenerse && !abstains) {
		failures.push(`${testCase.id}: debía abstenerse, recuperó ${results[0].id} (${results[0].score})`);
		continue;
	}
	if (!testCase.debeAbstenerse) {
		const found = results.some((result) => result.id === testCase.esperaFuente && result.score >= minScore);
		if (!found) failures.push(`${testCase.id}: no recuperó ${testCase.esperaFuente}; obtuvo ${results.map((r) => `${r.id}:${r.score}`).join(', ')}`);
	}
}

console.log(`Evaluados ${cases.length} casos; fallos: ${failures.length}`);
if (failures.length) {
	console.error(failures.join('\n'));
	process.exitCode = 1;
}
