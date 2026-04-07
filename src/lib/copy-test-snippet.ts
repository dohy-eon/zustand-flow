import type { FlowEvent } from './types'

function stateLiteral(state: unknown): string {
  try {
    return JSON.stringify(state, null, 2)
  } catch {
    return '/* non-serializable state — set manually */'
  }
}

export type TestSnippetRunner = 'vitest' | 'jest'

export type BuildCopyTestSnippetOptions = {
  storeId?: string
  runner?: TestSnippetRunner
}

function snippetHeader(runner: TestSnippetRunner): string {
  if (runner === 'jest') {
    return `// Jest: ensure it/expect/describe are in scope (globals or @jest/globals)\nimport { act } from '@testing-library/react'\n`
  }
  return `import { describe, it, expect } from 'vitest'\nimport { act } from '@testing-library/react'\n`
}

/** Paste-ready test skeleton; fill the TODO to invoke your action. */
export function buildCopyTestSnippet(
  event: FlowEvent,
  options: BuildCopyTestSnippetOptions = {}
): string {
  const storeId = options.storeId ?? 'useStore'
  const runner = options.runner ?? 'vitest'
  const prev = stateLiteral(event.prevState)
  const next = stateLiteral(event.nextState)
  const safeTitle = event.action.replace(/'/g, "\\'")
  const header = snippetHeader(runner)

  const open = `describe('${storeId}', () => {\n  it('${safeTitle}', () => {\n`
  const close = `  })\n})\n`

  const body = `    act(() => {
      ${storeId}.setState(${prev})
    })

    act(() => {
      // TODO: trigger "${event.action}" (e.g. ${storeId}.getState().yourMethod())
    })

    expect(${storeId}.getState()).toEqual(${next})
`

  return `${header}import { ${storeId} } from './path-to-store'

${open}${body}${close}`
}
