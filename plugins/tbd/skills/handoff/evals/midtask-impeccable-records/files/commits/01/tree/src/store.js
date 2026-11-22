// Plants in localStorage. Never throws: storage can be full or blocked.
const KEY = 'sprout/plants';

export function loadPlants() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function savePlants(plants) {
  try {
    localStorage.setItem(KEY, JSON.stringify(plants));
  } catch {
    // play on without saving
  }
}
