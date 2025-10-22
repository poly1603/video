/**
 * 弹幕渲染引擎
 */

import type { Danmaku, DanmakuConfig, DanmakuItem, DanmakuTrack } from '../types';
import { generateId } from '../utils/helpers';

/**
 * 弹幕引擎类
 */
export class DanmakuEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: Required<DanmakuConfig>;
  private items: DanmakuItem[] = [];
  private tracks: DanmakuTrack[] = [];
  private animationId?: number;
  private isRunning = false;

  constructor(container: HTMLElement, config: DanmakuConfig) {
    this.config = {
      enable: true,
      source: [],
      opacity: 1,
      speed: 1,
      fontSize: 24,
      mode: 'unlimited' as any,
      maxCount: 1000,
      maxOnScreen: 50,
      filter: {},
      ...config,
    };

    // 创建画布
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'ldesign-video-danmaku-canvas';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    `;

    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
    this.initTracks();
    this.updateCanvasSize();
  }

  /**
   * 初始化轨道
   */
  private initTracks(): void {
    const trackCount = 10;
    const trackHeight = this.canvas.height / trackCount;

    for (let i = 0; i < trackCount; i++) {
      this.tracks.push({
        index: i,
        y: i * trackHeight,
        items: [],
        available: true,
      });
    }
  }

  /**
   * 更新画布大小
   */
  updateCanvasSize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.initTracks();
  }

  /**
   * 添加弹幕
   */
  add(danmaku: Danmaku): void {
    if (this.items.length >= this.config.maxCount) {
      return;
    }

    // 过滤弹幕
    if (this.shouldFilter(danmaku)) {
      return;
    }

    const track = this.findAvailableTrack();
    if (!track) return;

    // 测量文本宽度
    this.ctx.font = `${this.config.fontSize}px Arial`;
    const width = this.ctx.measureText(danmaku.text).width;

    const item: DanmakuItem = {
      ...danmaku,
      renderId: generateId('danmaku'),
      x: this.canvas.width,
      y: track.y + this.config.fontSize,
      width,
      height: this.config.fontSize,
      speed: this.config.speed * 2,
      alive: true,
      id: danmaku.id || generateId('dm'),
      color: danmaku.color || '#ffffff',
      size: danmaku.size || this.config.fontSize,
      type: danmaku.type || 'scroll' as any,
    };

    this.items.push(item);
    track.items.push(item);
  }

  /**
   * 查找可用轨道
   */
  private findAvailableTrack(): DanmakuTrack | null {
    // 找到最空闲的轨道
    let bestTrack: DanmakuTrack | null = null;
    let minItems = Infinity;

    for (const track of this.tracks) {
      if (track.items.length < minItems) {
        minItems = track.items.length;
        bestTrack = track;
      }

      if (minItems === 0) break;
    }

    return bestTrack;
  }

  /**
   * 判断是否应该过滤
   */
  private shouldFilter(danmaku: Danmaku): boolean {
    const { filter } = this.config;

    if (filter.types && !filter.types.includes(danmaku.type!)) {
      return true;
    }

    if (filter.keywords) {
      for (const keyword of filter.keywords) {
        if (danmaku.text.includes(keyword)) {
          return true;
        }
      }
    }

    if (filter.users && danmaku.author && filter.users.includes(danmaku.author)) {
      return true;
    }

    if (filter.custom && !filter.custom(danmaku)) {
      return true;
    }

    return false;
  }

  /**
   * 开始渲染
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.render();
  }

  /**
   * 停止渲染
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  }

  /**
   * 渲染
   */
  private render = (): void => {
    if (!this.isRunning) return;

    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 设置全局透明度
    this.ctx.globalAlpha = this.config.opacity;

    // 更新和渲染弹幕
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];

      // 移动弹幕
      item.x -= item.speed;

      // 移除屏幕外的弹幕
      if (item.x + item.width < 0) {
        this.items.splice(i, 1);
        this.removeFromTrack(item);
        continue;
      }

      // 渲染弹幕
      this.ctx.font = `${item.size}px Arial`;
      this.ctx.fillStyle = item.color!;
      this.ctx.fillText(item.text, item.x, item.y);
    }

    this.animationId = requestAnimationFrame(this.render);
  };

  /**
   * 从轨道移除弹幕
   */
  private removeFromTrack(item: DanmakuItem): void {
    for (const track of this.tracks) {
      const index = track.items.indexOf(item);
      if (index !== -1) {
        track.items.splice(index, 1);
        break;
      }
    }
  }

  /**
   * 清空弹幕
   */
  clear(): void {
    this.items = [];
    this.tracks.forEach(track => {
      track.items = [];
    });
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 显示/隐藏
   */
  setVisible(visible: boolean): void {
    this.canvas.style.display = visible ? 'block' : 'none';
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.stop();
    this.clear();
    this.canvas.remove();
  }
}

