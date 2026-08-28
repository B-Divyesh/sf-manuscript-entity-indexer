import './style.css';
import { indexDocuments, mergeEntities } from './indexer';
import { sampleDocuments } from './sample';
import { clearProject, downloadText, loadProject, saveProject } from './storage';
import type { EntityKind, ManuscriptDocument, Project } from './types';
import { cachedLicenseState, captureLicense, checkoutUrl, removeLicense, storeLicense, verifyLicense, type LicenseState } from './license';

const app = document.querySelector<HTMLDivElement>('#app')!;
let project: Project | null = null;
let selectedEntityId = '';
let activeView: 'entities' | 'evidence' | 'timeline' = 'entities';
let search = '';
let notice = '';
let error = '';
let undoSnapshot = '';
let openDocumentId = '';
let license: LicenseState = cachedLicenseState();

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
const titleFor = (path: string): string => path === '/' ? 'Manuscript Entity Indexer — Track story details'
  : path === '/demo' ? 'Demo — Manuscript Entity Indexer'
  : path === '/app' ? 'Index — Manuscript Entity Indexer'
  : path === '/privacy' ? 'Privacy — Manuscript Entity Indexer'
  : path === '/terms' ? 'Terms — Manuscript Entity Indexer'
  : 'Page not found — Manuscript Entity Indexer';

function header(): string {
  return `<header class="site-header">
    <a class="wordmark route-link" href="/" aria-label="Manuscript Entity Indexer home"><span class="wordmark-mark">MEI</span><span>Manuscript<br>Entity Indexer</span></a>
    <nav aria-label="Main navigation">
      <a class="route-link" href="/demo">Demo</a>
      <a class="route-link" href="/app">Workbench</a>
      <a class="route-link" href="/privacy">Privacy</a>
    </nav>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <p>Keep a private continuity ledger beside your manuscript.</p>
    <nav aria-label="Footer navigation"><a class="route-link" href="/privacy">Privacy</a><a class="route-link" href="/terms">Terms</a><a href="https://param.sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
    <p class="folio">v0.1.0 · Original generated still life</p>
  </footer>`;
}

function facts(): string {
  return `<ul class="plain-facts" aria-label="Product facts">
    <li><span aria-hidden="true">01</span>Your drafts stay on this device.</li>
    <li><span aria-hidden="true">02</span>Works after the first visit without internet.</li>
    <li><span aria-hidden="true">03</span>$24 once for unlimited folders.</li>
  </ul>`;
}

