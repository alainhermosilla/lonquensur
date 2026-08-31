import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLoopback } from '../src/model.mjs';
import { asksAboutClothing, asksAboutHealthEmergency, asksAboutTourPurpose, asksAboutVisitedCommunes, asksAboutVisitedOrganizations, asksAboutVisitRecommendations, asksWhatToBringToVisits, asksWhenVisitingOrganization, createRetriever, matchDirectFaq, matchesVisitIdentifier, programDateForWeekdayQuestion } from '../src/retrieval.mjs';

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

test('reconoce consultas variadas sobre accidentes y problemas de salud', () => {
	const variants = [
		'¿Qué debo hacer si tengo un accidente durante la gira?',
		'Me siento mal',
		'¿A quién aviso si me enfermo?',
		'Necesito asistencia médica',
		'¿Qué hago si un compañero se lesiona?',
		'Tengo fiebre y mareos',
		'Me caí y me golpeé',
		'Tengo mucho dolor',
		'Me duele el estómago, ¿qué hago?',
		'A un compañero le duele la cabeza',
		'¿Qué hago si necesito medicamentos?',
		'Tuve una reacción alérgica',
		'Hay una persona herida',
		'¿Cuáles son los contactos para una emergencia?',
	];
	for (const question of variants) assert.equal(asksAboutHealthEmergency(question), true, question);
	assert.equal(asksAboutHealthEmergency('¿Qué ropa debo llevar?'), false);
});

test('reconoce consultas sobre el objetivo de la gira', () => {
	const variants = [
		'¿Cuál es el objetivo de esta gira?',
		'¿Cuál es el propósito de la gira?',
		'¿Para qué se realiza la gira?',
		'¿Qué busca la Gira de Innovación 2026?',
	];
	for (const question of variants) assert.equal(asksAboutTourPurpose(question), true, question);
	assert.equal(asksAboutTourPurpose('¿Qué debo llevar a la gira?'), false);
	assert.equal(asksAboutTourPurpose('¿Cuál es el objetivo de la encuesta final?'), false);
});

test('asigna variantes al FAQ directo correcto y rechaza coincidencias débiles', () => {
	const faqFragments = [
		{ id: 'faq:financia', tipo: 'faq', titulo: '¿Quién financia la gira?', consultas: ['¿Quién financia la gira?', '¿La gira es financiada por FIA?'], respuestaDirecta: 'FIA.', texto: '', fuente: '', visibilidad: 'publica' },
		{ id: 'faq:whatsapp', tipo: 'faq', titulo: '¿Para qué sirve WhatsApp?', consultas: ['¿Por dónde se informarán los avisos?', '¿Para qué sirve el WhatsApp de la gira?'], respuestaDirecta: 'WhatsApp.', texto: '', fuente: '', visibilidad: 'publica' },
	];
	assert.equal(matchDirectFaq('¿LA GIRA ES FINANCIADA POR FIA?', faqFragments)?.id, 'faq:financia');
	assert.equal(matchDirectFaq('¿Por dónde se informarán los avisos?', faqFragments)?.id, 'faq:whatsapp');
	assert.equal(matchDirectFaq('¿Qué regiones visita la gira?', faqFragments), null);
});

test('resuelve consultas del programa por día de la semana', () => {
	assert.equal(programDateForWeekdayQuestion('¿Qué hacemos el lunes?'), '2026-09-07');
	assert.equal(programDateForWeekdayQuestion('¿Cuál es el programa del miércoles?'), '2026-09-09');
	assert.equal(programDateForWeekdayQuestion('¿Qué visitamos el jueves?'), '2026-09-10');
	assert.equal(programDateForWeekdayQuestion('¿Qué ropa llevo el lunes?'), null);
});

test('solo permite un modelo HTTP local', () => {
	assert.doesNotThrow(() => assertLoopback('http://127.0.0.1:11434'));
	assert.throws(() => assertLoopback('https://api.example.com'));
	assert.throws(() => assertLoopback('http://example.com'));
});
