import typescript from '@rollup/plugin-typescript';

export default {
  input: ['src/index.ts'],
  output: [
    {
      dir: 'dist',
      entryFileNames: '[name].js',
      format: 'es',
      exports: 'named',
    },
  ],
  plugins: [typescript()],
  external: ['exceljs', 'file-saver', 'antd'],
};
