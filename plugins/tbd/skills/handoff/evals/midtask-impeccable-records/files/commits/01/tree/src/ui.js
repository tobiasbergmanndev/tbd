import { dueIn, water } from './plants.js';
import { savePlants } from './store.js';

export function renderList(root, plants, now = Date.now()) {
  root.innerHTML = '';
  for (const plant of plants) {
    const days = dueIn(plant, now);
    const row = document.createElement('div');
    row.className = days <= 0 ? 'plant due' : 'plant';
    row.innerHTML = `<span class="name"></span><span class="when"></span>`;
    row.querySelector('.name').textContent = plant.name;
    row.querySelector('.when').textContent = days <= 0 ? 'water today' : `water in ${days} days`;
    if (days <= 0) {
      const btn = document.createElement('button');
      btn.className = 'watered';
      btn.textContent = 'Watered';
      btn.addEventListener('click', () => {
        const next = plants.map((p) => (p === plant ? water(p, Date.now()) : p));
        savePlants(next);
        renderList(root, next);
      });
      row.append(btn);
    }
    root.append(row);
  }
}
