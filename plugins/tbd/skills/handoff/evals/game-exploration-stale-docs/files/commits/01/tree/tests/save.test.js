import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrate, SAVE_VERSION } from '../src/save.js';

test('current saves load unchanged', () => {
  const s = { version: SAVE_VERSION, oil: 5 };
  assert.equal(migrate(s).oil, 5);
});

test('unknown versions are dropped', () => {
  assert.equal(migrate({ version: 99 }), null);
});
