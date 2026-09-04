export interface CuratedPalette {
  slug: string;
  name: string;
  description: string;
  colors: string[];
}

/**
 * Seed set of curated palettes, each rendered as a static /palette/[slug]
 * page at build time. Add more entries to grow indexable palette pages.
 */
export const CURATED_PALETTES: CuratedPalette[] = [
  {
    slug: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool blues and teals inspired by coastal water.',
    colors: ['#023e8a', '#0077b6', '#0096c7', '#48cae4', '#ade8f4'],
  },
  {
    slug: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm oranges and pinks reminiscent of a fading sky.',
    colors: ['#ff6b35', '#f7931e', '#ffb703', '#fb8500', '#e85d75'],
  },
  {
    slug: 'forest-canopy',
    name: 'Forest Canopy',
    description: 'Earthy greens layered like a woodland canopy.',
    colors: ['#1b4332', '#2d6a4f', '#40916c', '#74c69d', '#b7e4c7'],
  },
  {
    slug: 'royal-orchid',
    name: 'Royal Orchid',
    description: 'Rich purples with a soft lavender finish.',
    colors: ['#3c096c', '#5a189a', '#7b2cbf', '#9d4edd', '#c77dff'],
  },
  {
    slug: 'monochrome-slate',
    name: 'Monochrome Slate',
    description: 'A neutral grayscale ramp for clean, minimal UI.',
    colors: ['#212529', '#495057', '#868e96', '#ced4da', '#f1f3f5'],
  },
  {
    slug: 'citrus-punch',
    name: 'Citrus Punch',
    description: 'Bright yellows and greens with a zesty edge.',
    colors: ['#ccff33', '#a3e635', '#facc15', '#fb923c', '#f87171'],
  },
];