function landing(): string {
  return `${header()}<main id="main">
    <section class="hero-section">
      <div class="edition-line"><span>No. 01</span><span>Offline author’s desk</span><span>2026</span></div>
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">A continuity ledger for long drafts</p>
          <h1 tabindex="-1">Index every name across your manuscript</h1>
          <p class="dek">For novelists working across languages who need one private place to check characters, places and aliases.</p>
          <div class="hero-actions">
            <a class="button button-primary route-link" href="/demo">Try it with sample data</a>
            <span>It opens a three-chapter index.</span>
          </div>
          ${facts()}
        </div>
        <figure class="hero-art">
          <picture><source type="image/avif" srcset="/broadsheet-ledger-800.avif 800w, /broadsheet-ledger.avif 1200w" sizes="(max-width: 980px) 94vw, 54vw"><source type="image/webp" srcset="/broadsheet-ledger-800.webp 800w, /broadsheet-ledger.webp 1200w" sizes="(max-width: 980px) 94vw, 54vw"><img src="/broadsheet-ledger.jpg" width="1200" height="800" alt="Manuscript sheets linked by thread to a black index ledger." fetchpriority="high" decoding="async"></picture>
          <figcaption>Repeated mentions become one author-reviewed ledger.</figcaption>
        </figure>
      </div>
    </section>

    <section class="preview-section" aria-labelledby="preview-heading">
      <div class="section-kicker"><span>On the desk</span><span>Live preview</span></div>
      <h2 id="preview-heading">See every mention before you merge it</h2>
      <div class="paper-preview">
        <div class="preview-list" aria-label="Example entity list">
          <p class="utility-label">Entities · 8</p>
          <p class="preview-active"><strong>Mara Venn</strong><span>5 mentions</span></p>
          <p><strong>Captain Venn</strong><span>3 mentions</span></p>
          <p><strong>林梅</strong><span>3 mentions</span></p>
        </div>
        <article class="preview-evidence">
          <p class="utility-label">Evidence · 01 — The tide ledger</p>
          <blockquote>At dusk, <mark>Mara Venn</mark> stepped off the ferry at Glass Harbor.</blockquote>
          <p class="suggestion"><span>Suggested alias</span> Captain Venn · Both names include “Venn”.</p>
        </article>
        <aside class="preview-ledger">
          <p class="utility-label">Ledger</p>
          <p><span>Type</span><strong>Person</strong></p>
          <p><span>Aliases</span><strong>1 to review</strong></p>
          <p><span>Chapters</span><strong>3</strong></p>
        </aside>
      </div>
    </section>

    <section class="walkthrough-section" aria-labelledby="walkthrough-heading">
      <div class="section-kicker"><span>Sample project</span><span>Three views</span></div>
      <h2 id="walkthrough-heading">Follow a name back to its chapter</h2>
      <div class="walkthrough-grid">
        <figure><img src="/walkthrough/index.webp" width="900" height="1563" loading="lazy" decoding="async" alt="The sample workbench lists entities beside their manuscript evidence and ledger."><figcaption><span>01</span>Start with extracted names and the lines where they appear.</figcaption></figure>
        <figure><img src="/walkthrough/alias.webp" width="900" height="1563" loading="lazy" decoding="async" alt="The workbench shows Captain Venn merged into Mara Venn as an alias."><figcaption><span>02</span>Merge a suggested alias only after checking its evidence.</figcaption></figure>
        <figure><img src="/walkthrough/source.webp" width="760" height="450" loading="lazy" decoding="async" alt="A chapter copy opens above the workbench for source checking."><figcaption><span>03</span>Open the chapter copy without changing the source file.</figcaption></figure>
      </div>
    </section>

    <section class="steps-section" aria-labelledby="steps-heading">
      <div class="section-kicker"><span>Method</span><span>Three passes</span></div>
      <h2 id="steps-heading">Build the ledger in three steps</h2>
      <ol class="editorial-steps">
        <li><span>1</span><div><h3>Choose your manuscript folder</h3><p>Open Markdown, text and DOCX chapters. Source files stay unchanged.</p></div></li>
        <li><span>2</span><div><h3>Review marked names</h3><p>Check Unicode-aware candidates. Accept or reject each alias suggestion.</p></div></li>
        <li><span>3</span><div><h3>Check story continuity</h3><p>Search evidence by chapter. Add timeline notes and export the ledger.</p></div></li>
      </ol>
    </section>

    <section class="privacy-section" aria-labelledby="boundaries-heading">
      <div><p class="eyebrow">The quiet margin</p><h2 id="boundaries-heading">What never happens to your draft</h2></div>
      <ul><li>No manuscript upload.</li><li>No text generation.</li><li>No training on your writing.</li><li>No source-file changes.</li></ul>
      <p>The index uses small, visible rules. You decide which names belong together.</p>
    </section>

    <section class="price-section" aria-labelledby="price-heading">
      <div><p class="eyebrow">Owner edition</p><h2 id="price-heading">Keep unlimited manuscript folders</h2><p>Free indexes three files at a time. The owner edition removes that limit.</p></div>
      <div class="price-ticket"><p><span class="price">$24</span> one time</p><a class="button button-primary" href="${checkoutUrl}">Buy the owner edition</a><p>Sociobot is the merchant of record. Refunds revoke the license.</p></div>
      <div class="download-block" id="download-block"><p class="utility-label">Desktop app · unsigned preview</p><a class="button button-ink" href="https://github.com/B-Divyesh/sf-manuscript-entity-indexer/releases">Downloads are being published</a><p>macOS, Windows and Linux builds appear on the release page.</p></div>
    </section>
  </main>${footer()}`;
}

