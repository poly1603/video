/**
 * 视频播放器核心类
 */

import {
  PlayState,
  type VideoPlayerConfig,
  type IVideoPlayer,
  type PlayerState,
  type VideoPlayerEvents,
} from '../types';
import { EventEmitter } from './EventEmitter';
import { StateManager } from './StateManager';
import { playerManager } from './PlayerManager';
import {
  generateId,
  clamp,
  deepMerge,
  requestFullscreen,
  exitFullscreen,
  getFullscreenElement,
  isPictureInPictureSupported,
  createElement,
  getBufferedPercent,
} from '../utils/helpers';

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Required<Omit<VideoPlayerConfig, 'src'>> = {
  type: 'video',
  poster: '',
  autoplay: false,
  loop: false,
  muted: false,
  preload: 'metadata',
  volume: 1,
  playbackRate: 1,
  controls: true,
  quality: {},
  subtitle: {},
  danmaku: { enable: false },
  plugins: [],
  theme: 'default',
  lang: 'zh-CN',
  hotkeys: true,
  gestures: true,
  pictureInPicture: true,
  screenshot: true,
  playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
  responsive: true,
  aspectRatio: '16:9',
  className: '',
  retryCount: 3,
  retryDelay: 1000,
};

/**
 * 视频播放器类
 */
export class VideoPlayer extends EventEmitter implements IVideoPlayer {
  private id: string;
  private config: Required<VideoPlayerConfig>;
  private _container: HTMLElement;
  private _videoElement: HTMLVideoElement;
  private stateManager: StateManager;
  private isDestroyed = false;
  private retryAttempts = 0;

  constructor(container: HTMLElement | string, config: VideoPlayerConfig) {
    super();

    // 获取容器
    this._container = typeof container === 'string'
      ? document.querySelector(container)!
      : container;

    if (!this._container) {
      throw new Error('Container element not found');
    }

    // 合并配置
    this.config = deepMerge({ ...DEFAULT_CONFIG }, config);

    // 生成 ID
    this.id = generateId('video-player');

    // 创建视频元素
    this._videoElement = this.createVideoElement();

    // 初始化状态管理器
    this.stateManager = new StateManager();

    // 注册到管理器
    playerManager.register(this.id, this);

    // 初始化
    this.init();
  }

  /**
   * 创建视频元素
   */
  private createVideoElement(): HTMLVideoElement {
    const video = createElement('video', {
      className: 'ldesign-video-element',
      attrs: {
        preload: this.config.preload,
        poster: this.config.poster,
      },
    });

    // 设置基本属性
    video.controls = false; // 使用自定义控制条
    video.autoplay = this.config.autoplay;
    video.loop = this.config.loop;
    video.muted = this.config.muted;
    video.volume = this.config.volume;
    video.playbackRate = this.config.playbackRate;

    // 设置视频源
    if (typeof this.config.src === 'string') {
      video.src = this.config.src;
    }

    return video;
  }

  /**
   * 初始化
   */
  private init(): void {
    // 添加容器类名
    this._container.classList.add('ldesign-video-player', this.config.theme);
    if (this.config.className) {
      this._container.classList.add(...this.config.className.split(' '));
    }

    // 添加视频元素到容器
    this._container.appendChild(this._videoElement);

    // 绑定视频事件
    this.bindVideoEvents();

    // 触发ready事件
    this.emit('ready');
  }

