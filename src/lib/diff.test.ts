import { describe, expect, it } from 'vitest'
import { isOpaqueStateChange, shallowStateDiff } from './diff'

describe('shallowStateDiff', () => {
  it('returns changed keys for plain objects', () => {
    expect(shallowStateDiff({ a: 1 }, { a: 2 })).toEqual({
      a: { from: 1, to: 2 },
    })
  })

  it('returns null for arrays', () => {
    expect(shallowStateDiff([1], [2])).toBeNull()
  })
})

describe('isOpaqueStateChange', () => {
  it('is true when references differ but not plain objects', () => {
    expect(isOpaqueStateChange([1], [1])).toBe(true)
  })

  it('is false when same reference', () => {
    const o = {}
    expect(isOpaqueStateChange(o, o)).toBe(false)
  })
})
