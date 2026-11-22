// Storms (exploration): some nights the oil burns faster.
export const STORM_CHANCE = 0.25; // per night
export const STORM_BURN = 2; // oil burns this many times faster in a storm

// rng: a function returning a number in [0, 1)
export function nightWeather(rng) {
  return rng() < STORM_CHANCE ? 'storm' : 'calm';
}

export function burnFactor(weather) {
  return weather === 'storm' ? STORM_BURN : 1;
}
