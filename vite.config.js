import { defineConfig } from 'vite';
import { resolve } from 'path';
import crypto from 'crypto';

// Polyfill crypto for Node.js environment
if (!global.crypto) {
  global.crypto = {
    getRandomValues: (buffer) => {
      return crypto.randomFillSync(buffer);
    }
  };
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