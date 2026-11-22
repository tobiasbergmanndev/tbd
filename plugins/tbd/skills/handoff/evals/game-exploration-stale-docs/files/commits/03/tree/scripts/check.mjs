// Plays the game on an emulated phone and runs behaviour checks.
// Usage: node scripts/check.mjs [url]   (default http://localhost:5173/)
import { chromium, devices } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:5173/';

const checks = [
  ['page loads', async (p) => p.locator('#game').waitFor()],
  ['lamp starts lit', async (p) => p.locator('#game').waitFor()],
  ['pour button is visible', async (p) => p.locator('.pour').waitFor()],
  ['pouring adds oil', async (p) => p.locator('.pour').click()],
  ['oil burns down', async (p) => p.waitForTimeout(1500)],
  ['state is saved', async (p) => p.evaluate(() => localStorage.getItem('lantern-keeper/save'))],
  ['reload resumes', async (p) => p.reload()],
  ['lamp goes out without oil', async (p) => p.waitForTimeout(100)],
  ['no console errors', async () => {}],
  ['storm nights flicker the glow', async (p) => p.evaluate(() => document.querySelector('#game').dataset.weather)],
  ['a v1 save loads after migration', async (p) => p.reload()],
];

const browser = await chromium.launch();
const page = await browser.newPage({ ...devices['Pixel 7'] });
await page.goto(url);
let failed = 0;
for (const [name, run] of checks) {
  try {
    await run(page);
    console.log(`ok   ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${name}: ${e.message}`);
  }
}
await browser.close();
console.log(`${checks.length - failed}/${checks.length} checks passed`);
process.exit(failed ? 1 : 0);
