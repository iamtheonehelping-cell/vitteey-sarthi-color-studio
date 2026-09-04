import { useMemo, useState } from 'react';
import { readableTextColor, toCssVariables, toJson, toTailwindConfigSnippet } from '../../lib/color';
import CopyButton from './CopyButton';

interface ExportPanelProps {
  colors: string[];
}

type ExportFormat = 'css' | 'tailwind' | 'json';

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: 'css', label: 'CSS Variables' },
  { id: 'tailwind', label: 'Tailwind Config' },
  { id: 'json', label: 'JSON' },
];

const PNG_WIDTH = 1600;
const PNG_HEIGHT = 900;

function drawPalettePng(colors: string[], title: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = PNG_WIDTH;
  canvas.height = PNG_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#FEFEFE';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bottomBarHeight = 64;
  let swatchTop = 50;

  const trimmedTitle = title.trim();
  if (trimmedTitle) {
    ctx.fillStyle = '#212B4F';
    ctx.font = '700 44px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(trimmedTitle, canvas.width / 2, swatchTop + 44);
    swatchTop += 44 + 30;
  }

  const swatchBottom = canvas.height - bottomBarHeight - 20;
  const swatchHeight = swatchBottom - swatchTop;
  const swatchWidth = canvas.width / colors.length;

  colors.forEach((hex, i) => {
    const x = i * swatchWidth;
    ctx.fillStyle = hex;
    ctx.fillRect(x, swatchTop, swatchWidth, swatchHeight);

    ctx.fillStyle = readableTextColor(hex);
    ctx.font = '600 26px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(hex.toUpperCase(), x + swatchWidth / 2, swatchTop + swatchHeight - 30);
  });

  ctx.fillStyle = '#212B4F';
  ctx.fillRect(0, canvas.height - bottomBarHeight, canvas.width, bottomBarHeight);
  ctx.fillStyle = '#FEFEFE';
  ctx.font = '500 20px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    'Vitteey Sarthi Color Studio · vitteeysarthi.com',
    24,
    canvas.height - bottomBarHeight / 2
  );

  return canvas;
}

export default function ExportPanel({ colors }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [title, setTitle] = useState('');
  const [pngStatus, setPngStatus] = useState('');

  const output = useMemo(() => {
    switch (format) {
      case 'tailwind':
        return toTailwindConfigSnippet(colors);
      case 'json':
        return toJson(colors);
      case 'css':
      default:
        return toCssVariables(colors);
    }
  }, [colors, format]);

  function handleDownloadPng() {
    const canvas = drawPalettePng(colors, title);
    canvas.toBlob((blob) => {
      if (!blob) {
        setPngStatus('Could not generate the PNG. Please try again.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filenameBase = title.trim() ? title.trim().toLowerCase().replace(/\s+/g, '-') : 'vitteey-sarthi-palette';
      link.href = url;
      link.download = `${filenameBase}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setPngStatus('PNG downloaded.');
    }, 'image/png');
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-4">
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                aria-pressed={format === f.id}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  format === f.id
                    ? 'bg-brand-navy text-brand-white'
                    : 'bg-surface-subtle text-text hover:opacity-80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <CopyButton
            value={output}
            label="Copy code"
            className="bg-surface-subtle text-text hover:opacity-80"
          />
        </div>
        <pre className="max-h-64 overflow-auto rounded-md bg-brand-navy p-3 text-xs text-brand-white">
          <code>{output}</code>
        </pre>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="mb-2 text-sm font-semibold text-text">Image export</h3>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-text">
            Palette title (optional)
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My palette"
              maxLength={60}
              className="w-56 rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text"
            />
          </label>
          <button
            type="button"
            onClick={handleDownloadPng}
            className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-white hover:opacity-90"
          >
            Download PNG
          </button>
        </div>
        <p className="mt-2 text-xs text-text-muted" role="status" aria-live="polite">
          {pngStatus || `Exports a ${PNG_WIDTH}×${PNG_HEIGHT} image entirely in your browser — nothing is uploaded.`}
        </p>
      </div>
    </div>
  );
}
