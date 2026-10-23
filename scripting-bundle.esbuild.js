const esbuild = require('esbuild');
const { externalGlobalPlugin } = require('esbuild-plugin-external-global');

esbuild.build({
  entryPoints: ['packages/vehicle-layer/src/index.ts'],
  bundle: true,
  outfile: 'dist/packages/vehicle-layer/scripting-bundle.js',
  plugins: [
    externalGlobalPlugin({
      '@deck.gl/core': 'deck',
      '@deck.gl/mesh-layers': 'deck',
      '@deck.gl/layers': 'deck',
    }),
  ],
});
