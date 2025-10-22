/**
 * Lit 示例项目 - Launcher 配置
 */

import { defineConfig } from '@ldesign/launcher';
import { resolve } from 'path';

export default defineConfig({
  // 开发服务器配置
  server: {
    port: 3002,
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
      '@ldesign/video/lit': resolve(__dirname, '../../src/adapters/lit'),
    },
  },

  // 性能监控
  performance: {
    enable: true,
  },

  // 开发体验
  devExperience: {
    errorOverlay: true,
    qrCode: true,
  },
});

