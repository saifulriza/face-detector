import { defineConfig } from 'vite';
import { resolve } from 'path';
import { webcrypto } from 'node:crypto';

// Use Node.js 22's native webcrypto API
if (!global.crypto) {
  global.crypto = webcrypto;
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/face-detector.js'),
      name: 'FaceDetector',
      fileName: 'face-detector',
      formats: ['umd', 'es']
    },
    rollupOptions: {
      output: {
        globals: {
          FaceDetector: 'FaceDetector'
        }
      }
    }
  }
});