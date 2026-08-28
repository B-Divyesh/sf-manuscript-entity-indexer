const RELEASES_URL = 'https://api.github.com/repos/B-Divyesh/sf-manuscript-entity-indexer/releases?per_page=1';
const RELEASE_PAGE = 'https://github.com/B-Divyesh/sf-manuscript-entity-indexer/releases';
const CACHE_KEY = 'mei:release:v1';
const CACHE_AGE = 3_600_000;

interface Release {
  tag_name: string;
  assets: Array<{ name: string; browser_download_url: string }>;
}

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);

function desktopPlatform(): 'macOS' | 'Windows' | 'Linux' | null {
  // `navigator.platform` is the stable desktop signal here. Chromium's
  // userAgentData can describe the host in embedded test and desktop shells.
  const platform = navigator.platform || navigator.userAgent;
  if (/iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent)) return null;
  if (/Mac/i.test(platform)) return 'macOS';
  if (/Win/i.test(platform)) return 'Windows';
  if (/Linux|X11/i.test(platform)) return 'Linux';
  return null;
}

function platformLinks(release: Release): string {
  const asset = (expression: RegExp) => release.assets.find(item => expression.test(item.name));
  const choices = [
    [asset(/aarch64.*\.dmg$/i), 'macOS Apple silicon'],
    [asset(/x64.*\.dmg$/i), 'macOS Intel'],
    [asset(/x64.*(?:setup\.exe|\.msi)$/i), 'Windows x64'],
    [asset(/amd64.*\.AppImage$/i), 'Linux x64']
  ].filter((choice): choice is [{ name: string; browser_download_url: string }, string] => Boolean(choice[0]))
    .map(([item, label]) => `<a href="${escapeHtml(item.browser_download_url)}">${label}</a>`).join(' · ');
  return choices || `<a href="${RELEASE_PAGE}">All desktop downloads</a>`;
}

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
    const platform = desktopPlatform();
    const primary = platform
      ? `<a class="button button-ink" href="${RELEASE_PAGE}">Choose a ${platform} installer</a>`
      : `<a class="button button-ink" href="${RELEASE_PAGE}">View desktop downloads</a>`;
    block.innerHTML = `<p class="utility-label">Desktop app · ${escapeHtml(release.tag_name)}</p>${primary}<p>${platformLinks(release)} · <a href="${RELEASE_PAGE}">All downloads</a></p>`;
  } catch {
    block.innerHTML = `<p class="utility-label">Desktop app · release pending</p><a class="button button-ink" href="${RELEASE_PAGE}">View desktop downloads</a><p>Open the release page for macOS, Windows and Linux builds.</p>`;
  }
}