  /**
   * 绑定视频事件
   */
  private bindVideoEvents(): void {
    const video = this._videoElement;

    // 播放事件
    video.addEventListener('play', () => {
      this.stateManager.playState = PlayState.PLAYING;
      this.emit('play');
    });

    video.addEventListener('pause', () => {
      this.stateManager.playState = PlayState.PAUSED;
      this.emit('pause');
    });

    video.addEventListener('ended', () => {
      this.stateManager.playState = PlayState.ENDED;
      this.emit('ended');
    });

    // 时间更新
    video.addEventListener('timeupdate', () => {
      this.stateManager.currentTime = video.currentTime;
      this.emit('timeupdate', video.currentTime);
    });

    // 进度更新
    video.addEventListener('progress', () => {
      const buffered = getBufferedPercent(
        video.buffered,
        video.currentTime,
        video.duration
      );
      this.stateManager.setState({ buffered });
      this.emit('progress', buffered);
    });

    // 时长变化
    video.addEventListener('durationchange', () => {
      this.stateManager.duration = video.duration;
      this.emit('durationchange', video.duration);
    });

    // 音量变化
    video.addEventListener('volumechange', () => {
      this.stateManager.volume = video.volume;
      this.stateManager.muted = video.muted;
      this.emit('volumechange', video.volume, video.muted);
    });

    // 播放速率变化
    video.addEventListener('ratechange', () => {
      this.stateManager.playbackRate = video.playbackRate;
      this.emit('ratechange', video.playbackRate);
    });

    // 缓冲中
    video.addEventListener('waiting', () => {
      this.stateManager.playState = PlayState.BUFFERING;
      this.emit('waiting');
    });

    // 可以播放
    video.addEventListener('canplay', () => {
      if (this.stateManager.playState === PlayState.LOADING) {
        this.stateManager.playState = PlayState.READY;
      }
      this.emit('canplay');
    });

    video.addEventListener('canplaythrough', () => {
      this.emit('canplaythrough');
    });

    // 加载事件
    video.addEventListener('loadstart', () => {
      this.stateManager.playState = PlayState.LOADING;
      this.emit('loadstart');
    });

    video.addEventListener('loadeddata', () => {
      this.emit('loadeddata');
    });

    video.addEventListener('loadedmetadata', () => {
      this.emit('loadedmetadata');
    });

    // 错误处理
    video.addEventListener('error', () => {
      this.handleError(video.error);
    });

    // 跳转事件
    video.addEventListener('seeking', () => {
      this.emit('seeking');
    });

    video.addEventListener('seeked', () => {
      this.emit('seeked');
    });

    // 画中画事件
    video.addEventListener('enterpictureinpicture', () => {
      this.stateManager.pictureInPicture = true;
      this.emit('pictureInPictureChange', true);
    });

    video.addEventListener('leavepictureinpicture', () => {
      this.stateManager.pictureInPicture = false;
      this.emit('pictureInPictureChange', false);
    });

    // 全屏事件
    const fullscreenchangeHandler = () => {
      const isFullscreen = getFullscreenElement() === this._container;
      this.stateManager.fullscreen = isFullscreen;
      this.emit('fullscreenchange', isFullscreen);
    };

    document.addEventListener('fullscreenchange', fullscreenchangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenchangeHandler);
    document.addEventListener('mozfullscreenchange', fullscreenchangeHandler);
    document.addEventListener('MSFullscreenChange', fullscreenchangeHandler);
  }

  /**
   * 错误处理
   */
  private handleError(error: MediaError | null): void {
    if (!error) return;

    let message = 'Video error';
    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        message = 'Video loading aborted';
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        message = 'Network error while loading video';
        break;
      case MediaError.MEDIA_ERR_DECODE:
        message = 'Video decoding failed';
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        message = 'Video format not supported';
        break;
    }

    const err = new Error(message);
    this.stateManager.setError(err);
    this.emit('error', err);

