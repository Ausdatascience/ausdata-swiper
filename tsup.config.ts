import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // 添加 CommonJS 格式以支持开发环境
  dts: true,
  sourcemap: true,
  clean: true,
  noExternal: ['swiper'], // 将这个依赖打包进去
  splitting: false, // 不分包，将一切打包到单个文件
  external: ['react', 'react-dom'], // 只将 React 作为外部依赖
  target: 'es2020',
  minify: false, // 开发时不压缩
  bundle: true,
  outDir: 'dist',
  treeshake: true,
  // 开发时监听文件变化
  watch: process.env.NODE_ENV === 'development' ? {
    onRebuild(error, result) {
      if (error) console.error('Rebuild failed:', error)
      else console.log('Rebuild succeeded')
    },
  } : false,
})