import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';

export default {
  input: ['src/components/index.ts'],
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
      minimize: true,
      plugins: [
        autoprefixer({ overrideBrowserslist: ['> 0.15% in CN'] }), // 自动添加css前缀
      ],
    }),
    typescript(),
  ],
  external: [],
};
