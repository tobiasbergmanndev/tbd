// Web Audio, unlocked by the first tap. iOS Safari only unlocks on pointerup/click, not touchstart.
let ctx;

export function unlockAudio() {
  ctx ??= new AudioContext();
  ctx.resume();
}

export function chime(freq = 660) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.6);
}
