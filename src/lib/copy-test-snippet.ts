import type { FlowEvent } from './types'

export type TestSnippetRunner = 'vitest' | 'jest'

export type BuildCopyTestSnippetOptions = {
  /** Default `useStore` — must match your store export name. */
  storeId?: string
  /** Vitest is the default; use `jest` for a Jest-oriented import header. */
  runner?: TestSnippetRunner
}

function jsonState(state: unknown): string {
  try {
    return JSON.stringify(state, null, 2)
  } catch {
    return '/* non-serializable state — set manually */'
  }
}

/** Safe for `it('…')` single-quoted titles. */
export function escapeTestTitle(action: string): string {
  return action.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function vitestPreamble(): string {
  return [
    "import { describe, it, expect } from 'vitest'",
    "import { act } from '@testing-library/react'",
    '',
  ].join('\n')
}

function jestPreamble(): string {
  return [
    "// Jest: use globals or `import { describe, it, expect } from '@jest/globals'`",
    "import { act } from '@testing-library/react'",
    '',
  ].join('\n')
}

function storeImportLine(storeId: string): string {
  return `import { ${storeId} } from './path-to-store'\n\n`
}

function testBody(storeId: string, actionLabel: string, prev: string, next: string): string {
  return `    act(() => {
      ${storeId}.setState(${prev})
    })

    act(() => {
      // TODO: trigger "${actionLabel}" (e.g. ${storeId}.getState().yourMethod())
    })

    expect(${storeId}.getState()).toEqual(${next})
`
}

/**
 * Clipboard-friendly Vitest (default) or Jest test skeleton around a flow event.
 */
export function buildCopyTestSnippet(
  event: FlowEvent,
  options: BuildCopyTestSnippetOptions = {}
): string {
  const storeId = options.storeId ?? 'useStore'
  const runner = options.runner ?? 'vitest'
  const prev = jsonState(event.prevState)
  const next = jsonState(event.nextState)
  const title = escapeTestTitle(event.action)
  const preamble = runner === 'jest' ? jestPreamble() : vitestPreamble()
  const open = `describe('${storeId}', () => {\n  it('${title}', () => {\n`
  const close = `  })\n})\n`

  return `${preamble}${storeImportLine(storeId)}${open}${testBody(storeId, event.action, prev, next)}${close}`
}

/** Same as `buildCopyTestSnippet(event, { ...opts, runner: 'vitest' })`. */
export function buildVitestTestSnippet(
  event: FlowEvent,
  options: Omit<BuildCopyTestSnippetOptions, 'runner'> = {}
): string {
  return buildCopyTestSnippet(event, { ...options, runner: 'vitest' })
}
