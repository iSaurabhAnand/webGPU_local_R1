import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    build: {
        target: 'esnext',
        minify: 'terser',
        sourcemap: false
    }
});
