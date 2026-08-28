import type { Project } from './types';

const REAL_KEY = 'mei:project:v1';

export function loadProject(): Project | null {
  try {
    const raw = localStorage.getItem(REAL_KEY);
    return raw ? JSON.parse(raw) as Project : null;
  } catch {
    return null;
  }
}

export function saveProject(project: Project, isDemo: boolean): void {
  if (isDemo) return;
  localStorage.setItem(REAL_KEY, JSON.stringify(project));
}

export function clearProject(): void {
  localStorage.removeItem(REAL_KEY);
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
