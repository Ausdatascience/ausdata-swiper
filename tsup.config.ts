import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  noExternal: ['swiper'], // 将这个依赖打包进去
  splitting: false, // 不分包，将一切打包到单个文件
  external: ['react', 'react-dom'], // 只将 React 作为外部依赖
  target: 'es2020',
  minify: true,
  bundle: true,
  outDir: 'dist',
  treeshake: true
})
