const STOPWORDS = new Set(['a','al','algo','como','con','cual','cuando','de','del','dime','donde','el','en','es','esta','este','favor','hay','hola','la','las','lo','los','me','mi','necesito','para','podrias','por','puedes','que','saber','se','si','su','un','una','y']);

export function tokenize(text) {
	return String(text)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.split(/\s+/)
		.filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

export function asksAboutVisitRecommendations(question) {
	const normalized = String(question)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
	if (!/\bvisitas?\b/.test(normalized)) return false;
	return /\b(cada|todas?)\b/.test(normalized)
		|| /\baspectos?\b/.test(normalized)
		|| /\b(tener|tomar)\s+en\s+cuenta\b/.test(normalized)
		|| /\bconsiderar\b/.test(normalized);
}

export function asksAboutVisitedOrganizations(question) {
	const normalized = String(question)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
	return /\borganizaciones?\b/.test(normalized)
		&& /\b(visitar(?:emos|an|a|as)?|visitas?|conocer(?:emos|an)?)\b/.test(normalized);
}

export function asksAboutVisitedCommunes(question) {
	const normalized = String(question)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
	return /\bcomunas?\b/.test(normalized)
		&& /\b(visitar(?:emos|an|a|as)?|visitas?|gira)\b/.test(normalized);
}

export function asksWhenVisitingOrganization(question) {
	const normalized = String(question)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
	if (/\b(encuesta|formulario)\b/.test(normalized)) return false;
	return /\b(cuando|que\s+dia|en\s+que\s+fecha)\b/.test(normalized)
		&& /\b(ir(?:emos|an|a)?|vamos|visitar(?:emos|an|a)?)\b/.test(normalized);
}

export function matchesVisitIdentifier(question, visitId) {
	const generic = new Set(['agricola', 'cooperativa', 'fundacion']);
	const queryTokens = new Set(tokenize(question));
	const identifierTokens = tokenize(String(visitId).replaceAll('-', ' '))
		.filter((token) => !generic.has(token));
	return identifierTokens.length > 0 && identifierTokens.every((token) => queryTokens.has(token));
}

export function asksWhatToBringToVisits(question) {
	const normalized = String(question)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
	return /\b(que\s+debo|que\s+conviene|que\s+hay\s+que)\s+llevar\b/.test(normalized)
		&& /\bvisitas?\b/.test(normalized);
}

export function asksAboutClothing(question) {
	const normalized = String(question)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
	return /\b(ropa|vestimenta|vestir(?:me|se)?|calzado|zapatos?|zapatillas?|chaqueta|abrigo|impermeable|cortaviento|que\s+ponerme|como\s+vestirme)\b/.test(normalized);
}

export function asksAboutHealthEmergency(question) {
	const normalized = String(question)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
	return /\b(accident[a-z]*|malestar|salud|enferm[a-z]*|emergencia|urgencia|medic[a-z]*|lesion[a-z]*|herid[a-z]*|golp[a-z]*|cai|caid[a-z]*|dolor[a-z]*|duel[a-z]*|fiebre|mare[a-z]*|alerg[a-z]*|hospital|clinica|ambulancia|primeros\s+auxilios|siento\s+mal)\b/.test(normalized);
}

export function asksAboutTourPurpose(question) {
	const normalized = String(question)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
	if (/\b(encuesta|visita|rompehielo)\b/.test(normalized)) return false;
	if (/\b(objetivo|proposito|finalidad)\b/.test(normalized)) return true;
	return /\b(para\s+que\s+(?:es|sirve|se\s+(?:hace|realiza))|que\s+busca|que\s+pretende)\b/.test(normalized)
		&& /\bgira\b/.test(normalized);
}

function normalizeForMatch(value) {
	return String(value)
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.replace(/\bcoop+erativas\b/g, 'cooperativas')
		.replace(/\bcoopca+m\b/g, 'coopcam')
		.trim();
}

export function matchDirectFaq(question, fragments, { minScore = 0.72 } = {}) {
	const normalizedQuestion = normalizeForMatch(question);
	const queryTokens = new Set(tokenize(question));
	if (!normalizedQuestion || !queryTokens.size) return null;
	const asksForOfficialSite = /\b(mas info(?:rmacion)?|sitio(?: oficial)?|pagina(?: web)?|web|saber mas|conocer mas)\b/.test(normalizedQuestion);
	const asksForDescription = /\b(que es|que hace|hablame de|a que se dedica|quienes son)\b/.test(normalizedQuestion);

	let best = null;
	for (const fragment of fragments) {
		if (fragment.tipo !== 'faq' || !fragment.respuestaDirecta) continue;
		if (fragment.id.startsWith('faq:mas-info-') && !asksForOfficialSite) continue;
		if (fragment.id.startsWith('faq:que-es-') && !asksForDescription) continue;
		for (const candidate of fragment.consultas ?? [fragment.titulo]) {
			const normalizedCandidate = normalizeForMatch(candidate);
			if (normalizedQuestion === normalizedCandidate) return { ...fragment, score: 3 };
			const candidateTokens = new Set(tokenize(candidate));
			if (!candidateTokens.size) continue;
			const shared = [...queryTokens].filter((token) => candidateTokens.has(token)).length;
			if (!shared) continue;
			const queryCoverage = shared / queryTokens.size;
			const candidateCoverage = shared / candidateTokens.size;
			const substringBoost = normalizedQuestion.includes(normalizedCandidate)
				|| normalizedCandidate.includes(normalizedQuestion) ? 0.12 : 0;
			const score = (queryCoverage * 0.65) + (candidateCoverage * 0.35) + substringBoost;
			if (shared < 2 && queryTokens.size > 1 && candidateTokens.size > 1) continue;
			if (!best || score > best.score) best = { ...fragment, score: Number(score.toFixed(4)) };
		}
	}
	return best && best.score >= minScore ? best : null;
}

export function programDateForWeekdayQuestion(question) {
	const normalized = normalizeForMatch(question);
	if (!/\b(que hacemos|programa|actividades|itinerario|donde (?:vamos|iremos|estaremos)|que (?:visitamos|veremos))\b/.test(normalized)) return null;
	const dates = {
		domingo: '2026-09-06', lunes: '2026-09-07', martes: '2026-09-08',
		miercoles: '2026-09-09', jueves: '2026-09-10', viernes: '2026-09-11',
	};
	for (const [weekday, date] of Object.entries(dates)) {
		if (new RegExp(`\\b${weekday}\\b`).test(normalized)) return date;
	}
	return null;
}

export function createRetriever(fragmentos) {
	const genericTokens = new Set(['gira', 'agrocoopinnova', '2026', 'durante']);
	const documents = fragmentos.map((fragmento) => ({
		fragmento,
		tokens: tokenize(`${fragmento.titulo} ${fragmento.texto} ${(fragmento.categorias ?? []).join(' ')}`),
		categoryTokens: new Set(tokenize((fragmento.categorias ?? []).join(' '))),
	}));
	const documentFrequency = new Map();

	for (const document of documents) {
		for (const token of new Set(document.tokens)) {
			documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
		}
	}

	return function retrieve(question, { topK = 5 } = {}) {
		const query = tokenize(question);
		if (!query.length) return [];
		const querySet = new Set(query);

		return documents
			.map((document) => {
				const frequencies = new Map();
				for (const token of document.tokens) frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
				let score = 0;
				for (const token of querySet) {
					const tf = frequencies.get(token) ?? 0;
					if (!tf) continue;
					const idf = Math.log((documents.length + 1) / ((documentFrequency.get(token) ?? 0) + 1)) + 1;
					score += (1 + Math.log(tf)) * idf;
				}
				const normalized = score / Math.sqrt(Math.max(1, document.tokens.length) * querySet.size);
				const categoryMatches = [...querySet].filter((token) => document.categoryTokens.has(token)).length;
				const categoryBoost = categoryMatches * 0.25;
				const matchedDistinctTokens = [...querySet]
					.filter((token) => !genericTokens.has(token) && frequencies.has(token)).length;
				return { ...document.fragmento, score: Number((normalized + categoryBoost).toFixed(4)), matchedDistinctTokens };
			})
			.filter((result) => result.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, topK);
	};
}
