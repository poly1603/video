# API 文档

## VideoPlayer 类

### 构造函数

```typescript
new VideoPlayer(container: HTMLElement | string, config: VideoPlayerConfig)
```

**参数**：
- `container` - 容器元素或选择器
- `config` - 播放器配置

### 配置选项

```typescript
interface VideoPlayerConfig {
  src: string | VideoSource[];        // 视频源
  type?: 'video' | 'hls' | 'dash';   // 视频类型
  poster?: string;                    // 海报图
  autoplay?: boolean;                 // 自动播放
  loop?: boolean;                     // 循环播放
  muted?: boolean;                    // 静音
  volume?: number;                    // 音量 (0-1)
  playbackRate?: number;              // 播放速率
  controls?: boolean | ControlsConfig; // 控制条
  quality?: QualityConfig;            // 画质配置
  subtitle?: SubtitleConfig;          // 字幕配置
  danmaku?: DanmakuConfig;           // 弹幕配置
  theme?: string;                     // 主题
  width?: number | string;            // 宽度
  height?: number | string;           // 高度
}
```

### 实例方法

#### play()
播放视频

```typescript
await player.play();
```

**返回**: `Promise<void>`

#### pause()
暂停视频

```typescript
player.pause();
```

#### toggle()
切换播放/暂停

```typescript
await player.toggle();
```

#### seek(time: number)
跳转到指定时间

```typescript
player.seek(30); // 跳转到30秒
```

**参数**：
- `time` - 目标时间（秒）

#### setVolume(volume: number)
设置音量

```typescript
player.setVolume(0.5); // 设置音量为50%
```

**参数**：
- `volume` - 音量值 (0-1)

#### setMuted(muted: boolean)
设置静音

```typescript
player.setMuted(true);
```

#### setPlaybackRate(rate: number)
设置播放速率

```typescript
player.setPlaybackRate(1.5); // 1.5倍速
```

#### requestFullscreen()
进入全屏

```typescript
await player.requestFullscreen();
```

#### exitFullscreen()
退出全屏

```typescript
await player.exitFullscreen();
```

#### toggleFullscreen()
切换全屏

```typescript
await player.toggleFullscreen();
```

#### requestPictureInPicture()
进入画中画

```typescript
await player.requestPictureInPicture();
```

#### exitPictureInPicture()
退出画中画

```typescript
await player.exitPictureInPicture();
```

#### screenshot()
截图

```typescript
const dataUrl = player.screenshot();
```

**返回**: `string` - Base64 编码的图片数据

#### reload()
重新加载视频

```typescript
player.reload();
```

#### destroy()
销毁播放器

```typescript
player.destroy();
```

### 事件

#### ready
播放器准备就绪

```typescript
player.on('ready', () => {
  console.log('播放器就绪');
});
```

#### play
开始播放

```typescript
player.on('play', () => {
  console.log('开始播放');
});
```

#### pause
暂停播放

```typescript
player.on('pause', () => {
  console.log('暂停播放');
});
```

#### timeupdate
时间更新

```typescript
player.on('timeupdate', (time: number) => {
  console.log('当前时间:', time);
});
```

#### volumechange
音量变化

```typescript
player.on('volumechange', (volume: number, muted: boolean) => {
  console.log('音量:', volume, '静音:', muted);
});
```

#### fullscreenchange
全屏状态变化

```typescript
player.on('fullscreenchange', (fullscreen: boolean) => {
  console.log('全屏:', fullscreen);
});
```

#### error
发生错误

```typescript
player.on('error', (error: Error) => {
  console.error('错误:', error);
});
```

### 状态属性

```typescript
interface PlayerState {
  playState: PlayState;           // 播放状态
  currentTime: number;            // 当前时间
  duration: number;               // 总时长
  buffered: number;               // 缓冲进度
  volume: number;                 // 音量
  muted: boolean;                 // 是否静音
  playbackRate: number;           // 播放速率
  fullscreen: boolean;            // 是否全屏
  pictureInPicture: boolean;      // 是否画中画
  error?: Error;                  // 错误信息
}

// 访问状态
const state = player.state;
console.log('当前时间:', state.currentTime);
```

## PlaylistManager 类

### 构造函数

```typescript
new PlaylistManager()
```

### 方法

#### add(item)
添加视频到播放列表

```typescript
playlist.add({
  id: '1',
  url: 'video1.mp4',
  quality: '1080p',
  title: '视频 1',
});

// 批量添加
playlist.add([item1, item2, item3]);
```

#### remove(index)
移除视频

```typescript
playlist.remove(0); // 移除第一个视频
```

#### next()
播放下一个

```typescript
const nextItem = playlist.next();
```

#### previous()
播放上一个

```typescript
const prevItem = playlist.previous();
```

#### playAt(index)
播放指定位置

```typescript
playlist.playAt(2); // 播放第3个视频
```

#### shuffle()
随机播放

```typescript
playlist.shuffle();
```

#### clear()
清空播放列表

```typescript
playlist.clear();
```

## QualityAnalyzer 类

### 构造函数

```typescript
new QualityAnalyzer(player: IVideoPlayer)
```

### 方法

#### getMetrics()
获取质量指标

```typescript
const metrics = analyzer.getMetrics();
console.log(metrics);
// {
//   droppedFrames: 0,
//   droppedFrameRate: 0,
//   bitrate: 2000000,
//   bufferHealth: 95,
//   stallCount: 0,
// }
```

#### getDroppedFrames()
获取丢帧数

```typescript
const dropped = analyzer.getDroppedFrames();
```

#### getBufferHealth()
获取缓冲健康度 (0-100)

```typescript
const health = analyzer.getBufferHealth();
```

## Analytics 类

### 构造函数

```typescript
new Analytics(player: IVideoPlayer, videoId: string, options?: AnalyticsOptions)
```

### 方法

#### getStats()
获取播放统计

```typescript
const stats = analytics.getStats();
console.log('观看时长:', stats.watchTime);
console.log('完成率:', stats.completionRate);
```

#### exportStats()
导出统计数据

```typescript
const json = analytics.exportStats();
```

## Hotkeys 类

### 构造函数

```typescript
new Hotkeys(player: IVideoPlayer, config?: HotkeyConfig)
```

### 方法

#### register(key, handler)
注册快捷键

```typescript
hotkeys.register('p', () => {
  console.log('按下 P 键');
});
```

#### unregister(key)
注销快捷键

```typescript
hotkeys.unregister('Space');
```

### 默认快捷键

| 键 | 功能 |
|---|---|
| Space | 播放/暂停 |
| ← | 快退 5秒 |
| → | 快进 5秒 |
| ↑ | 音量增加 |
| ↓ | 音量减少 |
| F | 全屏 |
| M | 静音 |
| 0-9 | 跳转到百分比位置 |
| < | 降低播放速度 |
| > | 提高播放速度 |

## Gestures 类

### 构造函数

```typescript
new Gestures(player: IVideoPlayer, config?: GestureConfig)
```

### 支持的手势

- **双击** - 播放/暂停
- **左右滑动** - 调整进度
- **右侧上下滑动** - 调整音量
- **左侧上下滑动** - 调整亮度（可选）

## 更多文档

- [快速开始](../QUICK_START_GUIDE.md)
- [完整示例](../examples/)
- [最佳实践](./BEST_PRACTICES.md)

