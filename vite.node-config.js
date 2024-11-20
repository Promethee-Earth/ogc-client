import { defineConfig } from 'vite';
import { dependencies, devDependencies } from './package.json';

export default defineConfig({
  build: {
    ssr: true,
    rollupOptions: {
      external: ['proj4', 'node-fetch'],
      input: 'src-node/index.ts',
      output: {
        entryFileNames: 'dist-node.js',
        globals: (name) => name,
      },
    },
    emptyOutDir: false,
    outDir: 'dist',
    minify: false,
  },
  ssr: {
    noExternal: Object.keys(dependencies).concat(Object.keys(devDependencies)),
    target: 'node',
  },
});
