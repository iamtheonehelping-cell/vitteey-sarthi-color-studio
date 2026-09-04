import { describe, expect, it } from 'vitest';
import {
  HARMONY_TYPES,
  contrastRatio,
  generateHarmony,
  hexToHsl,
  hexToRgb,
  hslToHex,
  isValidHex,
  normalizeHex,
  paletteToSlug,
  readableTextColor,
  slugToPalette,
  wcagLevel,
} from './color';

describe('isValidHex', () => {
  it('accepts 6-digit hex with or without hash', () => {
    expect(isValidHex('#ff0000')).toBe(true);
    expect(isValidHex('ff0000')).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isValidHex('#fff')).toBe(false);
    expect(isValidHex('not-a-color')).toBe(false);
    expect(isValidHex('#gggggg')).toBe(false);
  });
});

describe('normalizeHex', () => {
  it('adds a hash and lowercases', () => {
    expect(normalizeHex('FF00AA')).toBe('#ff00aa');
    expect(normalizeHex('#FF00AA')).toBe('#ff00aa');
  });
});

describe('hex/RGB/HSL conversion', () => {
  it('hexToRgb converts pure colors correctly', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });

  it('hexToHsl converts pure red to hsl(0, 100%, 50%)', () => {
    const hsl = hexToHsl('#ff0000');
    expect(hsl.h).toBeCloseTo(0, 0);
    expect(hsl.s).toBeCloseTo(100, 0);
    expect(hsl.l).toBeCloseTo(50, 0);
  });

  it('hslToHex is the inverse of hexToHsl for round numbers', () => {
    expect(hslToHex(120, 100, 50).toLowerCase()).toBe('#00ff00');
  });
});

describe('readableTextColor', () => {
  it('picks white text for dark backgrounds and black text for light ones', () => {
    expect(readableTextColor('#000000')).toBe('#ffffff');
    expect(readableTextColor('#ffffff')).toBe('#000000');
    expect(readableTextColor('#212b4f')).toBe('#ffffff');
  });
});

describe('generateHarmony', () => {
  it('returns the requested number of colors for every supported harmony type', () => {
    for (const type of HARMONY_TYPES) {
      const palette = generateHarmony('#3366ff', type, 5);
      expect(palette).toHaveLength(5);
      for (const hex of palette) {
        expect(isValidHex(hex)).toBe(true);
      }
    }
  });

  it('complementary includes the base and its 180deg opposite', () => {
    const palette = generateHarmony('#ff0000', 'complementary', 2);
    expect(palette[0].toLowerCase()).toBe('#ff0000');
    expect(palette[1].toLowerCase()).toBe('#00ffff');
  });

  it('shades ramps from the base toward black without lightening', () => {
    const palette = generateHarmony('#298c5f', 'shades', 4);
    expect(palette[0].toLowerCase()).toBe('#298c5f');
    const lightnesses = palette.map((hex) => hexToHsl(hex).l);
    for (let i = 1; i < lightnesses.length; i += 1) {
      expect(lightnesses[i]).toBeLessThanOrEqual(lightnesses[i - 1]);
    }
  });

  it('tints ramps from the base toward white without darkening', () => {
    const palette = generateHarmony('#298c5f', 'tints', 4);
    expect(palette[0].toLowerCase()).toBe('#298c5f');
    const lightnesses = palette.map((hex) => hexToHsl(hex).l);
    for (let i = 1; i < lightnesses.length; i += 1) {
      expect(lightnesses[i]).toBeGreaterThanOrEqual(lightnesses[i - 1]);
    }
  });

  it('is not restricted to brand colors — any base hex produces a full palette', () => {
    const palette = generateHarmony('#7851a9', 'triadic', 6);
    expect(palette).toHaveLength(6);
  });
});

describe('contrastRatio / wcagLevel', () => {
  it('black on white is the maximum 21:1 ratio', () => {
    const ratio = contrastRatio('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21, 0);
    expect(wcagLevel(ratio)).toBe('AAA');
  });

  it('identical colors have a 1:1 ratio and fail WCAG', () => {
    const ratio = contrastRatio('#888888', '#888888');
    expect(ratio).toBeCloseTo(1, 5);
    expect(wcagLevel(ratio)).toBe('fail');
  });
});

describe('palette slug round-trip', () => {
  it('encodes and decodes a list of hex colors', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    const slug = paletteToSlug(colors);
    expect(slug).toBe('ff0000-00ff00-0000ff');
    expect(slugToPalette(slug)).toEqual(colors);
  });
});
