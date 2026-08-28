import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { zipSync, strToU8 } from 'fflate';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('@claim:demo-isolation demo loads complete sample data and does not persist edits', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review names found in your manuscript' })).toBeVisible();
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await page.getByLabel('Display name').fill('Mara Venn Edited');
  await page.getByRole('button', { name: 'Save entity' }).click();
  await page.reload();
  await expect(page.getByRole('option', { name: /Mara Venn/ })).toBeVisible();
  await expect(page.getByText('Mara Venn Edited')).toHaveCount(0);
});

test('@claim:sample-preview landing sample counts match the rendered demo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Sample output', { exact: true })).toBeVisible();
  const landingTotal = Number((await page.locator('[data-preview-entity-count]').innerText()).match(/\d+/)?.[0]);
  const landingMentions = new Map<string, number>();
  for (const name of ['Mara Venn', 'Captain Venn', '林梅']) {
    const text = await page.locator(`[data-preview-entity="${name}"]`).innerText();
    landingMentions.set(name, Number(text.match(/\d+/)?.[0]));
  }

  await page.getByRole('link', { name: 'Try it with sample data' }).first().click();
  await expect(page.getByRole('heading', { name: 'Review names found in your manuscript' })).toBeVisible();
  const demoTotal = await page.locator('[data-entity]').count();
  expect(landingTotal).toBe(demoTotal);
  for (const [name, count] of landingMentions) {
    const text = await page.getByRole('option', { name: new RegExp(name) }).innerText();
    expect(Number(text.match(/\d+/)?.[0])).toBe(count);
  }

  await page.getByRole('link', { name: /Manuscript Entity Indexer home/ }).click();
  await expect(page.locator('[data-preview-entity-count]')).toHaveText(`Names · ${demoTotal}`);
});

test('@regression ?demo=1 opens the isolated sample with its banner and reset control', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Manuscript Entity Indexer');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review names found in your manuscript' })).toBeVisible();
  const realStorage = await page.evaluate(() => localStorage.getItem('mei:project:v1'));
  expect(realStorage).toBeNull();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole('heading', { name: 'Index your manuscript folder' })).toBeVisible();
  await expect(page.evaluate(() => sessionStorage.getItem('demo:mei:project:v1'))).resolves.toBeNull();
});

test('@claim:local-processing demo indexing makes no cross-origin requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(url.href);
  });
  await page.goto('/demo');
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await page.getByRole('button', { name: 'Merge as alias' }).first().click();
  expect(external).toEqual([]);
});

test('@claim:no-tracking all first-party routes make no analytics, advertising, manuscript upload, or cloud-storage requests', async ({ page }) => {
  const requests: Array<{ url: string; method: string; body: string | null }> = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }));
  await page.route('https://api.github.com/repos/B-Divyesh/sf-manuscript-entity-indexer/releases?per_page=1', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify([{ tag_name: 'v0.1.5', assets: [] }])
  }));
  for (const path of ['/', '/demo', '/app', '/privacy', '/terms']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
  }
  const external = requests.filter(request => new URL(request.url).origin !== 'http://127.0.0.1:4173');
  expect(external.map(request => request.url)).toEqual(['https://api.github.com/repos/B-Divyesh/sf-manuscript-entity-indexer/releases?per_page=1']);
  expect(requests.filter(request => request.method !== 'GET')).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
  const storageKeys = await page.evaluate(() => [...Object.keys(localStorage), ...Object.keys(sessionStorage)]);
  expect(storageKeys.some(key => /analytics|advert|track/i.test(key))).toBe(false);
});

test('@claim:offline-reload demo works after the connection is removed', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Review names found in your manuscript' })).toBeVisible();
  await expect(page.getByRole('option', { name: /林梅/ })).toBeVisible();
});

test('@claim:csv-export exports one CSV row per visible entity', async ({ page }) => {
  await page.goto('/demo');
  const count = await page.locator('[data-entity]').count();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let content = '';
  for await (const chunk of stream!) content += chunk.toString();
  expect(content.split('\n')).toHaveLength(count + 1);
  expect(content).toContain('"name","type","aliases","mentions","chapters"');
});

