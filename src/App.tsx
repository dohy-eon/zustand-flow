import { ZustandFlowDevtools } from './flow/ZustandFlowDevtools'
import { useStore } from './store'

export function App() {
  const count = useStore((s) => s.count)
  const inc = useStore((s) => s.inc)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        background: '#f8fafc',
        color: '#0f172a',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 20 }}>Zustand Flow demo</h1>
      <p style={{ margin: 0, fontSize: 14 }}>Count: {count}</p>
      <button
        type="button"
        onClick={inc}
        style={{
          padding: '10px 18px',
          fontSize: 14,
          borderRadius: 8,
          border: '1px solid #cbd5e1',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        Increment
      </button>
      <ZustandFlowDevtools namespace="demo" storeIdentifier="useStore" />
    </div>
  )
}
