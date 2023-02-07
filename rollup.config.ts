import { defineConfig } from 'rollup';
import { aliucordPlugin, makeManifest, makePluginZip } from '@aliucord/rollup-plugin';

export default defineConfig({
  input: process.env.pluginPath,
  output: {
    file: `dist/${process.env.plugin}.js`,
  },
  plugins: [
    aliucordPlugin({
      autoDeploy: !!process.env.ROLLUP_WATCH
    }),
    makeManifest({
      baseManifest: 'baseManifest.json',
      manifest: `${process.env.plugin}/manifest.json`,
    }),
    makePluginZip(),
  ],
});
