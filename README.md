# zustand-flow

Trace **which action** moved Zustand state: middleware + optional React devtools.

## Demo


https://github.com/user-attachments/assets/d7464b32-30ca-4d95-8a9f-ca973ca0759f


## Install

```bash
npm install zustand-flow
```

Peers: `react`, `react-dom`, `zustand` (v5).

## Usage

**Core** (middleware + headless hook):

```ts
import { flowMiddleware, useFlowEvents } from 'zustand-flow'
```

**Devtools UI** (separate entry — keeps UI out of the main graph if you only want middleware):

```ts
import { ZustandFlowDevtools } from 'zustand-flow/devtools'
```

## Build (maintainers)

| Script        | Output        | Purpose                          |
|---------------|---------------|----------------------------------|
| `npm run build` | `dist/`       | **Library** ESM (`.js`) + CJS (`.cjs`) + `.d.ts` |
| `npm run build:demo` | `dist-demo/` | Demo SPA for preview            |
| `npm run dev` | —             | Demo dev server                  |
| `npm test`    | —             | Vitest                           |

`package.json` **exports**:

- `.` → `dist/index.js` / `dist/index.cjs` + types  
- `./devtools` → `dist/devtools.js` / `dist/devtools.cjs` + types  

Rollup may emit small shared chunks under `dist/`; publish the whole `dist` folder (`files` field).

## Immutability

Events store **references** from `get()` before/after `set`. In-place mutation breaks timelines — keep updates immutable.

## `NODE_ENV`

Middleware and devtools use `process.env.NODE_ENV` (injected by Vite, webpack, etc.). If `process` is missing, recording stays off and devtools are not treated as a production build (the panel may still render).

## Vitest “Copy as Test”

`buildVitestTestSnippet(event, { storeId: 'useStore' })` or `buildCopyTestSnippet` (default runner: Vitest). See `src/lib/copy-test-snippet.ts`.

## Source layout

| Path        | Role                                      |
|------------|-------------------------------------------|
| `src/lib/` | Middleware, event store, env, diff, snippet |
| `src/react/` | `use-flow-events`, devtools UI          |
| `src/index.ts` | Package main entry                    |
| `src/devtools.tsx` | Package `zustand-flow/devtools`   |
