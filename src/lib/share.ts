import {
  HARMONY_TYPES,
  isValidHex,
  normalizeHex,
  paletteToSlug,
  slugToPalette,
  type HarmonyType,
} from './color';

export interface PaletteShareState {
  baseColor: string;
  harmony: HarmonyType;
  colors: string[];
  locked: boolean[];
}

/**
 * Encodes the current generator state into URL search params, without a
 * backend — the URL itself is the payload. Query keys are kept short:
 *   c = colors (hyphen-joined hex, no '#')
 *   b = base color (hex, no '#')
 *   h = harmony type
 *   l = locked bitmask, one '0'/'1' per color, only included if any are locked
 */
export function encodeShareState(state: PaletteShareState): string {
  const params = new URLSearchParams();
  params.set('c', paletteToSlug(state.colors));
  params.set('b', normalizeHex(state.baseColor).slice(1));
  params.set('h', state.harmony);
  if (state.locked.some(Boolean)) {
    params.set('l', state.locked.map((v) => (v ? '1' : '0')).join(''));
  }
  return params.toString();
}

export function buildShareUrl(state: PaletteShareState, origin: string, pathname = '/generator'): string {
  const query = encodeShareState(state);
  return `${origin}${pathname}?${query}`;
}

/**
 * Decodes URL search params back into generator state. Never throws —
 * malformed, partial, or missing data degrades gracefully:
 *   - unknown/missing harmony falls back to 'analogous'
 *   - an invalid/missing base color falls back to the first valid color
 *   - a locked bitmask of the wrong length or with non-0/1 chars is ignored
 *   - if no valid colors are present at all, returns null (nothing to restore)
 */
export function decodeShareState(search: string | URLSearchParams): PaletteShareState | null {
  try {
    const params = typeof search === 'string' ? new URLSearchParams(search) : search;

    const rawColors = params.get('c') ?? '';
    const colors = slugToPalette(rawColors).filter((hex) => isValidHex(hex));
    if (colors.length === 0) return null;

    const rawHarmony = params.get('h') ?? '';
    const harmony: HarmonyType = (HARMONY_TYPES as string[]).includes(rawHarmony)
      ? (rawHarmony as HarmonyType)
      : 'analogous';

    const rawBase = params.get('b') ?? '';
    const baseColor = isValidHex(rawBase) ? normalizeHex(rawBase) : colors[0];

    const rawLocked = params.get('l') ?? '';
    const locked =
      rawLocked.length === colors.length && /^[01]+$/.test(rawLocked)
        ? rawLocked.split('').map((c) => c === '1')
        : colors.map(() => false);

    return { baseColor, harmony, colors, locked };
  } catch {
    return null;
  }
}
