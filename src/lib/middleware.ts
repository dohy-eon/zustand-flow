import type { StateCreator, StoreApi } from 'zustand'
import { DEFAULT_FLOW_NAMESPACE } from './constants'
import { shouldRecordFlowEvents } from './env'
import { pushFlowEvent } from './event-store'

const shouldRecord = shouldRecordFlowEvents()

export type FlowMiddlewareOptions = {
  /** Isolates timeline when multiple stores use flow middleware. */
  namespace?: string
}

/** `set` with optional 3rd argument for action name (flow events only). */
export type FlowSetState<T extends object> = {
  (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: false,
    action?: string
  ): void
  (state: T | ((state: T) => T), replace: true, action?: string): void
}

export type FlowStateCreator<T extends object> = (
  set: FlowSetState<T>,
  get: () => T,
  api: StoreApi<T>
) => T

function createFlowInner<T extends object>(
  options: FlowMiddlewareOptions,
  config: FlowStateCreator<T>
): StateCreator<T, [], []> {
  const namespace = options.namespace ?? DEFAULT_FLOW_NAMESPACE

  return (set, get, api) => {
    const wrappedSet: FlowSetState<T> = (
      partial: T | Partial<T> | ((state: T) => T | Partial<T>),
      replace?: boolean,
      action?: string
    ) => {
      const actionName = typeof action === 'string' ? action : 'anonymous'

      const apply = () => {
        if (replace === true) {
          set(partial as T | ((state: T) => T), true)
        } else {
          set(
            partial as T | Partial<T> | ((state: T) => T | Partial<T>),
            replace as false | undefined
          )
        }
      }

      if (!shouldRecord) {
        apply()
        return
      }

      const prevState = get()
      apply()
      const nextState = get()

      if (Object.is(prevState, nextState)) {
        return
      }

      pushFlowEvent({
        namespace,
        action: actionName,
        prevState,
        nextState,
        timestamp: Date.now(),
      })
    }

    return config(wrappedSet, get, api)
  }
}

/**
 * Wraps `set` to record flow events (dev only). Stores **references** from `get()` before/after
 * `set` — keep Zustand state updates immutable; in-place mutation breaks timelines/diffs.
 */
export function flowMiddleware<T extends object>(
  config: FlowStateCreator<T>
): StateCreator<T, [], []>
export function flowMiddleware<T extends object>(
  options: FlowMiddlewareOptions,
  config: FlowStateCreator<T>
): StateCreator<T, [], []>
export function flowMiddleware<T extends object>(
  optionsOrConfig: FlowMiddlewareOptions | FlowStateCreator<T>,
  config?: FlowStateCreator<T>
): StateCreator<T, [], []> {
  if (config !== undefined) {
    return createFlowInner(optionsOrConfig as FlowMiddlewareOptions, config)
  }
  return createFlowInner({}, optionsOrConfig as FlowStateCreator<T>)
}
