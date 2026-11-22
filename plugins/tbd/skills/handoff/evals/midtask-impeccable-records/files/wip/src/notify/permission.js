// Asks for notification permission at the right moment: only after the first plant is added,
// never on first load (asking before the app has shown its worth gets a "no" forever).
export function shouldAskPermission(plants, permission = globalThis.Notification?.permission) {
  if (!permission || permission !== 'default') return false;
  return plants.length >= 1;
}

export async function askPermission() {
  if (!('Notification' in globalThis)) return 'unsupported';
  return Notification.requestPermission();
}