function demoBanner(): string {
  return `<aside class="demo-banner" aria-label="Demo status"><strong>Demo — sample data, nothing is saved</strong><div><button type="button" data-action="reset-demo">Reset demo</button><a class="route-link" href="/app">Start for real</a></div></aside>`;
}

function emptyWorkbench(isDemo: boolean): string {
  return `${isDemo ? demoBanner() : ''}${header()}<main id="main" class="empty-main">
    <section class="empty-sheet"><p class="eyebrow">New index</p><h1 tabindex="-1">Index your manuscript folder</h1><p>Choose Markdown, text or DOCX chapters. The app reads copies and leaves every source file unchanged.</p>
      <div class="empty-actions"><button class="button button-primary" type="button" data-action="choose-folder">Choose manuscript folder</button><a class="button button-paper route-link" href="/demo">Load sample project</a></div>
      <p class="small-note">Free edition: up to three files. Owner edition: unlimited files.</p>
      <input id="folder-input" class="visually-hidden-input" type="file" accept=".md,.markdown,.txt,.docx" multiple webkitdirectory aria-label="Choose manuscript files">
    </section>
    <section class="format-strip" aria-label="Supported files"><span>Markdown</span><span>Plain text</span><span>DOCX</span><span>Unicode and CJK</span></section>
    ${licensePanel()}
  </main>${footer()}`;
}

function licensePanel(): string {
  return `<section class="license-panel" aria-labelledby="license-heading"><div><p class="eyebrow">Edition</p><h2 id="license-heading">${escapeHtml(license.message)}</h2><p>Buy once to index folders with more than three files.</p></div>
    <div class="license-actions"><a class="button button-ink" href="${checkoutUrl}">Buy for $24</a><form id="license-form"><label for="license-token">Have a license?</label><div><input id="license-token" name="license" autocomplete="off"><button type="submit">Verify license</button></div></form>${license.active ? '<button class="text-button" type="button" data-action="remove-license">Remove license</button>' : ''}</div></section>`;
}

