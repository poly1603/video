# @ldesign/video 快速开始指南

## 🚀 5分钟上手

### 1. 安装

```bash
npm install @ldesign/video
```

### 2. 基础使用

```typescript
import { VideoPlayer } from '@ldesign/video';
import '@ldesign/video/style.css';

const player = new VideoPlayer('#player', {
  src: 'https://example.com/video.mp4',
  controls: true,
  autoplay: false,
});
```

## 📦 框架集成

### Vue 3

```vue
<template>
  <VideoPlayer
    ref="playerRef"
    src="video.mp4"
    :controls="true"
    :width="800"
    :height="450"
    @ready="onReady"
    @play="onPlay"
  />
</template>

<script setup>
import { ref } from 'vue';
import { VideoPlayer } from '@ldesign/video/vue';
import '@ldesign/video/style.css';

const playerRef = ref();

const onReady = (player) => {
  console.log('播放器就绪', player);
};

const onPlay = () => {
  console.log('开始播放');
};

// 控制播放器
const play = () => playerRef.value?.play();
const pause = () => playerRef.value?.pause();
</script>
```

### React 18

```tsx
import React, { useRef } from 'react';
import { VideoPlayer, VideoPlayerRef } from '@ldesign/video/react';
import '@ldesign/video/style.css';

function App() {
  const playerRef = useRef<VideoPlayerRef>(null);

  return (
    <VideoPlayer
      ref={playerRef}
      src="video.mp4"
      controls={true}
      width={800}
      height={450}
      onReady={(player) => console.log('播放器就绪', player)}
      onPlay={() => console.log('开始播放')}
    />
  );
}
```

### Lit 3

```typescript
import '@ldesign/video/lit';
import '@ldesign/video/style.css';

const player = document.createElement('ldesign-video-player');
player.src = 'video.mp4';
player.controls = true;
player.width = 800;
player.height = 450;

document.body.appendChild(player);

// 监听事件
player.addEventListener('ready', (e) => {
  console.log('播放器就绪', e.detail);
});
```

## 🎯 核心功能

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

// 发送弹幕
player.sendDanmaku('这是一条弹幕');
```

### 字幕支持

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  subtitle: {
    tracks: [
      {
        id: 'zh',
        url: 'subtitle-zh.srt',
        lang: 'zh-CN',
        label: '中文',
        default: true,
      },
    ],
  },
});
```

## 🔥 企业级功能

### 1. 播放列表

```typescript
import { PlaylistManager } from '@ldesign/video';

const playlist = new PlaylistManager();

// 添加视频
playlist.add([
  { id: '1', url: 'video1.mp4', title: '视频 1' },
  { id: '2', url: 'video2.mp4', title: '视频 2' },
]);

// 播放控制
playlist.next();        // 下一个
playlist.previous();    // 上一个
playlist.shuffle();     // 随机播放

// 监听事件
playlist.on('play', (item) => {
  console.log('正在播放:', item.title);
});
```

### 2. 质量分析

```typescript
import { QualityAnalyzer } from '@ldesign/video';

const analyzer = new QualityAnalyzer(player);

// 获取质量指标
const metrics = analyzer.getMetrics();
console.log('丢帧率:', metrics.droppedFrameRate);
console.log('缓冲健康度:', metrics.bufferHealth);
console.log('卡顿次数:', metrics.stallCount);
```

### 3. 智能预加载

```typescript
import { PreloadManager } from '@ldesign/video';

const preloader = new PreloadManager({
  strategy: 'normal',  // aggressive | normal | conservative
  count: 2,           // 预加载数量
  networkType: 'wifi', // all | wifi | none
});

preloader.setSources([
  { url: 'video1.mp4', quality: '1080p' },
  { url: 'video2.mp4', quality: '1080p' },
]);

// 开始预加载
await preloader.preload(0);

// 获取进度
console.log('预加载进度:', preloader.getProgress());
```

### 4. 错误自动恢复

