import assert from 'node:assert/strict';
import test from 'node:test';
import { ModelGate } from '../src/model-gate.mjs';

test('limita las generaciones simultaneas', async () => {
	const gate = new ModelGate({ concurrency: 1, maxQueue: 0 });
	const release = await gate.acquire();
	assert.equal(typeof release, 'function');
	assert.equal(await gate.acquire(), null);
	assert.deepEqual(gate.status(), { active: 1, queued: 0 });
	release();
	assert.deepEqual(gate.status(), { active: 0, queued: 0 });
});

test('entrega el turno siguiente cuando se libera el modelo', async () => {
	const gate = new ModelGate({ concurrency: 1, maxQueue: 1, waitMs: 100 });
	const releaseFirst = await gate.acquire();
	const second = gate.acquire();
	releaseFirst();
	const releaseSecond = await second;
	assert.equal(typeof releaseSecond, 'function');
	releaseSecond();
	assert.deepEqual(gate.status(), { active: 0, queued: 0 });
});

test('abandona la cola rapidamente para usar la respuesta extractiva', async () => {
	const gate = new ModelGate({ concurrency: 1, maxQueue: 1, waitMs: 10 });
	const release = await gate.acquire();
	assert.equal(await gate.acquire(), null);
	release();
	assert.deepEqual(gate.status(), { active: 0, queued: 0 });
});
