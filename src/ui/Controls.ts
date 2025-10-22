/**
 * 播放控制条
 */

import type { IVideoPlayer, ControlsConfig } from '../types';
import { createElement, formatTime } from '../utils/helpers';

/**
 * 控制条类
 */
export class Controls {
  private player: IVideoPlayer;
  private config: ControlsConfig;
  private container: HTMLElement;
  private controlsElement: HTMLElement;
  private autoHideTimer?: number;

  constructor(player: IVideoPlayer, config: ControlsConfig = {}) {
    this.player = player;
    this.config = {
      show: true,
      autoHideDelay: 3000,
      buttons: ['play', 'time', 'progress', 'volume', 'settings', 'fullscreen'],
      ...config,
    };

    this.container = player.container;
    this.controlsElement = this.create();
    this.init();
  }

  /**
   * 创建控制条
   */
  private create(): HTMLElement {
    const controls = createElement('div', {
      className: 'ldesign-video-controls',
    });

    // 进度条容器
    const progressContainer = this.createProgressBar();
    controls.appendChild(progressContainer);

    // 控制按钮容器
    const buttonsContainer = createElement('div', {
      className: 'ldesign-video-controls-buttons',
    });

    // 左侧按钮组
    const leftButtons = createElement('div', {
      className: 'ldesign-video-controls-left',
    });

    // 播放/暂停按钮
    if (this.config.buttons?.includes('play')) {
      leftButtons.appendChild(this.createPlayButton());
    }

    // 时间显示
    if (this.config.buttons?.includes('time')) {
      leftButtons.appendChild(this.createTimeDisplay());
    }

    buttonsContainer.appendChild(leftButtons);

    // 右侧按钮组
    const rightButtons = createElement('div', {
      className: 'ldesign-video-controls-right',
    });

    // 音量按钮
    if (this.config.buttons?.includes('volume')) {
      rightButtons.appendChild(this.createVolumeButton());
    }

    // 设置按钮
    if (this.config.buttons?.includes('settings')) {
      rightButtons.appendChild(this.createSettingsButton());
    }

    // 画中画按钮
    if (this.config.buttons?.includes('pip')) {
      rightButtons.appendChild(this.createPipButton());
    }

    // 全屏按钮
    if (this.config.buttons?.includes('fullscreen')) {
      rightButtons.appendChild(this.createFullscreenButton());
    }

    buttonsContainer.appendChild(rightButtons);
    controls.appendChild(buttonsContainer);

    return controls;
  }

  /**
   * 创建进度条
   */
  private createProgressBar(): HTMLElement {
    const container = createElement('div', {
      className: 'ldesign-video-progress-container',
    });

    const progress = createElement('div', {
      className: 'ldesign-video-progress',
    });

    const buffered = createElement('div', {
      className: 'ldesign-video-progress-buffered',
    });

    const played = createElement('div', {
      className: 'ldesign-video-progress-played',
    });

    const handle = createElement('div', {
      className: 'ldesign-video-progress-handle',
    });

    played.appendChild(handle);
    progress.appendChild(buffered);
    progress.appendChild(played);
    container.appendChild(progress);

    // 进度条交互
    this.bindProgressEvents(container, played, handle);

    return container;
  }

  /**
   * 绑定进度条事件
   */
  private bindProgressEvents(
    container: HTMLElement,
    played: HTMLElement,
    handle: HTMLElement
  ): void {
    let isDragging = false;

    const updateProgress = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const time = percent * this.player.state.duration;

      if (isDragging) {
        this.player.seek(time);
      }

      played.style.width = `${percent * 100}%`;
    };

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateProgress(e);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        updateProgress(e);
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // 时间更新
    this.player.on('timeupdate', (time) => {
      if (!isDragging) {
        const percent = (time / this.player.state.duration) * 100;
        played.style.width = `${percent}%`;
      }
    });

