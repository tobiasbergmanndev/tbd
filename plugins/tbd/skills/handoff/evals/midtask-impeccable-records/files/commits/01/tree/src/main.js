import { loadPlants } from './store.js';
import { renderList } from './ui.js';

renderList(document.querySelector('#app'), loadPlants());

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}