test('@claim:alias-review aliases can be found, renamed, classified, merged and undone', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await expect(page.getByText('Suggested alias', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Both names include “Venn”\./)).toBeVisible();
  await page.getByRole('button', { name: 'Merge as alias' }).first().click();
  await expect(page.getByText(/Also: Captain Venn/)).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('option', { name: /Captain Venn/ })).toBeVisible();
  await page.getByLabel('Display name').fill('Mara Vale');
  await page.getByLabel('Type').selectOption('place');
  await page.getByRole('button', { name: 'Save entity' }).click();
  await page.getByLabel('Search mentions').fill('Mara Vale');
  await expect(page.getByRole('option', { name: /Mara Vale.*place/ })).toBeVisible();
  await expect(page.getByRole('option', { name: /Captain Venn/ })).toHaveCount(0);
});

test('@claim:timeline-ledger timeline notes stay linked to the selected entity', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await page.getByLabel('Add continuity note').fill('Mara cannot cross before the key returns.');
  await page.getByRole('button', { name: 'Add timeline note' }).click();
  await expect(page.getByText('Mara cannot cross before the key returns.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Mara cannot cross before the key returns.')).toHaveCount(0);
});

test('@claim:chapter-evidence opens the chapter copy behind a mention', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await page.getByRole('button', { name: /01 — The tide ledger/ }).first().click();
  const dialog = page.getByRole('dialog', { name: '01 — The tide ledger' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Mara Venn stepped off the ferry');
  await page.getByRole('button', { name: 'Close chapter' }).click();
  await expect(dialog).toBeHidden();
});

test('@claim:supported-imports imports Markdown, plain text and DOCX text', async ({ page }) => {
  await page.goto('/app');
  const xml = '<?xml version="1.0"?><w:document xmlns:w="x"><w:body><w:p><w:r><w:t>Lin Park met Ilya Chen at River Station.</w:t></w:r></w:p></w:body></w:document>';
  const docx = Buffer.from(zipSync({ 'word/document.xml': strToU8(xml) }));
  const folder = await mkdtemp(join(tmpdir(), 'mei-import-'));
  try {
    await writeFile(join(folder, 'chapter.md'), 'Mara Venn entered Glass Harbor. ユキは白港へ向かった。민서가 강변역에 도착했다。');
    await writeFile(join(folder, 'chapter.txt'), 'Nina Ross arrived at Archive Bridge.');
    await writeFile(join(folder, 'chapter.docx'), docx);
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByText('3 files', { exact: false }).first()).toBeVisible();
    await expect(page.getByRole('option', { name: /Mara Venn/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /Ilya Chen/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /白港/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /ユキ/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /민서/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /Nina Ross/ })).toBeVisible();
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('@claim:source-files-unchanged imports a copy and leaves the selected chapter unchanged', async ({ page }) => {
  await page.goto('/app');
  const folder = await mkdtemp(join(tmpdir(), 'mei-source-'));
  const chapter = join(folder, 'chapter.md');
  const source = 'Mara Venn entered Glass Harbor.\n';
  try {
    await writeFile(chapter, source);
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByRole('option', { name: /Mara Venn/ })).toBeVisible();
    expect(await readFile(chapter, 'utf8')).toBe(source);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('@claim:free-file-limit free edition indexes at most three files', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const folder = await mkdtemp(join(tmpdir(), 'mei-limit-'));
  try {
    await Promise.all(['04.txt', '02.md', '01.txt', '03.md'].map(name => writeFile(join(folder, name), `Mara Venn entered Glass Harbor in ${name}.`)));
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByText(/Indexed the first three files in path order:.*01\.txt.*02\.md.*03\.md.*Omitted:.*04\.txt/)).toBeVisible();
    await expect(page.getByText(/· 3 files/)).toBeVisible();
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('@claim:local-project-storage keeps a real index after reload and clears it on request', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const folder = await mkdtemp(join(tmpdir(), 'mei-storage-'));
  try {
    await writeFile(join(folder, 'chapter.md'), 'Mara Venn entered Glass Harbor.');
    await page.locator('#folder-input').setInputFiles(folder);
    await page.reload();
    await expect(page.getByRole('option', { name: /Mara Venn/ })).toBeVisible();
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Clear local index' }).click();
    await expect(page.getByRole('heading', { name: 'Index your manuscript folder' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Index your manuscript folder' })).toBeVisible();
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('@claim:owner-license a checkout-return license is verified immediately and removes the file limit', async ({ page }) => {
  let verificationRequests = 0;
  await page.route('https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/verify?license=test-owner', async route => {
    verificationRequests += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/app?license=test-owner');
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole('link', { name: 'Buy for $24' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/checkout');
  await expect(page.getByRole('heading', { name: 'Owner edition' })).toBeVisible();
  expect(verificationRequests).toBe(1);
  const folder = await mkdtemp(join(tmpdir(), 'mei-owner-'));
  try {
    await Promise.all([1, 2, 3, 4].map(number => writeFile(join(folder, `chapter-${number}.md`), `Mara Venn entered Glass Harbor in chapter ${number}.`)));
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByText(/· 4 files/)).toBeVisible();
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('@claim:refund-revocation a recorded refunded license response removes owner access', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/verify?license=refunded-owner', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null })
  }));
  await page.goto('/app?license=refunded-owner');
  await expect(page.getByRole('heading', { name: 'License no longer active' })).toBeVisible();
  const folder = await mkdtemp(join(tmpdir(), 'mei-refund-'));
  try {
    await Promise.all([1, 2, 3, 4].map(number => writeFile(join(folder, `chapter-${number}.md`), `Mara Venn entered Glass Harbor in chapter ${number}.`)));
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByText(/Indexed the first three files in path order/)).toBeVisible();
    await expect(page.getByText(/· 3 files/)).toBeVisible();
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('@claim:billing-privacy license checks send only the token and the purchase link discloses the Dodo checkout redirect', async ({ page, request }) => {
  let requestEvidence: { method: string; url: string; body: string | null } | undefined;
  await page.route('https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/verify?license=private-token', async route => {
    const request = route.request();
    requestEvidence = { method: request.method(), url: request.url(), body: request.postData() };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid', expires_at: null }) });
  });
  await page.goto('/app');
  await page.getByLabel('Have a license?').fill('private-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByRole('heading', { name: 'License no longer active' })).toBeVisible();
  expect(requestEvidence).toEqual({
    method: 'GET',
    url: 'https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/verify?license=private-token',
    body: null
  });
  await expect(page.locator('input[type="email"], input[autocomplete="cc-number"], input[name*="card" i]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Buy for $24' })).toHaveAttribute('href', /^https:\/\/api\.sociobot\.in\//);
  const checkout = await request.get('https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/checkout', { maxRedirects: 1 });
  expect(checkout.url()).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});

test('@claim:checkout-available the live purchase link starts at Sociobot and opens Dodo checkout', async ({ request }) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
  const redirected = await request.get('https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/checkout', { maxRedirects: 1 });
  expect(redirected.url()).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});

test('@claim:platform-download selects current macOS, Windows and Linux installers', async ({ browser }) => {
  const assets = [
    'Manuscript.Entity.Indexer_0.1.5_aarch64.dmg',
    'Manuscript.Entity.Indexer_0.1.5_x64-setup.exe',
    'Manuscript.Entity.Indexer_0.1.5_amd64.AppImage'
  ].map(name => ({ name, browser_download_url: `https://github.com/B-Divyesh/sf-manuscript-entity-indexer/releases/download/v0.1.5/${name}` }));
  for (const [platformValue, label, suffix] of [
    ['MacIntel', 'macOS', '.dmg'],
    ['Win32', 'Windows', '.exe'],
    ['Linux x86_64', 'Linux', '.AppImage']
  ]) {
    const context = await browser.newContext();
    await context.addInitScript(value => Object.defineProperty(navigator, 'platform', { configurable: true, get: () => value }), platformValue);
    const page = await context.newPage();
    await page.route('https://api.github.com/repos/B-Divyesh/sf-manuscript-entity-indexer/releases?per_page=1', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ tag_name: 'v0.1.5', assets }])
    }));
    await page.goto('/');
    const download = page.getByRole('link', { name: `Download for ${label}` });
    await expect(download).toBeVisible();
    await expect(download).toHaveAttribute('href', new RegExp(`${suffix.replace('.', '\\.')}\$`));
    await context.close();
  }
});

test('@claim:release-workflow builds the stated desktop matrix and publishes checksum and manifest assets', async () => {
  const workflow = await readFile(join(process.cwd(), '.github/workflows/release.yml'), 'utf8');
  const manifestScript = await readFile(join(process.cwd(), 'scripts/release-manifest.py'), 'utf8');
  expect(workflow).toContain("tags: ['v*']");
  expect(workflow).toContain('macos-latest');
  expect(workflow).toContain('windows-latest');
  expect(workflow).toContain('ubuntu-latest');
  expect(workflow).toContain('release-assets/SHA256SUMS');
  expect(workflow).toContain('release-assets/latest.json');
  expect(manifestScript).toContain('latest.json');
});

test('@regression an online reload replaces a stale cached shell and keeps the repaired shell offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
    const cache = await caches.open('mei-shell-v2');
    await cache.put('/', new Response('<!doctype html><title>stale</title><p>STALE SHELL SENTINEL</p>', { headers: { 'Content-Type': 'text/html' } }));
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Review names found across your manuscript' })).toBeVisible();
  await expect(page.getByText('STALE SHELL SENTINEL')).toHaveCount(0);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Review names found across your manuscript' })).toBeVisible();
});

test('@regression landing startup excludes the workbench and stays below 10 KB of JavaScript', async ({ page }) => {
  await page.route('https://api.github.com/repos/B-Divyesh/sf-manuscript-entity-indexer/releases?per_page=1', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ tag_name: 'v0.1.2', assets: [] }])
  }));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Review names found across your manuscript' })).toBeVisible();
  await page.waitForLoadState('networkidle');
  const scripts = await page.evaluate(() => performance.getEntriesByType('resource')
    .filter(entry => entry.name.endsWith('.js'))
    .map(entry => ({ name: entry.name, transferSize: (entry as PerformanceResourceTiming).transferSize })));
  expect(scripts.some(script => /\/assets\/main-[^/]+\.js$/.test(script.name))).toBe(false);
  expect(scripts.reduce((total, script) => total + script.transferSize, 0)).toBeLessThanOrEqual(10 * 1024);
});

test('@regression static shell links its manifest and returns the designed 404 with a 404 status in Static Web Apps', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { name: 'This clipping is not in the index' })).toBeVisible();
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
  const config = JSON.parse(await readFile(join(process.cwd(), 'public/staticwebapp.config.json'), 'utf8')) as { responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }> };
  expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('@regression desktop release metadata uses the source version instead of the stale v0.1.0 fallback', async () => {
  const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8')) as { version: string };
  const tauriConfig = JSON.parse(await readFile(join(process.cwd(), 'src-tauri/tauri.conf.json'), 'utf8')) as { version: string };
  const cargoToml = await readFile(join(process.cwd(), 'src-tauri/Cargo.toml'), 'utf8');
  const workflow = await readFile(join(process.cwd(), '.github/workflows/release.yml'), 'utf8');
  expect(tauriConfig.version).toBe(packageJson.version);
  expect(cargoToml).toContain(`version = "${packageJson.version}"`);
  expect(workflow).toContain(`'v${packageJson.version}'`);
  expect(workflow).not.toContain("|| 'v0.1.0'");
});

test('@regression import and license failures are announced and a later import recovers', async ({ page }) => {
  await page.goto('/app');
  const folder = await mkdtemp(join(tmpdir(), 'mei-invalid-import-'));
  try {
    const empty = join(folder, 'empty.md');
    await writeFile(empty, '   ');
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByRole('alert')).toContainText('No readable chapters were found');
    await expect(page.getByRole('button', { name: 'Choose manuscript folder' })).toBeVisible();

    await rm(empty);
    await writeFile(join(folder, 'broken.docx'), 'not a zip');
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByRole('alert')).toContainText('broken.docx is not a readable DOCX file');

    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('alert')).toContainText('No license was entered');
    await rm(join(folder, 'broken.docx'));
    await writeFile(join(folder, 'recovery.txt'), 'Mara Venn entered Glass Harbor.');
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByRole('option', { name: /Mara Venn/ })).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('@a11y main routes have no serious accessibility violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', exception => errors.push(exception.message));
  for (const path of ['/', '/demo', '/app', '/privacy', '/terms', '/missing-page']) {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('@a11y mobile workbench fits 390px and exposes its views', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('tab', { name: 'Entities' })).toBeVisible();
  await expect(page.getByLabel('Main navigation').getByRole('link', { name: 'Privacy' })).toBeVisible();
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await expect(page.getByRole('heading', { name: 'Evidence' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const undersizedControls = await page.locator('button:visible, a:visible').evaluateAll(elements => elements
    .filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width < 43.9 || rect.height < 43.9;
    })
    .map(element => ({ text: (element.textContent ?? '').trim(), rect: element.getBoundingClientRect().toJSON() })));
  expect(undersizedControls).toEqual([]);
  const undersizedText = await page.locator('main :is(p, span, small, label, button, input, select, textarea, blockquote):visible').evaluateAll(elements => elements
    .filter(element => Number.parseFloat(getComputedStyle(element).fontSize) < 16)
    .map(element => ({ text: (element.textContent ?? '').trim(), size: getComputedStyle(element).fontSize })));
  expect(undersizedText).toEqual([]);
});

test('@regression all three first-screen facts fit in a 1440 by 900 desktop viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const bottoms = await page.locator('.plain-facts li').evaluateAll(items => items.map(item => item.getBoundingClientRect().bottom));
  expect(bottoms).toHaveLength(3);
  expect(Math.max(...bottoms)).toBeLessThanOrEqual(900);
});

