import postcss from 'rollup-plugin-postcss';
import { rollup, OutputOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

async function build() {
  const config: RollupOptions = {
    input: ['src/index.ts'],
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].js',
        format: 'es',
        exports: 'named',
      },
    ],
    plugins: [
      postcss({
        extract: 'style.css',
      }),
      typescript(),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts', '.tsx'],
      }),
    ],
    external: ['react', 'react-dom'],
  };
  const build = await rollup(config);

  const outputs: OutputOptions[] = Array.isArray(config.output) ? config.output : [config.output!];
  await Promise.all(outputs.map((output) => build.write(output)));

  console.log(`[JS] Generated ESM files ✅`);
}

build();
