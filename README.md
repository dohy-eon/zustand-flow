# zustand-flow

> **Stop guessing, start tracing.**

Trace **exactly which action** moved your Zustand state — middleware, a focused Devtools UI, and **one-click Vitest/Jest snippets**.

**→ [Open the live demo](https://zustand-flow.vercel.app)**

[![npm version](https://img.shields.io/npm/v/zustand-flow.svg)](https://www.npmjs.com/package/zustand-flow)
[![license](https://img.shields.io/npm/l/zustand-flow.svg)](https://github.com/dohy-eon/zustand-flow/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/zustand-flow)](https://bundlephobia.com/package/zustand-flow)

## What you get

- 🔍 See **why** state changed — not just **what**
- 🕒 **Timeline** of actions (labeled `set` calls)
- 🔁 **Before / after** state (diff-friendly workflow in Devtools)
- 🧪 **Copy real transitions as tests** (Vitest / Jest)

## Before vs After

❌ `console.log` debugging · guessing what flipped state  
✅ **Timeline** · **action tracing** · **instant test snippets**

❌ “Something mutated this slice…”  
✅ **Named actions** end-to-end

## Why?

Zustand stays simple; **debugging** multi-action flows does not.

Redux DevTools-style tooling often shows *what* moved — **zustand-flow** is built around the **flow**: named actions, readable timeline, and turning that moment into a test.

## Quick start

```bash
npm install zustand-flow
```

Peers: `react`, `react-dom`, `zustand` (^5).

**1. Middleware** — third argument to `set` is the action label:

```ts
import { create } from 'zustand'
import { flowMiddleware } from 'zustand-flow'

type Store = { count: number; increment: () => void }

export const useStore = create<Store>()(
  flowMiddleware((set) => ({
    count: 0,
    increment: () =>
      set((s) => ({ count: s.count + 1 }), false, 'increment'),
  }))
)
```

Multiple stores: `flowMiddleware({ namespace: 'cart' }, (set) => ({ … }))`.

**2. Devtools (dev only)**

```tsx
import { ZustandFlowDevtools } from 'zustand-flow/devtools'

function App() {
  return (
    <>
      <YourApp />
      <ZustandFlowDevtools />
    </>
  )
}
```

**3. Copy as test** — from the panel, or in code: `buildCopyTestSnippet(event, { storeId: 'useStore' })` · [`copy-test-snippet.ts`](src/lib/copy-test-snippet.ts)

## Demo

- **[zustand-flow.vercel.app](https://zustand-flow.vercel.app)** — try the timeline and “copy as test” in the browser.
- **[Screen recording](https://github.com/user-attachments/assets/d7464b32-30ca-4d95-8a9f-ca973ca0759f)** (GitHub-hosted clip).

## Headless

```ts
import { flowMiddleware, useFlowEvents } from 'zustand-flow'
```

## Package layout

| Import | Purpose |
|--------|---------|
| `zustand-flow` | Middleware, events, diff helpers, snippet builders, `useFlowEvents` |
| `zustand-flow/devtools` | `ZustandFlowDevtools` |

Exports: ESM + CJS + types for `.` and `./devtools`. Publish the full `dist/` tree (`files` in `package.json`).

## Immutability

Events keep **references** from `get()` before/after `set`. In-place mutation breaks timelines — keep updates immutable.

## `NODE_ENV`

Recording follows `process.env.NODE_ENV` (with a `globalThis.process` fallback). The demo uses a small shim in `vite.demo.config.ts` so `npm run dev` works without a full `process` polyfill.

## Build (maintainers)

| Script | Output | Purpose |
|--------|--------|---------|
| `npm run build` | `dist/` | Library ESM (`.js`) + CJS (`.cjs`) + `.d.ts` |
| `npm run build:demo` | `dist-demo/` | Demo SPA |
| `npm run dev` | — | Demo dev server |
| `npm test` | — | Vitest |

## Source layout

| Path | Role |
|------|------|
| `src/lib/` | Middleware, event store, env, diff, snippets |
| `src/react/` | `use-flow-events`, Devtools UI |
| `src/index.ts` | Main entry |
| `src/devtools.tsx` | `zustand-flow/devtools` entry |
