import * as esbuild from 'esbuild'

const isWatch = process.argv.includes('--watch')

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: ['src/extension/extension.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outdir: 'dist/extension',
  external: ['vscode'],
  sourcemap: true,
  minify: false,
  tsconfig: 'tsconfig.extension.json',
}

if (isWatch) {
  const ctx = await esbuild.context(buildOptions)
  await ctx.watch()
  console.log('Watching extension...')
} else {
  await esbuild.build(buildOptions)
  console.log('Extension built successfully.')
}
