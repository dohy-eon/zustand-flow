import type { CSSProperties } from 'react'
import { isOpaqueStateChange, shallowStateDiff } from '../../lib/diff'
import { tryStringify } from './format'

export function JsonBlock({ label, value }: { label: string; value: unknown }) {
  let text: string
  try {
    text = JSON.stringify(value, null, 2)
  } catch {
    text = String(value)
  }
  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          fontSize: 10,
          color: '#9ca3af',
          marginBottom: 6,
          letterSpacing: '0.02em',
          textTransform: 'uppercase' as const,
        }}
      >
        {label}
      </div>
      <pre
        style={{
          margin: 0,
          padding: 10,
          background: '#0b0f14',
          borderRadius: 6,
          fontSize: 10,
          lineHeight: 1.45,
          overflow: 'auto',
          maxHeight: 168,
          color: '#e5e7eb',
          border: '1px solid #1f2937',
        }}
      >
        {text}
      </pre>
    </div>
  )
}

const box: CSSProperties = {
  marginTop: 4,
  padding: '10px 12px',
  borderRadius: 6,
  fontSize: 10,
  lineHeight: 1.45,
}

export function DiffSummary({ prev, next }: { prev: unknown; next: unknown }) {
  const diff = shallowStateDiff(prev, next)
  if (diff === null) {
    if (Object.is(prev, next)) {
      return (
        <div style={{ ...box, background: '#1f2937', color: '#9ca3af', border: '1px solid #374151' }}>
          Same state reference — no transition to compare.
        </div>
      )
    }
    if (isOpaqueStateChange(prev, next)) {
      return (
        <div
          style={{
            ...box,
            background: '#292524',
            color: '#fcd34d',
            border: '1px solid #78350f',
          }}
        >
          State changed, but shallow key diff is only for plain objects (not Map, Set, arrays as
          root, or class instances). Inspect JSON below.
        </div>
      )
    }
    return (
      <div style={{ ...box, background: '#1f2937', color: '#9ca3af', border: '1px solid #374151' }}>
        Could not compute shallow keys. See JSON below.
      </div>
    )
  }
  const keys = Object.keys(diff)
  if (keys.length === 0) {
    return (
      <div
        style={{
          ...box,
          color: '#6ee7b7',
          background: '#052e1f',
          border: '1px solid #14532d',
        }}
      >
        No shallow key changes (same reference or value).
      </div>
    )
  }
  return (
    <div style={{ marginTop: 4 }}>
      <div
        style={{
          fontSize: 10,
          color: '#fcd34d',
          marginBottom: 8,
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        Changed keys ({keys.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {keys.map((k) => (
          <div
            key={k}
            style={{
              padding: '10px 12px',
              background: '#0c1829',
              borderRadius: 6,
              border: '1px solid #1e3a5f',
              borderLeft: '3px solid #38bdf8',
              fontSize: 10,
              lineHeight: 1.45,
            }}
          >
            <div style={{ color: '#93c5fd', fontWeight: 600, marginBottom: 6 }}>{k}</div>
            <div style={{ color: '#fca5a5' }}>
              <span style={{ opacity: 0.85 }}>from </span>
              <code style={{ wordBreak: 'break-all' }}>{tryStringify(diff[k].from)}</code>
            </div>
            <div style={{ color: '#86efac', marginTop: 6 }}>
              <span style={{ opacity: 0.85 }}>to </span>
              <code style={{ wordBreak: 'break-all' }}>{tryStringify(diff[k].to)}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function changedKeysLabel(prev: unknown, next: unknown): string | null {
  const diff = shallowStateDiff(prev, next)
  if (diff && Object.keys(diff).length > 0) return Object.keys(diff).join(', ')
  if (isOpaqueStateChange(prev, next)) return 'non-plain state change'
  return null
}
