/**
 * 视频播放器事件类型定义
 */

import type { PlayState } from './player';
import type { Danmaku } from './danmaku';

/**
 * 播放器事件映射
 */
export interface VideoPlayerEvents {
  /** 播放器准备就绪 */
  ready: () => void;

  /** 播放 */
  play: () => void;

  /** 暂停 */
  pause: () => void;

  /** 播放结束 */
  ended: () => void;

  /** 时间更新 */
  timeupdate: (time: number) => void;

  /** 进度更新 */
  progress: (buffered: number) => void;

  /** 时长变化 */
  durationchange: (duration: number) => void;

  /** 音量变化 */
  volumechange: (volume: number, muted: boolean) => void;

  /** 播放速率变化 */
  ratechange: (rate: number) => void;

  /** 全屏变化 */
  fullscreenchange: (fullscreen: boolean) => void;

  /** 画中画变化 */
  pictureInPictureChange: (pip: boolean) => void;

  /** 画质变化 */
  qualitychange: (quality: string) => void;

  /** 字幕变化 */
  subtitlechange: (subtitle: string | null) => void;

  /** 状态变化 */
  statechange: (state: PlayState) => void;

  /** 缓冲中 */
  waiting: () => void;

  /** 可以播放 */
  canplay: () => void;

  /** 可以流畅播放 */
  canplaythrough: () => void;

  /** 加载开始 */
  loadstart: () => void;

  /** 加载完成 */
  loadeddata: () => void;

  /** 元数据加载完成 */
  loadedmetadata: () => void;

  /** 错误 */
  error: (error: Error) => void;

  /** 跳转中 */
  seeking: () => void;

  /** 跳转完成 */
  seeked: () => void;

  /** 弹幕发送 */
  danmakusend: (danmaku: Danmaku) => void;

  /** 弹幕显示/隐藏 */
  danmakutoggle: (visible: boolean) => void;

  /** 截图 */
  screenshot: (dataUrl: string) => void;

  /** 尺寸变化 */
  resize: (width: number, height: number) => void;

  /** 销毁 */
  destroy: () => void;
}

/**
 * 事件处理器类型
 */
export type EventHandler<T = any> = (data: T) => void;

/**
 * 事件监听器选项
 */
export interface EventListenerOptions {
  once?: boolean;
  capture?: boolean;
}

