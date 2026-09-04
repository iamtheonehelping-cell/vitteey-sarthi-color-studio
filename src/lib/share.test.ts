import { describe, expect, it } from 'vitest';
import { buildShareUrl, decodeShareState, encodeShareState, type PaletteShareState } from './share';

const sample: PaletteShareState = {
  baseColor: '#212b4f',
  harmony: 'analogous',
  colors: ['#212b4f', '#298c5f', '#bf161a'],
  locked: [true, false, true],
};

describe('encodeShareState / decodeShareState round trip', () => {
  it('reconstructs the exact same state', () => {
    const encoded = encodeShareState(sample);
    const decoded = decodeShareState(encoded);
    expect(decoded).toEqual(sample);
  });

  it('omits the locked param when nothing is locked, and decodes to all-unlocked', () => {
    const state: PaletteShareState = { ...sample, locked: [false, false, false] };
    const encoded = encodeShareState(state);
    expect(encoded).not.toContain('l=');
    expect(decodeShareState(encoded)).toEqual(state);
  });
});

describe('buildShareUrl', () => {
  it('builds a full URL against the given origin and default path', () => {
    const url = buildShareUrl(sample, 'https://www.vitteeysarthi.com');
    expect(url.startsWith('https://www.vitteeysarthi.com/generator?')).toBe(true);
    expect(decodeShareState(new URL(url).search)).toEqual(sample);
  });
});

describe('decodeShareState malformed input handling', () => {
  it('returns null for an empty string', () => {
    expect(decodeShareState('')).toBeNull();
  });

  it('returns null when the colors param is missing entirely', () => {
    expect(decodeShareState('h=triadic&b=212b4f')).toBeNull();
  });

  it('returns null for garbage input instead of throwing', () => {
    expect(() => decodeShareState('c=%%%not-a-real-param&&&')).not.toThrow();
    expect(decodeShareState('c=not-hex-at-all')).toBeNull();
  });

  it('drops invalid hex entries from the colors list but keeps valid ones', () => {
    const decoded = decodeShareState('c=212b4f-zzzzzz-298c5f');
    expect(decoded?.colors).toEqual(['#212b4f', '#298c5f']);
  });

  it('falls back to a known harmony when the harmony param is unrecognized', () => {
    const decoded = decodeShareState('c=212b4f-298c5f&h=not-a-real-harmony');
    expect(decoded?.harmony).toBe('analogous');
  });

  it('falls back to the first color when the base color param is invalid or missing', () => {
    const decoded = decodeShareState('c=212b4f-298c5f&b=nope');
    expect(decoded?.baseColor).toBe('#212b4f');
  });

  it('ignores a locked bitmask whose length does not match the color count', () => {
    const decoded = decodeShareState('c=212b4f-298c5f-bf161a&l=10');
    expect(decoded?.locked).toEqual([false, false, false]);
  });

  it('ignores a locked bitmask containing non-0/1 characters', () => {
    const decoded = decodeShareState('c=212b4f-298c5f&l=1x');
    expect(decoded?.locked).toEqual([false, false]);
  });

  it('never throws on a completely malformed URLSearchParams-incompatible value', () => {
    expect(() => decodeShareState('???&&&===')).not.toThrow();
  });
});
