const baseUrl = process.env.IA_GIRA_URL ?? 'http://127.0.0.1:8787';

const health = await fetch(`${baseUrl}/health`);
if (!health.ok) throw new Error(`Health falló con HTTP ${health.status}`);
const status = await health.json();
if (!status.ok || !status.corpus) throw new Error('Health no informa un corpus válido');

const origin = process.env.ALLOWED_ORIGIN ?? 'https://gira.lonquensur.cl';
const emergencyQuestion = '¿Qué debo hacer si tengo un accidente durante la gira?';
const expectedEmergencyAnswer = 'Debes contactar inmediatamente a las personas encargadas de la Gira de Innovación 2026:\n\n- Alain Hermosilla Ringger: +56 9 9846 4849\n- Ignacio Fernández Uribe: +56 9 8827 8525\n- Ximena Uribe Álvarez: +56 9 9888 9356\n\nEllos te dirán qué hacer.';
const answer = await fetch(`${baseUrl}/v1/consultar`, {
	method: 'POST',
	headers: { 'content-type': 'application/json', origin },
	body: JSON.stringify({ pregunta: emergencyQuestion }),
});
if (!answer.ok) throw new Error(`Consulta falló con HTTP ${answer.status}`);
const payload = await answer.json();
if (!payload.respuesta) throw new Error('La API no entregó respuesta');
if (payload.respuesta !== expectedEmergencyAnswer) {
	throw new Error('La respuesta de emergencia no coincide exactamente con el texto oficial');
}
if (!payload.fuentes?.some((fuente) => fuente.id === 'faq:emergencia-salud')) {
	throw new Error('La respuesta de emergencia no informa la fuente oficial esperada');
}

console.log(JSON.stringify({ health: status, consulta: payload }, null, 2));
