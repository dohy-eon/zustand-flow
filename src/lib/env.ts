/**
 * Uses `process.env.NODE_ENV` so values are resolved by the **app** bundler (Vite, webpack, …).
 * Avoids `import.meta.env`, which library bundlers can fold incorrectly in dual-format output.
 */
export function shouldRecordFlowEvents(): boolean {
  if (typeof process === 'undefined' || process.env == null) return false
  return process.env.NODE_ENV !== 'production'
}

export function isProductionBuild(): boolean {
  if (typeof process === 'undefined' || process.env == null) return false
  return process.env.NODE_ENV === 'production'
}
