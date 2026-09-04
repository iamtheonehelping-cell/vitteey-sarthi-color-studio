// Renders public/og-image.png (1200x630) from an inline SVG template built
// from Vitteey Sarthi brand tokens, embedding the real logo
// (public/images/vitteey-sarthi-logo.png) as a base64 data URI. Re-run with
// `npm run og:generate` whenever the copy changes or the logo file is
// replaced.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const NAVY = '#212B4F';
const GREEN = '#298C5F';
const RED = '#BF161A';
const WHITE = '#FEFEFE';

const WIDTH = 1200;
const HEIGHT = 630;

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const logoPath = resolve(rootDir, 'public/images/vitteey-sarthi-logo.png');
const logoBuffer = readFileSync(logoPath);
const logoBase64 = logoBuffer.toString('base64');

// Read the logo's real pixel dimensions straight from the PNG IHDR chunk so
// it's placed at its exact original aspect ratio — never stretched.
const logoWidthPx = logoBuffer.readUInt32BE(16);
const logoHeightPx = logoBuffer.readUInt32BE(20);
const logoAspectRatio = logoWidthPx / logoHeightPx;

// The logo's wordmark is navy, so it needs a light plate to stay legible
// against this OG image's navy background (same reason the header/footer
// use a light backing plate behind it in dark mode).
const PLATE_PADDING = 24;
const logoDisplayWidth = 340;
const logoDisplayHeight = Math.round(logoDisplayWidth / logoAspectRatio);
const plateWidth = logoDisplayWidth + PLATE_PADDING * 2;
const plateHeight = logoDisplayHeight + PLATE_PADDING * 2;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY}" />

  <!-- Real Vitteey Sarthi logo, on a light plate for legibility (never recolored/cropped/stretched). -->
  <g transform="translate(90, 70)">
    <rect width="${plateWidth}" height="${plateHeight}" rx="20" fill="${WHITE}" />
    <image
      x="${PLATE_PADDING}" y="${PLATE_PADDING}"
      width="${logoDisplayWidth}" height="${logoDisplayHeight}"
      href="data:image/png;base64,${logoBase64}"
      preserveAspectRatio="xMidYMid meet"
    />
  </g>

  <text x="90" y="330" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="64"
    fill="${WHITE}">Vitteey Sarthi</text>
  <text x="90" y="400" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="64"
    fill="${WHITE}">Color Studio</text>
  <text x="90" y="455" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="30"
    fill="${WHITE}" opacity="0.85">Create beautiful color palettes in seconds.</text>

  <!-- A rainbow of swatches communicates that generated palettes are not
       limited to the brand colors, while the brand colors anchor the
       chrome around them. -->
  <g transform="translate(0, 570)">
    <rect x="0" y="0" width="${WIDTH / 8}" height="60" fill="#E63946" />
    <rect x="${(WIDTH / 8) * 1}" y="0" width="${WIDTH / 8}" height="60" fill="#F4A261" />
    <rect x="${(WIDTH / 8) * 2}" y="0" width="${WIDTH / 8}" height="60" fill="#E9C46A" />
    <rect x="${(WIDTH / 8) * 3}" y="0" width="${WIDTH / 8}" height="60" fill="${GREEN}" />
    <rect x="${(WIDTH / 8) * 4}" y="0" width="${WIDTH / 8}" height="60" fill="#2A9D8F" />
    <rect x="${(WIDTH / 8) * 5}" y="0" width="${WIDTH / 8}" height="60" fill="#457B9D" />
    <rect x="${(WIDTH / 8) * 6}" y="0" width="${WIDTH / 8}" height="60" fill="${NAVY}" />
    <rect x="${(WIDTH / 8) * 7}" y="0" width="${WIDTH / 8}" height="60" fill="${RED}" />
  </g>
</svg>
`;

const resvg = new Resvg(svg, {
  font: { loadSystemFonts: true, defaultFontFamily: 'Arial' },
  fitTo: { mode: 'width', value: WIDTH },
});

// resvg needs raster images resolved explicitly rather than sniffing data URIs.
for (const href of resvg.imagesToResolve()) {
  resvg.resolveImage(href, logoBuffer);
}

const png = resvg.render().asPng();

const outPath = resolve(rootDir, 'public/og-image.png');
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${WIDTH}x${HEIGHT}), logo at ${logoDisplayWidth}x${logoDisplayHeight} (source ${logoWidthPx}x${logoHeightPx})`);
