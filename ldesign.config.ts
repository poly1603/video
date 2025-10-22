/**
 * @ldesign/builder 配置文件
 * 零配置智能构建，自动检测框架和优化
 */

import { defineConfig } from '@ldesign/builder';

export default defineConfig({
  // 库名称
  name: '@ldesign/video',

  // 自动检测 Vue/React/Lit 框架
  autoDetect: true,

  // 入口配置 - 多入口支持
  entries: {
    // 核心包
    index: 'src/index.ts',

    // Vue 适配器
    vue: 'src/adapters/vue/index.ts',

    // React 适配器
    react: 'src/adapters/react/index.tsx',

    // Lit 适配器
    lit: 'src/adapters/lit/index.ts',
  },

  // 输出格式（ESM + CJS + UMD）
  formats: ['esm', 'cjs', 'umd'],

  // 输出目录
  outDir: 'dist',

  // 样式处理
  styles: {
    // 提取独立的 CSS 文件
    extract: true,

    // 不使用 CSS Modules
    modules: false,

    // 样式入口
    entry: 'src/styles/index.css',

    // PostCSS 配置
    postcss: {
      plugins: {
        autoprefixer: {},
        cssnano: {
          preset: 'default',
        },
      },
    },
  },

  // 外部依赖 - 不打包进产物
  external: [
    'vue',
    'react',
    'react-dom',
    'react/jsx-runtime',
    'lit',
    'lit/decorators.js',
    'lit/directive.js',
    'lit/directives/class-map.js',
    'lit/directives/style-map.js',
    'hls.js',
    'dashjs',
  ],

  // 全局变量映射（UMD 格式）
  globals: {
    vue: 'Vue',
    react: 'React',
    'react-dom': 'ReactDOM',
    lit: 'Lit',
    'hls.js': 'Hls',
    dashjs: 'dashjs',
  },

  // TypeScript 配置
  typescript: {
    // 生成类型声明文件
    declaration: true,

    // 生成类型声明映射文件
    declarationMap: true,

    // 使用项目的 tsconfig.json
    tsconfig: './tsconfig.json',
  },

  // 优化配置
  optimization: {
    // 生产环境压缩
    minify: true,

    // Tree-shaking
    treeshake: true,

    // 代码分割
    splitting: false,

    // 移除 console
    dropConsole: true,

    // 移除 debugger
    dropDebugger: true,
  },

  // 源码映射
  sourcemap: false,

  // 清理输出目录
  clean: true,

  // 构建报告
  report: {
    // 生成构建报告
    enabled: true,

    // 显示文件大小
    showSize: true,

    // 显示 gzip 大小
    showGzip: true,
  },

  // Vue 特定配置
  vue: {
    // Vue 版本
    version: 3,

    // 是否使用 JSX
    jsx: false,
  },

  // React 特定配置
  react: {
    // JSX 运行时
    jsxRuntime: 'automatic',

    // JSX 导入源
    jsxImportSource: 'react',
  },

  // Lit 特定配置
  lit: {
    // 使用装饰器
    decorators: true,
  },

  // 插件配置
  plugins: [],
});

