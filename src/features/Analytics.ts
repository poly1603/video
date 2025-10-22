/**
 * 数据分析和埋点
 * 收集播放数据和用户行为
 */

import type { IVideoPlayer } from '../types';
import { EventEmitter } from '../core/EventEmitter';

export interface PlaybackStats {
  /** 视频ID */
  videoId: string;

  /** 总播放时长（秒） */
  totalPlayTime: number;

  /** 实际观看时长（秒） */
  watchTime: number;

  /** 播放次数 */
  playCount: number;

  /** 暂停次数 */
  pauseCount: number;

  /** 跳转次数 */
  seekCount: number;

  /** 完成率（%） */
  completionRate: number;

  /** 平均播放速率 */
  averagePlaybackRate: number;

  /** 缓冲次数 */
  bufferCount: number;

  /** 总缓冲时长（秒） */
  totalBufferTime: number;

  /** 错误次数 */
  errorCount: number;

  /** 画质切换次数 */
  qualitySwitchCount: number;

  /** 音量调整次数 */
  volumeChangeCount: number;

  /** 全屏次数 */
  fullscreenCount: number;
}

export interface AnalyticsOptions {
  /** 是否启用 */
  enabled: boolean;

  /** 数据上报间隔（秒） */
  reportInterval?: number;

  /** 自定义上报函数 */
  onReport?: (stats: PlaybackStats) => void;

  /** 是否自动上报 */
  autoReport?: boolean;
}

export class Analytics extends EventEmitter {
  private player: IVideoPlayer;
  private options: Required<AnalyticsOptions>;
  private stats: PlaybackStats;
  private startTime?: Date;
  private lastPlayTime?: Date;
  private bufferStartTime?: Date;
  private reportTimer?: number;
  private playbackRateSamples: number[] = [];

  constructor(player: IVideoPlayer, videoId: string, options: Partial<AnalyticsOptions> = {}) {
    super();

    this.player = player;
    this.options = {
      enabled: true,
      reportInterval: 30,
      autoReport: true,
      onReport: () => { },
      ...options,
    };

    this.stats = {
      videoId,
      totalPlayTime: 0,
      watchTime: 0,
      playCount: 0,
      pauseCount: 0,
      seekCount: 0,
      completionRate: 0,
      averagePlaybackRate: 1,
      bufferCount: 0,
      totalBufferTime: 0,
      errorCount: 0,
      qualitySwitchCount: 0,
      volumeChangeCount: 0,
      fullscreenCount: 0,
    };

    if (this.options.enabled) {
      this.enable();
    }
  }

  /**
   * 启用分析
   */
  enable(): void {
    this.options.enabled = true;
    this.bindEvents();
    this.startTracking();
    this.emit('enabled');
  }

  /**
   * 禁用分析
   */
  disable(): void {
    this.options.enabled = false;
    this.unbindEvents();
    this.stopTracking();
    this.emit('disabled');
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    this.player.on('play', this.onPlay.bind(this));
    this.player.on('pause', this.onPause.bind(this));
    this.player.on('ended', this.onEnded.bind(this));
    this.player.on('seeking', this.onSeeking.bind(this));
    this.player.on('waiting', this.onBufferStart.bind(this));
    this.player.on('canplay', this.onBufferEnd.bind(this));
    this.player.on('error', this.onError.bind(this));
    this.player.on('ratechange', this.onRateChange.bind(this));
    this.player.on('qualitychange', this.onQualityChange.bind(this));
    this.player.on('volumechange', this.onVolumeChange.bind(this));
    this.player.on('fullscreenchange', this.onFullscreenChange.bind(this));
  }

  /**
   * 解绑事件
   */
  private unbindEvents(): void {
    // 移除所有事件监听器
    this.player.removeAllListeners();
  }

  /**
   * 开始追踪
   */
  private startTracking(): void {
    this.startTime = new Date();

    if (this.options.autoReport && this.options.reportInterval) {
      this.reportTimer = window.setInterval(() => {
        this.report();
      }, this.options.reportInterval * 1000);
    }
  }

