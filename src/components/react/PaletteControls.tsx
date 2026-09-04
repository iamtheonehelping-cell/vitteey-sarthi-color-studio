import { HARMONY_TYPES, type HarmonyType } from '../../lib/color';
import ColorPicker from './ColorPicker';
import CopyButton from './CopyButton';

interface PaletteControlsProps {
  baseColor: string;
  onBaseColorChange: (hex: string) => void;
  harmony: HarmonyType;
  onHarmonyChange: (harmony: HarmonyType) => void;
  count: number;
  onCountChange: (count: number) => void;
  onRandomize: () => void;
  onSave: () => void;
  shareUrl: string;
  randomizeDisabled: boolean;
}

const HARMONY_LABELS: Record<HarmonyType, string> = {
  complementary: 'Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  tetradic: 'Tetradic',
  'split-complementary': 'Split Complementary',
  monochromatic: 'Monochromatic',
  shades: 'Shades',
  tints: 'Tints',
};

export default function PaletteControls({
  baseColor,
  onBaseColorChange,
  harmony,
  onHarmonyChange,
  count,
  onCountChange,
  onRandomize,
  onSave,
  shareUrl,
  randomizeDisabled,
}: PaletteControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-end gap-4">
        <ColorPicker value={baseColor} onChange={onBaseColorChange} />

        <label className="flex flex-col gap-1 text-sm font-medium text-text">
          Harmony
          <select
            value={harmony}
            onChange={(e) => onHarmonyChange(e.target.value as HarmonyType)}
            className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text"
          >
            {HARMONY_TYPES.map((type) => (
              <option key={type} value={type}>
                {HARMONY_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-text">
          Colors
          <input
            type="number"
            min={2}
            max={10}
            value={count}
            onChange={(e) => onCountChange(Math.min(10, Math.max(2, Number(e.target.value) || 2)))}
            className="w-20 rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRandomize}
          disabled={randomizeDisabled}
          aria-describedby={randomizeDisabled ? 'randomize-disabled-reason' : undefined}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Randomize
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-surface-subtle"
        >
          Save palette
        </button>
        <CopyButton
          value={shareUrl}
          label="Copy Share Link"
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-surface-subtle"
        />
      </div>

      {randomizeDisabled && (
        <p id="randomize-disabled-reason" className="text-sm text-text-muted">
          All colors are locked, so a new palette would look identical. Unlock at least one
          color to generate something new.
        </p>
      )}
    </div>
  );
}
