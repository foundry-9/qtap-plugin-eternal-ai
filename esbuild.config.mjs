import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  format: 'cjs',
  sourcemap: true,
  external: ['@quilltap/plugin-types', '@quilltap/plugin-utils'],
  logLevel: 'info',
}).catch(() => process.exit(1));
