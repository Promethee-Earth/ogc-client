import esbuild from 'esbuild';
import { glob } from 'glob';

const files = glob.sync('src/**/*.ts', {
  ignore: ['**/worker/index.ts', '**/*.spec.ts']
});

esbuild.build({
  entryPoints: files,
  outdir: 'dist',
  platform: 'neutral',
  format: 'esm',
  sourcemap: true
}).catch(() => process.exit(1));