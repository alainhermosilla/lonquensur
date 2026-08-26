const baseUrl = process.env.IA_GIRA_URL ?? 'http://127.0.0.1:8787';

const health = await fetch(`${baseUrl}/health`);
if (!health.ok) throw new Error(`Health falló con HTTP ${health.status}`);
const status = await health.json();
if (!status.ok || !status.corpus) throw new Error('Health no informa un corpus válido');

const origin = process.env.ALLOWED_ORIGIN ?? 'https://gira.lonquensur.cl';
const answer = await fetch(`${baseUrl}/v1/consultar`, {
	method: 'POST',
	headers: { 'content-type': 'application/json', origin },
	body: JSON.stringify({ pregunta: '¿Cuál es el alojamiento de la Gira?' }),
});
if (!answer.ok) throw new Error(`Consulta falló con HTTP ${answer.status}`);
const payload = await answer.json();
if (!payload.respuesta) throw new Error('La API no entregó respuesta');

console.log(JSON.stringify({ health: status, consulta: payload }, null, 2));
