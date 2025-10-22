/**
 * 播放器实例管理器
 */

import type { IVideoPlayer } from '../types';

/**
 * 播放器管理器类
 */
class PlayerManager {
  private players: Map<string, IVideoPlayer> = new Map();

  /**
   * 注册播放器实例
   */
  register(id: string, player: IVideoPlayer): void {
    if (this.players.has(id)) {
      console.warn(`Player with id "${id}" already exists`);
    }
    this.players.set(id, player);
  }

  /**
   * 注销播放器实例
   */
  unregister(id: string): void {
    this.players.delete(id);
  }

  /**
   * 获取播放器实例
   */
  get(id: string): IVideoPlayer | undefined {
    return this.players.get(id);
  }

  /**
   * 获取所有播放器实例
   */
  getAll(): IVideoPlayer[] {
    return Array.from(this.players.values());
  }

  /**
   * 暂停所有其他播放器
   */
  pauseOthers(exceptId: string): void {
    this.players.forEach((player, id) => {
      if (id !== exceptId && player.state.playState === 'playing') {
        player.pause();
      }
    });
  }

  /**
   * 销毁所有播放器
   */
  destroyAll(): void {
    this.players.forEach(player => player.destroy());
    this.players.clear();
  }

  /**
   * 获取播放器数量
   */
  get count(): number {
    return this.players.size;
  }
}

// 导出单例
export const playerManager = new PlayerManager();

