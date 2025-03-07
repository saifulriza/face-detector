import { defineConfig } from 'vite';
import { resolve } from 'path';
import crypto from 'crypto';

// Proper crypto polyfill for Node.js environment
const cryptoPolyfill = {
  randomBytes: (size) => crypto.randomBytes(size),
  getRandomValues: function(arr) {
    const bytes = crypto.randomBytes(arr.length);
    arr.set(bytes);
    return arr;
  }
};

if (!global.crypto || !global.crypto.getRandomValues) {
  global.crypto = cryptoPolyfill;
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