import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  outDir: 'dist',
  // Externalize peer dependencies
  external: ['fuse.js'], // If you decide to use fuse.js as a peer/dev dependency
  // CLI banner for executable
  banner: {
    js: '#!/usr/bin/env node',
  },
  // onSuccess: async () => {
  //   console.log('Build successful, copying JSON data...');
  //   // This is where you'd copy the generated tld-info-data.json to dist/
  //   // For example, using fs-extra:
  //   // await copy('src/data/tld-info-data.json', 'dist/tld-info-data.json');
  //   // For now, this is handled by the compile-data script and package.json exports.
  // },
});
