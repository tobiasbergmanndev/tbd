import { createView } from './render.js';
import { pour, tick } from './lamp.js';
import { load, write } from './save.js';

const view = createView(document.querySelector('#game'));
let state = load() ?? { version: 1, oil: 8, lit: true, night: 1 };

view.root.querySelector('.pour').addEventListener('click', () => {
  state = pour(state);
  view.show(state);
});

setInterval(() => {
  state = tick(state);
  view.show(state);
  write(state);
}, 1000);

view.log('Night 1. The sea is calm.');
view.show(state);
