import { readFile } from 'node:fs/promises';

export async function loadKnowledge(path) {
	const raw = await readFile(path, 'utf8');
	const corpus = JSON.parse(raw);

	if (corpus.navegacionWebPermitida !== false) {
		throw new Error('El corpus no declara explícitamente la navegación web como deshabilitada');
	}
	if (!Array.isArray(corpus.fragmentos) || corpus.fragmentos.length === 0) {
		throw new Error('El corpus no contiene fragmentos');
	}

	const fragmentos = corpus.fragmentos.filter(
		(fragmento) => fragmento.visibilidad === 'publica' && typeof fragmento.texto === 'string',
	);

	if (fragmentos.length !== corpus.fragmentos.length) {
		throw new Error('El corpus contiene fragmentos no públicos; se rechaza por seguridad');
	}

	return { ...corpus, fragmentos };
}
