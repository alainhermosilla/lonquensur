import { resolve } from 'node:path';

const integer = (value, fallback) => {
	const parsed = Number.parseInt(value ?? '', 10);
	return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = Object.freeze({
	host: process.env.HOST ?? '127.0.0.1',
	port: integer(process.env.PORT, 8787),
	knowledgePath: resolve(process.env.KNOWLEDGE_PATH ?? '../gira-innovacion/dist/conocimiento.json'),
	allowedOrigin: process.env.ALLOWED_ORIGIN ?? 'https://gira.lonquensur.cl',
	modelBaseUrl: process.env.MODEL_BASE_URL ?? 'http://127.0.0.1:11434',
	modelName: process.env.MODEL_NAME ?? '',
	modelKeepAlive: process.env.MODEL_KEEP_ALIVE ?? '30m',
	warmModelOnStart: (process.env.WARM_MODEL_ON_START ?? 'true') === 'true',
	topK: integer(process.env.TOP_K, 5),
	minScore: Number(process.env.MIN_SCORE ?? 0.16),
	maxQuestionLength: integer(process.env.MAX_QUESTION_LENGTH, 500),
	modelContext: integer(process.env.MODEL_NUM_CTX, 4096),
	modelMaxOutput: integer(process.env.MODEL_NUM_PREDICT, 220),
	rateLimitPerMinute: integer(process.env.RATE_LIMIT_PER_MINUTE, 20),
});
