# 迁移指南

## 从 Video.js 迁移

### 基础使用

**Video.js**:
```javascript
const player = videojs('my-video', {
  controls: true,
  autoplay: false,
  preload: 'auto',
});
```

**@ldesign/video**:
```javascript
import { VideoPlayer } from '@ldesign/video';

const player = new VideoPlayer('#my-video', {
  controls: true,
  autoplay: false,
  preload: 'auto',
});
```

### 事件监听

**Video.js**:
```javascript
player.on('play', function() {
  console.log('播放');
});
```

**@ldesign/video**:
```typescript
player.on('play', () => {
  console.log('播放');
});
```

### 播放控制

功能基本相同：

```javascript
player.play();
player.pause();
player.currentTime(30);  // Video.js
player.seek(30);         // @ldesign/video
player.volume(0.5);      // Video.js
player.setVolume(0.5);   // @ldesign/video
```

## 从 Plyr 迁移

### 基础使用

**Plyr**:
```javascript
const player = new Plyr('#player', {
  controls: ['play', 'progress', 'volume', 'fullscreen'],
});
```

**@ldesign/video**:
```typescript
const player = new VideoPlayer('#player', {
  controls: {
    buttons: ['play', 'progress', 'volume', 'fullscreen'],
  },
});
```

### 事件系统

**Plyr**:
```javascript
player.on('play', event => {});
```

**@ldesign/video**:
```typescript
player.on('play', () => {});
```

## 从 DPlayer 迁移

### 弹幕系统

**DPlayer**:
```javascript
const dp = new DPlayer({
  container: document.getElementById('player'),
  video: { url: 'video.mp4' },
  danmaku: {
    id: 'demo',
    api: 'https://api.example.com/danmaku/',
  },
});
```

**@ldesign/video**:
```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  danmaku: {
    enable: true,
    source: 'https://api.example.com/danmaku/',
    onSend: async (danmaku) => {
      await fetch('https://api.example.com/danmaku/', {
        method: 'POST',
        body: JSON.stringify(danmaku),
      });
    },
  },
});
```

### 发送弹幕

**DPlayer**:
```javascript
dp.danmaku.send({
  text: '这是一条弹幕',
  color: '#fff',
  type: 'right',
});
```

**@ldesign/video**:
```typescript
player.sendDanmaku('这是一条弹幕', {
  color: '#fff',
  type: 'scroll',
});
```

## 功能对比

| 功能 | Video.js | Plyr | DPlayer | @ldesign/video |
|------|----------|------|---------|----------------|
| 基础播放 | ✅ | ✅ | ✅ | ✅ |
| HLS | ✅ | ✅ | ✅ | ✅ |
| DASH | ✅ | ❌ | ❌ | ✅ |
| 弹幕 | ❌ | ❌ | ✅ | ✅ |
| 字幕 | ✅ | ✅ | ✅ | ✅ |
| 画质切换 | ✅ | ✅ | ✅ | ✅ |
| Vue 支持 | 🔌 | 🔌 | ❌ | ✅ |
| React 支持 | 🔌 | 🔌 | ❌ | ✅ |
| Lit 支持 | ❌ | ❌ | ❌ | ✅ |
| TypeScript | ✅ | ✅ | ❌ | ✅ |
| 播放列表 | 🔌 | ❌ | ❌ | ✅ |
| 质量分析 | ❌ | ❌ | ❌ | ✅ |
| 错误恢复 | ❌ | ❌ | ❌ | ✅ |
| 包大小 | ~250KB | ~20KB | ~150KB | ~30KB |

**图例**：
- ✅ 原生支持
- 🔌 通过插件支持
- ❌ 不支持

## 迁移清单

### 1. 安装依赖

```bash
npm uninstall video.js # 或 plyr / dplayer
npm install @ldesign/video
```

### 2. 更新引入

```typescript
// 旧
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// 新
import { VideoPlayer } from '@ldesign/video';
import '@ldesign/video/style.css';
```

### 3. 更新初始化代码

参考上面各播放器的对比示例。

### 4. 更新事件监听

事件名称基本相同，只需更新语法。

### 5. 测试功能

确保所有功能正常工作。

## 优势

### 为什么选择 @ldesign/video？

1. **更小的包体积** - 30KB vs 150-250KB
2. **更好的 TypeScript 支持** - 完整类型定义
3. **多框架原生支持** - Vue/React/Lit
4. **企业级功能** - 播放列表、质量分析、错误恢复
5. **现代化架构** - 基于最新标准
6. **更好的性能** - 优化的渲染和内存管理
7. **完整的弹幕支持** - Canvas 高性能渲染
8. **零配置构建** - 使用 @ldesign/builder

## 需要帮助？

- [API 文档](./API.md)
- [快速开始](../QUICK_START_GUIDE.md)
- [示例代码](../examples/)
- [GitHub Issues](https://github.com/ldesign/video/issues)

