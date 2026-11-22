// When to remind about each plant: the moment it becomes due, moved out of quiet hours
// (21:00 to 08:00 local time) to 08:00.
import { dueIn } from '../plants.js';

const DAY = 24 * 60 * 60 * 1000;
export const QUIET_FROM = 21;
export const QUIET_UNTIL = 8;

export function outOfQuietHours(time) {
  const d = new Date(time);
  const h = d.getHours();
  if (h >= QUIET_FROM) {
    d.setDate(d.getDate() + 1);
    d.setHours(QUIET_UNTIL, 0, 0, 0);
  } else if (h < QUIET_UNTIL) {
    d.setHours(QUIET_UNTIL, 0, 0, 0);
  }
  return d.getTime();
}

export function nextReminders(plants, now) {
  return plants
    .map((p) => ({ name: p.name, at: outOfQuietHours(now + dueIn(p, now) * DAY) }))
    .sort((a, b) => a.at - b.at);
}
