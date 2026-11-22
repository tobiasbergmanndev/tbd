import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dueIn, water } from '../src/plants.js';

const DAY = 24 * 60 * 60 * 1000;

test('a plant watered today is due in its interval', () => {
  assert.equal(dueIn({ lastWatered: 0, everyDays: 3 }, 0), 3);
});

test('an overdue plant has a negative due count', () => {
  assert.ok(dueIn({ lastWatered: 0, everyDays: 1 }, 3 * DAY) < 0);
});

test('watering resets the clock', () => {
  assert.equal(water({ lastWatered: 0, everyDays: 2 }, 5).lastWatered, 5);
});
