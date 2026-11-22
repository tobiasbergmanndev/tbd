// Renders the lamp, the oil gauge and the keeper's log into one canvas.
export function createView(canvas) {
  const ctx = canvas.getContext('2d');
  const lines = [];
  return {
    show(state) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = state.lit ? '#ffd27a' : '#333';
      ctx.beginPath();
      ctx.arc(180, 160, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eee';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Oil: ${state.oil}`, 20, 300);
      lines.slice(-6).forEach((l, i) => ctx.fillText(l, 20, 340 + i * 22));
    },
    log(line) {
      lines.push(line);
    },
  };
}
