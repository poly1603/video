/**
 * 视频播放器类型定义
 */

import type { ControlsConfig } from './controls';
import type { QualityConfig, VideoSource } from './quality';
import type { SubtitleConfig } from './subtitle';
import type { DanmakuConfig } from './danmaku';
import type { PluginConfig } from './plugin';
import type { VideoPlayerEvents } from './events';

/**
 * 视频类型
 */
export type VideoType = 'video' | 'hls' | 'dash';

/**
 * 播放状态
 */
export enum PlayState {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  ENDED = 'ended',
  ERROR = 'error',
}

/**
 * 播放器配置
 */
export interface VideoPlayerConfig {
  /** 视频源 */
  src: string | VideoSource[];

  /** 视频类型 */
  type?: VideoType;

  /** 海报图 */
  poster?: string;

  /** 自动播放 */
  autoplay?: boolean;

  /** 循环播放 */
  loop?: boolean;

  /** 静音 */
  muted?: boolean;

  /** 预加载策略 */
  preload?: 'none' | 'metadata' | 'auto';

  /** 音量 (0-1) */
  volume?: number;

  /** 播放速率 */
  playbackRate?: number;

  /** 控制条配置 */
  controls?: boolean | ControlsConfig;

  /** 画质配置 */
  quality?: QualityConfig;

  /** 字幕配置 */
  subtitle?: SubtitleConfig;

  /** 弹幕配置 */
  danmaku?: DanmakuConfig;

  /** 插件配置 */
  plugins?: PluginConfig[];

  /** 主题 */
  theme?: 'default' | 'dark' | string;

  /** 语言 */
  lang?: string;

  /** 快捷键 */
  hotkeys?: boolean;

  /** 手势控制（移动端） */
  gestures?: boolean;

  /** 画中画 */
  pictureInPicture?: boolean;

  /** 截图 */
  screenshot?: boolean;

  /** 倍速播放选项 */
  playbackRates?: number[];

  /** 响应式 */
  responsive?: boolean;

  /** 宽高比 */
  aspectRatio?: string;

  /** 自定义类名 */
  className?: string;

  /** 错误重试次数 */
  retryCount?: number;

  /** 错误重试延迟(ms) */
  retryDelay?: number;
}

/**
 * 播放器状态
 */
export interface PlayerState {
  /** 播放状态 */
  playState: PlayState;

  /** 当前时间 */
  currentTime: number;

  /** 总时长 */
  duration: number;

  /** 缓冲进度 */
  buffered: number;

  /** 音量 */
  volume: number;

  /** 是否静音 */
  muted: boolean;

  /** 播放速率 */
  playbackRate: number;

  /** 是否全屏 */
  fullscreen: boolean;

  /** 是否画中画 */
  pictureInPicture: boolean;

  /** 当前画质 */
  quality?: string;

  /** 当前字幕 */
  subtitle?: string;

  /** 错误信息 */
  error?: Error;
}

/**
 * 播放器实例接口
 */
export interface IVideoPlayer {
  /** 播放器状态 */
  readonly state: PlayerState;

  /** 原生视频元素 */
  readonly videoElement: HTMLVideoElement;

  /** 容器元素 */
  readonly container: HTMLElement;

  /** 播放 */
  play(): Promise<void>;

  /** 暂停 */
  pause(): void;

  /** 切换播放/暂停 */
  toggle(): Promise<void>;

  /** 跳转到指定时间 */
  seek(time: number): void;

  /** 设置音量 */
  setVolume(volume: number): void;

  /** 设置静音 */
  setMuted(muted: boolean): void;

  /** 设置播放速率 */
  setPlaybackRate(rate: number): void;

  /** 进入全屏 */
  requestFullscreen(): Promise<void>;

  /** 退出全屏 */
  exitFullscreen(): Promise<void>;

  /** 切换全屏 */
  toggleFullscreen(): Promise<void>;

  /** 进入画中画 */
  requestPictureInPicture(): Promise<void>;

  /** 退出画中画 */
  exitPictureInPicture(): Promise<void>;

  /** 切换画质 */
  setQuality(quality: string): Promise<void>;

  /** 切换字幕 */
  setSubtitle(subtitle: string): void;

  /** 发送弹幕 */
  sendDanmaku(text: string, options?: any): void;

  /** 截图 */
  screenshot(): string;

  /** 刷新 */
  reload(): void;

  /** 销毁 */
  destroy(): void;

  /** 监听事件 */
  on<K extends keyof VideoPlayerEvents>(
    event: K,
    handler: VideoPlayerEvents[K]
  ): void;

  /** 取消监听事件 */
  off<K extends keyof VideoPlayerEvents>(
    event: K,
    handler: VideoPlayerEvents[K]
  ): void;

  /** 触发事件 */
  emit<K extends keyof VideoPlayerEvents>(
    event: K,
    ...args: Parameters<VideoPlayerEvents[K]>
  ): void;
}

/**
 * 播放器选项（内部使用）
 */
export interface PlayerOptions extends Required<VideoPlayerConfig> {
  container: HTMLElement;
}

