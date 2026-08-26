function assertLoopback(baseUrl) {
	const url = new URL(baseUrl);
	const allowed = new Set(['127.0.0.1', 'localhost', '::1']);
	if (url.protocol !== 'http:' || !allowed.has(url.hostname)) {
		throw new Error('MODEL_BASE_URL debe apuntar por HTTP a localhost');
	}
	return url;
}

export async function askLocalModel({ baseUrl, modelName, messages, signal }) {
	if (!modelName) throw new Error('MODEL_NAME no está configurado');
	const base = assertLoopback(baseUrl);
	const endpoint = new URL('/api/chat', base);

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ model: modelName, messages, stream: false, options: { temperature: 0.1 } }),
		signal,
	});
	if (!response.ok) throw new Error(`El modelo local respondió ${response.status}`);
	const payload = await response.json();
	const answer = payload?.message?.content?.trim();
	if (!answer) throw new Error('El modelo local no entregó una respuesta');
	return answer;
}

export { assertLoopback };
