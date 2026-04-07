import type { StateCreator, StoreApi } from 'zustand'
import { pushFlowEvent } from './flowEventStore'

function snapshot(value: unknown): unknown {
  try {
    return structuredClone(value)
  } catch {
    try {
      return JSON.parse(JSON.stringify(value))
    } catch {
      return value
    }
  }
}

/** `set` with optional 3rd argument for action name (passed to flow events only). */
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

export function flowMiddleware<T extends object>(
  config: FlowStateCreator<T>
): StateCreator<T, [], []> {
  return (set, get, api) => {
    const wrappedSet: FlowSetState<T> = (
      partial: T | Partial<T> | ((state: T) => T | Partial<T>),
      replace?: boolean,
      action?: string
    ) => {
      const prevState = snapshot(get())
      const actionName = typeof action === 'string' ? action : 'anonymous'

      if (replace === true) {
        set(partial as T | ((state: T) => T), true)
      } else {
        set(
          partial as T | Partial<T> | ((state: T) => T | Partial<T>),
          replace as false | undefined
        )
      }

      const nextState = snapshot(get())
      pushFlowEvent({
        action: actionName,
        prevState,
        nextState,
        timestamp: Date.now(),
      })
    }

    return config(wrappedSet, get, api)
  }
}
