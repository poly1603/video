/**
 * React 示例项目 - Launcher 配置
 */

import { defineConfig } from '@ldesign/launcher';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // React 插件
  plugins: [react()],

  // 开发服务器配置
  server: {
    port: 3001,
    open: true,
    host: '0.0.0.0',
  },

  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true,
  },

  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ldesign/video': resolve(__dirname, '../../src'),
      '@ldesign/video/react': resolve(__dirname, '../../src/adapters/react'),
    },
  },

  // 性能监控
  performance: {
    enable: true,
    lighthouse: true,
  },

  // 开发体验增强
  devExperience: {
    errorOverlay: true,
    qrCode: true,
    autoOpen: true,
    notify: true,
  },

  // 优化配置
  optimization: {
    splitChunks: true,
    minify: 'esbuild',
    treeshake: true,
  },
});

