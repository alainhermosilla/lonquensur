const BLOCKED_PATTERNS = [
	/\b(navega|navegar|internet|noticias|busca en|googlea)\b/i,
	/\b(abre|visita|consulta|sigue)\b.{0,30}\b(enlace|enlaces|web|sitio externo)\b/i,
	/\b(prompt|mensaje de sistema|variables? privadas?|secretos?|credenciales?)\b/i,
	/\b(ignora|omite|desobedece)\b.{0,40}\b(reglas|instrucciones|sistema)\b/i,
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
	if (UNSUPPORTED_PATTERNS.some((pattern) => pattern.test(normalized))) {
		return { allowed: false, reason: 'fuera-de-alcance' };
	}
	return { allowed: true, reason: 'consulta-interna' };
}
