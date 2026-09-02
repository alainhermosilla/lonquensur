import { createServer } from 'node:http';
import { clientKey } from './client-key.mjs';
import { config } from './config.mjs';
import { loadKnowledge } from './knowledge.mjs';
import { askLocalModel, warmLocalModel } from './model.mjs';
import { buildMessages, NO_INFORMATION } from './prompt.mjs';
import { asksAboutClothing, asksAboutHealthEmergency, asksAboutTourPurpose, asksAboutVisitedCommunes, asksAboutVisitedOrganizations, asksAboutVisitRecommendations, asksWhatToBringToVisits, asksWhenVisitingOrganization, createRetriever, matchDirectFaq, matchesVisitIdentifier, programDateForWeekdayQuestion } from './retrieval.mjs';
import { classifyQuestion } from './guardrails.mjs';
import { expandTemporalQuery, resolveRelativeDate } from './temporal.mjs';
import { ModelGate } from './model-gate.mjs';

const corpus = await loadKnowledge(config.knowledgePath);
const retrieve = createRetriever(corpus.fragmentos);
const buckets = new Map();
const modelGate = new ModelGate({
	concurrency: config.modelConcurrency,
	maxQueue: config.modelMaxQueue,
	waitMs: config.modelQueueWaitMs,
});
const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function normalizeText(value) {
	return String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function contextsForExplicitDate(question) {
	const normalized = normalizeText(question);
	if (!/\b(que hacemos|programa|actividades|itinerario|donde (?:vamos|iremos|estaremos)|que (?:se )?(?:visita|visitamos|veremos))\b/.test(normalized)) return null;
	const dates = new Set(corpus.fragmentos.map((fragmento) => fragmento.fecha).filter(Boolean));
	for (const date of dates) {
		const [, month, day] = date.split('-').map(Number);
		const expression = new RegExp(`\\b0?${day}\\s+de\\s+${monthNames[month - 1]}\\b`);
		if (!expression.test(normalized)) continue;
		return corpus.fragmentos
			.filter((fragmento) => fragmento.tipo === 'programa' && fragmento.fecha === date)
			.map((fragmento) => ({ ...fragmento, score: 2 }));
	}
	return null;
}

function contextsForWeekdayProgram(question) {
	const date = programDateForWeekdayQuestion(question);
	if (!date) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.tipo === 'programa' && fragmento.fecha === date)
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForRelativeProgramDate(question) {
	const date = resolveRelativeDate(question);
	if (!date) return null;
	const normalized = normalizeText(question);
	if (!/\b(que hacemos|programa|actividades|itinerario|donde (?:vamos|iremos|estaremos)|que (?:se )?(?:visita|visitamos|veremos))\b/.test(normalized)) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.tipo === 'programa' && fragmento.fecha === date)
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForVisitRecommendations(question) {
	if (!asksAboutVisitRecommendations(question)) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.tipo === 'recomendacion')
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForVisitedOrganizations(question) {
	if (!asksAboutVisitedOrganizations(question)) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.tipo === 'visita')
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForVisitedCommunes(question) {
	if (!asksAboutVisitedCommunes(question)) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.tipo === 'visita')
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForVisitSchedule(question) {
	if (!asksWhenVisitingOrganization(question)) return null;
	const normalized = normalizeText(question);
	const visit = corpus.fragmentos.find(
		(fragmento) => fragmento.tipo === 'visita'
			&& (normalized.includes(normalizeText(fragmento.titulo)) || matchesVisitIdentifier(question, fragmento.visitaId)),
	);
	if (!visit?.visitaId) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.tipo === 'programa' && fragmento.visitaId === visit.visitaId)
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForWhatToBring(question) {
	if (!asksWhatToBringToVisits(question)) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.id === 'faq:agua-mochila')
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForClothing(question) {
	if (!asksAboutClothing(question)) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.id === 'faq:vestimenta')
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForHealthEmergency(question) {
	if (!asksAboutHealthEmergency(question)) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.id === 'faq:emergencia-salud')
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForTourPurpose(question) {
	if (!asksAboutTourPurpose(question)) return null;
	return corpus.fragmentos
		.filter((fragmento) => fragmento.id === 'faq:objetivo-gira')
		.map((fragmento) => ({ ...fragmento, score: 2 }));
}

function contextsForDirectFaq(question) {
	const match = matchDirectFaq(question, corpus.fragmentos);
	return match ? [{ ...match, score: 2 }] : null;
}

function formatVisitRecommendations(contexts) {
	const items = contexts.map((context, index) => {
		const detail = context.texto
			.split('\n')
			.find((line) => line.trim() && line.trim() !== context.titulo);
		return `${index + 1}. ${context.titulo}${detail ? `: ${detail}` : ''}`;
	});
	return `Para aprovechar cada visita, toma en cuenta estos aspectos:\n\n${items.join('\n')}`;
}

function formatVisitedOrganizations(contexts) {
	const items = contexts.map((context, index) => {
		const lines = context.texto.split('\n').map((line) => line.trim()).filter(Boolean);
		const location = lines.find((line) => /\b(comuna|region)\b/i.test(line));
		return `${index + 1}. ${context.titulo}${location ? ` — ${location}` : ''}`;
	});
	return `Las organizaciones que visitaremos son:\n\n${items.join('\n')}`;
}

function formatVisitedCommunes(contexts) {
	const items = contexts.map((context, index) => {
		const location = context.texto
			.split('\n')
			.map((line) => line.trim())
			.find((line) => /^comuna\b/i.test(line));
		const commune = location?.match(/^Comuna\s+(.+?)(?:\s+·|$)/i)?.[1] ?? location ?? 'Comuna no indicada';
		return `${index + 1}. ${commune} — ${context.titulo}`;
	});
	return `Las comunas que se visitan en la Gira son:\n\n${items.join('\n')}`;
}

function formatVisitSchedule(contexts) {
	const context = contexts[0];
	const lines = context.texto.split('\n').map((line) => line.trim()).filter(Boolean);
	const period = lines[0]?.toLowerCase() ?? 'jornada indicada';
	const organization = lines[1] ?? context.titulo;
	const location = lines[2] ?? '';
	const [year, month, day] = context.fecha.split('-').map(Number);
	const date = new Intl.DateTimeFormat('es-CL', {
		weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
	}).format(new Date(Date.UTC(year, month - 1, day)));
	return `La visita a ${organization} será el ${date}, durante la ${period}${location ? `, en ${location}` : ''}.`;
}

function formatProgramForDate(contexts) {
	const date = contexts[0]?.fecha;
	const formattedDate = date
		? new Intl.DateTimeFormat('es-CL', {
			weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
		}).format(new Date(`${date}T00:00:00Z`))
		: 'la fecha consultada';
	const activities = contexts.map((context) => context.texto.trim()).filter(Boolean);
	return `Según el programa del ${formattedDate}:\n\n${activities.join('\n\n')}`;
}

function formatRetrievedInformation(contexts) {
	const excerpts = contexts.slice(0, 3).map((context) => context.texto.trim()).filter(Boolean);
	return `Encontré esta información oficial relacionada con tu pregunta:\n\n${excerpts.join('\n\n')}`;
}

function chileNow() {
	return new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'America/Santiago', dateStyle: 'short', timeStyle: 'medium',
	}).format(new Date());
}

