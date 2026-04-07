/** Dev-only recording: resolved when the app bundle is built (Vite / Node). */
export function shouldRecordFlowEvents(): boolean {
  return (
    (typeof import.meta !== 'undefined' &&
      import.meta.env != null &&
      import.meta.env.DEV === true) ||
    (typeof process !== 'undefined' &&
      process.env != null &&
      process.env.NODE_ENV === 'development')
  )
}

export function isProductionBuild(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env != null) {
    if (import.meta.env.PROD === true) return true
  }
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return true
  return false
}
