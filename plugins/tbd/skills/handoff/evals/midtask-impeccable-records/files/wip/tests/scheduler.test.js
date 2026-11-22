import { test } from 'node:test';
import assert from 'node:assert/strict';
import { outOfQuietHours, nextReminders } from '../src/notify/scheduler.js';

const at = (y, m, d, h, min = 0) => new Date(y, m - 1, d, h, min).getTime();

test('daytime reminders stay where they are', () => {
  assert.equal(outOfQuietHours(at(2026, 11, 22, 14)), at(2026, 11, 22, 14));
});

test('late evening moves to 08:00 the next day', () => {
  assert.equal(outOfQuietHours(at(2026, 11, 22, 22)), at(2026, 11, 23, 8));
});

test('early morning moves to 08:00 the same day', () => {
  assert.equal(outOfQuietHours(at(2026, 11, 22, 5)), at(2026, 11, 22, 8));
});

test('21:00 sharp is already quiet', () => {
  assert.equal(outOfQuietHours(at(2026, 11, 22, 21)), at(2026, 11, 23, 8));
});

test('reminders come soonest first', () => {
  const day = 24 * 60 * 60 * 1000;
  const now = at(2026, 11, 22, 12);
  const plants = [
    { name: 'Fern', lastWatered: now - day, everyDays: 3 },
    { name: 'Cactus', lastWatered: now - day, everyDays: 2 },
  ];
  assert.deepEqual(nextReminders(plants, now).map((r) => r.name), ['Cactus', 'Fern']);
});
