// Renders the lamp, the oil gauge and the keeper's log as DOM; the glow is a CSS radial gradient.
export function createView(root) {
  root.innerHTML = `
    <div class="glow"></div>
    <p class="oil" aria-live="polite"></p>
    <ol class="log"></ol>
    <button class="pour">Pour oil</button>`;
  return {
    root,
    show(state) {
      root.dataset.lit = String(state.lit);
      root.dataset.weather = state.weather ?? 'calm';
      root.querySelector('.oil').textContent = `Oil: ${state.oil}`;
    },
    log(line) {
      const li = document.createElement('li');
      li.textContent = line;
      root.querySelector('.log').append(li);
    },
  };
}
