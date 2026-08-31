import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const corpusPath = new URL('../../gira-innovacion/dist/conocimiento.json', import.meta.url);
const corpus = JSON.parse(await readFile(corpusPath, 'utf8'));
const serialized = JSON.stringify(corpus);

test('el corpus público solo contiene fragmentos públicos', () => {
	assert.ok(corpus.fragmentos.length > 0);
	assert.ok(corpus.fragmentos.every((fragment) => fragment.visibilidad === 'publica'));
	assert.ok(corpus.fragmentos.every((fragment) => fragment.tipo !== 'participante'));
});

test('solo publica los teléfonos autorizados del equipo coordinador', () => {
	const allowedPhones = new Set(['+56 9 9846 4849', '+56 9 8827 8525', '+56 9 9888 9356']);
	const publishedPhones = new Set(serialized.match(/\+56 9 \d{4} \d{4}/g) ?? []);
	assert.deepEqual(publishedPhones, allowedPhones);
});

test('no incorpora archivos privados ni nóminas personales al corpus', () => {
	assert.doesNotMatch(serialized, /NOMINA GIRA|\.xlsx|participantes\.ts|Descargas\//i);
	assert.doesNotMatch(serialized, /representanteNombre|correoPersonal|rutParticipante/i);
});
