import test from 'node:test';
import assert from 'node:assert/strict';
import { expandTemporalQuery } from '../src/temporal.mjs';

test('resuelve mañana usando la fecha de Chile', () => {
	const expanded = expandTemporalQuery('¿Qué hacemos mañana?', new Date('2026-09-08T23:30:00-03:00'));
	assert.match(expanded, /2026-09-09/);
	assert.match(expanded, /9 de septiembre de 2026/);
});

test('respeta Chile aunque UTC esté en el día siguiente', () => {
	const expanded = expandTemporalQuery('¿Qué hacemos hoy?', new Date('2026-09-09T01:30:00Z'));
	assert.match(expanded, /2026-09-08/);
});
