/**
 * 预加载管理器
 * 智能预加载下一个视频，提升用户体验
 */

import type { VideoSource } from '../types';
import { EventEmitter } from '../core/EventEmitter';

export interface PreloadOptions {
  /** 预加载延迟（秒） */
  delay?: number;

  /** 预加载数量 */
  count?: number;

  /** 预加载策略 */
  strategy?: 'aggressive' | 'normal' | 'conservative';

  /** 网络类型限制 */
  networkType?: 'all' | 'wifi' | 'none';
}

export class PreloadManager extends EventEmitter {
  private sources: VideoSource[] = [];
  private preloadedVideos: Map<string, HTMLVideoElement> = new Map();
  private preloadQueue: string[] = [];
  private currentIndex = 0;
  private options: Required<PreloadOptions>;
  private isPreloading = false;

  constructor(options: PreloadOptions = {}) {
    super();

    this.options = {
      delay: 5,
      count: 2,
      strategy: 'normal',
      networkType: 'all',
      ...options,
    };
  }

  /**
   * 设置视频源列表
   */
  setSources(sources: VideoSource[]): void {
    this.sources = sources;
    this.emit('sourcesChange', sources);
  }

  /**
   * 开始预加载
   */
  async preload(currentIndex: number): Promise<void> {
    if (this.isPreloading) return;

    this.currentIndex = currentIndex;

    // 检查网络类型
    if (!this.shouldPreload()) {
      this.emit('skip', 'Network condition not suitable');
      return;
    }

    this.isPreloading = true;
    this.emit('start');

    try {
      const count = this.getPreloadCount();
      const indicesToPreload = this.getPreloadIndices(currentIndex, count);

      for (const index of indicesToPreload) {
        if (index < this.sources.length) {
          await this.preloadVideo(this.sources[index]);
        }
      }

      this.emit('complete');
    } catch (error) {
      this.emit('error', error);
    } finally {
      this.isPreloading = false;
    }
  }

  /**
   * 预加载单个视频
   */
  private async preloadVideo(source: VideoSource): Promise<void> {
    const url = source.url;

    // 已经预加载过
    if (this.preloadedVideos.has(url)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = url;

      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`Preload timeout: ${url}`));
      }, 30000); // 30秒超时

      const cleanup = () => {
        clearTimeout(timeout);
        video.removeEventListener('canplaythrough', onLoaded);
        video.removeEventListener('error', onError);
      };

      const onLoaded = () => {
        cleanup();
        this.preloadedVideos.set(url, video);
        this.emit('videoPreloaded', url, video);
        resolve();
      };

      const onError = (error: Event) => {
        cleanup();
        this.emit('videoError', url, error);
        reject(error);
      };

      video.addEventListener('canplaythrough', onLoaded, { once: true });
      video.addEventListener('error', onError, { once: true });

      // 开始加载
      video.load();
    });
  }

  /**
   * 获取预加载索引
   */
  private getPreloadIndices(currentIndex: number, count: number): number[] {
    const indices: number[] = [];

    for (let i = 1; i <= count; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < this.sources.length) {
        indices.push(nextIndex);
      }
    }

    return indices;
  }

  /**
   * 获取预加载数量
   */
  private getPreloadCount(): number {
    switch (this.options.strategy) {
      case 'aggressive':
        return this.options.count * 2;
      case 'conservative':
        return Math.max(1, Math.floor(this.options.count / 2));
      default:
        return this.options.count;
    }
  }

  /**
   * 判断是否应该预加载
   */
  private shouldPreload(): boolean {
    // 检查网络类型
    if (this.options.networkType !== 'all') {
      const connection = (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      if (connection) {
        const effectiveType = connection.effectiveType;

        if (this.options.networkType === 'wifi') {
          // 只在WiFi或快速网络下预加载
          return effectiveType === '4g' || effectiveType === 'wifi';
        }
      }
    }

    return true;
  }

  /**
   * 获取预加载的视频
   */
  getPreloadedVideo(url: string): HTMLVideoElement | undefined {
    return this.preloadedVideos.get(url);
  }

  /**
   * 取消预加载
   */
  cancelPreload(): void {
    this.isPreloading = false;
    this.preloadQueue = [];
    this.emit('cancel');
  }

  /**
   * 清除预加载的视频
   */
  clear(): void {
    this.preloadedVideos.forEach(video => {
      video.src = '';
      video.load();
    });
    this.preloadedVideos.clear();
    this.emit('clear');
  }

  /**
   * 获取预加载进度
   */
  getProgress(): number {
    const totalVideos = this.getPreloadCount();
    const preloadedCount = this.preloadedVideos.size;
    return totalVideos > 0 ? (preloadedCount / totalVideos) * 100 : 0;
  }

  /**
   * 获取预加载的视频数量
   */
  get preloadedCount(): number {
    return this.preloadedVideos.size;
  }
}

