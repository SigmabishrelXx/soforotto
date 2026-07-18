import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind is wired via PostCSS (see postcss.config.mjs) rather than the Vite
// plugin, which does not reliably transform CSS under this Vite version.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
