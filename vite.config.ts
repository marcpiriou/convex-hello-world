import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Set to e.g. "/convex-hello-world/" when building for a GitHub Pages
  // project site; defaults to root for local dev and most other hosts.
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
})