function projectWorkbench(isDemo: boolean): string {
  if (!project) return emptyWorkbench(isDemo);
  const selected = project.entities.find(entity => entity.id === selectedEntityId) ?? project.entities[0];
  if (selected && !selectedEntityId) selectedEntityId = selected.id;
  const query = search.trim().toLocaleLowerCase();
  const visibleEntities = project.entities.filter(entity => !query || [entity.name, ...entity.aliases].some(value => value.toLocaleLowerCase().includes(query))
    || project!.mentions.some(mention => mention.entityId === entity.id && mention.excerpt.toLocaleLowerCase().includes(query)));
  const mentions = selected ? project.mentions.filter(mention => mention.entityId === selected.id) : [];
  const suggestions = selected ? project.suggestions.filter(suggestion => suggestion.sourceId === selected.id || suggestion.targetId === selected.id) : [];
  return `${isDemo ? demoBanner() : ''}${header()}<main id="main" class="workbench-main">
    <div class="workbench-head">
      <div><p class="eyebrow">${escapeHtml(project.name)} · ${project.documents.length} files</p><h1 tabindex="-1">Review your entity index</h1></div>
      <div class="workbench-actions"><label class="search-label" for="index-search"><span>Search mentions</span><input id="index-search" type="search" value="${escapeHtml(search)}" placeholder="Name, place or phrase" autocomplete="off"></label><button type="button" data-action="export-csv">Export CSV</button><button type="button" data-action="choose-folder">Index another folder</button>${!isDemo ? '<button type="button" class="clear-index" data-action="clear-project">Clear local index</button>' : ''}</div>
      <input id="folder-input" class="visually-hidden-input" type="file" accept=".md,.markdown,.txt,.docx" multiple webkitdirectory aria-label="Choose manuscript files">
    </div>
    ${notice ? `<p class="notice" role="status">${escapeHtml(notice)}${undoSnapshot ? ' <button type="button" data-action="undo">Undo</button>' : ''}</p>` : ''}
    ${error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : ''}
    <div class="mobile-tabs" role="tablist" aria-label="Workbench views">
      <button role="tab" aria-selected="${activeView === 'entities'}" data-view="entities">Entities</button>
      <button role="tab" aria-selected="${activeView === 'evidence'}" data-view="evidence">Evidence</button>
      <button role="tab" aria-selected="${activeView === 'timeline'}" data-view="timeline">Timeline</button>
    </div>
    <div class="workbench-grid">
      <section class="entity-rail ${activeView !== 'entities' ? 'mobile-hidden' : ''}" aria-labelledby="entities-heading">
        <div class="panel-heading"><h2 id="entities-heading">Entities</h2><span>${visibleEntities.length}</span></div>
        ${visibleEntities.length ? `<div class="entity-list" role="listbox" aria-label="Extracted entities">${visibleEntities.map((entity, index) => `<button type="button" role="option" aria-selected="${entity.id === selected?.id}" data-entity="${entity.id}" data-index="${index}"><span>${escapeHtml(entity.name)}</span><small>${entity.kind} · ${entity.mentionIds.length}</small></button>`).join('')}</div>` : `<div class="panel-empty"><p>No entities match “${escapeHtml(search)}”.</p><button type="button" data-action="clear-search">Clear search</button></div>`}
      </section>
      <section class="evidence-desk ${activeView !== 'evidence' ? 'mobile-hidden' : ''}" aria-labelledby="evidence-heading">
        <div class="panel-heading"><h2 id="evidence-heading">Evidence</h2><span>${mentions.length} mentions</span></div>
        ${selected ? `<div class="entity-title"><p class="kind-stamp">${escapeHtml(selected.kind)}</p><h3>${escapeHtml(selected.name)}</h3>${selected.aliases.length ? `<p>Also: ${selected.aliases.map(escapeHtml).join(', ')}</p>` : ''}</div>
        ${suggestions.map(suggestion => {
          const otherId = suggestion.sourceId === selected.id ? suggestion.targetId : suggestion.sourceId;
          const other = project!.entities.find(entity => entity.id === otherId);
          return other ? `<aside class="alias-suggestion"><p><strong>Suggested alias</strong> · heuristic</p><p><span>${escapeHtml(other.name)}</span> ${escapeHtml(suggestion.reason)}</p><div><button type="button" data-merge="${other.id}">Merge as alias</button><button type="button" data-reject="${suggestion.id}">Keep separate</button></div></aside>` : '';
        }).join('')}
        <ol class="mention-list">${mentions.map((mention, index) => `<li id="mention-${mention.id}"><button type="button" class="chapter-link" data-doc="${mention.documentId}">${String(index + 1).padStart(2, '0')} · ${escapeHtml(mention.documentTitle)}</button><blockquote>${highlight(mention.excerpt, mention.matchedText)}</blockquote></li>`).join('')}</ol>` : '<div class="panel-empty"><p>No entity is selected.</p><p>Choose a name from the entity list.</p></div>'}
      </section>
      <aside class="ledger-panel ${activeView !== 'timeline' ? 'mobile-hidden' : ''}" aria-labelledby="ledger-heading">
        <div class="panel-heading"><h2 id="ledger-heading">Ledger</h2><span>Author reviewed</span></div>
        ${selected ? `<form id="entity-form" class="entity-form"><label for="entity-name">Display name</label><input id="entity-name" name="name" value="${escapeHtml(selected.name)}" required><label for="entity-kind">Type</label><select id="entity-kind" name="kind"><option value="person" ${selected.kind === 'person' ? 'selected' : ''}>Person</option><option value="place" ${selected.kind === 'place' ? 'selected' : ''}>Place</option><option value="other" ${selected.kind === 'other' ? 'selected' : ''}>Other</option></select><button type="submit">Save entity</button></form>` : ''}
        <section class="timeline-block" aria-labelledby="timeline-heading"><h3 id="timeline-heading">Timeline</h3>${selected ? `<ol>${project.timeline.filter(entry => entry.entityIds.includes(selected.id)).map(entry => `<li><span>${escapeHtml(entry.marker)}</span><p>${escapeHtml(entry.note)}</p><small>${escapeHtml(entry.documentTitle)}${entry.manual ? ' · your note' : ' · found marker'}</small></li>`).join('') || '<li class="timeline-empty">No time markers for this entity yet.</li>'}</ol><form id="timeline-form"><label for="timeline-note">Add continuity note</label><textarea id="timeline-note" name="note" rows="3" required></textarea><button type="submit">Add timeline note</button></form>` : ''}</section>
      </aside>
    </div>
    ${!isDemo ? licensePanel() : ''}
    ${documentDialog()}
  </main>${footer()}`;
}

