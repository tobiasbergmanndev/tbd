import { createView } from './render.js';
import { pour, tick } from './lamp.js';
import { nightWeather, burnFactor } from './storms.js';
import { load, write } from './save.js';

const NIGHT_TICKS = 60;
const view = createView(document.querySelector('#game'));
let state = load() ?? { version: 2, oil: 8, lit: true, night: 1, weather: 'calm', storms: { seen: 0 } };
let ticks = 0;

view.root.querySelector('.pour').addEventListener('click', () => {
  state = pour(state);
  view.show(state);
});

setInterval(() => {
  state = tick(state, burnFactor(state.weather));
  if (++ticks % NIGHT_TICKS === 0) {
    const weather = nightWeather(Math.random);
    state = { ...state, night: state.night + 1, weather };
    if (weather === 'storm') {
      state = { ...state, storms: { seen: state.storms.seen + 1 } };
      view.log(`Night ${state.night}. A storm is coming in.`);
    } else {
      view.log(`Night ${state.night}. The sea is calm.`);
    }
  }
  view.show(state);
  write(state);
}, 1000);

view.log(`Night ${state.night}. The sea is calm.`);
view.show(state);
