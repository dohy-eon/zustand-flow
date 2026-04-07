# zustand-flow

Visualize how your Zustand state flows — and which action caused each change.

## Immutability

Flow stores **state references** from `get()` before/after each `set`. If you **mutate** nested objects instead of replacing them, timelines and diffs will be misleading. Prefer immutable updates (Zustand’s default pattern).

## Package layout (library build)

```bash
npm run build:lib
```

Emits **TypeScript ESM + `.d.ts`** into `dist-lib/` (no pre-bundle) so `import.meta.env` / `NODE_ENV` are resolved by **your** app bundler.

- **`zustand-flow`** → `dist-lib/index.js` — middleware, `useFlowEvents`, event store, snippets, diff helpers.
- **`zustand-flow/devtools`** → `dist-lib/devtools.js` — `<ZustandFlowDevtools />` only.

Import the root entry if you want to avoid pulling the devtools module into your graph.

## Copy as Test

`buildCopyTestSnippet(event, { storeId: 'useStore', runner: 'vitest' | 'jest' })` — Vitest emits explicit `describe`/`it`/`expect` imports; Jest assumes globals (see comment in snippet).

## Demo app

```bash
npm install
npm run dev
```