function documentDialog(): string {
  const document = project?.documents.find(item => item.id === openDocumentId);
  if (!document) return '';
  return `<dialog id="document-dialog" aria-labelledby="document-dialog-title"><div class="dialog-heading"><div><p class="eyebrow">Source copy</p><h2 id="document-dialog-title">${escapeHtml(document.title)}</h2></div><button type="button" data-action="close-document" aria-label="Close chapter">Close</button></div><pre>${escapeHtml(document.text)}</pre><p>The source file remains unchanged.</p></dialog>`;
}

function highlight(text: string, match: string): string {
  const safe = escapeHtml(text);
  const safeMatch = escapeHtml(match);
  return safe.replace(safeMatch, `<mark>${safeMatch}</mark>`);
}

function privacyPage(): string {
  return `${header()}<main id="main" class="legal-main"><p class="eyebrow">Policy · 28 August 2026</p><h1 tabindex="-1">Your manuscript stays yours</h1><p class="legal-dek">The app reads selected files on your device. It does not upload manuscript text.</p><section><h2>What the app stores</h2><p>The web edition stores your index in browser storage. Demo changes stay in memory and disappear when you leave.</p><p>The desktop edition stores the index on your computer. It never changes source chapters.</p></section><section><h2>Network requests</h2><p>The index needs no network. The landing page may ask GitHub for current download links. License checks send only your license token to Sociobot.</p></section><section><h2>Payments</h2><p>Sociobot and Dodo handle checkout, receipts and refunds. This app never receives payment card details.</p></section><section><h2>Remove your data</h2><p>Use “Clear local index” in the workbench. You can also clear this site’s browser storage.</p></section><p>Questions: <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a></p></main>${footer()}`;
}

function termsPage(): string {
  return `${header()}<main id="main" class="legal-main"><p class="eyebrow">Terms · 28 August 2026</p><h1 tabindex="-1">Use the index as an editing aid</h1><p class="legal-dek">These terms cover Manuscript Entity Indexer and its one-time owner license.</p><section><h2>Your files and decisions</h2><p>You keep all rights to your manuscript. Extraction and alias results are heuristic suggestions. Review them before relying on the ledger.</p></section><section><h2>License</h2><p>The free edition indexes three files at a time. A valid owner license removes that file limit for one purchaser’s devices.</p></section><section><h2>Refunds and availability</h2><p>Sociobot is the merchant of record. Approved refunds revoke the license. The software is provided as available without a promise that every name will be found.</p></section><section><h2>Acceptable use</h2><p>Use the app only with files you may access. Do not bypass license checks or redistribute paid builds.</p></section><p>Questions: <a href="mailto:support@sociobot.in">support@sociobot.in</a></p></main>${footer()}`;
}

function notFound(): string {
  return `${header()}<main id="main" class="not-found"><p class="folio-404">404</p><h1 tabindex="-1">This clipping is not in the index</h1><p>The address points to a page that does not exist.</p><a class="button button-primary route-link" href="/">Return to the front page</a></main>${footer()}`;
}

