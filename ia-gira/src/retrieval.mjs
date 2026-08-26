const STOPWORDS = new Set(['a','al','algo','como','con','cual','cuando','de','del','donde','el','en','es','esta','este','hay','la','las','lo','los','me','mi','para','por','que','se','si','su','un','una','y']);

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

export function createRetriever(fragmentos) {
	const documents = fragmentos.map((fragmento) => ({
		fragmento,
		tokens: tokenize(`${fragmento.titulo} ${fragmento.texto}`),
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
				return { ...document.fragmento, score: Number(normalized.toFixed(4)) };
			})
			.filter((result) => result.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, topK);
	};
}
