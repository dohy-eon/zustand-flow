import { describe, expect, it } from 'vitest'
import {
  buildCopyTestSnippet,
  buildVitestTestSnippet,
  escapeTestTitle,
} from './copy-test-snippet'
import type { FlowEvent } from './types'

const baseEvent = (over: Partial<FlowEvent> = {}): FlowEvent => ({
  id: '1',
  namespace: 'test',
  action: 'inc',
  prevState: { count: 0 },
  nextState: { count: 1 },
  timestamp: 0,
  ...over,
})

describe('escapeTestTitle', () => {
  it('escapes quotes and backslashes', () => {
    expect(escapeTestTitle("a'b")).toBe("a\\'b")
    expect(escapeTestTitle('x\\y')).toBe('x\\\\y')
  })
})

describe('buildVitestTestSnippet', () => {
  it('includes vitest imports and expect line', () => {
    const s = buildVitestTestSnippet(baseEvent())
    expect(s).toContain("from 'vitest'")
    expect(s).toContain("from '@testing-library/react'")
    expect(s).toContain('useStore.setState')
    expect(s).toContain('expect(useStore.getState()).toEqual')
    expect(s).toContain('"count": 1')
  })

  it('respects storeId', () => {
    const s = buildVitestTestSnippet(baseEvent(), { storeId: 'useCart' })
    expect(s).toContain('useCart')
    expect(s).toContain("describe('useCart'")
  })
})

describe('buildCopyTestSnippet', () => {
  it('uses jest preamble when runner is jest', () => {
    const s = buildCopyTestSnippet(baseEvent(), { runner: 'jest' })
    expect(s).toContain('@jest/globals')
    expect(s).not.toContain("from 'vitest'")
  })
})
