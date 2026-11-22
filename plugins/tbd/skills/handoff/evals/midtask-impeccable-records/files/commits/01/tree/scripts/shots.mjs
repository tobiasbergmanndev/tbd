// Screenshots of the plant list on an emulated phone, into shots/.
// Needs playwright installed outside the repo; usage: node scripts/shots.mjs [url]
import { chromium, devices } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:5173/';
const browser = await chromium.launch();
const page = await browser.newPage({ ...devices['Pixel 7'] });
await page.goto(url);
await page.evaluate(() => {
  const day = 24 * 60 * 60 * 1000;
  localStorage.setItem('sprout/plants', JSON.stringify([
    { name: 'Fern', lastWatered: Date.now() - 4 * day, everyDays: 3 },
    { name: 'Cactus', lastWatered: Date.now(), everyDays: 14 },
  ]));
});
await page.reload();
await page.screenshot({ path: 'shots/list.png' });
await browser.close();
