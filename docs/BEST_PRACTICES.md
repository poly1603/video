# 最佳实践

## 性能优化

### 1. 使用合适的预加载策略

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  preload: 'metadata', // 'none' | 'metadata' | 'auto'
});
```

- `none` - 不预加载，节省带宽
- `metadata` - 只加载元数据（推荐）
- `auto` - 完整预加载

### 2. 启用质量自适应

```typescript
const player = new VideoPlayer('#player', {
  src: 'stream.m3u8',
  type: 'hls',
  quality: {
    auto: true, // 自动调整画质
  },
});
```

### 3. 使用播放列表预加载

```typescript
import { PreloadManager } from '@ldesign/video';

const preloader = new PreloadManager({
  strategy: 'normal',
  networkType: 'wifi', // 仅在 WiFi 下预加载
});

preloader.setSources(playlist);
await preloader.preload(currentIndex);
```

### 4. 启用错误自动恢复

```typescript
import { ErrorRecovery } from '@ldesign/video';

const recovery = new ErrorRecovery(player, {
  strategy: {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  },
});
```

## 用户体验

### 1. 添加加载状态

```vue
<VideoPlayer src="video.mp4">
  <template #loading>
    <div class="custom-loading">
      <div class="spinner"></div>
      <p>视频加载中...</p>
    </div>
  </template>
</VideoPlayer>
```

### 2. 错误处理

```typescript
player.on('error', (error) => {
  // 显示友好的错误提示
  showErrorMessage('视频加载失败，请稍后重试');
  
  // 记录错误日志
  console.error('Video error:', error);
});
```

### 3. 使用响应式设计

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  responsive: true,
  aspectRatio: '16:9',
});
```

### 4. 移动端优化

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  gestures: true,  // 启用手势控制
  controls: {
    autoHideDelay: 3000, // 3秒后自动隐藏控制条
  },
});
```

## 数据分析

### 1. 追踪播放数据

```typescript
import { Analytics } from '@ldesign/video';

const analytics = new Analytics(player, 'video-123', {
  reportInterval: 30,
  onReport: async (stats) => {
    // 上报到服务器
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
    });
  },
});
```

### 2. 监控播放质量

```typescript
import { QualityAnalyzer } from '@ldesign/video';

const analyzer = new QualityAnalyzer(player);

setInterval(() => {
  const metrics = analyzer.getMetrics();
  
  // 丢帧率过高时降低画质
  if (metrics.droppedFrameRate > 5) {
    console.warn('丢帧率过高，建议降低画质');
  }
  
  // 缓冲健康度低时暂停播放
  if (metrics.bufferHealth < 30) {
    player.pause();
    showMessage('网络不佳，请稍候...');
  }
}, 2000);
```

## 弹幕系统

### 1. 优化弹幕性能

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  danmaku: {
    enable: true,
    maxOnScreen: 50,      // 限制同屏弹幕数量
    mode: 'no-overlap',   // 防重叠模式
    opacity: 0.8,         // 降低透明度减少遮挡
  },
});
```

### 2. 弹幕过滤

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  danmaku: {
    enable: true,
    filter: {
      keywords: ['广告', '垃圾'],  // 过滤关键词
      types: ['scroll'],            // 只显示滚动弹幕
      custom: (danmaku) => {
        // 自定义过滤逻辑
        return danmaku.text.length <= 50;
      },
    },
  },
});
```

## 多画质管理

### 1. 配置多画质源

```typescript
const player = new VideoPlayer('#player', {
  src: [
    { 
      url: 'video-1080p.mp4', 
      quality: '1080p', 
      label: '超清',
      default: false,
    },
    { 
      url: 'video-720p.mp4', 
      quality: '720p', 
      label: '高清',
      default: true,
    },
    { 
      url: 'video-480p.mp4', 
      quality: '480p', 
      label: '标清',
    },
  ],
  quality: {
    default: '720p',
    auto: false,
    remember: true, // 记住用户选择
  },
});
```

### 2. 动态切换画质

```typescript
// 根据网络状况切换
const connection = (navigator as any).connection;
if (connection) {
  connection.addEventListener('change', () => {
    const type = connection.effectiveType;
    
    if (type === '4g' || type === 'wifi') {
      player.setQuality('1080p');
    } else if (type === '3g') {
      player.setQuality('720p');
    } else {
      player.setQuality('480p');
    }
  });
}
```

## 常见问题

### Q: 如何处理跨域视频？

确保服务器设置了正确的 CORS 头：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD
```

### Q: 如何在微信中自动播放？

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  autoplay: true,
  muted: true,  // 微信中需要静音才能自动播放
});

// 微信 ready 后播放
document.addEventListener('WeixinJSBridgeReady', () => {
  player.play();
});
```

### Q: 如何优化移动端性能？

```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  preload: 'metadata',  // 不完整预加载
  controls: {
    autoHideDelay: 2000, // 更快隐藏控制条
  },
  danmaku: {
    maxOnScreen: 30,     // 减少同屏弹幕
  },
});
```

### Q: 如何支持旧版浏览器？

使用 UMD 版本并添加 polyfills：

```html
<script src="https://cdn.jsdelivr.net/npm/@ldesign/video/dist/index.umd.min.js"></script>
<script>
  var player = new LdesignVideo.VideoPlayer('#player', {
    src: 'video.mp4',
  });
</script>
```

## 安全建议

### 1. 验证视频源

```typescript
function isValidVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

if (isValidVideoUrl(videoUrl)) {
  player = new VideoPlayer('#player', { src: videoUrl });
}
```

### 2. 限制弹幕内容

```typescript
function sanitizeDanmaku(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')  // 移除 HTML 标签
    .substring(0, 100);       // 限制长度
}

player.sendDanmaku(sanitizeDanmaku(userInput));
```

### 3. 内容安全策略

在 HTML 中添加 CSP：

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; media-src https:; style-src 'unsafe-inline';">
```

