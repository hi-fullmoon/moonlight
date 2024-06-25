import postcss from 'rollup-plugin-postcss';
import * as rollup from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import babel from '@rollup/plugin-babel';

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
        extract: true,
      }),
      typescript(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['ts', '.tsx'],
      }),
    ],
    external: [],
  };
  const build = await rollup.rollup(config);

  const outputs: rollup.OutputOptions[] = Array.isArray(config.output) ? config.output : [config.output!];

  await Promise.all(outputs.map((output) => build.write(output)));

  console.log(`[JS] Generated ESM files ✅`);
}

build();
