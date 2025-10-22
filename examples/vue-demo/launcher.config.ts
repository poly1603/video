/**
 * Vue 示例项目 - Launcher 配置
 */

import { defineConfig } from '@ldesign/launcher';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  // Vue 插件
  plugins: [vue()],

  // 开发服务器配置
  server: {
    port: 3000,
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
      '@ldesign/video/vue': resolve(__dirname, '../../src/adapters/vue'),
    },
  },

  // 性能监控
  performance: {
    enable: true,
    lighthouse: true,
    budgets: {
      js: 500, // KB
      css: 100, // KB
    },
  },

  // 开发体验增强
  devExperience: {
    // 错误遮罩层
    errorOverlay: true,

    // 二维码访问
    qrCode: true,

    // 自动打开浏览器
    autoOpen: true,

    // 通知
    notify: true,
  },

  // 优化配置
  optimization: {
    // 代码分割
    splitChunks: true,

    // 压缩
    minify: 'esbuild',

    // Tree-shaking
    treeshake: true,
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});

