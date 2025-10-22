/**
 * 手势控制管理器（移动端）
 */

import type { IVideoPlayer } from '../types';
import { EventEmitter } from '../core/EventEmitter';

export interface GestureConfig {
  /** 是否启用手势 */
  enabled: boolean;

  /** 双击灵敏度（毫秒） */
  doubleTapDelay?: number;

  /** 滑动灵敏度 */
  swipeSensitivity?: number;

  /** 是否启用音量手势 */
  volumeGesture?: boolean;

  /** 是否启用亮度手势 */
  brightnessGesture?: boolean;

  /** 是否启用进度手势 */
  seekGesture?: boolean;
}

export class Gestures extends EventEmitter {
  private player: IVideoPlayer;
  private config: Required<GestureConfig>;
  private container: HTMLElement;

  // 触摸状态
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private lastTapTime = 0;
  private isSwiping = false;
  private startVolume = 0;
  private startBrightness = 0;
  private startTime = 0;

  constructor(player: IVideoPlayer, config: Partial<GestureConfig> = {}) {
    super();

    this.player = player;
    this.container = player.container;
    this.config = {
      enabled: true,
      doubleTapDelay: 300,
      swipeSensitivity: 50,
      volumeGesture: true,
      brightnessGesture: false, // 需要特殊权限
      seekGesture: true,
      ...config,
    };

    if (this.config.enabled) {
      this.enable();
    }
  }

  /**
   * 启用手势
   */
  enable(): void {
    this.config.enabled = true;
    this.bindEvents();
    this.emit('enabled');
  }

  /**
   * 禁用手势
   */
  disable(): void {
    this.config.enabled = false;
    this.unbindEvents();
    this.emit('disabled');
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), {
      passive: false,
    });
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), {
      passive: false,
    });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), {
      passive: false,
    });
  }

  /**
   * 解绑事件
   */
  private unbindEvents(): void {
    this.container.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  /**
   * 触摸开始
   */
  private handleTouchStart(event: TouchEvent): void {
    if (!this.config.enabled || event.touches.length !== 1) return;

    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.isSwiping = false;

    // 保存初始状态
    this.startVolume = this.player.state.volume;
    this.startTime = this.player.state.currentTime;
  }

  /**
   * 触摸移动
   */
  private handleTouchMove(event: TouchEvent): void {
    if (!this.config.enabled || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    // 判断是否为滑动
    if (Math.abs(deltaX) > this.config.swipeSensitivity ||
      Math.abs(deltaY) > this.config.swipeSensitivity) {

      if (!this.isSwiping) {
        this.isSwiping = true;
        this.emit('swipeStart');
      }

      const containerWidth = this.container.clientWidth;
      const containerHeight = this.container.clientHeight;

      // 水平滑动 - 调整进度
      if (Math.abs(deltaX) > Math.abs(deltaY) && this.config.seekGesture) {
        event.preventDefault();
        const duration = this.player.state.duration;
        const seekDelta = (deltaX / containerWidth) * duration * 0.5;
        const newTime = Math.max(0, Math.min(duration, this.startTime + seekDelta));

        this.emit('seekGesture', newTime);
        // 显示进度提示
      }

      // 垂直滑动
      else if (Math.abs(deltaY) > Math.abs(deltaX)) {
        event.preventDefault();

        const startX = this.touchStartX;
        const isLeftSide = startX < containerWidth / 2;

        // 左侧 - 调整亮度（如果启用）
        if (isLeftSide && this.config.brightnessGesture) {
          const brightnessDelta = -deltaY / containerHeight;
          const newBrightness = Math.max(0, Math.min(1, this.startBrightness + brightnessDelta));
          this.emit('brightnessGesture', newBrightness);
        }

        // 右侧 - 调整音量
        else if (!isLeftSide && this.config.volumeGesture) {
          const volumeDelta = -deltaY / containerHeight;
          const newVolume = Math.max(0, Math.min(1, this.startVolume + volumeDelta));
          this.player.setVolume(newVolume);
          this.emit('volumeGesture', newVolume);
        }
      }
    }
  }

  /**
   * 触摸结束
   */
  private handleTouchEnd(event: TouchEvent): void {
    if (!this.config.enabled) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    const duration = Date.now() - this.touchStartTime;

    // 判断是否为点击
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && duration < 300) {
      this.handleTap();
    }

    if (this.isSwiping) {
      this.emit('swipeEnd');
      this.isSwiping = false;
    }

    // 重置状态
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
  }

  /**
   * 处理点击
   */
  private handleTap(): void {
    const now = Date.now();

    // 双击检测
    if (now - this.lastTapTime < this.config.doubleTapDelay) {
      this.handleDoubleTap();
      this.lastTapTime = 0;
    } else {
      // 单击 - 显示/隐藏控制条
      this.emit('tap');
      this.lastTapTime = now;
    }
  }

  /**
   * 处理双击
   */
  private handleDoubleTap(): void {
    // 双击播放/暂停
    this.player.toggle();
    this.emit('doubleTap');
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<GestureConfig>): void {
    this.config = { ...this.config, ...config };
    this.emit('configUpdate', this.config);
  }
}

