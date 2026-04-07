export type FlowEvent = {
  id: string
  namespace: string
  action: string
  prevState: unknown
  nextState: unknown
  timestamp: number
}
