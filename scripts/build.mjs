import * as esbuild from 'esbuild';
import path from 'node:path';
import process from 'node:process';

const SRC_PATH = path.resolve('.', 'src');

/**
 * @type {esbuild.Plugin}
 */
const resolveTSPathsPlugin = {
  name: 'resolveTSPaths',
  setup: (build) => {
    build.onResolve({ filter: /^@\// }, (args) => {
      const relativeFilePath = args.path.replace('@/', '');
      const absoluteFilePath = path.join(SRC_PATH, relativeFilePath);

      return build.resolve(absoluteFilePath, {
        importer: args.importer,
        kind: args.kind,
        namespace: args.namespace,
        pluginData: args.pluginData,
        resolveDir: args.resolveDir,
      });
    });
  },
};

/**
 * @type {esbuild.BuildOptions}
 */
const baseConfig = {
  bundle: true,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  tsconfig: 'tsconfig.build.json',
  sourcemap: 'linked',
  plugins: [resolveTSPathsPlugin],
  outExtension: {
    '.js': '.cjs',
  },
};

/**
 * @type {Record<string, esbuild.BuildOptions>}
 */
const CONFIGS = {
  app: {
    ...baseConfig,
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
  },
};

const targetConfig = process.argv.length >= 3 ? process.argv[2] : '';
const buildConfig = CONFIGS[targetConfig];

if (!buildConfig) {
  console.error(`Could not find any build config for target "${targetConfig}"`);
  process.exit(1);
}

await esbuild.build(buildConfig);