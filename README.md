# @ldesign/video

> 🎬 企业级视频播放器插件 - 功能强大、性能卓越、开箱即用

[![npm version](https://img.shields.io/npm/v/@ldesign/video.svg)](https://www.npmjs.com/package/@ldesign/video)
[![License](https://img.shields.io/npm/l/@ldesign/video.svg)](./LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

## ✨ 核心特性

### 🎯 多框架支持
- ✅ **Vue 3** - 组件 + Composable
- ✅ **React 18** - 组件 + Hook
- ✅ **Lit 3** - Web Component
- ✅ **原生 JavaScript** - 零依赖

### 📺 流媒体
- ✅ **HLS** 自适应流媒体（hls.js）
- ✅ **DASH** 流媒体（dash.js）
- ✅ **多画质切换**（自动/手动）

### 💬 弹幕系统
- ✅ **Canvas 高性能渲染**
- ✅ **三种弹幕类型**（滚动/顶部/底部）
- ✅ **弹幕过滤**
- ✅ **防重叠模式**

### 📝 字幕支持
- ✅ **SRT 格式**
- ✅ **VTT 格式**
- ✅ **ASS 格式**
- ✅ **多语言切换**

### 🔥 企业级功能
- ✅ **播放列表管理** - 完整的列表控制
- ✅ **质量实时分析** - 丢帧、缓冲监控
- ✅ **智能预加载** - 提升用户体验
- ✅ **错误自动恢复** - 指数退避重试
- ✅ **数据分析埋点** - 播放数据统计
- ✅ **快捷键系统** - 15+ 个快捷键
- ✅ **手势控制** - 移动端优化

### ⚡ 性能优化
- ✅ **零配置构建** - 使用 @ldesign/builder
- ✅ **构建速度提升 3-10 倍**
- ✅ **Web Worker** 数据处理
- ✅ **对象池** 优化
- ✅ **帧调度器**
- ✅ **懒加载**

### 💪 开发体验
- ✅ **TypeScript** 完整支持
- ✅ **完整测试** - 单元 + E2E
- ✅ **详细文档** - 8 篇文档
- ✅ **丰富示例** - 3 个框架
- ✅ **最佳实践** - 性能优化指南

---

## 📦 安装

```bash
npm install @ldesign/video

# 可选：流媒体支持
npm install hls.js dashjs
```

---

## 🚀 快速开始

### 原生 JavaScript

```javascript
import { VideoPlayer } from '@ldesign/video';
import '@ldesign/video/style.css';

const player = new VideoPlayer('#player', {
  src: 'https://example.com/video.mp4',
  controls: true,
  autoplay: false,
});

player.on('ready', () => console.log('就绪'));
player.on('play', () => console.log('播放'));
```

### Vue 3

```vue
<template>
  <VideoPlayer
    src="video.mp4"
    :controls="true"
    @ready="onReady"
  />
</template>

<script setup>
import { VideoPlayer } from '@ldesign/video/vue';
import '@ldesign/video/style.css';

const onReady = (player) => {
  console.log('播放器就绪', player);
};
</script>
```

### React 18

```tsx
import { VideoPlayer } from '@ldesign/video/react';
import '@ldesign/video/style.css';

function App() {
  return (
    <VideoPlayer
      src="video.mp4"
      controls={true}
      onReady={(player) => console.log('就绪', player)}
    />
  );
}
```

### Lit 3

```html
<ldesign-video-player
  src="video.mp4"
  controls
></ldesign-video-player>

<script type="module">
  import '@ldesign/video/lit';
  import '@ldesign/video/style.css';
</script>
```

---

## 🎯 核心功能示例

### HLS 流媒体

```typescript
const player = new VideoPlayer('#player', {
  src: 'https://example.com/stream.m3u8',
  type: 'hls',
  quality: {
    default: '720p',
    auto: true,
  },
});
```

### 弹幕系统

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  danmaku: {
    enable: true,
    opacity: 0.8,
    speed: 1,
    fontSize: 24,
  },
});

player.sendDanmaku('这是一条弹幕');
```

### 播放列表

```typescript
import { PlaylistManager } from '@ldesign/video';

const playlist = new PlaylistManager();
playlist.add([
  { id: '1', url: 'video1.mp4', title: '第一集' },
  { id: '2', url: 'video2.mp4', title: '第二集' },
]);

playlist.next(); // 下一个
```

### 质量分析

```typescript
import { QualityAnalyzer } from '@ldesign/video';

const analyzer = new QualityAnalyzer(player);
const metrics = analyzer.getMetrics();

console.log('丢帧率:', metrics.droppedFrameRate);
console.log('缓冲健康度:', metrics.bufferHealth);
```

### 错误恢复

```typescript
import { ErrorRecovery } from '@ldesign/video';

const recovery = new ErrorRecovery(player, {
  strategy: {
    maxRetries: 3,
    retryDelay: 1000,
  },
});

recovery.on('recoverySuccess', () => {
  console.log('恢复成功');
});
```

### 数据分析

```typescript
import { Analytics } from '@ldesign/video';

const analytics = new Analytics(player, 'video-123');
analytics.on('report', (stats) => {
  console.log('观看时长:', stats.watchTime);
  console.log('完成率:', stats.completionRate);
});
```

---

## 📖 文档

- 📘 [快速开始指南](./QUICK_START_GUIDE.md) - 5 分钟上手
- 📗 [API 文档](./docs/API.md) - 完整 API 参考
- 📕 [最佳实践](./docs/BEST_PRACTICES.md) - 性能优化建议
- 📙 [迁移指南](./docs/MIGRATION_GUIDE.md) - 从其他播放器迁移

---

## 🎨 示例项目

运行完整的示例应用：

```bash
# Vue 示例
cd examples/vue-demo && npm install && npm run dev

# React 示例
cd examples/react-demo && npm install && npm run dev

# Lit 示例
cd examples/lit-demo && npm install && npm run dev
```

---

## 🏗️ 构建

项目使用 `@ldesign/builder` 进行零配置智能构建：

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 构建分析
npm run analyze
```

---

## 🧪 测试

```bash
# 运行单元测试
npm run test

# 运行 E2E 测试
npx playwright test

# 测试覆盖率
npm run test -- --coverage
```

---

## 📊 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88
- iOS Safari >= 14
- Android Chrome >= 87

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

---

## 📄 许可证

[MIT](./LICENSE) © 2024 ldesign

---

## 🔗 相关链接

- [GitHub](https://github.com/ldesign/video)
- [npm](https://www.npmjs.com/package/@ldesign/video)
- [问题反馈](https://github.com/ldesign/video/issues)
- [更新日志](./CHANGELOG.md)

---

## ⭐ Star History

如果这个项目对你有帮助，请给一个 ⭐ Star！
