import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In the Base44 sandbox the dev server is reached through a rotating preview
// host, so its host allowlist is extended only while BASE44_PREVIEW_MODE=1.
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN
const allowedHosts =
  process.env.BASE44_PREVIEW_MODE === '1' && sandboxHostDomain
    ? [`.${sandboxHostDomain}`]
    : []

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts,
    // Bind mounts don't always emit file events inside containers.
    watch: { usePolling: true, interval: 300 },
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://api:4000',
        changeOrigin: true,
      },
    },
  },
})
