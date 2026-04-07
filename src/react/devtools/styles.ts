import type { CSSProperties } from 'react'

export const panel: CSSProperties = {
  position: 'fixed',
  right: 14,
  bottom: 14,
  width: 340,
  maxHeight: '46vh',
  display: 'flex',
  flexDirection: 'column',
  background: '#111827',
  color: '#e5e7eb',
  borderRadius: 10,
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  border: '1px solid #1f2937',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  zIndex: 99999,
  overflow: 'hidden',
}

export const btnBase: CSSProperties = {
  fontSize: 11,
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #374151',
  background: '#1f2937',
  color: '#e5e7eb',
  cursor: 'pointer',
  lineHeight: 1.2,
}
