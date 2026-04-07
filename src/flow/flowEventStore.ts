export type FlowEvent = {
  id: string
  namespace: string
  action: string
  prevState: unknown
  nextState: unknown
  timestamp: number
}

/** Max events kept per namespace (oldest dropped). */
export const FLOW_EVENT_HISTORY_LIMIT = 50

const MAX_EVENTS = FLOW_EVENT_HISTORY_LIMIT

export const DEFAULT_FLOW_NAMESPACE = 'default'

let seq = 0

function newEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  seq += 1
  return `flow-${seq}`
}

const EMPTY: FlowEvent[] = []

/** Per-namespace timeline (references stable until that namespace mutates). */
const eventsByNamespace = new Map<string, FlowEvent[]>()
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

export function pushFlowEvent(
  event: Omit<FlowEvent, 'id'>
): void {
  const ns = event.namespace
  const full: FlowEvent = { ...event, id: newEventId() }
  const prev = eventsByNamespace.get(ns) ?? EMPTY
  const nextList = [full, ...(prev === EMPTY ? [] : prev)].slice(0, MAX_EVENTS)
  eventsByNamespace.set(ns, nextList)
  notify()
}

/** Clear one namespace, or all if `namespace` omitted. */
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
