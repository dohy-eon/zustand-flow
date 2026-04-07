import { useSyncExternalStore } from 'react'
import { DEFAULT_FLOW_NAMESPACE } from '../lib/constants'
import { getFlowEvents, subscribeFlowEvents } from '../lib/event-store'
import type { FlowEvent } from '../lib/types'

/** Headless subscription to flow events for one namespace (custom UI or logging). */
export function useFlowEvents(namespace: string = DEFAULT_FLOW_NAMESPACE): FlowEvent[] {
  return useSyncExternalStore(
    subscribeFlowEvents,
    () => getFlowEvents(namespace),
    () => getFlowEvents(namespace)
  )
}
