import './style.css';
import { resolveCurrentDownload } from './downloads';

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

const isStaticLanding = location.pathname === '/' && !new URLSearchParams(location.search).has('license');
let pendingSearchFocus = false;

function isTextEntryTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
}

function focusSearch(): boolean {
  const search = document.querySelector<HTMLInputElement>('#index-search');
  if (!search) return false;
  search.focus();
  return true;
}

document.addEventListener('keydown', event => {
  if (event.key !== '/' || event.defaultPrevented || event.isComposing || event.metaKey || event.ctrlKey || event.altKey || isTextEntryTarget(event.target)) return;
  if (location.pathname !== '/demo' && !document.querySelector('#index-search')) return;
  event.preventDefault();
  pendingSearchFocus = !focusSearch();
});

function restorePendingSearchFocus(): void {
  if (!pendingSearchFocus) return;
  pendingSearchFocus = false;
  requestAnimationFrame(() => focusSearch());
}

if (isStaticLanding) {
  document.querySelectorAll<HTMLAnchorElement>('a.route-link').forEach(link => link.addEventListener('click', async event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || link.target) return;
    event.preventDefault();
    const destination = new URL(link.href).pathname;
    const workbench = await import('./main');
    workbench.navigate(destination);
  }));
  const scheduleDownload = (): void => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(() => void resolveCurrentDownload(), { timeout: 1_500 });
    else setTimeout(() => void resolveCurrentDownload(), 0);
  };
  if (document.readyState === 'complete') scheduleDownload();
  else window.addEventListener('load', scheduleDownload, { once: true });
} else {
  document.querySelector('#app')?.replaceChildren();
  void import('./main').then(restorePendingSearchFocus);
}

if ('serviceWorker' in navigator && !window.__TAURI_INTERNALS__) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined), { once: true });
}
