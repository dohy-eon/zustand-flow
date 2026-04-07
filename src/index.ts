/* Root export: core + `useFlowEvents`. Devtools UI: `zustand-flow/devtools`. */
export type { FlowEvent } from './lib/types'
export { DEFAULT_FLOW_NAMESPACE, FLOW_EVENT_HISTORY_LIMIT } from './lib/constants'
export {
  clearFlowEvents,
  getFlowEvents,
  subscribeFlowEvents,
} from './lib/event-store'
export {
  flowMiddleware,
  type FlowMiddlewareOptions,
  type FlowSetState,
  type FlowStateCreator,
} from './lib/middleware'
export { shallowStateDiff, isOpaqueStateChange } from './lib/diff'
export {
  buildCopyTestSnippet,
  buildVitestTestSnippet,
  escapeTestTitle,
  type BuildCopyTestSnippetOptions,
  type TestSnippetRunner,
} from './lib/copy-test-snippet'
export { useFlowEvents } from './react/use-flow-events'
