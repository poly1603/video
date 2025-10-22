/**
 * 播放列表管理器
 */

import type { VideoSource } from '../types';
import { EventEmitter } from '../core/EventEmitter';

export interface PlaylistItem extends VideoSource {
  id: string;
  title?: string;
  duration?: number;
  thumbnail?: string;
}

export class PlaylistManager extends EventEmitter {
  private playlist: PlaylistItem[] = [];
  private currentIndex = -1;
  private shuffleIndices: number[] = [];
  private isShuffled = false;

  /**
   * 添加到播放列表
   */
  add(item: PlaylistItem | PlaylistItem[]): void {
    const items = Array.isArray(item) ? item : [item];
    this.playlist.push(...items);
    this.emit('add', items);
    this.emit('change', this.playlist);
  }

  /**
   * 从播放列表移除
   */
  remove(index: number): void {
    if (index >= 0 && index < this.playlist.length) {
      const removed = this.playlist.splice(index, 1);

      // 调整当前索引
      if (index < this.currentIndex) {
        this.currentIndex--;
      } else if (index === this.currentIndex) {
        this.currentIndex = -1;
      }

      this.emit('remove', removed[0], index);
      this.emit('change', this.playlist);
    }
  }

  /**
   * 清空播放列表
   */
  clear(): void {
    this.playlist = [];
    this.currentIndex = -1;
    this.shuffleIndices = [];
    this.emit('clear');
    this.emit('change', this.playlist);
  }

  /**
   * 播放指定索引
   */
  playAt(index: number): PlaylistItem | null {
    if (index >= 0 && index < this.playlist.length) {
      this.currentIndex = index;
      const item = this.playlist[index];
      this.emit('play', item, index);
      return item;
    }
    return null;
  }

  /**
   * 播放下一个
   */
  next(): PlaylistItem | null {
    if (this.playlist.length === 0) return null;

    let nextIndex: number;

    if (this.isShuffled) {
      const currentShuffleIndex = this.shuffleIndices.indexOf(this.currentIndex);
      const nextShuffleIndex = (currentShuffleIndex + 1) % this.shuffleIndices.length;
      nextIndex = this.shuffleIndices[nextShuffleIndex];
    } else {
      nextIndex = (this.currentIndex + 1) % this.playlist.length;
    }

    return this.playAt(nextIndex);
  }

  /**
   * 播放上一个
   */
  previous(): PlaylistItem | null {
    if (this.playlist.length === 0) return null;

    let prevIndex: number;

    if (this.isShuffled) {
      const currentShuffleIndex = this.shuffleIndices.indexOf(this.currentIndex);
      const prevShuffleIndex = currentShuffleIndex === 0
        ? this.shuffleIndices.length - 1
        : currentShuffleIndex - 1;
      prevIndex = this.shuffleIndices[prevShuffleIndex];
    } else {
      prevIndex = this.currentIndex === 0
        ? this.playlist.length - 1
        : this.currentIndex - 1;
    }

    return this.playAt(prevIndex);
  }

  /**
   * 随机播放
   */
  shuffle(): void {
    if (this.playlist.length === 0) return;

    this.isShuffled = true;
    this.shuffleIndices = Array.from({ length: this.playlist.length }, (_, i) => i);

    // Fisher-Yates 洗牌算法
    for (let i = this.shuffleIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffleIndices[i], this.shuffleIndices[j]] =
        [this.shuffleIndices[j], this.shuffleIndices[i]];
    }

    this.emit('shuffle', true);
  }

  /**
   * 取消随机播放
   */
  unshuffle(): void {
    this.isShuffled = false;
    this.shuffleIndices = [];
    this.emit('shuffle', false);
  }

  /**
   * 移动项目
   */
  move(fromIndex: number, toIndex: number): void {
    if (fromIndex < 0 || fromIndex >= this.playlist.length ||
      toIndex < 0 || toIndex >= this.playlist.length) {
      return;
    }

    const item = this.playlist.splice(fromIndex, 1)[0];
    this.playlist.splice(toIndex, 0, item);

    // 调整当前索引
    if (this.currentIndex === fromIndex) {
      this.currentIndex = toIndex;
    } else if (fromIndex < this.currentIndex && toIndex >= this.currentIndex) {
      this.currentIndex--;
    } else if (fromIndex > this.currentIndex && toIndex <= this.currentIndex) {
      this.currentIndex++;
    }

    this.emit('move', fromIndex, toIndex);
    this.emit('change', this.playlist);
  }

  /**
   * 获取播放列表
   */
  getPlaylist(): ReadonlyArray<PlaylistItem> {
    return [...this.playlist];
  }

  /**
   * 获取当前项
   */
  getCurrentItem(): PlaylistItem | null {
    return this.currentIndex >= 0 ? this.playlist[this.currentIndex] : null;
  }

  /**
   * 获取当前索引
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * 获取播放列表长度
   */
  get length(): number {
    return this.playlist.length;
  }

  /**
   * 是否为空
   */
  get isEmpty(): boolean {
    return this.playlist.length === 0;
  }
}

