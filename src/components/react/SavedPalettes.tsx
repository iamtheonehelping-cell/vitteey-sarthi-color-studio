import { useEffect, useState } from 'react';
import { getSavedPalettes, removePalette, type SavedPalette } from '../../lib/storage';

interface SavedPalettesProps {
  onLoad?: (colors: string[]) => void;
  refreshKey?: number;
}

export default function SavedPalettes({ onLoad, refreshKey }: SavedPalettesProps) {
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setPalettes(getSavedPalettes());
  }, [refreshKey]);

  function handleRemove(palette: SavedPalette) {
    removePalette(palette.id);
    setPalettes(getSavedPalettes());
    setStatus(`Deleted ${palette.name}.`);
  }

  function handleLoad(palette: SavedPalette) {
    onLoad?.(palette.colors);
    setStatus(`Loaded ${palette.name}.`);
  }

  return (
    <div>
      <div role="status" aria-live="polite" className="sr-only">
        {status}
      </div>
      {palettes.length === 0 ? (
        <p className="text-sm text-text-muted">No saved palettes yet. Generate one and hit Save.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {palettes.map((palette) => (
            <li
              key={palette.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface p-2"
            >
              <button
                type="button"
                onClick={() => handleLoad(palette)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <span className="flex overflow-hidden rounded">
                  {palette.colors.map((c, i) => (
                    <span key={i} className="h-6 w-6" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="text-sm font-medium text-text">{palette.name}</span>
              </button>
              <button
                type="button"
                onClick={() => handleRemove(palette)}
                className="rounded-md px-2 py-1 text-xs text-text-muted hover:bg-error-bg hover:text-error-text"
                aria-label={`Delete ${palette.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
