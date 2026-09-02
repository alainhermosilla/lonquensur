const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function chileParts(now) {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
	}).formatToParts(now);
	return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function relativeDate(now, days) {
	const parts = chileParts(now);
	const date = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day) + days));
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();
	const day = date.getUTCDate();
	return {
		iso: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
		text: `${day} de ${MESES[month]} de ${year}`,
	};
}

export function expandTemporalQuery(question, now = new Date()) {
	const normalized = question.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
	const additions = [];
	if (/\bhoy\b/.test(normalized)) {
		const date = relativeDate(now, 0);
		additions.push(`hoy corresponde a ${date.iso}, ${date.text}`);
	}
	if (/\bmanana\b/.test(normalized)) {
		const date = relativeDate(now, 1);
		additions.push(`mañana corresponde a ${date.iso}, ${date.text}`);
	}
	if (/\bayer\b/.test(normalized)) {
		const date = relativeDate(now, -1);
		additions.push(`ayer corresponde a ${date.iso}, ${date.text}`);
	}
	return additions.length ? `${question}\n${additions.join('\n')}` : question;
}

export function resolveRelativeDate(question, now = new Date()) {
	const normalized = String(question).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
	if (/\bmanana\b/.test(normalized)) return relativeDate(now, 1).iso;
	if (/\bhoy\b/.test(normalized)) return relativeDate(now, 0).iso;
	if (/\bayer\b/.test(normalized)) return relativeDate(now, -1).iso;
	return null;
}
