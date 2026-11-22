// Plants and their watering schedule. Times are milliseconds since the epoch.
const DAY = 24 * 60 * 60 * 1000;

export function dueIn(plant, now) {
  const next = plant.lastWatered + plant.everyDays * DAY;
  return Math.ceil((next - now) / DAY);
}

export function water(plant, now) {
  return { ...plant, lastWatered: now };
}
