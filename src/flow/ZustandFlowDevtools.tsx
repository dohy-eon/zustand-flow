import { useCallback, useState, useSyncExternalStore } from 'react'
import {
  clearFlowEvents,
  getFlowEvents,
  subscribeFlowEvents,
  type FlowEvent,
} from './flowEventStore'

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
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>{label}</div>
      <pre
        style={{
          margin: 0,
          padding: 8,
          background: '#0b0f14',
          borderRadius: 4,
          fontSize: 10,
          lineHeight: 1.35,
          overflow: 'auto',
          maxHeight: 160,
          color: '#e5e7eb',
          border: '1px solid #1f2937',
        }}
      >
        {text}
      </pre>
    </div>
  )
}

function EventRow({ event }: { event: FlowEvent }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])

  return (
    <div
      style={{
        borderBottom: '1px solid #1f2937',
        padding: '6px 8px',
        fontSize: 11,
      }}
    >
      <button
        type="button"
        onClick={toggle}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          width: '100%',
          color: '#f3f4f6',
        }}
      >
        <span style={{ fontWeight: 600, color: '#93c5fd' }}>{event.action}</span>
        <span style={{ color: '#9ca3af', fontSize: 10, flexShrink: 0 }}>
          {formatTime(event.timestamp)}
        </span>
      </button>
      {open && (
        <>
          <JsonBlock label="prevState" value={event.prevState} />
          <JsonBlock label="nextState" value={event.nextState} />
        </>
      )}
    </div>
  )
}

export function ZustandFlowDevtools() {
  const events = useSyncExternalStore(
    subscribeFlowEvents,
    getFlowEvents,
    getFlowEvents
  )

  return (
    <div
      style={{
        position: 'fixed',
        right: 12,
        bottom: 12,
        width: 320,
        maxHeight: '42vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#111827',
        color: '#e5e7eb',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        border: '1px solid #1f2937',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: '#0f172a',
          borderBottom: '1px solid #1f2937',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <span>Zustand Flow</span>
        <button
          type="button"
          onClick={clearFlowEvents}
          style={{
            fontSize: 10,
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid #374151',
            background: '#1f2937',
            color: '#e5e7eb',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>
      <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
        {events.length === 0 ? (
          <div style={{ padding: 12, fontSize: 11, color: '#6b7280' }}>
            No events yet.
          </div>
        ) : (
          events.map((e, i) => (
            <EventRow key={`${e.timestamp}-${i}`} event={e} />
          ))
        )}
      </div>
    </div>
  )
}
