import { defineConfig } from 'vite';
import { resolve } from 'path';
import { webcrypto } from 'node:crypto';

// Use Node.js 22's native webcrypto API
if (!global.crypto) {
  global.crypto = webcrypto;
}

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/face-detector.js'),
      name: 'FaceDetector',
      fileName: (format) => `webcam-face-detector.${format}.js`,
      formats: ['umd', 'es']
    },
    rollupOptions: {
      output: {
        globals: {
          FaceDetector: 'FaceDetector',
          pico: 'pico',
          lploc: 'lploc'
        },
        inlineDynamicImports: true
      }
    }
  }
});