import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  base: '/resistor-tool/',
  // plugins: [svelte(), viteSingleFile()],
  plugins: [svelte()],
})
