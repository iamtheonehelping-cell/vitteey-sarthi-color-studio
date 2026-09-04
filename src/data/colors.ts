export interface NamedColor {
  name: string;
  hex: string;
}

/**
 * Seed set of named colors that get their own static /color/[hex] page.
 * Extend this list to grow the site's indexable color-detail pages —
 * no backend or CMS required, each entry is just built at compile time.
 */
export const NAMED_COLORS: NamedColor[] = [
  { name: 'Vitteey Sarthi Navy', hex: '#212b4f' },
  { name: 'Vitteey Sarthi Green', hex: '#298c5f' },
  { name: 'Vitteey Sarthi Red', hex: '#bf161a' },
  { name: 'Crimson Red', hex: '#dc143c' },
  { name: 'Forest Green', hex: '#228b22' },
  { name: 'Sunflower Yellow', hex: '#ffd700' },
  { name: 'Royal Purple', hex: '#7851a9' },
  { name: 'Coral Orange', hex: '#ff7f50' },
  { name: 'Slate Gray', hex: '#708090' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Hot Pink', hex: '#ff69b4' },
  { name: 'Midnight Navy', hex: '#0a1a3f' },
  { name: 'Charcoal', hex: '#36454f' },
  { name: 'Mint Green', hex: '#98ff98' },
];

export function hexToSlug(hex: string): string {
  return hex.replace('#', '').toLowerCase();
}

export function slugToHex(slug: string): string {
  return `#${slug.toLowerCase()}`;
}
