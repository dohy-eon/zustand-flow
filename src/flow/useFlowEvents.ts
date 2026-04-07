import { useSyncExternalStore } from 'react'
import {
  DEFAULT_FLOW_NAMESPACE,
  getFlowEvents,
  subscribeFlowEvents,
  type FlowEvent,
} from './flowEventStore'

/** Subscribe to flow events for a namespace (headless; use for custom UI or logging). */
export function useFlowEvents(namespace: string = DEFAULT_FLOW_NAMESPACE): FlowEvent[] {
  return useSyncExternalStore(
    subscribeFlowEvents,
    () => getFlowEvents(namespace),
    () => getFlowEvents(namespace)
  )
}
