import { DEFAULT_FLOW_NAMESPACE, FLOW_EVENT_HISTORY_LIMIT } from './constants'
import type { FlowEvent } from './types'

const MAX_EVENTS = FLOW_EVENT_HISTORY_LIMIT

let seq = 0

function newEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  seq += 1
  return `flow-${seq}`
}

const EMPTY: FlowEvent[] = []

const eventsByNamespace = new Map<string, FlowEvent[]>()
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

/** @internal Used by middleware only. */
export function pushFlowEvent(event: Omit<FlowEvent, 'id'>): void {
  const ns = event.namespace
  const full: FlowEvent = { ...event, id: newEventId() }
  const prev = eventsByNamespace.get(ns) ?? EMPTY
  const nextList = [full, ...(prev === EMPTY ? [] : prev)].slice(0, MAX_EVENTS)
  eventsByNamespace.set(ns, nextList)
  notify()
}

export function clearFlowEvents(namespace?: string): void {
  if (namespace === undefined) {
    eventsByNamespace.clear()
  } else {
    eventsByNamespace.delete(namespace)
  }
  notify()
}

export function getFlowEvents(namespace: string = DEFAULT_FLOW_NAMESPACE): FlowEvent[] {
  return eventsByNamespace.get(namespace) ?? EMPTY
}

export function subscribeFlowEvents(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}
