/**
 * 键盘快捷键管理器
 */

import type { IVideoPlayer } from '../types';
import { EventEmitter } from '../core/EventEmitter';

export interface HotkeyConfig {
  /** 是否启用快捷键 */
  enabled: boolean;

  /** 自定义快捷键映射 */
  keyMap?: Record<string, () => void>;

  /** 是否全局监听 */
  global?: boolean;
}

export class Hotkeys extends EventEmitter {
  private player: IVideoPlayer;
  private config: HotkeyConfig;
  private keyMap: Map<string, () => void> = new Map();

  constructor(player: IVideoPlayer, config: Partial<HotkeyConfig> = {}) {
    super();

    this.player = player;
    this.config = {
      enabled: true,
      global: false,
      ...config,
    };

    this.setupDefaultKeys();

    if (this.config.enabled) {
      this.enable();
    }
  }

  /**
   * 设置默认快捷键
   */
  private setupDefaultKeys(): void {
    // 播放/暂停 - 空格键
    this.register('Space', () => {
      this.player.toggle();
    });

    // 快退 5 秒 - 左箭头
    this.register('ArrowLeft', () => {
      const currentTime = this.player.state.currentTime;
      this.player.seek(Math.max(0, currentTime - 5));
    });

    // 快进 5 秒 - 右箭头
    this.register('ArrowRight', () => {
      const currentTime = this.player.state.currentTime;
      const duration = this.player.state.duration;
      this.player.seek(Math.min(duration, currentTime + 5));
    });

    // 音量增加 - 上箭头
    this.register('ArrowUp', () => {
      const volume = this.player.state.volume;
      this.player.setVolume(Math.min(1, volume + 0.1));
    });

    // 音量减少 - 下箭头
    this.register('ArrowDown', () => {
      const volume = this.player.state.volume;
      this.player.setVolume(Math.max(0, volume - 0.1));
    });

    // 全屏 - F 键
    this.register('f', () => {
      this.player.toggleFullscreen();
    });

    // 静音 - M 键
    this.register('m', () => {
      this.player.setMuted(!this.player.state.muted);
    });

    // 跳转到百分比位置 - 0-9 数字键
    for (let i = 0; i <= 9; i++) {
      this.register(String(i), () => {
        const duration = this.player.state.duration;
        const targetTime = (duration * i) / 10;
        this.player.seek(targetTime);
      });
    }

    // 倍速 - > 和 <
    this.register('>', () => {
      const rate = this.player.state.playbackRate;
      this.player.setPlaybackRate(Math.min(2, rate + 0.25));
    });

    this.register('<', () => {
      const rate = this.player.state.playbackRate;
      this.player.setPlaybackRate(Math.max(0.25, rate - 0.25));
    });

    // Home - 跳转到开始
    this.register('Home', () => {
      this.player.seek(0);
    });

    // End - 跳转到结束
    this.register('End', () => {
      const duration = this.player.state.duration;
      this.player.seek(duration - 1);
    });
  }

  /**
   * 注册快捷键
   */
  register(key: string, handler: () => void): void {
    this.keyMap.set(key.toLowerCase(), handler);
    this.emit('register', key);
  }

  /**
   * 注销快捷键
   */
  unregister(key: string): void {
    this.keyMap.delete(key.toLowerCase());
    this.emit('unregister', key);
  }

  /**
   * 启用快捷键
   */
  enable(): void {
    this.config.enabled = true;

    const target = this.config.global ? document : this.player.container;
    target.addEventListener('keydown', this.handleKeydown.bind(this));

    this.emit('enabled');
  }

  /**
   * 禁用快捷键
   */
  disable(): void {
    this.config.enabled = false;

    const target = this.config.global ? document : this.player.container;
    target.removeEventListener('keydown', this.handleKeydown.bind(this));

    this.emit('disabled');
  }

  /**
   * 处理按键事件
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (!this.config.enabled) return;

    // 忽略输入框的按键
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    const key = event.key.toLowerCase();
    const handler = this.keyMap.get(key);

    if (handler) {
      event.preventDefault();
      handler();
      this.emit('trigger', key);
    }
  }

  /**
   * 获取所有快捷键
   */
  getKeyMap(): ReadonlyMap<string, () => void> {
    return new Map(this.keyMap);
  }

  /**
   * 清除所有快捷键
   */
  clear(): void {
    this.keyMap.clear();
    this.emit('clear');
  }
}

