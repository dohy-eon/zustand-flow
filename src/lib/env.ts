/**
 * `process.env.NODE_ENV`는 Vite/esbuild가 빌드 시 문자열로 치환되므로 쓰지 않습니다.
 * 런타임 값을 쓰려면 `globalThis.process.env['NODE_ENV']`처럼 동적 키로 읽습니다.
 * 데모는 `vite.demo.config` head 시밈으로 여기에 `development`를 넣습니다.
 */
function getNodeEnv(): string | undefined {
  try {
    const p = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    const env = p?.env
    if (env == null) return undefined
    return env['NODE_ENV']
  } catch {
    return undefined
  }
}

export function shouldRecordFlowEvents(): boolean {
  const n = getNodeEnv()
  if (n == null) return false
  return n !== 'production'
}

export function isProductionBuild(): boolean {
  const n = getNodeEnv()
  if (n == null) return true
  return n === 'production'
}
