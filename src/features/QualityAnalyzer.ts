/**
 * 视频质量分析器
 */

import type { IVideoPlayer } from '../types';

export interface QualityMetrics {
  /** 丢帧数 */
  droppedFrames: number;

  /** 总帧数 */
  totalFrames: number;

  /** 丢帧率 (%) */
  droppedFrameRate: number;

  /** 当前比特率 (bps) */
  bitrate: number;

  /** 缓冲健康度 (0-100) */
  bufferHealth: number;

  /** 平均缓冲时长 (秒) */
  averageBufferLength: number;

  /** 卡顿次数 */
  stallCount: number;

  /** 总卡顿时长 (秒) */
  stallDuration: number;
}

export class QualityAnalyzer {
  private player: IVideoPlayer;
  private metrics: QualityMetrics;
  private lastBufferLength = 0;
  private bufferLengthSamples: number[] = [];
  private maxSamples = 10;
  private stallStartTime?: number;

  constructor(player: IVideoPlayer) {
    this.player = player;
    this.metrics = {
      droppedFrames: 0,
      totalFrames: 0,
      droppedFrameRate: 0,
      bitrate: 0,
      bufferHealth: 100,
      averageBufferLength: 0,
      stallCount: 0,
      stallDuration: 0,
    };

    this.startMonitoring();
  }

  /**
   * 开始监控
   */
  private startMonitoring(): void {
    // 监听等待事件（缓冲）
    this.player.on('waiting', () => {
      if (!this.stallStartTime) {
        this.stallStartTime = Date.now();
        this.metrics.stallCount++;
      }
    });

    // 监听播放事件（缓冲结束）
    this.player.on('play', () => {
      if (this.stallStartTime) {
        const stallDuration = (Date.now() - this.stallStartTime) / 1000;
        this.metrics.stallDuration += stallDuration;
        this.stallStartTime = undefined;
      }
    });

    // 定期更新指标
    setInterval(() => this.updateMetrics(), 1000);
  }

  /**
   * 更新指标
   */
  private updateMetrics(): void {
    const video = this.player.videoElement;

    // 获取丢帧信息
    if ('getVideoPlaybackQuality' in video) {
      const quality = (video as any).getVideoPlaybackQuality();
      this.metrics.droppedFrames = quality.droppedVideoFrames || 0;
      this.metrics.totalFrames = quality.totalVideoFrames || 0;
      this.metrics.droppedFrameRate = this.metrics.totalFrames > 0
        ? (this.metrics.droppedFrames / this.metrics.totalFrames) * 100
        : 0;
    }

    // 获取缓冲信息
    const buffered = video.buffered;
    if (buffered.length > 0) {
      const currentTime = video.currentTime;
      let bufferLength = 0;

      for (let i = 0; i < buffered.length; i++) {
        if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) {
          bufferLength = buffered.end(i) - currentTime;
          break;
        }
      }

      // 记录缓冲长度样本
      this.bufferLengthSamples.push(bufferLength);
      if (this.bufferLengthSamples.length > this.maxSamples) {
        this.bufferLengthSamples.shift();
      }

      // 计算平均缓冲长度
      this.metrics.averageBufferLength =
        this.bufferLengthSamples.reduce((a, b) => a + b, 0) /
        this.bufferLengthSamples.length;

      // 计算缓冲健康度
      this.metrics.bufferHealth = Math.min(100, bufferLength * 20);

      this.lastBufferLength = bufferLength;
    }

    // 估算比特率
    this.estimateBitrate();
  }

  /**
   * 估算比特率
   */
  private estimateBitrate(): void {
    // 简单估算：基于视频尺寸和质量
    const video = this.player.videoElement;
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (width && height) {
      // 粗略估算：分辨率 * 2 (假设中等压缩)
      this.metrics.bitrate = width * height * 2;
    }
  }

  /**
   * 获取质量指标
   */
  getMetrics(): Readonly<QualityMetrics> {
    return { ...this.metrics };
  }

  /**
   * 获取丢帧数
   */
  getDroppedFrames(): number {
    return this.metrics.droppedFrames;
  }

  /**
   * 获取丢帧率
   */
  getDroppedFrameRate(): number {
    return this.metrics.droppedFrameRate;
  }

  /**
   * 获取比特率
   */
  getBitrate(): number {
    return this.metrics.bitrate;
  }

  /**
   * 获取缓冲健康度
   */
  getBufferHealth(): number {
    return this.metrics.bufferHealth;
  }

  /**
   * 获取卡顿统计
   */
  getStallStats(): { count: number; duration: number } {
    return {
      count: this.metrics.stallCount,
      duration: this.metrics.stallDuration,
    };
  }

  /**
   * 重置统计
   */
  reset(): void {
    this.metrics = {
      droppedFrames: 0,
      totalFrames: 0,
      droppedFrameRate: 0,
      bitrate: 0,
      bufferHealth: 100,
      averageBufferLength: 0,
      stallCount: 0,
      stallDuration: 0,
    };
    this.bufferLengthSamples = [];
  }
}

