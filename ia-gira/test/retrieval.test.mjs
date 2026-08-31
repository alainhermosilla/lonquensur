import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLoopback } from '../src/model.mjs';
import { asksAboutClothing, asksAboutVisitedCommunes, asksAboutVisitedOrganizations, asksAboutVisitRecommendations, asksWhatToBringToVisits, asksWhenVisitingOrganization, createRetriever, matchesVisitIdentifier } from '../src/retrieval.mjs';

const fragments = [
	{ id: 'programa:09', titulo: 'COOPEUMO', texto: 'Miércoles 9 de septiembre en Peumo.', fuente: '/programa/', visibilidad: 'publica' },
	{ id: 'faq:alojamiento', titulo: 'Alojamiento', texto: 'El alojamiento aún no está publicado.', fuente: 'fuente-interna:faqs', visibilidad: 'publica' },
];

test('recupera únicamente el fragmento pertinente', () => {
	const retrieve = createRetriever(fragments);
	const [result] = retrieve('¿Qué hacemos en COOPEUMO?');
	assert.equal(result.id, 'programa:09');
	assert.ok(result.score > 0);
});

test('una consulta ajena no produce resultados', () => {
	const retrieve = createRetriever(fragments);
	assert.deepEqual(retrieve('resultado del campeonato mundial'), []);
});

test('reconoce una consulta sobre los aspectos de cada visita', () => {
	assert.equal(asksAboutVisitRecommendations('¿Qué aspectos debo tomar en cuenta para cada una de las visitas?'), true);
	assert.equal(asksAboutVisitRecommendations('¿Qué debo tener en cuenta para las visitas de la gira?'), true);
	assert.equal(asksAboutVisitRecommendations('¿Debo llevar cargador durante las visitas?'), false);
});

test('reconoce una consulta sobre las organizaciones que se visitarán', () => {
	assert.equal(asksAboutVisitedOrganizations('¿Cuáles son las organizaciones que visitaremos?'), true);
	assert.equal(asksAboutVisitedOrganizations('¿Qué debo llevar a las visitas?'), false);
});

test('reconoce una consulta sobre las comunas que se visitarán', () => {
	assert.equal(asksAboutVisitedCommunes('¿Qué comunas se visitan en la gira?'), true);
	assert.equal(asksAboutVisitedCommunes('¿Qué regiones recorrerá la Gira?'), false);
});

test('reconoce cuándo se visitará una organización', () => {
	assert.equal(asksWhenVisitingOrganization('¿Cuándo iremos a COOPEUMO?'), true);
	assert.equal(asksWhenVisitingOrganization('¿Cuándo abre la encuesta de COOPEUMO?'), false);
	assert.equal(matchesVisitIdentifier('¿Cuándo iremos a Tres Piedras?', 'tres-piedras'), true);
	assert.equal(matchesVisitIdentifier('¿Cuándo iremos a Cinco Valles?', 'agricola-cinco-valles'), true);
});

test('reconoce qué se debe llevar a las visitas', () => {
	assert.equal(asksWhatToBringToVisits('¿Qué debo llevar a las visitas?'), true);
	assert.equal(asksWhatToBringToVisits('¿Debo llevar cargador durante las visitas?'), false);
});

test('reconoce consultas variadas sobre vestimenta', () => {
	assert.equal(asksAboutClothing('¿Debo llevar alguna ropa en especial?'), true);
	assert.equal(asksAboutClothing('¿Cómo debería vestirme para la gira?'), true);
	assert.equal(asksAboutClothing('¿Qué calzado y chaqueta conviene llevar?'), true);
	assert.equal(asksAboutClothing('¿Debo llevar cargador durante las visitas?'), false);
});

test('solo permite un modelo HTTP local', () => {
	assert.doesNotThrow(() => assertLoopback('http://127.0.0.1:11434'));
	assert.throws(() => assertLoopback('https://api.example.com'));
	assert.throws(() => assertLoopback('http://example.com'));
});
