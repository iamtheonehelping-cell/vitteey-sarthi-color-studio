import { isValidHex, normalizeHex } from '../../lib/color';
import ColorSwatchInput from './ColorSwatchInput';

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
}

export default function ColorPicker({ value, onChange, label = 'Base color' }: ColorPickerProps) {
  const swatchColor = isValidHex(value) ? normalizeHex(value) : '#212b4f';

  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-text">
      {label}
      <div className="flex items-center gap-2">
        <ColorSwatchInput value={swatchColor} onChange={onChange} label={label} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#212b4f"
          className="w-28 rounded-md border border-border bg-surface px-2 py-1 font-mono text-sm uppercase text-text"
        />
      </div>
    </label>
  );
}
