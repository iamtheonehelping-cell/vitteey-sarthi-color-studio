interface ColorSwatchInputProps {
  value: string;
  onChange: (hex: string) => void;
  label: string;
}

/**
 * A native `<input type="color">` trigger with an explicit visible swatch
 * div behind it, outlined with a light+dark double ring (inline `boxShadow`,
 * not a themed border token) so the swatch stays visibly distinct from its
 * surroundings no matter what color it holds — including the coincidental
 * case where the fill matches the panel background exactly, e.g. the
 * default base color is the brand navy, which is also the dark-mode card
 * background.
 */
export default function ColorSwatchInput({ value, onChange, label }: ColorSwatchInputProps) {
  return (
    <span
      className="relative inline-block h-9 w-9 shrink-0 rounded-md"
      style={{
        backgroundColor: value,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.9), inset 0 0 0 2px rgba(0,0,0,0.35)',
      }}
    >
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer rounded-md opacity-0"
        aria-label={label}
      />
    </span>
  );
}
