import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite 프로덕션 빌드 시에도 데모 호스팅(Vercel 등)에서 Flow 패널·이벤트 기록이 켜지도록
 * 런타임 `process.env.NODE_ENV`는 `development`로 둡니다. (라이브러리 번들 `vite.config.ts`와 무관)
 */
const nodeEnvForPage = 'development'

/** 브라우저에 `process.env.NODE_ENV`가 없을 때 flow 미들웨어가 동작하도록 시밈 */
function processEnvShimPlugin() {
  const script = `globalThis.process=globalThis.process||{env:{NODE_ENV:${JSON.stringify(nodeEnvForPage)}}};`
  return {
    name: 'zustand-flow-demo-process-shim',
    transformIndexHtml(html: string) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            injectTo: 'head-prepend' as const,
            children: script,
          },
        ],
      }
    },
  }
}

/** Demo app (dev server + static preview). Library build uses vite.config.ts. */
export default defineConfig({
  plugins: [processEnvShimPlugin(), react()],
  root: '.',
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
  },
})