function isDemoPath(): boolean { return location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1'; }

function render(focusHeading = false): void {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.title = titleFor(path);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://manuscript-entity-indexer.sociobot.in${path === '/' ? '/' : path}`;
  if (path === '/') app.innerHTML = landing();
  else if (path === '/demo' || path === '/app') app.innerHTML = projectWorkbench(path === '/demo');
  else if (path === '/privacy') app.innerHTML = privacyPage();
  else if (path === '/terms') app.innerHTML = termsPage();
  else app.innerHTML = notFound();
  if (focusHeading) document.querySelector<HTMLHeadingElement>('main h1')?.focus({ preventScroll: true });
  document.querySelector('#route-status')!.textContent = document.title;
  bindPage();
  if (path === '/') void resolveDownload();
}

function navigate(path: string): void {
  history.pushState({}, '', path);
  if (path === '/demo') loadDemo();
  else if (path === '/app') project = loadProject();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  render(true);
}

function loadDemo(): void {
  project = indexDocuments('The Glass Harbor papers', structuredClone(sampleDocuments));
  selectedEntityId = project.entities.find(entity => entity.name === 'Mara Venn')?.id ?? project.entities[0]?.id ?? '';
  search = '';
  notice = '';
  error = '';
  undoSnapshot = '';
}

async function chooseFolder(): Promise<void> {
  error = '';
  if ('__TAURI_INTERNALS__' in window) {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const { invoke } = await import('@tauri-apps/api/core');
      const selected = await open({ directory: true, multiple: false, title: 'Choose manuscript folder' });
      if (!selected) return;
      const documents = await invoke<ManuscriptDocument[]>('index_folder', { path: selected });
      useDocuments(documents, String(selected).split(/[\\/]/).pop() || 'Manuscript');
    } catch (reason) {
      error = `The folder could not be read. ${reason instanceof Error ? reason.message : 'Choose a folder you can open.'}`;
      render();
    }
  } else document.querySelector<HTMLInputElement>('#folder-input')?.click();
}

async function fileToDocument(file: File, index: number): Promise<ManuscriptDocument | null> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let text = '';
  if (extension === 'docx') {
    try {
      const { unzipSync, strFromU8 } = await import('fflate');
      const archive = unzipSync(new Uint8Array(await file.arrayBuffer()));
      const xml = archive['word/document.xml'];
      if (!xml) throw new Error('The DOCX document body is missing.');
      text = strFromU8(xml).replace(/<w:tab\s*\/>/g, '\t').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    } catch {
      throw new Error(`${file.name} is not a readable DOCX file.`);
    }
  } else text = await file.text();
  if (!text.trim()) return null;
  return { id: `file-${Date.now()}-${index}`, title: file.name.replace(/\.(md|markdown|txt|docx)$/i, ''), path: file.webkitRelativePath || file.name, text };
}

async function readFiles(files: FileList): Promise<void> {
  try {
    const supported = [...files].filter(file => /\.(md|markdown|txt|docx)$/i.test(file.name));
    const documents = (await Promise.all(supported.map(fileToDocument))).filter((doc): doc is ManuscriptDocument => Boolean(doc));
    useDocuments(documents, supported[0]?.webkitRelativePath.split('/')[0] || 'Selected manuscript');
  } catch (reason) {
    error = reason instanceof Error ? `${reason.message} Choose Markdown, text or DOCX files.` : 'The files could not be read. Choose another folder.';
    render();
  }
}

function useDocuments(documents: ManuscriptDocument[], name: string): void {
  if (!documents.length) {
    error = 'No readable chapters were found. Choose a folder with Markdown, text or DOCX files.';
    render();
    return;
  }
  const limited = license.active ? documents : documents.slice(0, 3);
  project = indexDocuments(name, limited);
  selectedEntityId = project.entities[0]?.id ?? '';
  notice = documents.length > limited.length ? `Indexed the first three files. The owner edition can index all ${documents.length}.` : `Indexed ${limited.length} files without changing them.`;
  saveProject(project, false);
  if (location.pathname !== '/app') history.replaceState({}, '', '/app');
  render();
}

