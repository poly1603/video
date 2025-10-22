/**
 * 缩略图预览
 * 在进度条上显示视频缩略图
 */

import type { IVideoPlayer } from '../types';

export interface ThumbnailConfig {
  /** 缩略图 URL 模板 */
  url: string;

  /** 缩略图宽度 */
  width?: number;

  /** 缩略图高度 */
  height?: number;

  /** 缩略图间隔（秒） */
  interval?: number;

  /** 雪碧图列数 */
  columns?: number;

  /** 雪碧图行数 */
  rows?: number;
}

export class ThumbnailPreview {
  private player: IVideoPlayer;
  private config: Required<ThumbnailConfig>;
  private previewElement: HTMLDivElement;
  private imageElement: HTMLImageElement;
  private isVisible = false;

  constructor(player: IVideoPlayer, config: ThumbnailConfig) {
    this.player = player;
    this.config = {
      width: 160,
      height: 90,
      interval: 5,
      columns: 5,
      rows: 5,
      ...config,
    };

    this.previewElement = this.createPreviewElement();
    this.imageElement = this.previewElement.querySelector('img')!;
    this.init();
  }

  /**
   * 创建预览元素
   */
  private createPreviewElement(): HTMLDivElement {
    const preview = document.createElement('div');
    preview.className = 'ldesign-video-thumbnail-preview';
    preview.style.cssText = `
      position: absolute;
      bottom: 50px;
      left: 0;
      width: ${this.config.width}px;
      height: ${this.config.height}px;
      background: #000;
      border: 2px solid #fff;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
      overflow: hidden;
      z-index: 20;
    `;

    const img = document.createElement('img');
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;

    preview.appendChild(img);
    this.player.container.appendChild(preview);

    return preview;
  }

  /**
   * 初始化
   */
  private init(): void {
    const progressBar = this.player.container.querySelector('.ldesign-video-progress-container');

    if (progressBar) {
      progressBar.addEventListener('mousemove', this.handleMouseMove.bind(this));
      progressBar.addEventListener('mouseleave', this.hide.bind(this));
    }
  }

  /**
   * 处理鼠标移动
   */
  private handleMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const time = percent * this.player.state.duration;

    this.updateThumbnail(time);
    this.updatePosition(event.clientX - rect.left);
    this.show();
  }

  /**
   * 更新缩略图
   */
  private updateThumbnail(time: number): void {
    const index = Math.floor(time / this.config.interval);
    const row = Math.floor(index / this.config.columns);
    const col = index % this.config.columns;

    // 使用雪碧图
    const totalWidth = this.config.width * this.config.columns;
    const totalHeight = this.config.height * this.config.rows;

    this.imageElement.src = this.config.url;
    this.imageElement.style.width = `${totalWidth}px`;
    this.imageElement.style.height = `${totalHeight}px`;
    this.imageElement.style.marginLeft = `-${col * this.config.width}px`;
    this.imageElement.style.marginTop = `-${row * this.config.height}px`;
  }

  /**
   * 更新位置
   */
  private updatePosition(x: number): void {
    const maxX = this.player.container.clientWidth - this.config.width;
    const left = Math.max(0, Math.min(maxX, x - this.config.width / 2));

    this.previewElement.style.left = `${left}px`;
  }

  /**
   * 显示
   */
  private show(): void {
    if (!this.isVisible) {
      this.previewElement.style.opacity = '1';
      this.isVisible = true;
    }
  }

  /**
   * 隐藏
   */
  private hide(): void {
    if (this.isVisible) {
      this.previewElement.style.opacity = '0';
      this.isVisible = false;
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.previewElement.remove();
  }
}

