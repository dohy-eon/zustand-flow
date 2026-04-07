import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_FLOW_NAMESPACE, FLOW_EVENT_HISTORY_LIMIT } from '../../lib/constants'
import { isProductionBuild } from '../../lib/env'
import { clearFlowEvents } from '../../lib/event-store'
import type { TestSnippetRunner } from '../../lib/copy-test-snippet'
import { useFlowEvents } from '../use-flow-events'
import { EventRow } from './event-row'
import { btnBase, panel } from './styles'

export type ZustandFlowDevtoolsProps = {
  /** Must match `flowMiddleware({ namespace })`. */
  namespace?: string
  /** Store name in “Copy as Test” output. */
  storeIdentifier?: string
  testRunner?: TestSnippetRunner
}

function ZustandFlowDevtoolsInner({
  namespace = DEFAULT_FLOW_NAMESPACE,
  storeIdentifier = 'useStore',
  testRunner = 'vitest',
}: ZustandFlowDevtoolsProps) {
  const [open, setOpen] = useState(true)
  const events = useFlowEvents(namespace)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey && e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])

  const onClear = useCallback(() => {
    clearFlowEvents(namespace)
  }, [namespace])

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
        title="Show Flow (⌘⌃Z)"
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
            {namespace} · {events.length} / {FLOW_EVENT_HISTORY_LIMIT}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onClear}
            style={btnBase}
            title="Clear events for this namespace"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{ ...btnBase, padding: '6px 9px' }}
            title="Hide panel (⌘⌃Z)"
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
          events.map((e) => (
            <EventRow
              key={e.id}
              event={e}
              storeIdentifier={storeIdentifier}
              testRunner={testRunner}
            />
          ))
        )}
      </div>
    </div>
  )
}

/** Renders `null` in production. Prefer dynamic `import('zustand-flow/devtools')` in dev for smaller prod bundles. */
export function ZustandFlowDevtools(props: ZustandFlowDevtoolsProps) {
  if (isProductionBuild()) return null
  return <ZustandFlowDevtoolsInner {...props} />
}
