// Save data in localStorage, versioned. Bump SAVE_VERSION and add a migration when the shape changes.
export const SAVE_VERSION = 1;
const KEY = 'lantern-keeper/save';

const migrations = {};

export function migrate(data) {
  let s = data;
  while (s && s.version < SAVE_VERSION) {
    const step = migrations[s.version];
    if (!step) return null;
    s = step(s);
  }
  return s && s.version === SAVE_VERSION ? s : null;
}

export function load(storage = globalThis.localStorage) {
  try {
    return migrate(JSON.parse(storage.getItem(KEY)));
  } catch {
    return null;
  }
}

export function write(state, storage = globalThis.localStorage) {
  try {
    storage.setItem(KEY, JSON.stringify({ ...state, version: SAVE_VERSION }));
  } catch {
    // storage full or blocked: play on without saving
  }
}
