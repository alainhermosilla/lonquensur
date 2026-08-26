import { createServer } from 'node:http';
import { config } from './config.mjs';
import { loadKnowledge } from './knowledge.mjs';
import { askLocalModel } from './model.mjs';
import { buildMessages, NO_INFORMATION } from './prompt.mjs';
import { createRetriever } from './retrieval.mjs';

const corpus = await loadKnowledge(config.knowledgePath);
const retrieve = createRetriever(corpus.fragmentos);
const buckets = new Map();

function chileNow() {
	return new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'America/Santiago', dateStyle: 'short', timeStyle: 'medium',
	}).format(new Date());
}

function clientKey(request) {
	return request.socket.remoteAddress ?? 'unknown';
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

		const contexts = retrieve(pregunta, { topK: config.topK });
		if (!contexts.length || contexts[0].score < config.minScore) {
			return send(response, 200, { respuesta: NO_INFORMATION, fuentes: [] }, origin);
		}

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 30_000);
		try {
			const respuesta = await askLocalModel({
				baseUrl: config.modelBaseUrl,
				modelName: config.modelName,
				messages: buildMessages(pregunta, contexts, chileNow()),
				signal: controller.signal,
			});
			return send(response, 200, {
				respuesta,
				fuentes: contexts.map(({ id, titulo, fuente, score }) => ({ id, titulo, fuente, score })),
			}, origin);
		} finally {
			clearTimeout(timeout);
		}
	} catch (error) {
		console.error(error);
		return send(response, 503, { error: 'El asistente no está disponible temporalmente' }, origin);
	}
});

server.listen(config.port, config.host, () => {
	console.log(`IA Gira escuchando en http://${config.host}:${config.port}`);
});
