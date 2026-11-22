import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nightWeather, burnFactor, STORM_CHANCE } from '../src/storms.js';
import { migrate } from '../src/save.js';

test('a low roll brings a storm', () => {
  assert.equal(nightWeather(() => STORM_CHANCE - 0.01), 'storm');
  assert.equal(nightWeather(() => STORM_CHANCE), 'calm');
});

test('storms burn oil faster', () => {
  assert.ok(burnFactor('storm') > burnFactor('calm'));
});

test('v1 saves migrate to v2 with storms', () => {
  const s = migrate({ version: 1, oil: 3, lit: true, night: 4 });
  assert.equal(s.version, 2);
  assert.deepEqual(s.storms, { seen: 0 });
});
