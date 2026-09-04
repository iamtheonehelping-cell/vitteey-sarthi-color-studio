import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  generateHarmony,
  isValidHex,
  normalizeHex,
  randomHex,
  type HarmonyType,
} from '../../lib/color';
import { savePalette } from '../../lib/storage';
import { decodeShareState, encodeShareState } from '../../lib/share';
import ColorCard from './ColorCard';
import PaletteControls from './PaletteControls';
import ExportPanel from './ExportPanel';
import SavedPalettes from './SavedPalettes';

const DEFAULT_BASE_COLOR = '#212b4f';

interface PaletteGeneratorProps {
  initialColors?: string[];
}

function readShareStateFromLocation() {
  if (typeof window === 'undefined') return null;
  if (!window.location.search) return null;
  return decodeShareState(window.location.search);
}

export default function PaletteGenerator({ initialColors }: PaletteGeneratorProps) {
  const shared = useMemo(() => readShareStateFromLocation(), []);

  const [baseColor, setBaseColor] = useState(
    shared?.baseColor ?? initialColors?.[0] ?? DEFAULT_BASE_COLOR
  );
  const [harmony, setHarmony] = useState<HarmonyType>(shared?.harmony ?? 'analogous');
  const [count, setCount] = useState(shared?.colors.length ?? initialColors?.length ?? 5);
  const [colors, setColors] = useState<string[]>(
    shared?.colors ??
      initialColors ??
      generateHarmony(DEFAULT_BASE_COLOR, 'analogous', 5)
  );
  const [locked, setLocked] = useState<boolean[]>(
    shared?.locked ?? colors.map(() => false)
  );
  const [savedRefresh, setSavedRefresh] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const allLocked = locked.length > 0 && locked.every(Boolean);

  const regenerate = useCallback(
    (nextBase: string, nextHarmony: HarmonyType, nextCount: number) => {
      if (!isValidHex(nextBase)) return;
      const generated = generateHarmony(normalizeHex(nextBase), nextHarmony, nextCount);
      setColors((prev) =>
        generated.map((hex, i) => (locked[i] && prev[i] ? prev[i] : hex))
      );
    },
    [locked]
  );

  useEffect(() => {
    regenerate(baseColor, harmony, count);
    setLocked((prev) => {
      const next = [...prev];
      next.length = count;
      return Array.from({ length: count }, (_, i) => next[i] ?? false);
    });
    // Re-run only when harmony or count changes explicitly, not on every base tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harmony, count]);

  function handleBaseColorChange(hex: string) {
    setBaseColor(hex);
    if (isValidHex(hex)) {
      regenerate(hex, harmony, count);
    }
  }

  function handleRandomize() {
    if (allLocked) return;
    const nextBase = randomHex();
    setBaseColor(nextBase);
    const generated = generateHarmony(nextBase, harmony, count);
    setColors((prev) => generated.map((hex, i) => (locked[i] && prev[i] ? prev[i] : hex)));
    setStatusMessage('Generated a new palette.');
  }

  function handleToggleLock(index: number) {
    setLocked((prev) => {
      const next = prev.map((l, i) => (i === index ? !l : l));
      setStatusMessage(`Color ${index + 1} ${next[index] ? 'locked' : 'unlocked'}.`);
      return next;
    });
  }

  function handleSave() {
    savePalette(colors);
    setSavedRefresh((n) => n + 1);
    setStatusMessage('Palette saved to your device.');
  }

  function handleLoadSaved(loadedColors: string[]) {
    setColors(loadedColors);
    setCount(loadedColors.length);
    setLocked(loadedColors.map(() => false));
    setBaseColor(loadedColors[0] ?? baseColor);
    setStatusMessage('Loaded saved palette.');
  }

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const query = encodeShareState({ baseColor, harmony, colors, locked });
    return `${window.location.origin}${window.location.pathname}?${query}`;
  }, [baseColor, harmony, colors, locked]);

  return (
    <div className="flex flex-col gap-6">
      <div role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      <PaletteControls
        baseColor={baseColor}
        onBaseColorChange={handleBaseColorChange}
        harmony={harmony}
        onHarmonyChange={setHarmony}
        count={count}
        onCountChange={setCount}
        onRandomize={handleRandomize}
        onSave={handleSave}
        shareUrl={shareUrl}
        randomizeDisabled={allLocked}
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
        {colors.map((hex, i) => (
          <ColorCard
            key={i}
            hex={hex}
            locked={locked[i] ?? false}
            onToggleLock={() => handleToggleLock(i)}
          />
        ))}
      </div>

      <ExportPanel colors={colors} />

      <div>
        <h2 className="mb-2 text-lg font-semibold text-text">Saved palettes</h2>
        <SavedPalettes onLoad={handleLoadSaved} refreshKey={savedRefresh} />
      </div>
    </div>
  );
}