function rateLimited(request) {
	const key = clientKey(request);
	const minute = Math.floor(Date.now() / 60_000);
	const bucket = buckets.get(key);
	if (!bucket || bucket.minute !== minute) {
		buckets.set(key, { minute, count: 1 });
		return false;
	}
	bucket.count += 1;
	return bucket.count > config.rateLimitPerMinute;
}

function send(response, status, payload, origin) {
	response.writeHead(status, {
		'content-type': 'application/json; charset=utf-8',
		'cache-control': 'no-store',
		'content-security-policy': "default-src 'none'",
		'x-content-type-options': 'nosniff',
		'referrer-policy': 'no-referrer',
		'vary': 'Origin',
		...(origin === config.allowedOrigin ? { 'access-control-allow-origin': origin } : {}),
	});
	response.end(JSON.stringify(payload));
}

async function readJson(request) {
	let raw = '';
	for await (const chunk of request) {
		raw += chunk;
		if (raw.length > 8_192) throw new Error('Solicitud demasiado grande');
	}
	return JSON.parse(raw || '{}');
}

const server = createServer(async (request, response) => {
	const origin = request.headers.origin;
	if (request.method === 'GET' && request.url === '/health') {
		return send(response, 200, { ok: true, corpus: corpus.total, modelConfigured: Boolean(config.modelName) }, origin);
	}
	if (request.method === 'OPTIONS' && request.url === '/v1/consultar') {
		if (origin !== config.allowedOrigin) return send(response, 403, { error: 'Origen no permitido' }, origin);
		response.writeHead(204, {
			'access-control-allow-origin': origin,
			'access-control-allow-methods': 'POST',
			'access-control-allow-headers': 'content-type',
			'access-control-max-age': '600',
		});
		return response.end();
	}
	if (request.method !== 'POST' || request.url !== '/v1/consultar') {
		return send(response, 404, { error: 'Ruta no encontrada' }, origin);
	}
	if (origin !== config.allowedOrigin) return send(response, 403, { error: 'Origen no permitido' }, origin);
	if (rateLimited(request)) return send(response, 429, { error: 'Demasiadas consultas' }, origin);

	try {
		const { pregunta } = await readJson(request);
		if (typeof pregunta !== 'string' || !pregunta.trim() || pregunta.length > config.maxQuestionLength) {
			return send(response, 400, { error: 'Pregunta inválida' }, origin);
		}

		if (!classifyQuestion(pregunta).allowed) {
			return send(response, 200, { respuesta: NO_INFORMATION, fuentes: [] }, origin);
		}

		const consultaRecuperacion = expandTemporalQuery(pregunta);
		const explicitDateContexts = contextsForExplicitDate(pregunta);
		const relativeDateContexts = contextsForRelativeProgramDate(pregunta);
		const weekdayProgramContexts = contextsForWeekdayProgram(pregunta);
		const visitScheduleContexts = contextsForVisitSchedule(pregunta);
		const healthEmergencyContexts = contextsForHealthEmergency(pregunta);
		const tourPurposeContexts = contextsForTourPurpose(pregunta);
		const directFaqContexts = contextsForDirectFaq(pregunta);
		const clothingContexts = contextsForClothing(pregunta);
		const whatToBringContexts = contextsForWhatToBring(pregunta);
		let contexts = relativeDateContexts
			?? explicitDateContexts
			?? weekdayProgramContexts
			?? visitScheduleContexts
			?? healthEmergencyContexts
			?? tourPurposeContexts
			?? directFaqContexts
			?? clothingContexts
			?? whatToBringContexts
			?? contextsForVisitedCommunes(pregunta)
			?? contextsForVisitedOrganizations(pregunta)
			?? contextsForVisitRecommendations(pregunta)
			?? retrieve(consultaRecuperacion, { topK: config.topK });
		const usedApproximateFallback = !(
			relativeDateContexts || explicitDateContexts || weekdayProgramContexts || visitScheduleContexts
			|| healthEmergencyContexts || tourPurposeContexts || directFaqContexts
			|| clothingContexts || whatToBringContexts
			|| asksAboutVisitedCommunes(pregunta) || asksAboutVisitedOrganizations(pregunta)
			|| asksAboutVisitRecommendations(pregunta)
		);
		if (usedApproximateFallback) {
			contexts = contexts.filter((context) => context.tipo !== 'faq' && context.matchedDistinctTokens >= 2);
		}
		if (!/\b(encuesta|encuestas|formulario|formularios)\b/i.test(pregunta)) {
			contexts = contexts.filter((context) => context.tipo !== 'encuesta');
		}
		if (!contexts.length || contexts[0].score < config.minScore) {
			return send(response, 200, { respuesta: NO_INFORMATION, fuentes: [] }, origin);
		}

		if (visitScheduleContexts) {
			return send(response, 200, {
				respuesta: formatVisitSchedule(contexts),
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
			}, origin);
		}

		if (relativeDateContexts || explicitDateContexts || weekdayProgramContexts) {
			return send(response, 200, {
				respuesta: formatProgramForDate(contexts),
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
			}, origin);
		}

		if (asksAboutVisitedCommunes(pregunta)) {
			return send(response, 200, {
				respuesta: formatVisitedCommunes(contexts),
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
			}, origin);
		}

		if (asksAboutVisitedOrganizations(pregunta)) {
			return send(response, 200, {
				respuesta: formatVisitedOrganizations(contexts),
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
			}, origin);
		}

		if (asksAboutVisitRecommendations(pregunta)) {
			return send(response, 200, {
				respuesta: formatVisitRecommendations(contexts),
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
			}, origin);
		}

		const directFaqWasConfidentlyMatched = healthEmergencyContexts
			|| tourPurposeContexts
			|| directFaqContexts
			|| clothingContexts
			|| whatToBringContexts;
		if (directFaqWasConfidentlyMatched && contexts[0].tipo === 'faq' && contexts[0].respuestaDirecta) {
			return send(response, 200, {
				respuesta: contexts[0].respuestaDirecta,
				fuentes: [{ id: contexts[0].id, titulo: contexts[0].titulo, fuente: contexts[0].fuente, score: contexts[0].score }],
			}, origin);
		}

		const releaseModel = await modelGate.acquire();
		if (!releaseModel) {
			return send(response, 200, {
				respuesta: formatRetrievedInformation(contexts),
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
				modo: 'recuperacion',
			}, origin);
		}

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 30_000);
		try {
			const respuesta = await askLocalModel({
				baseUrl: config.modelBaseUrl,
				modelName: config.modelName,
				messages: buildMessages(pregunta, contexts, chileNow()),
				signal: controller.signal,
				numCtx: config.modelContext,
				numPredict: config.modelMaxOutput,
				keepAlive: config.modelKeepAlive,
			});
			return send(response, 200, {
				respuesta,
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
				modo: 'modelo',
			}, origin);
		} catch (error) {
			console.error('El modelo no respondió; se usa recuperación directa:', error.message);
			return send(response, 200, {
				respuesta: formatRetrievedInformation(contexts),
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
				modo: 'recuperacion-modelo-no-disponible',
			}, origin);
		} finally {
			clearTimeout(timeout);
			releaseModel();
		}
	} catch (error) {
		console.error(error);
		return send(response, 503, { error: 'El asistente no está disponible temporalmente' }, origin);
	}
});

server.listen(config.port, config.host, () => {
	console.log(`IA Gira escuchando en http://${config.host}:${config.port}`);
	if (config.warmModelOnStart && config.modelName) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 120_000);
		warmLocalModel({
			baseUrl: config.modelBaseUrl,
			modelName: config.modelName,
			keepAlive: config.modelKeepAlive,
			signal: controller.signal,
		})
			.then(() => console.log(`Modelo ${config.modelName} precargado`))
			.catch((error) => console.error('No fue posible precargar el modelo:', error.message))
			.finally(() => clearTimeout(timeout));
	}
});
