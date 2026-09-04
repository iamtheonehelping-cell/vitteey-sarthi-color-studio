/**
 * Joins Astro's configured `base` path with an absolute-style path, without
 * producing a double slash regardless of whether `import.meta.env.BASE_URL`
 * itself ends in a slash. Safe to use whether or not a base path is
 * configured at all (falls back to a plain root-relative path).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath}` || '/';
}
