import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  appType: 'spa',
  plugins: [react(), svgr(), nodePolyfills({ include: ['path'] })],
  server: {
    port: 3000,
    host: '127.0.0.1',
  },
})
