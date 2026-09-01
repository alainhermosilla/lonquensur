const baseUrl = (process.env.IA_GIRA_URL ?? 'http://127.0.0.1:8787').replace(/\/$/, '');
const origin = process.env.ALLOWED_ORIGIN ?? 'https://gira.lonquensur.cl';
const concurrency = Number.parseInt(process.env.CONCURRENCY ?? '30', 10);
const question = process.env.QUESTION ?? '¿Qué debo llevar a las visitas?';

if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 100) {
	throw new Error('CONCURRENCY debe ser un entero entre 1 y 100');
}

const started = performance.now();
const results = await Promise.all(Array.from({ length: concurrency }, async (_, index) => {
	const requestStarted = performance.now();
	try {
		const response = await fetch(`${baseUrl}/v1/consultar`, {
			method: 'POST',
			headers: { 'content-type': 'application/json', origin },
			body: JSON.stringify({ pregunta: question }),
			signal: AbortSignal.timeout(60_000),
		});
		const payload = await response.json().catch(() => ({}));
		return {
			index: index + 1,
			status: response.status,
			ok: response.ok && Boolean(payload.respuesta),
			mode: payload.modo ?? 'directo/modelo',
			ms: Math.round(performance.now() - requestStarted),
		};
	} catch (error) {
		return { index: index + 1, status: 0, ok: false, error: error.message, ms: Math.round(performance.now() - requestStarted) };
	}
}));

const times = results.map(({ ms }) => ms).sort((a, b) => a - b);
const counts = (key) => Object.fromEntries(
	Object.entries(Object.groupBy(results, key)).map(([name, items]) => [name, items.length]),
);
const summary = {
	url: baseUrl,
	concurrency,
	ok: results.filter((result) => result.ok).length,
	failed: results.filter((result) => !result.ok).length,
	statusCodes: counts((result) => String(result.status)),
	modes: counts((result) => result.mode ?? 'error'),
	latencyMs: {
		min: times[0],
		median: times[Math.floor(times.length / 2)],
		p95: times[Math.min(times.length - 1, Math.ceil(times.length * 0.95) - 1)],
		max: times.at(-1),
	},
	totalMs: Math.round(performance.now() - started),
};

console.log(JSON.stringify(summary, null, 2));
if (summary.failed) process.exitCode = 1;
