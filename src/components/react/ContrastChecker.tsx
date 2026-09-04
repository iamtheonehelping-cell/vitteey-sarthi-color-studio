import { useState } from 'react';
import { contrastRatio, isValidHex, normalizeHex, wcagLevel } from '../../lib/color';
import ColorSwatchInput from './ColorSwatchInput';

interface ContrastCheckerProps {
  initialForeground?: string;
  initialBackground?: string;
}

export default function ContrastChecker({
  initialForeground = '#212b4f',
  initialBackground = '#fefefe',
}: ContrastCheckerProps) {
  const [fg, setFg] = useState(initialForeground);
  const [bg, setBg] = useState(initialBackground);

  const valid = isValidHex(fg) && isValidHex(bg);
  const ratio = valid ? contrastRatio(normalizeHex(fg), normalizeHex(bg)) : 0;
  const normalLevel = valid ? wcagLevel(ratio, false) : 'fail';
  const largeLevel = valid ? wcagLevel(ratio, true) : 'fail';

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-text">
          Foreground (text)
          <div className="flex items-center gap-2">
            <ColorSwatchInput
              value={isValidHex(fg) ? normalizeHex(fg) : '#000000'}
              onChange={setFg}
              label="Foreground color"
            />
            <input
              type="text"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-2 py-1 font-mono text-sm text-text"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-text">
          Background
          <div className="flex items-center gap-2">
            <ColorSwatchInput
              value={isValidHex(bg) ? normalizeHex(bg) : '#ffffff'}
              onChange={setBg}
              label="Background color"
            />
            <input
              type="text"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-2 py-1 font-mono text-sm text-text"
            />
          </div>
        </label>
      </div>

      {valid ? (
        <div className="mt-4 space-y-3">
          <div
            className="flex h-24 items-center justify-center rounded-md text-lg font-semibold"
            style={{ backgroundColor: normalizeHex(bg), color: normalizeHex(fg) }}
          >
            Sample Text
          </div>
          <p className="font-mono text-sm text-text-muted">Contrast ratio: {ratio.toFixed(2)}:1</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <ResultBadge label="Normal text" level={normalLevel} />
            <ResultBadge label="Large text" level={largeLevel} />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-error-text">Enter two valid 6-digit hex colors.</p>
      )}
    </div>
  );
}

function ResultBadge({ label, level }: { label: string; level: 'fail' | 'AA' | 'AAA' }) {
  if (level === 'AAA') {
    return (
      <span className="rounded-full bg-success-bg px-3 py-1 font-medium text-success-text">
        {label}: Pass (AAA)
      </span>
    );
  }
  if (level === 'AA') {
    return (
      <span className="rounded-full bg-warning-bg px-3 py-1 font-medium text-warning-text">
        {label}: Pass (AA)
      </span>
    );
  }
  return (
    <span className="rounded-full bg-error-bg px-3 py-1 font-medium text-error-text">
      {label}: Fail
    </span>
  );
}
