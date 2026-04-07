import { useCallback, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { shallowStateDiff } from './flowDiff'
import {
  clearFlowEvents,
  FLOW_EVENT_HISTORY_LIMIT,
  getFlowEvents,
  subscribeFlowEvents,
  type FlowEvent,
} from './flowEventStore'

const panel: CSSProperties = {
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

const btnBase: CSSProperties = {
  fontSize: 11,
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #374151',
  background: '#1f2937',
  color: '#e5e7eb',
  cursor: 'pointer',
  lineHeight: 1.2,
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
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

function DiffSummary({ prev, next }: { prev: unknown; next: unknown }) {
  const diff = shallowStateDiff(prev, next)
  if (diff === null) {
    return (
      <div
        style={{
          marginTop: 4,
          padding: '10px 12px',
          background: '#1f2937',
          borderRadius: 6,
          fontSize: 10,
          lineHeight: 1.45,
          color: '#9ca3af',
          border: '1px solid #374151',
        }}
      >
        Shallow diff applies to plain objects only. See full JSON below.
      </div>
    )
  }
  const keys = Object.keys(diff)
  if (keys.length === 0) {
    return (
      <div
        style={{
          marginTop: 4,
          padding: '10px 12px',
          fontSize: 10,
          lineHeight: 1.45,
          color: '#6ee7b7',
          background: '#052e1f',
          borderRadius: 6,
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

function tryStringify(v: unknown): string {
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

function changedKeysLabel(prev: unknown, next: unknown): string | null {
  const diff = shallowStateDiff(prev, next)
  if (!diff || Object.keys(diff).length === 0) return null
  return Object.keys(diff).join(', ')
}

function EventRow({ event }: { event: FlowEvent }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])
  const keysHint = changedKeysLabel(event.prevState, event.nextState)

  return (
    <div
      style={{
        borderBottom: '1px solid #1f2937',
        padding: '10px 14px',
      }}
    >
      <button
        type="button"
        onClick={toggle}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 4,
          width: '100%',
          color: '#f3f4f6',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              color: '#93c5fd',
              fontSize: 12,
              lineHeight: 1.35,
            }}
          >
            {event.action}
            {open ? ' ▾' : ' ▸'}
          </span>
          <span
            style={{
              color: '#9ca3af',
              fontSize: 10,
              flexShrink: 0,
              lineHeight: 1.35,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatTime(event.timestamp)}
          </span>
        </div>
        {!open && keysHint && (
          <div
            style={{
              fontSize: 10,
              color: '#fcd34d',
              opacity: 0.95,
              lineHeight: 1.35,
              paddingLeft: 1,
            }}
          >
            {keysHint}
          </div>
        )}
      </button>
      {open && (
        <div style={{ paddingTop: 10 }}>
          <DiffSummary prev={event.prevState} next={event.nextState} />
          <JsonBlock label="prevState" value={event.prevState} />
          <JsonBlock label="nextState" value={event.nextState} />
        </div>
      )}
    </div>
  )
}

export function ZustandFlowDevtools() {
  const [open, setOpen] = useState(true)
  const events = useSyncExternalStore(
    subscribeFlowEvents,
    getFlowEvents,
    getFlowEvents
  )

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          ...btnBase,
          position: 'fixed',
          right: 14,
          bottom: 14,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          fontWeight: 600,
          border: '1px solid #334155',
          background: '#0f172a',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <span>Flow</span>
        {events.length > 0 && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#93c5fd',
              background: '#1e293b',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            {events.length}
          </span>
        )}
      </button>
    )
  }

  return (
    <div style={panel}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '11px 14px',
          background: '#0f172a',
          borderBottom: '1px solid #1f2937',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Zustand Flow
          </span>
          <span style={{ fontSize: 10, color: '#6b7280' }}>
            Last {events.length} / {FLOW_EVENT_HISTORY_LIMIT}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={clearFlowEvents}
            style={btnBase}
            title="Clear event history"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{ ...btnBase, padding: '6px 9px' }}
            title="Hide panel"
            aria-label="Hide devtools panel"
          >
            −
          </button>
        </div>
      </div>
      <div
        style={{
          overflow: 'auto',
          flex: 1,
          minHeight: 0,
          paddingBottom: 4,
        }}
      >
        {events.length === 0 ? (
          <div
            style={{
              padding: '18px 16px',
              fontSize: 12,
              lineHeight: 1.5,
              color: '#6b7280',
            }}
          >
            No events yet. Dispatch actions with a named <code style={{ color: '#9ca3af' }}>set</code>{' '}
            call to see them here.
          </div>
        ) : (
          events.map((e) => <EventRow key={e.id} event={e} />)
        )}
      </div>
    </div>
  )
}
