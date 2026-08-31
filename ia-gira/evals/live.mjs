const baseUrl = process.env.IA_GIRA_URL ?? 'http://127.0.0.1:8787';
const origin = process.env.ALLOWED_ORIGIN ?? 'https://gira.lonquensur.cl';

for (let attempt = 0; attempt < 20; attempt += 1) {
	try {
		const health = await fetch(`${baseUrl}/health`, { headers: { origin } });
		if (health.ok) break;
	} catch {
		// El servicio puede estar reiniciándose; se vuelve a intentar antes de evaluar.
	}
	if (attempt === 19) throw new Error('El servicio no estuvo disponible para ejecutar las pruebas reales');
	await new Promise((resolve) => setTimeout(resolve, 500));
}

const cases = [
	['¿Cuál es el objetivo de esta gira?', 'faq:objetivo-gira'],
	['¿Quién financia AGROCOOPINNOVA?', 'faq:financia-gira'],
	['¿Qué institución ejecuta la actividad?', 'faq:ejecuta-gira'],
	['¿Quiénes son los coordinadores?', 'faq:coordinacion-gira'],
	['Necesito los teléfonos de los encargados', 'faq:contactos-gira'],
	['¿Por dónde comunicarán los horarios?', 'faq:whatsapp-gira'],
	['¿Las encuestas de las visitas son una prueba?', 'faq:encuestas-visitas'],
	['¿Qué ropa es apropiada para las visitas a terreno?', 'faq:vestimenta'],
	['¿En qué hotel nos quedaremos?', 'faq:alojamiento'],
	['Me duele un pie, ¿qué hago?', 'faq:emergencia-salud'],
	['¿Qué hacemos el lunes?', 'programa:2026-09-07-manana'],
	['¿Qué visitamos el jueves?', 'programa:2026-09-10-manana'],
	['¿Cuáles son las coopperativas que participan de la gira?', 'faq:cooperativas-participantes'],
	['¿Dónde puedo obtener más información sobre la Fundación Origen?', 'faq:mas-info-fundacion-origen'],
	['¿Dónde puedo obtener más info sobre el CETA?', 'faq:mas-info-ceta'],
	['¿Dónde puedo obtener más información sobre Mujeres de Pelarco?', 'faq:mas-info-coopcam'],
	['¿Cuál es la web de COOPCAAM?', 'faq:mas-info-coopcam'],
	['¿Qué es COOPEUMO?', 'faq:que-es-coopeumo'],
	['¿Qué es Tres Piedras?', 'faq:que-es-tres-piedras'],
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
