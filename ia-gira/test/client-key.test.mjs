import test from 'node:test';
import assert from 'node:assert/strict';
import { clientKey } from '../src/client-key.mjs';

test('usa la IP validada de Cloudflare cuando el túnel conecta por loopback', () => {
	const request = { socket: { remoteAddress: '127.0.0.1' }, headers: { 'cf-connecting-ip': '203.0.113.24' } };
	assert.equal(clientKey(request), '203.0.113.24');
});

test('ignora una cabecera inválida y conserva loopback', () => {
	const request = { socket: { remoteAddress: '127.0.0.1' }, headers: { 'cf-connecting-ip': 'dirección falsa' } };
	assert.equal(clientKey(request), '127.0.0.1');
});

test('no confía en la cabecera cuando la conexión no viene por loopback', () => {
	const request = { socket: { remoteAddress: '10.0.0.8' }, headers: { 'cf-connecting-ip': '203.0.113.24' } };
	assert.equal(clientKey(request), '10.0.0.8');
});