    // 缓冲更新
    this.player.on('progress', (buffered) => {
      const bufferedEl = container.querySelector('.ldesign-video-progress-buffered') as HTMLElement;
      if (bufferedEl) {
        bufferedEl.style.width = `${buffered}%`;
      }
    });
  }

  /**
   * 创建播放按钮
   */
  private createPlayButton(): HTMLElement {
    const button = createElement('button', {
      className: 'ldesign-video-button ldesign-video-button-play',
      attrs: { 'aria-label': 'Play' },
    });

    button.innerHTML = this.getPlayIcon();

    button.addEventListener('click', () => {
      this.player.toggle();
    });

    // 更新按钮状态
    this.player.on('play', () => {
      button.innerHTML = this.getPauseIcon();
      button.setAttribute('aria-label', 'Pause');
    });

    this.player.on('pause', () => {
      button.innerHTML = this.getPlayIcon();
      button.setAttribute('aria-label', 'Play');
    });

    return button;
  }

  /**
   * 创建时间显示
   */
  private createTimeDisplay(): HTMLElement {
    const timeDisplay = createElement('div', {
      className: 'ldesign-video-time',
    });

    const updateTime = () => {
      const current = formatTime(this.player.state.currentTime);
      const duration = formatTime(this.player.state.duration);
      timeDisplay.textContent = `${current} / ${duration}`;
    };

    this.player.on('timeupdate', updateTime);
    this.player.on('durationchange', updateTime);

    updateTime();

    return timeDisplay;
  }

  /**
   * 创建音量按钮
   */
  private createVolumeButton(): HTMLElement {
    const container = createElement('div', {
      className: 'ldesign-video-volume',
    });

    const button = createElement('button', {
      className: 'ldesign-video-button ldesign-video-button-volume',
      attrs: { 'aria-label': 'Mute' },
    });

    button.innerHTML = this.getVolumeIcon(this.player.state.volume);

    button.addEventListener('click', () => {
      this.player.setMuted(!this.player.state.muted);
    });

    // 音量滑块
    const slider = createElement('input', {
      className: 'ldesign-video-volume-slider',
      attrs: {
        type: 'range',
        min: '0',
        max: '100',
        value: String(this.player.state.volume * 100),
      },
    }) as HTMLInputElement;

    slider.addEventListener('input', () => {
      const volume = parseInt(slider.value) / 100;
      this.player.setVolume(volume);
      this.player.setMuted(false);
    });

    // 更新图标
    this.player.on('volumechange', (volume, muted) => {
      button.innerHTML = muted ? this.getMuteIcon() : this.getVolumeIcon(volume);
      slider.value = String(volume * 100);
    });

    container.appendChild(button);
    container.appendChild(slider);

    return container;
  }

  /**
   * 创建设置按钮
   */
  private createSettingsButton(): HTMLElement {
    const button = createElement('button', {
      className: 'ldesign-video-button ldesign-video-button-settings',
      attrs: { 'aria-label': 'Settings' },
    });

    button.innerHTML = this.getSettingsIcon();

    button.addEventListener('click', () => {
      // 打开设置菜单（待实现）
    });

    return button;
  }

  /**
   * 创建画中画按钮
   */
  private createPipButton(): HTMLElement {
    const button = createElement('button', {
      className: 'ldesign-video-button ldesign-video-button-pip',
      attrs: { 'aria-label': 'Picture in Picture' },
    });

    button.innerHTML = this.getPipIcon();

    button.addEventListener('click', async () => {
      if (this.player.state.pictureInPicture) {
        await this.player.exitPictureInPicture();
      } else {
        await this.player.requestPictureInPicture();
      }
    });

    return button;
  }

  /**
   * 创建全屏按钮
   */
  private createFullscreenButton(): HTMLElement {
    const button = createElement('button', {
      className: 'ldesign-video-button ldesign-video-button-fullscreen',
      attrs: { 'aria-label': 'Fullscreen' },
    });

    button.innerHTML = this.getFullscreenIcon();

    button.addEventListener('click', () => {
      this.player.toggleFullscreen();
    });

    // 更新图标
    this.player.on('fullscreenchange', (fullscreen) => {
      button.innerHTML = fullscreen
        ? this.getExitFullscreenIcon()
        : this.getFullscreenIcon();
    });

    return button;
  }

  /**
   * 初始化
   */
  private init(): void {
    this.container.appendChild(this.controlsElement);

    // 自动隐藏
    if (this.config.autoHideDelay) {
      this.setupAutoHide();
    }
  }

  /**
   * 设置自动隐藏
   */
  private setupAutoHide(): void {
    const show = () => {
      this.controlsElement.classList.add('ldesign-video-controls-show');
      this.resetAutoHideTimer();
    };

    const hide = () => {
      if (this.player.state.playState === 'playing') {
        this.controlsElement.classList.remove('ldesign-video-controls-show');
      }
    };

    this.container.addEventListener('mousemove', show);
    this.container.addEventListener('mouseleave', hide);

    show();
  }

  /**
   * 重置自动隐藏计时器
   */
  private resetAutoHideTimer(): void {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }

    this.autoHideTimer = window.setTimeout(() => {
      if (this.player.state.playState === 'playing') {
        this.controlsElement.classList.remove('ldesign-video-controls-show');
      }
    }, this.config.autoHideDelay);
  }

  /**
   * 图标 SVG
   */
  private getPlayIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  }

  private getPauseIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>`;
  }

  private getVolumeIcon(volume: number): string {
    if (volume === 0) return this.getMuteIcon();
    if (volume < 0.5) {
      return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 9v6h4l5 5V4l-5 5H7z"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`;
  }

  private getMuteIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
  }

  private getSettingsIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;
  }

  private getPipIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/></svg>`;
  }

  private getFullscreenIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
  }

  private getExitFullscreenIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;
  }

  /**
   * 销毁
   */
  destroy(): void {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }
    this.controlsElement.remove();
  }
}

