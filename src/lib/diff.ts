function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Shallow diff: changed top-level keys as `{ from, to }`. `null` if not both plain objects. */
export function shallowStateDiff(
  prev: unknown,
  next: unknown
): Record<string, { from: unknown; to: unknown }> | null {
  if (!isPlainObject(prev) || !isPlainObject(next)) {
    return null
  }
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)])
  const out: Record<string, { from: unknown; to: unknown }> = {}
  for (const k of keys) {
    const a = prev[k]
    const b = next[k]
    if (Object.is(a, b)) continue
    out[k] = { from: a, to: b }
  }
  return out
}

/** True when state changed but shallow key diff does not apply (Map, class instance, etc.). */
export function isOpaqueStateChange(prev: unknown, next: unknown): boolean {
  return !Object.is(prev, next) && shallowStateDiff(prev, next) === null
}
