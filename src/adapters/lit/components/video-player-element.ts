/**
 * Lit Web Component for Video Player
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { VideoPlayer } from '../../../core/VideoPlayer';
import type { VideoPlayerConfig } from '../../../types';

@customElement('ldesign-video-player')
export class VideoPlayerElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-height: 200px;
      background: #000;
    }

    .player-container {
      width: 100%;
      height: 100%;
    }

    .loading,
    .error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 16px;
    }

    .error {
      color: #f56c6c;
    }
  `;

  @property() src!: string;
  @property() type: 'video' | 'hls' | 'dash' = 'video';
  @property() poster?: string;
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Number }) volume = 1;
  @property({ type: Number }) playbackRate = 1;
  @property({ type: Boolean }) controls = true;
  @property() theme = 'default';
  @property({ type: Object }) danmaku?: any;
  @property({ type: Object }) subtitle?: any;
  @property({ type: Object }) quality?: any;

  @state() private isLoading = true;
  @state() private error: Error | null = null;

  private player?: VideoPlayer;
  private container?: HTMLDivElement;

  async firstUpdated() {
    await this.initPlayer();
  }

  async updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('src') && this.player) {
      await this.initPlayer();
    }

    if (changedProperties.has('volume') && this.player) {
      this.player.setVolume(this.volume);
    }

    if (changedProperties.has('muted') && this.player) {
      this.player.setMuted(this.muted);
    }

    if (changedProperties.has('playbackRate') && this.player) {
      this.player.setPlaybackRate(this.playbackRate);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.player?.destroy();
  }

  private async initPlayer() {
    const container = this.shadowRoot?.querySelector('.player-container') as HTMLDivElement;
    if (!container) return;

    try {
      this.isLoading = true;
      this.error = null;

      // 销毁旧实例
      if (this.player) {
        this.player.destroy();
      }

      const config: VideoPlayerConfig = {
        src: this.src,
        type: this.type,
        poster: this.poster,
        autoplay: this.autoplay,
        loop: this.loop,
        muted: this.muted,
        volume: this.volume,
        playbackRate: this.playbackRate,
        controls: this.controls,
        theme: this.theme,
        danmaku: this.danmaku,
        subtitle: this.subtitle,
        quality: this.quality,
      };

      this.player = new VideoPlayer(container, config);

      // 绑定事件
      this.player.on('ready', () => {
        this.isLoading = false;
        this.dispatchEvent(new CustomEvent('ready', { detail: this.player }));
      });

      this.player.on('play', () => {
        this.dispatchEvent(new Event('play'));
      });

      this.player.on('pause', () => {
        this.dispatchEvent(new Event('pause'));
      });

      this.player.on('ended', () => {
        this.dispatchEvent(new Event('ended'));
      });

      this.player.on('timeupdate', (time) => {
        this.dispatchEvent(new CustomEvent('timeupdate', { detail: time }));
      });

      this.player.on('volumechange', (volume, muted) => {
        this.dispatchEvent(new CustomEvent('volumechange', { detail: { volume, muted } }));
      });

      this.player.on('fullscreenchange', (fullscreen) => {
        this.dispatchEvent(new CustomEvent('fullscreenchange', { detail: fullscreen }));
      });

      this.player.on('error', (err) => {
        this.error = err;
        this.isLoading = false;
        this.dispatchEvent(new CustomEvent('error', { detail: err }));
      });
    } catch (err) {
      this.error = err as Error;
      this.isLoading = false;
      this.dispatchEvent(new CustomEvent('error', { detail: err }));
    }
  }

  // Public API
  public async play() {
    await this.player?.play();
  }

  public pause() {
    this.player?.pause();
  }

  public async toggle() {
    await this.player?.toggle();
  }

  public seek(time: number) {
    this.player?.seek(time);
  }

  public setVol(volume: number) {
    this.player?.setVolume(volume);
  }

  public setMut(muted: boolean) {
    this.player?.setMuted(muted);
  }

  public setRate(rate: number) {
    this.player?.setPlaybackRate(rate);
  }

  public async requestFullscreen() {
    await this.player?.requestFullscreen();
  }

  public async exitFullscreen() {
    await this.player?.exitFullscreen();
  }

  public screenshot(): string {
    return this.player?.screenshot() || '';
  }

  public reload() {
    this.player?.reload();
  }

  render() {
    return html`
      ${this.isLoading ? html`<div class="loading">加载中...</div>` : ''}
      ${this.error ? html`<div class="error">${this.error.message}</div>` : ''}
      <div class="player-container"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ldesign-video-player': VideoPlayerElement;
  }
}

