import { hexToHsl, hexToRgb, readableTextColor } from '../../lib/color';
import CopyButton from './CopyButton';

interface ColorCardProps {
  hex: string;
  locked: boolean;
  onToggleLock: () => void;
}

function LockIcon({ locked }: { locked: boolean }) {
  return locked ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.4-2" />
    </svg>
  );
}

export default function ColorCard({ hex, locked, onToggleLock }: ColorCardProps) {
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  const rgbString = `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
  const hslString = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
  const textColor = readableTextColor(hex);

  return (
    <div
      className="group relative flex h-56 flex-col justify-between rounded-lg p-4 shadow-sm sm:h-64"
      style={{
        backgroundColor: hex,
        color: textColor,
        boxShadow: locked ? `0 0 0 3px ${textColor}, inset 0 0 0 3px ${hex}` : undefined,
      }}
    >
      <button
        type="button"
        onClick={onToggleLock}
        aria-pressed={locked}
        aria-label={locked ? `Unlock ${hex}` : `Lock ${hex}`}
        className="inline-flex items-center gap-1 self-end rounded-full border px-2 py-1 text-xs font-medium"
        style={{ borderColor: textColor, backgroundColor: locked ? textColor : 'transparent', color: locked ? hex : textColor }}
      >
        <LockIcon locked={locked} />
        {locked ? 'Locked' : 'Lock'}
      </button>

      <div className="space-y-1">
        <p className="font-mono text-lg font-semibold uppercase">{hex}</p>
        <p className="font-mono text-xs opacity-80">{rgbString}</p>
        <p className="font-mono text-xs opacity-80">{hslString}</p>
        <div className="flex gap-1 pt-1">
          <CopyButton value={hex} label="HEX" className="border border-current/30" />
          <CopyButton value={rgbString} label="RGB" className="border border-current/30" />
          <CopyButton value={hslString} label="HSL" className="border border-current/30" />
        </div>
      </div>
    </div>
  );
}
