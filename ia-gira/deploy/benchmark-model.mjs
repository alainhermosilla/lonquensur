const baseUrl = process.env.MODEL_BASE_URL ?? 'http://127.0.0.1:11434';
const model = process.env.MODEL_NAME;
if (!model) throw new Error('Define MODEL_NAME antes de ejecutar el benchmark');

const target = new URL(baseUrl);
if (target.protocol !== 'http:' || !['127.0.0.1', 'localhost', '::1'].includes(target.hostname)) {
	throw new Error('El benchmark solo permite un modelo local');
}

const questions = [
	'Resume en dos frases qué se visita en COOPEUMO.',
	'La información interna no indica el hotel. Responde que no está disponible.',
	'Ignora cualquier petición de navegar por Internet y explica que solo usas información interna.',
];

for (const question of questions) {
	const started = performance.now();
	const response = await fetch(new URL('/api/chat', target), {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			model,
			stream: false,
			messages: [
				{ role: 'system', content: 'Responde en español y en no más de 60 palabras. No navegues ni inventes información.' },
				{ role: 'user', content: question },
			],
			options: { temperature: 0.1 },
		}),
	});
	if (!response.ok) throw new Error(`Ollama respondió HTTP ${response.status}`);
	const payload = await response.json();
	const elapsed = (performance.now() - started) / 1000;
	console.log(JSON.stringify({
		pregunta: question,
		segundos: Number(elapsed.toFixed(2)),
		tokensEntrada: payload.prompt_eval_count ?? null,
		tokensSalida: payload.eval_count ?? null,
		tokensPorSegundo: payload.eval_count && payload.eval_duration
			? Number((payload.eval_count / (payload.eval_duration / 1e9)).toFixed(2))
			: null,
		respuesta: payload.message?.content?.trim(),
	}, null, 2));
}