```typescript
import { ErrorRecovery } from '@ldesign/video';

const recovery = new ErrorRecovery(player, {
  enabled: true,
  strategy: {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  },
});

// 监听恢复事件
recovery.on('recoverySuccess', (retryCount) => {
  console.log(`恢复成功，重试了 ${retryCount} 次`);
});

recovery.on('recoveryFailed', (error) => {
  console.error('恢复失败:', error);
});
```

### 5. 数据分析

```typescript
import { Analytics } from '@ldesign/video';

const analytics = new Analytics(player, 'video-123', {
  reportInterval: 30, // 30秒上报一次
  onReport: (stats) => {
    // 上报到服务器
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(stats),
    });
  },
});

// 获取统计数据
const stats = analytics.getStats();
console.log('观看时长:', stats.watchTime);
console.log('完成率:', stats.completionRate);
```

### 6. 快捷键

```typescript
import { Hotkeys } from '@ldesign/video';

const hotkeys = new Hotkeys(player);

// 自定义快捷键
hotkeys.register('p', () => {
  console.log('按下了 P 键');
});

// 禁用默认快捷键
hotkeys.unregister('Space');
```

### 7. 手势控制（移动端）

```typescript
import { Gestures } from '@ldesign/video';

const gestures = new Gestures(player, {
  enabled: true,
  doubleTapDelay: 300,
  volumeGesture: true,
  seekGesture: true,
});

// 监听手势事件
gestures.on('volumeGesture', (volume) => {
  console.log('音量调整:', volume);
});

gestures.on('doubleTap', () => {
  console.log('双击');
});
```

## 🎨 主题定制

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  theme: 'dark', // 'default' | 'dark'
});

// 自定义 CSS
<style>
.ldesign-video-player.my-theme {
  --primary-color: #ff6b6b;
  --bg-color: #000;
  --text-color: #fff;
}
</style>
```

## 📚 完整示例

```typescript
import {
  VideoPlayer,
  PlaylistManager,
  QualityAnalyzer,
  ErrorRecovery,
  Analytics,
  Hotkeys,
} from '@ldesign/video';
import '@ldesign/video/style.css';

// 1. 创建播放器
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  controls: true,
  autoplay: false,
  volume: 0.8,
  playbackRate: 1,
  theme: 'default',
});

// 2. 播放列表
const playlist = new PlaylistManager();
playlist.add([
  { id: '1', url: 'video1.mp4', title: '第一集' },
  { id: '2', url: 'video2.mp4', title: '第二集' },
]);

// 3. 质量分析
const analyzer = new QualityAnalyzer(player);
setInterval(() => {
  console.log('质量:', analyzer.getMetrics());
}, 5000);

// 4. 错误恢复
const recovery = new ErrorRecovery(player, {
  strategy: { maxRetries: 3, retryDelay: 1000 },
});

// 5. 数据分析
const analytics = new Analytics(player, 'video-123');
analytics.on('report', (stats) => {
  console.log('统计:', stats);
});

// 6. 快捷键
const hotkeys = new Hotkeys(player);

// 7. 事件监听
player.on('ready', () => console.log('就绪'));
player.on('play', () => console.log('播放'));
player.on('pause', () => console.log('暂停'));
player.on('ended', () => playlist.next());
```

## 🔗 运行示例项目

```bash
# 进入示例目录
cd examples/vue-demo

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 📖 更多文档

- [完整 API 文档](./README.md)
- [配置选项](./README.md#配置选项)
- [事件列表](./README.md#事件监听)
- [最佳实践](./ENHANCEMENT_SUMMARY.md)

## 💡 常见问题

### Q: 如何支持 DASH 格式？

```typescript
const player = new VideoPlayer('#player', {
  src: 'https://example.com/stream.mpd',
  type: 'dash',
});
```

### Q: 如何自定义控制条？

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  controls: {
    buttons: ['play', 'progress', 'volume', 'fullscreen'],
    autoHideDelay: 3000,
  },
});
```

### Q: 如何获取播放器实例？

```typescript
// Vue
const player = playerRef.value?.player;

// React
const player = playerRef.current?.player;

// 原生
const player = videoPlayer; // VideoPlayer 实例
```

---

🎉 开始使用 @ldesign/video 构建出色的视频应用！

