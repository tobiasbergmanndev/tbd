import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pour, tick, OIL_MAX, OIL_PER_TAP } from '../src/lamp.js';

test('pouring adds oil up to the maximum', () => {
  assert.equal(pour({ oil: 0 }).oil, OIL_PER_TAP);
  assert.equal(pour({ oil: OIL_MAX }).oil, OIL_MAX);
});

test('the lamp goes out when the oil runs out', () => {
  assert.equal(tick({ oil: 1, lit: true }).lit, false);
});

test('a burn factor burns oil faster', () => {
  assert.equal(tick({ oil: 10, lit: true }, 2).oil, 8);
});
