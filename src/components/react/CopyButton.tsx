import { useState } from 'react';

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ value, label = 'Copy', className = '' }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${className}`}
      aria-label={`${label} ${value}`}
    >
      {status === 'copied' ? 'Copied!' : status === 'error' ? 'Copy failed' : label}
      <span className="sr-only" aria-live="polite">
        {status === 'copied' ? 'Copied to clipboard' : status === 'error' ? 'Copy failed' : ''}
      </span>
    </button>
  );
}
