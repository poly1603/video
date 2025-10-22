/**
 * 流媒体加载器 (HLS/DASH)
 */

import type { IVideoPlayer, VideoType } from '../types';

/**
 * 流加载器类
 */
export class StreamLoader {
  private player: IVideoPlayer;
  private hlsInstance?: any;
  private dashInstance?: any;

  constructor(player: IVideoPlayer) {
    this.player = player;
  }

  /**
   * 加载流媒体
   */
  async load(src: string, type: VideoType): Promise<void> {
    this.destroy();

    if (type === 'hls') {
      await this.loadHLS(src);
    } else if (type === 'dash') {
      await this.loadDASH(src);
    } else {
      this.player.videoElement.src = src;
    }
  }

  /**
   * 加载 HLS
   */
  private async loadHLS(src: string): Promise<void> {
    if (this.player.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // 原生支持 HLS (Safari)
      this.player.videoElement.src = src;
      return;
    }

    // 动态导入 hls.js
    try {
      const Hls = (await import('hls.js')).default;

      if (Hls.isSupported()) {
        this.hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
        });

        this.hlsInstance.loadSource(src);
        this.hlsInstance.attachMedia(this.player.videoElement);

        this.hlsInstance.on(Hls.Events.ERROR, (_: any, data: any) => {
          if (data.fatal) {
            this.handleHLSError(data);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load hls.js:', error);
      throw error;
    }
  }

  /**
   * 加载 DASH
   */
  private async loadDASH(src: string): Promise<void> {
    try {
      const dashjs = (await import('dashjs')).default;

      this.dashInstance = dashjs.MediaPlayer().create();
      this.dashInstance.initialize(this.player.videoElement, src, false);

      this.dashInstance.on('error', (e: any) => {
        console.error('DASH error:', e);
      });
    } catch (error) {
      console.error('Failed to load dash.js:', error);
      throw error;
    }
  }

  /**
   * 处理 HLS 错误
   */
  private handleHLSError(data: any): void {
    const Hls = (window as any).Hls;

    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        this.hlsInstance?.startLoad();
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        this.hlsInstance?.recoverMediaError();
        break;
      default:
        this.destroy();
        break;
    }
  }

  /**
   * 获取可用画质
   */
  getQualities(): Array<{ level: number; height: number; bitrate: number }> {
    if (this.hlsInstance) {
      return this.hlsInstance.levels.map((level: any, index: number) => ({
        level: index,
        height: level.height,
        bitrate: level.bitrate,
      }));
    }

    if (this.dashInstance) {
      const bitrateList = this.dashInstance.getBitrateInfoListFor('video');
      return bitrateList.map((item: any, index: number) => ({
        level: index,
        height: item.height,
        bitrate: item.bitrate,
      }));
    }

    return [];
  }

  /**
   * 切换画质
   */
  setQuality(level: number): void {
    if (this.hlsInstance) {
      this.hlsInstance.currentLevel = level;
    }

    if (this.dashInstance) {
      this.dashInstance.setQualityFor('video', level);
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }

    if (this.dashInstance) {
      this.dashInstance.reset();
      this.dashInstance = null;
    }
  }
}

