export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

const STORAGE_KEY = 'vsc-saved-palettes';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getSavedPalettes(): SavedPalette[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePalettes(palettes: SavedPalette[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
}

export function savePalette(colors: string[], name?: string): SavedPalette {
  const palette: SavedPalette = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name?.trim() || `Palette ${new Date().toLocaleDateString()}`,
    colors,
    createdAt: Date.now(),
  };
  const palettes = [palette, ...getSavedPalettes()];
  writePalettes(palettes);
  return palette;
}

export function removePalette(id: string): void {
  writePalettes(getSavedPalettes().filter((p) => p.id !== id));
}

export function clearPalettes(): void {
  writePalettes([]);
}
