import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    host: true
  },
  preview: {
    allowedHosts: ['racetrackinfo-screens-production-8f97.up.railway.app']
  }
})
