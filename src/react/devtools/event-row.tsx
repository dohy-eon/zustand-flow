import { memo, useCallback, useState } from 'react'
import { buildCopyTestSnippet, type TestSnippetRunner } from '../../lib/copy-test-snippet'
import type { FlowEvent } from '../../lib/types'
import { changedKeysLabel, DiffSummary, JsonBlock } from './panels'
import { formatTime } from './format'
import { btnBase } from './styles'

type EventRowProps = {
  event: FlowEvent
  storeIdentifier: string
  testRunner: TestSnippetRunner
}

export const EventRow = memo(function EventRow({
  event,
  storeIdentifier,
  testRunner,
}: EventRowProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])
  const keysHint = changedKeysLabel(event.prevState, event.nextState)

  const copyTest = useCallback(() => {
    const text = buildCopyTestSnippet(event, {
      storeId: storeIdentifier,
      runner: testRunner,
    })
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })
  }, [event, storeIdentifier, testRunner])

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
          <div style={{ marginBottom: 8 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                copyTest()
              }}
              style={{ ...btnBase, fontSize: 10 }}
            >
              {copied ? 'Copied' : 'Copy as Test'}
            </button>
          </div>
          <DiffSummary prev={event.prevState} next={event.nextState} />
          <JsonBlock label="prevState" value={event.prevState} />
          <JsonBlock label="nextState" value={event.nextState} />
        </div>
      )}
    </div>
  )
})
