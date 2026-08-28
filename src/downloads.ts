const RELEASES_URL = 'https://api.github.com/repos/B-Divyesh/sf-manuscript-entity-indexer/releases?per_page=1';
const RELEASE_PAGE = 'https://github.com/B-Divyesh/sf-manuscript-entity-indexer/releases';
const CACHE_KEY = 'mei:release:v1';
const CACHE_AGE = 3_600_000;

interface Release {
  tag_name: string;
  assets: Array<{ name: string; browser_download_url: string }>;
}

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);

export async function resolveCurrentDownload(): Promise<void> {
  const block = document.querySelector<HTMLElement>('#download-block');
  if (!block) return;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as { at: number; release: Release } | null;
    const release = cached && Date.now() - cached.at < CACHE_AGE ? cached.release : await fetch(RELEASES_URL).then(async response => {
      if (!response.ok) throw new Error('Release service unavailable');
      const releases = await response.json() as Release[];
      if (!releases[0]) throw new Error('No release');
      return releases[0];
    });
    if (!cached || cached.release.tag_name !== release.tag_name) localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), release }));
    const platform = /Mac/i.test(navigator.platform) ? 'macOS' : /Win/i.test(navigator.platform) ? 'Windows' : 'Linux';
    const matcher = platform === 'macOS' ? /\.(dmg|app\.tar\.gz)$/i : platform === 'Windows' ? /\.(msi|exe|zip)$/i : /\.(AppImage|deb)$/i;
    const asset = release.assets.find(item => matcher.test(item.name));
    if (!asset) throw new Error('Platform asset missing');
    block.innerHTML = `<p class="utility-label">Desktop app · ${escapeHtml(release.tag_name)}</p><a class="button button-ink" href="${escapeHtml(asset.browser_download_url)}">Download for ${platform}</a><p>Unsigned build · ${escapeHtml(asset.name)} · <a href="${RELEASE_PAGE}">All downloads</a></p>`;
  } catch {
    block.innerHTML = `<p class="utility-label">Desktop app · release pending</p><a class="button button-ink" href="${RELEASE_PAGE}">Downloads are being published</a><p>Open the release page for macOS, Windows and Linux builds.</p>`;
  }
}
