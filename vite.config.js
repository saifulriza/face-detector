import { defineConfig } from 'vite';
import { resolve } from 'path';

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