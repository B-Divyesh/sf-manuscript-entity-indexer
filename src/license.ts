const SLUG = 'manuscript-entity-indexer';
const TOKEN_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `${TOKEN_KEY}:verdict`;
const DAY = 86_400_000;

export interface LicenseState {
  active: boolean;
  checking: boolean;
  message: string;
}

export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;

export function captureLicense(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  storeLicense(token);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function storeLicense(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function removeLicense(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VERDICT_KEY);
}

export function cachedLicenseState(): LicenseState {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { active: false, checking: false, message: 'Free edition' };
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '{}') as { valid?: boolean; checkedAt?: number };
    if (verdict.valid) return { active: true, checking: false, message: 'Owner edition' };
  } catch { /* ignore a damaged cache */ }
  return { active: false, checking: true, message: 'Checking license' };
}

export async function verifyLicense(): Promise<LicenseState> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { active: false, checking: false, message: 'Free edition' };
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '{}') as { valid?: boolean; checkedAt?: number };
    if (cached.checkedAt && Date.now() - cached.checkedAt < DAY) {
      return { active: Boolean(cached.valid), checking: false, message: cached.valid ? 'Owner edition' : 'License no longer active' };
    }
  } catch { /* verify again */ }
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return { active: result.valid, checking: false, message: result.valid ? 'Owner edition' : 'License no longer active' };
  } catch {
    try {
      const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '{}') as { valid?: boolean };
      if (cached.valid) return { active: true, checking: false, message: 'Owner edition · offline' };
    } catch { /* stay locked until the token can be checked */ }
    return { active: false, checking: false, message: 'License check unavailable' };
  }
}
