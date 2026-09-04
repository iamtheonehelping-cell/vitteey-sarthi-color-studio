import { colord, extend, type Colord } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import namesPlugin from 'colord/plugins/names';

extend([a11yPlugin, namesPlugin]);

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'monochromatic'
  | 'shades'
  | 'tints';

export const HARMONY_TYPES: HarmonyType[] = [
  'complementary',
  'analogous',
  'triadic',
  'tetradic',
  'split-complementary',
  'monochromatic',
  'shades',
  'tints',
];

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value.trim());
}

export function normalizeHex(value: string): string {
  const trimmed = value.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return withHash.toLowerCase();
}

export function randomHex(): string {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return `#${hex}`;
}

export function hexToRgb(hex: string) {
  return colord(hex).toRgb();
}

export function hexToHsl(hex: string) {
  return colord(hex).toHsl();
}

export function hslToHex(h: number, s: number, l: number): string {
  return colord({ h, s, l }).toHex();
}

/** Relative luminance-based contrast ratio, per WCAG 2.x (1:1 to 21:1). */
export function contrastRatio(fg: string, bg: string): number {
  return colord(fg).contrast(bg);
}

export type WcagLevel = 'fail' | 'AA' | 'AAA';

export function wcagLevel(ratio: number, largeText = false): WcagLevel {
  const aaThreshold = largeText ? 3 : 4.5;
  const aaaThreshold = largeText ? 4.5 : 7;
  if (ratio >= aaaThreshold) return 'AAA';
  if (ratio >= aaThreshold) return 'AA';
  return 'fail';
}

export function readableTextColor(bg: string): '#000000' | '#ffffff' {
  return colord(bg).isDark() ? '#ffffff' : '#000000';
}

function rotateHue(color: Colord, degrees: number): Colord {
  const { h, s, l, a } = color.toHsl();
  return colord({ h: (h + degrees + 360) % 360, s, l, a });
}

function shade(color: Colord, amount: number): Colord {
  return amount >= 0 ? color.lighten(amount) : color.darken(-amount);
}

/**
 * Generates a palette of hex colors from a base color and harmony rule.
 * `count` is honored where the harmony naturally supports it; monochromatic
 * and analogous scale freely, the fixed-hue rules pad with tints/shades.
 */
export function generateHarmony(
  baseHex: string,
  type: HarmonyType,
  count = 5
): string[] {
  const base = colord(baseHex);
  let hues: Colord[];

  switch (type) {
    case 'complementary':
      hues = [base, rotateHue(base, 180)];
      break;
    case 'analogous':
      hues = [
        rotateHue(base, -30),
        rotateHue(base, -15),
        base,
        rotateHue(base, 15),
        rotateHue(base, 30),
      ];
      break;
    case 'triadic':
      hues = [base, rotateHue(base, 120), rotateHue(base, 240)];
      break;
    case 'tetradic':
      hues = [
        base,
        rotateHue(base, 90),
        rotateHue(base, 180),
        rotateHue(base, 270),
      ];
      break;
    case 'split-complementary':
      hues = [base, rotateHue(base, 150), rotateHue(base, 210)];
      break;
    case 'monochromatic':
    default:
      hues = [base];
      break;
  }

  const palette: string[] = [];
  if (type === 'monochromatic') {
    const steps = Math.max(count, 2);
    for (let i = 0; i < steps; i += 1) {
      const amount = -0.32 + (0.64 * i) / (steps - 1);
      palette.push(shade(base, amount).toHex());
    }
    return palette;
  }

  if (type === 'shades') {
    // Base color ramping toward black — darken only.
    const steps = Math.max(count, 2);
    for (let i = 0; i < steps; i += 1) {
      const amount = (0.85 * i) / (steps - 1);
      palette.push(base.darken(amount).toHex());
    }
    return palette;
  }

  if (type === 'tints') {
    // Base color ramping toward white — lighten only.
    const steps = Math.max(count, 2);
    for (let i = 0; i < steps; i += 1) {
      const amount = (0.85 * i) / (steps - 1);
      palette.push(base.lighten(amount).toHex());
    }
    return palette;
  }

  // Fixed-hue harmonies: use the rule's hues first, then pad with
  // lightness variations of the base to reach the requested count.
  for (const hue of hues) {
    palette.push(hue.toHex());
    if (palette.length >= count) break;
  }
  let padIndex = 0;
  const padAmounts = [0.18, -0.18, 0.3, -0.3];
  while (palette.length < count) {
    const source = hues[padIndex % hues.length];
    const amount = padAmounts[padIndex % padAmounts.length];
    palette.push(shade(source, amount).toHex());
    padIndex += 1;
  }

  return palette.slice(0, count);
}

export function toCssVariables(colors: string[], prefix = 'color'): string {
  return [
    ':root {',
    ...colors.map((c, i) => `  --${prefix}-${i + 1}: ${c};`),
    '}',
  ].join('\n');
}

export function toTailwindConfigSnippet(colors: string[], name = 'palette'): string {
  const entries = colors
    .map((c, i) => `        ${i + 1}00: '${c}',`)
    .join('\n');
  return `colors: {\n  ${name}: {\n${entries}\n  },\n}`;
}

export function toJson(colors: string[]): string {
  return JSON.stringify(colors, null, 2);
}

/** Deterministic, URL-safe slug for a palette from its hex colors. */
export function paletteToSlug(colors: string[]): string {
  return colors.map((c) => normalizeHex(c).slice(1)).join('-');
}

export function slugToPalette(slug: string): string[] {
  return slug
    .split('-')
    .filter((part) => /^[0-9a-fA-F]{6}$/.test(part))
    .map((part) => `#${part.toLowerCase()}`);
}