  /**
   * 停止追踪
   */
  private stopTracking(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = undefined;
    }

    // 最后上报一次
    this.report();
  }

  /**
   * 播放事件
   */
  private onPlay(): void {
    this.stats.playCount++;
    this.lastPlayTime = new Date();
  }

  /**
   * 暂停事件
   */
  private onPause(): void {
    this.stats.pauseCount++;
    this.updateWatchTime();
  }

  /**
   * 结束事件
   */
  private onEnded(): void {
    this.updateWatchTime();
    this.calculateCompletionRate();
    this.report();
  }

  /**
   * 跳转事件
   */
  private onSeeking(): void {
    this.stats.seekCount++;
    this.updateWatchTime();
  }

  /**
   * 缓冲开始
   */
  private onBufferStart(): void {
    this.stats.bufferCount++;
    this.bufferStartTime = new Date();
  }

  /**
   * 缓冲结束
   */
  private onBufferEnd(): void {
    if (this.bufferStartTime) {
      const bufferTime = (new Date().getTime() - this.bufferStartTime.getTime()) / 1000;
      this.stats.totalBufferTime += bufferTime;
      this.bufferStartTime = undefined;
    }
  }

  /**
   * 错误事件
   */
  private onError(): void {
    this.stats.errorCount++;
  }

  /**
   * 播放速率变化
   */
  private onRateChange(rate: number): void {
    this.playbackRateSamples.push(rate);
    this.stats.averagePlaybackRate =
      this.playbackRateSamples.reduce((a, b) => a + b, 0) /
      this.playbackRateSamples.length;
  }

  /**
   * 画质变化
   */
  private onQualityChange(): void {
    this.stats.qualitySwitchCount++;
  }

  /**
   * 音量变化
   */
  private onVolumeChange(): void {
    this.stats.volumeChangeCount++;
  }

  /**
   * 全屏变化
   */
  private onFullscreenChange(fullscreen: boolean): void {
    if (fullscreen) {
      this.stats.fullscreenCount++;
    }
  }

  /**
   * 更新观看时长
   */
  private updateWatchTime(): void {
    if (this.lastPlayTime) {
      const watchTime = (new Date().getTime() - this.lastPlayTime.getTime()) / 1000;
      this.stats.watchTime += watchTime;
      this.lastPlayTime = undefined;
    }

    if (this.startTime) {
      this.stats.totalPlayTime =
        (new Date().getTime() - this.startTime.getTime()) / 1000;
    }
  }

  /**
   * 计算完成率
   */
  private calculateCompletionRate(): void {
    const duration = this.player.state.duration;
    if (duration > 0) {
      this.stats.completionRate =
        Math.min(100, (this.stats.watchTime / duration) * 100);
    }
  }

  /**
   * 上报数据
   */
  report(): void {
    this.updateWatchTime();
    this.calculateCompletionRate();

    const stats = this.getStats();
    this.options.onReport(stats);
    this.emit('report', stats);
  }

  /**
   * 获取统计数据
   */
  getStats(): Readonly<PlaybackStats> {
    return { ...this.stats };
  }

  /**
   * 导出统计数据
   */
  exportStats(): string {
    return JSON.stringify(this.getStats(), null, 2);
  }

  /**
   * 重置统计
   */
  reset(): void {
    this.stats = {
      ...this.stats,
      totalPlayTime: 0,
      watchTime: 0,
      playCount: 0,
      pauseCount: 0,
      seekCount: 0,
      completionRate: 0,
      averagePlaybackRate: 1,
      bufferCount: 0,
      totalBufferTime: 0,
      errorCount: 0,
      qualitySwitchCount: 0,
      volumeChangeCount: 0,
      fullscreenCount: 0,
    };

    this.playbackRateSamples = [];
    this.startTime = new Date();
    this.lastPlayTime = undefined;
    this.bufferStartTime = undefined;

    this.emit('reset');
  }
}

