import type { Project } from './types';

const REAL_KEY = 'mei:project:v1';
const DEMO_KEY = 'demo:mei:project:v1';

export function loadProject(): Project | null {
  try {
    const raw = localStorage.getItem(REAL_KEY);
    return raw ? JSON.parse(raw) as Project : null;
  } catch {
    return null;
  }
}

export function saveProject(project: Project, isDemo: boolean): void {
  if (isDemo) {
    // Demo edits are deliberately kept in a separate, disposable namespace.
    // The demo is rebuilt on entry, so this can never become a real project.
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(project));
    return;
  }
  localStorage.setItem(REAL_KEY, JSON.stringify(project));
}

export function clearProject(): void {
  localStorage.removeItem(REAL_KEY);
}

export function clearDemoProject(): void {
  sessionStorage.removeItem(DEMO_KEY);
}

export function downloadText(filename: string, text: string, type = 'text/plain'): void {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