    // 重试
    if (this.retryAttempts < this.config.retryCount) {
      this.retryAttempts++;
      setTimeout(() => this.reload(), this.config.retryDelay);
    }
  }

  /**
   * 获取状态
   */
  get state(): Readonly<PlayerState> {
    return this.stateManager.state;
  }

  /**
   * 获取视频元素
   */
  get videoElement(): HTMLVideoElement {
    return this._videoElement;
  }

  /**
   * 获取容器元素
   */
  get container(): HTMLElement {
    return this._container;
  }

  /**
   * 播放
   */
  async play(): Promise<void> {
    try {
      await this._videoElement.play();
      // 暂停其他播放器
      playerManager.pauseOthers(this.id);
    } catch (error) {
      console.error('Play error:', error);
      throw error;
    }
  }

  /**
   * 暂停
   */
  pause(): void {
    this._videoElement.pause();
  }

  /**
   * 切换播放/暂停
   */
  async toggle(): Promise<void> {
    if (this._videoElement.paused) {
      await this.play();
    } else {
      this.pause();
    }
  }

  /**
   * 跳转到指定时间
   */
  seek(time: number): void {
    this._videoElement.currentTime = clamp(time, 0, this._videoElement.duration);
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this._videoElement.volume = clamp(volume, 0, 1);
  }

  /**
   * 设置静音
   */
  setMuted(muted: boolean): void {
    this._videoElement.muted = muted;
  }

  /**
   * 设置播放速率
   */
  setPlaybackRate(rate: number): void {
    this._videoElement.playbackRate = rate;
  }

  /**
   * 进入全屏
   */
  async requestFullscreen(): Promise<void> {
    await requestFullscreen(this._container);
  }

  /**
   * 退出全屏
   */
  async exitFullscreen(): Promise<void> {
    await exitFullscreen();
  }

  /**
   * 切换全屏
   */
  async toggleFullscreen(): Promise<void> {
    if (this.stateManager.fullscreen) {
      await this.exitFullscreen();
    } else {
      await this.requestFullscreen();
    }
  }

  /**
   * 进入画中画
   */
  async requestPictureInPicture(): Promise<void> {
    if (!isPictureInPictureSupported()) {
      throw new Error('Picture-in-Picture not supported');
    }

    try {
      await (this._videoElement as any).requestPictureInPicture();
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
      throw error;
    }
  }

  /**
   * 退出画中画
   */
  async exitPictureInPicture(): Promise<void> {
    if ((document as any).pictureInPictureElement) {
      await (document as any).exitPictureInPicture();
    }
  }

  /**
   * 切换画质（待实现）
   */
  async setQuality(quality: string): Promise<void> {
    // 将在 QualityManager 中实现
    this.emit('qualitychange', quality);
  }

  /**
   * 切换字幕（待实现）
   */
  setSubtitle(subtitle: string): void {
    // 将在 SubtitleManager 中实现
    this.emit('subtitlechange', subtitle);
  }

  /**
   * 发送弹幕（待实现）
   */
  sendDanmaku(text: string, options?: any): void {
    // 将在 DanmakuManager 中实现
  }

  /**
   * 截图
   */
  screenshot(): string {
    const canvas = document.createElement('canvas');
    canvas.width = this._videoElement.videoWidth;
    canvas.height = this._videoElement.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(this._videoElement, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    this.emit('screenshot', dataUrl);

    return dataUrl;
  }

  /**
   * 刷新
   */
  reload(): void {
    const currentTime = this._videoElement.currentTime;
    this._videoElement.load();

    // 恢复播放位置
    this._videoElement.addEventListener('loadedmetadata', () => {
      this._videoElement.currentTime = currentTime;
    }, { once: true });
  }

  /**
   * 销毁
   */
  destroy(): void {
    if (this.isDestroyed) return;

    // 暂停播放
    this.pause();

    // 退出全屏和画中画
    if (this.stateManager.fullscreen) {
      this.exitFullscreen().catch(() => { });
    }
    if (this.stateManager.pictureInPicture) {
      this.exitPictureInPicture().catch(() => { });
    }

    // 移除视频元素
    this._videoElement.remove();

    // 清空容器
    this._container.innerHTML = '';

    // 移除事件监听器
    this.removeAllListeners();

    // 从管理器注销
    playerManager.unregister(this.id);

    // 触发销毁事件
    this.emit('destroy');

    this.isDestroyed = true;
  }

  /**
   * 监听事件
   */
  on<K extends keyof VideoPlayerEvents>(
    event: K,
    handler: VideoPlayerEvents[K]
  ): void {
    super.on(event as string, handler as any);
  }

  /**
   * 取消监听事件
   */
  off<K extends keyof VideoPlayerEvents>(
    event: K,
    handler: VideoPlayerEvents[K]
  ): void {
    super.off(event as string, handler as any);
  }
}

