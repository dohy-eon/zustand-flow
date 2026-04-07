export type FlowEvent = {
  id: string
  action: string
  prevState: unknown
  nextState: unknown
  timestamp: number
}

/** Max events kept in memory (oldest dropped). */
export const FLOW_EVENT_HISTORY_LIMIT = 50

const MAX_EVENTS = FLOW_EVENT_HISTORY_LIMIT

let seq = 0

function newEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  seq += 1
  return `flow-${seq}`
}

let events: FlowEvent[] = []
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

export function pushFlowEvent(
  event: Omit<FlowEvent, 'id'>
): void {
  const full: FlowEvent = { ...event, id: newEventId() }
  events = [full, ...events].slice(0, MAX_EVENTS)
  notify()
}

export function clearFlowEvents(): void {
  events = []
  notify()
}

export function getFlowEvents(): FlowEvent[] {
  return events
}

export function subscribeFlowEvents(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}
