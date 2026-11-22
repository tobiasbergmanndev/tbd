// Oil and light: the keeper taps to pour oil; the lamp burns it every tick.
export const OIL_MAX = 20;
export const OIL_PER_TAP = 2;
export const BURN_PER_TICK = 1;

export function pour(state) {
  return { ...state, oil: Math.min(OIL_MAX, state.oil + OIL_PER_TAP) };
}

export function tick(state, burnFactor = 1) {
  const oil = Math.max(0, state.oil - BURN_PER_TICK * burnFactor);
  return { ...state, oil, lit: oil > 0 };
}
