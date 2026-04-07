export type FlowEvent = {
  action: string
  prevState: unknown
  nextState: unknown
  timestamp: number
}

const MAX_EVENTS = 300

let events: FlowEvent[] = []
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

export function pushFlowEvent(event: FlowEvent): void {
  events = [event, ...events].slice(0, MAX_EVENTS)
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
