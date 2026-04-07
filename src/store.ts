import { create } from 'zustand'
import { flowMiddleware } from './flow/flowMiddleware'

type Store = {
  count: number
  inc: () => void
}

export const useStore = create<Store>()(
  flowMiddleware((set) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 }), false, 'inc'),
  }))
)
