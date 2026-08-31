const BLOCKED_PATTERNS = [
	/\b(navega|navegar|internet|noticias|busca en|googlea)\b/i,
	/\b(abre|visita|consulta|sigue)\b.{0,30}\b(enlace|enlaces|web|sitio externo)\b/i,
	/\b(prompt|mensaje de sistema|variables? privadas?|secretos?|credenciales?)\b/i,
	/\b(ignora|omite|desobedece|olvida|anula)\b.{0,40}\b(reglas|instrucciones|sistema)\b/i,
	/\b(actua como|finge ser)\b.{0,50}\b(administrador|sistema|desarrollador)\b/i,
];

const PRIVATE_PATTERNS = [
	/\b(lista|nomina|nombres?)\b.{0,50}\b(participantes?|asistentes?|beneficiarios?)\b/i,
	/\b(quien es|quien sera|como se llama|nombre|telefono|correo|email|rut|direccion)\b.{0,70}\b(representante|participante|asistente|beneficiario)\b/i,
	/\b(representante|participante|asistente|beneficiario)\b.{0,70}\b(nombre|telefono|correo|email|rut|direccion|como se llama)\b/i,
];

const UNSUPPORTED_PATTERNS = [
	/\b(clima|temperatura|pronostico|lluvia mañana)\b/i,
	/\b(futbol|campeonato|partido|resultado deportivo)\b/i,
	/\b(precio|cuanto cuesta|tarifa|pasaje de avion|vuelo)\b/i,
];

export function classifyQuestion(question) {
	const normalized = String(question).normalize('NFD').replace(/\p{Diacritic}/gu, '');
	if (BLOCKED_PATTERNS.some((pattern) => pattern.test(normalized))) {
		return { allowed: false, reason: 'instruccion-no-permitida' };
	}
	if (PRIVATE_PATTERNS.some((pattern) => pattern.test(normalized))) {
		return { allowed: false, reason: 'informacion-personal' };
	}
	if (UNSUPPORTED_PATTERNS.some((pattern) => pattern.test(normalized))) {
		return { allowed: false, reason: 'fuera-de-alcance' };
	}
	return { allowed: true, reason: 'consulta-interna' };
}
