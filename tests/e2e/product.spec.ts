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
  await expect(page.getByRole('heading', { name: 'Review your entity index' })).toBeVisible();
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await page.getByLabel('Display name').fill('Mara Venn Edited');
  await page.getByRole('button', { name: 'Save entity' }).click();
  await page.reload();
  await expect(page.getByRole('option', { name: /Mara Venn/ })).toBeVisible();
  await expect(page.getByText('Mara Venn Edited')).toHaveCount(0);
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

test('@claim:offline-reload demo works after the connection is removed', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Review your entity index' })).toBeVisible();
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

test('@claim:alias-review accepted aliases merge and can be undone', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await expect(page.getByText('Suggested alias', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Merge as alias' }).first().click();
  await expect(page.getByText(/Also: Captain Venn/)).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('option', { name: /Captain Venn/ })).toBeVisible();
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

test('@claim:supported-imports imports Markdown and DOCX text', async ({ page }) => {
  await page.goto('/app');
  const xml = '<?xml version="1.0"?><w:document xmlns:w="x"><w:body><w:p><w:r><w:t>Lin Park met Ilya Chen at River Station.</w:t></w:r></w:p></w:body></w:document>';
  const docx = Buffer.from(zipSync({ 'word/document.xml': strToU8(xml) }));
  const folder = await mkdtemp(join(tmpdir(), 'mei-import-'));
  try {
    await writeFile(join(folder, 'chapter.md'), 'Mara Venn entered Glass Harbor. ユキは白港へ向かった。민서가 강변역에 도착했다。');
    await writeFile(join(folder, 'chapter.docx'), docx);
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByText('2 files', { exact: false }).first()).toBeVisible();
    await expect(page.getByRole('option', { name: /Mara Venn/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /Ilya Chen/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /ユキ/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /민서/ })).toBeVisible();
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
    await Promise.all([1, 2, 3, 4].map(number => writeFile(join(folder, `chapter-${number}.md`), `Mara Venn entered Glass Harbor in chapter ${number}.`)));
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByText('Indexed the first three files.')).toBeVisible();
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

test('@claim:owner-license a verified owner license removes the three-file limit', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/verify?license=test-owner', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await page.goto('/app');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole('link', { name: 'Buy for $24' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/checkout');
  await page.getByLabel('Have a license?').fill('test-owner');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByRole('heading', { name: 'Owner edition' })).toBeVisible();
  const folder = await mkdtemp(join(tmpdir(), 'mei-owner-'));
  try {
    await Promise.all([1, 2, 3, 4].map(number => writeFile(join(folder, `chapter-${number}.md`), `Mara Venn entered Glass Harbor in chapter ${number}.`)));
    await page.locator('#folder-input').setInputFiles(folder);
    await expect(page.getByText(/· 4 files/)).toBeVisible();
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('@claim:platform-download selects a current installer for the visitor', async ({ page }) => {
  await page.route('https://api.github.com/repos/B-Divyesh/sf-manuscript-entity-indexer/releases?per_page=1', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ tag_name: 'v0.1.0', assets: [{ name: 'Manuscript.Entity.Indexer_0.1.0_amd64.AppImage', browser_download_url: 'https://github.com/B-Divyesh/sf-manuscript-entity-indexer/releases/download/v0.1.0/Manuscript.Entity.Indexer_0.1.0_amd64.AppImage' }] }])
  }));
  await page.goto('/');
  const download = page.getByRole('link', { name: 'Download for Linux' });
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute('href', /v0\.1\.0\/Manuscript\.Entity\.Indexer_0\.1\.0_amd64\.AppImage$/);
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
  await page.getByRole('option', { name: /Mara Venn/ }).click();
  await expect(page.getByRole('heading', { name: 'Evidence' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const undersizedControls = await page.locator('button:visible, a:visible').evaluateAll(elements => elements
    .filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    })
    .map(element => ({ text: (element.textContent ?? '').trim(), rect: element.getBoundingClientRect().toJSON() })));
  expect(undersizedControls).toEqual([]);
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
});