function saveCurrent(): void {
  if (project) saveProject(project, isDemoPath());
}

function exportCsv(): void {
  if (!project) return;
  const rows = [['name', 'type', 'aliases', 'mentions', 'chapters']];
  for (const entity of project.entities) {
    const chapters = new Set(project.mentions.filter(mention => mention.entityId === entity.id).map(mention => mention.documentTitle));
    rows.push([entity.name, entity.kind, entity.aliases.join(' | '), String(entity.mentionIds.length), [...chapters].join(' | ')]);
  }
  const csv = rows.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadText('manuscript-entity-index.csv', csv, 'text/csv;charset=utf-8');
  notice = `Exported ${project.entities.length} entities as CSV.`;
  render();
}

function bindPage(): void {
  document.querySelectorAll<HTMLAnchorElement>('a.route-link').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || link.target) return;
    event.preventDefault();
    navigate(new URL(link.href).pathname);
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button => button.addEventListener('click', () => handleAction(button.dataset.action!)));
  const folder = document.querySelector<HTMLInputElement>('#folder-input');
  folder?.addEventListener('change', () => { if (folder.files) void readFiles(folder.files); });
  const searchInput = document.querySelector<HTMLInputElement>('#index-search');
  searchInput?.addEventListener('input', () => { search = searchInput.value; render(); document.querySelector<HTMLInputElement>('#index-search')?.focus(); });
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => button.addEventListener('click', () => { activeView = button.dataset.view as typeof activeView; render(); }));
  document.querySelectorAll<HTMLButtonElement>('[data-doc]').forEach(button => button.addEventListener('click', () => { openDocumentId = button.dataset.doc!; render(); }));
  document.querySelectorAll<HTMLButtonElement>('[data-entity]').forEach(button => {
    button.addEventListener('click', () => { selectedEntityId = button.dataset.entity!; if (innerWidth < 760) activeView = 'evidence'; render(); });
    button.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-entity]')];
      const at = buttons.indexOf(button);
      buttons[(at + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus();
    });
  });
  document.querySelectorAll<HTMLButtonElement>('[data-merge]').forEach(button => button.addEventListener('click', () => {
    if (!project) return;
    undoSnapshot = JSON.stringify(project);
    project = mergeEntities(project, selectedEntityId, button.dataset.merge!);
    notice = 'Merged the suggested name as an alias.';
    saveCurrent();
    render();
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-reject]').forEach(button => button.addEventListener('click', () => {
    if (!project) return;
    project.suggestions = project.suggestions.filter(suggestion => suggestion.id !== button.dataset.reject);
    notice = 'Kept the two names separate.';
    saveCurrent(); render();
  }));
  document.querySelector<HTMLFormElement>('#entity-form')?.addEventListener('submit', event => {
    event.preventDefault();
    if (!project) return;
    const selected = project.entities.find(entity => entity.id === selectedEntityId);
    const data = new FormData(event.currentTarget);
    if (selected) { selected.name = String(data.get('name')).trim(); selected.kind = String(data.get('kind')) as EntityKind; }
    notice = 'Saved the entity.'; saveCurrent(); render();
  });
  document.querySelector<HTMLFormElement>('#timeline-form')?.addEventListener('submit', event => {
    event.preventDefault();
    if (!project) return;
    const note = String(new FormData(event.currentTarget).get('note')).trim();
    if (!note) return;
    project.timeline.push({ id: `manual-${Date.now()}`, documentId: '', documentTitle: 'Author ledger', entityIds: [selectedEntityId], marker: 'Your note', note, manual: true });
    notice = 'Added the continuity note.'; saveCurrent(); render();
  });
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const token = String(new FormData(event.currentTarget).get('license')).trim();
    if (!token) { error = 'No license was entered. Paste the full token and try again.'; render(); return; }
    storeLicense(token); license = { active: false, checking: true, message: 'Checking license' }; render();
    license = await verifyLicense(); render();
  });
  const dialog = document.querySelector<HTMLDialogElement>('#document-dialog');
  if (dialog && !dialog.open) dialog.showModal();
  dialog?.addEventListener('close', () => { openDocumentId = ''; });
}