test('@a11y keyboard shortcuts, entity arrows and the chapter dialog remain operable', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('/');
  await expect(page.getByLabel('Search mentions')).toBeFocused();
  await page.locator('[data-entity]').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-entity]').nth(1)).toBeFocused();
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await page.getByRole('button', { name: /01 — The tide ledger/ }).first().focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('button', { name: /01 — The tide ledger/ }).first()).toBeFocused();
});

test('@regression slash focuses search during startup and remains text inside inputs', async ({ page }) => {
  let releaseWorkbench!: () => void;
  const workbenchReleased = new Promise<void>(resolve => { releaseWorkbench = resolve; });
  let markWorkbenchRequested!: () => void;
  const workbenchRequested = new Promise<void>(resolve => { markWorkbenchRequested = resolve; });

  await page.route(/\/assets\/main-[^/]+\.js$/, async route => {
    markWorkbenchRequested();
    await workbenchReleased;
    await route.continue();
  });

  const navigation = page.goto('/demo');
  await workbenchRequested;
  await page.keyboard.press('/');
  releaseWorkbench();
  await navigation;

  const search = page.getByLabel('Search mentions');
  await expect(search).toBeFocused();
  await page.keyboard.press('/');
  await expect(search).toHaveValue('/');

  await search.fill('');
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  const displayName = page.getByLabel('Display name');
  await displayName.focus();
  await page.keyboard.press('End');
  await page.keyboard.press('/');
  await expect(displayName).toHaveValue('Mara Venn/');
  await expect(displayName).toBeFocused();
});

test('@a11y demo focus and mobile tabs keep a visible keyboard path', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).focus();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toHaveCSS('outline-color', 'rgb(255, 253, 247)');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toHaveCSS('box-shadow', /rgb\(21, 21, 21\)/);

  await page.setViewportSize({ width: 390, height: 844 });
  const entities = page.getByRole('tab', { name: 'Entities' });
  await expect(entities).toHaveAttribute('aria-controls', 'entities-panel');
  await expect(entities).toHaveAttribute('tabindex', '0');
  await entities.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Evidence' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Evidence' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Evidence' })).toBeVisible();
  await page.getByRole('tab', { name: 'Ledger' }).click();
  await expect(page.getByLabel('Display name')).toBeVisible();
});
