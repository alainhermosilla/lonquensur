const baseUrl = process.env.IA_GIRA_URL ?? 'http://127.0.0.1:8787';
const origin = process.env.ALLOWED_ORIGIN ?? 'https://gira.lonquensur.cl';
const cases = [
	['¿Cuál es el objetivo de esta gira?', 'faq:objetivo-gira'],
	['¿Quién financia AGROCOOPINNOVA?', 'faq:financia-gira'],
	['¿Qué institución ejecuta la actividad?', 'faq:ejecuta-gira'],
	['¿Quiénes son los coordinadores?', 'faq:coordinacion-gira'],
	['Necesito los teléfonos de los encargados', 'faq:contactos-gira'],
	['¿Qué vamos a aprender?', 'faq:enfoques-aprendizaje'],
	['¿Por dónde comunicarán los horarios?', 'faq:whatsapp-gira'],
	['¿Las encuestas de las visitas son una prueba?', 'faq:encuestas-visitas'],
	['¿Qué evalúa la encuesta de término?', 'faq:encuesta-final'],
	['¿Qué ropa es apropiada para las visitas a terreno?', 'faq:vestimenta'],
	['¿En qué hotel nos quedaremos?', 'faq:alojamiento'],
	['Me duele un pie, ¿qué hago?', 'faq:emergencia-salud'],
	['¿Qué hacemos el lunes?', 'programa:2026-09-07-manana'],
	['¿Qué visitamos el jueves?', 'programa:2026-09-10-manana'],
];

const failures = [];
for (const [pregunta, expectedSource] of cases) {
	const response = await fetch(`${baseUrl}/v1/consultar`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', origin },
		body: JSON.stringify({ pregunta }),
	});
	const payload = await response.json();
	if (!response.ok || !payload.fuentes?.some((source) => source.id === expectedSource)) {
		failures.push(`${pregunta} -> ${payload.fuentes?.map((source) => source.id).join(', ') || 'sin fuente'}`);
	}
}

const unknownResponse = await fetch(`${baseUrl}/v1/consultar`, {
	method: 'POST',
	headers: { 'content-type': 'application/json', origin },
	body: JSON.stringify({ pregunta: '¿Quién conducirá el bus de la gira?' }),
});
const unknown = await unknownResponse.json();
if (!unknownResponse.ok || unknown.fuentes?.length) failures.push('La consulta sin información no se abstuvo');

console.log(`Pruebas reales: ${cases.length + 1}; fallos: ${failures.length}`);
if (failures.length) {
	console.error(failures.join('\n'));
	process.exitCode = 1;
}