function handleAction(action: string): void {
  if (action === 'choose-folder') void chooseFolder();
  if (action === 'reset-demo') { loadDemo(); render(); }
  if (action === 'export-csv') exportCsv();
  if (action === 'clear-search') { search = ''; render(); }
  if (action === 'undo' && undoSnapshot) { project = JSON.parse(undoSnapshot) as Project; undoSnapshot = ''; notice = 'Restored the separate names.'; saveCurrent(); render(); }
  if (action === 'remove-license') { removeLicense(); license = cachedLicenseState(); notice = 'Removed the license from this device.'; render(); }
  if (action === 'close-document') { document.querySelector<HTMLDialogElement>('#document-dialog')?.close(); openDocumentId = ''; }
  if (action === 'clear-project' && confirm('Clear this local index? Your manuscript files will not change.')) {
    clearProject(); project = null; selectedEntityId = ''; notice = ''; error = ''; render();
  }
}

async function resolveDownload(): Promise<void> {
  const block = document.querySelector<HTMLElement>('#download-block');
  if (!block) return;
  const releasePage = 'https://github.com/B-Divyesh/sf-manuscript-entity-indexer/releases';
  try {
    const cached = JSON.parse(localStorage.getItem('mei:release:v1') ?? 'null') as { at: number; release: Release } | null;
    const release = cached && Date.now() - cached.at < 3_600_000 ? cached.release : await fetch('https://api.github.com/repos/B-Divyesh/sf-manuscript-entity-indexer/releases?per_page=1').then(async response => {
      if (!response.ok) throw new Error('Release service unavailable');
      const releases = await response.json() as Release[];
      if (!releases[0]) throw new Error('No release');
      return releases[0];
    });
    if (!cached || cached.release.tag_name !== release.tag_name) localStorage.setItem('mei:release:v1', JSON.stringify({ at: Date.now(), release }));
    const platform = /Mac/i.test(navigator.platform) ? 'macOS' : /Win/i.test(navigator.platform) ? 'Windows' : 'Linux';
    const matcher = platform === 'macOS' ? /\.(dmg|app\.tar\.gz)$/i : platform === 'Windows' ? /\.(msi|exe|zip)$/i : /\.(AppImage|deb)$/i;
    const asset = release.assets.find(item => matcher.test(item.name));
    if (!asset) throw new Error('Platform asset missing');
    block.innerHTML = `<p class="utility-label">Desktop app · ${escapeHtml(release.tag_name)}</p><a class="button button-ink" href="${escapeHtml(asset.browser_download_url)}">Download for ${platform}</a><p>Unsigned build · ${escapeHtml(asset.name)} · <a href="${releasePage}">All downloads</a></p>`;
  } catch {
    block.innerHTML = `<p class="utility-label">Desktop app · release pending</p><a class="button button-ink" href="${releasePage}">Downloads are being published</a><p>Open the release page for macOS, Windows and Linux builds.</p>`;
  }
}

interface Release { tag_name: string; assets: Array<{ name: string; browser_download_url: string }> }

document.addEventListener('keydown', event => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) { event.preventDefault(); document.querySelector<HTMLInputElement>('#index-search')?.focus(); }
});
window.addEventListener('popstate', () => {
  if (isDemoPath()) loadDemo(); else if (location.pathname === '/app') project = loadProject();
  render(true);
});

captureLicense();
if ('__TAURI_INTERNALS__' in window && new URLSearchParams(location.search).has('desktop') && location.pathname !== '/app') {
  history.replaceState({}, '', '/app');
}
if (isDemoPath()) loadDemo(); else if (location.pathname === '/app') project = loadProject();
render();
if (license.active && !isDemoPath()) void verifyLicense().then(result => { license = result; if (location.pathname === '/app') render(); });
if ('serviceWorker' in navigator && !('__TAURI_INTERNALS__' in window)) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
