import { defineConfig } from 'rollup';
import { aliucordPlugin, makeManifest } from '@aliucord/rollup-plugin';

export default defineConfig({
  input: process.env.pluginPath,
  output: {
    file: `dist/${process.env.plugin}.js`,
  },
  plugins: [
    aliucordPlugin({
      autoDeploy: !!process.env.ROLLUP_WATCH,
      hermesPath: 'node_modules/.pnpm/hermes-engine@0.11.0/node_modules/hermes-engine',
    }),
    makeManifest({
      baseManifest: 'baseManifest.json',
      manifest: `${process.env.plugin}/manifest.json`,
      outputFile: `dist/${process.env.plugin}.json`,
    }),
  ],
});
