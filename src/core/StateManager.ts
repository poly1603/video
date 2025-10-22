/**
 * 状态管理器
 */

import { PlayState, type PlayerState } from '../types';
import { EventEmitter } from './EventEmitter';

/**
 * 状态管理器类
 */
export class StateManager extends EventEmitter {
  private _state: PlayerState;

  constructor() {
    super();

    // 初始化状态
    this._state = {
      playState: PlayState.IDLE,
      currentTime: 0,
      duration: 0,
      buffered: 0,
      volume: 1,
      muted: false,
      playbackRate: 1,
      fullscreen: false,
      pictureInPicture: false,
      quality: undefined,
      subtitle: undefined,
      error: undefined,
    };
  }

  /**
   * 获取状态
   */
  get state(): Readonly<PlayerState> {
    return { ...this._state };
  }

  /**
   * 更新状态
   */
  setState(newState: Partial<PlayerState>): void {
    const oldState = { ...this._state };
    this._state = { ...this._state, ...newState };

    // 触发变化事件
    this.emit('statechange', this._state, oldState);

    // 触发具体属性变化事件
    Object.keys(newState).forEach(key => {
      const typedKey = key as keyof PlayerState;
      if (oldState[typedKey] !== this._state[typedKey]) {
        this.emit(`${key}change`, this._state[typedKey]);
      }
    });
  }

  /**
   * 获取播放状态
   */
  get playState(): PlayState {
    return this._state.playState;
  }

  /**
   * 设置播放状态
   */
  set playState(state: PlayState) {
    if (this._state.playState !== state) {
      this.setState({ playState: state });
    }
  }

  /**
   * 获取当前时间
   */
  get currentTime(): number {
    return this._state.currentTime;
  }

  /**
   * 设置当前时间
   */
  set currentTime(time: number) {
    this.setState({ currentTime: time });
  }

  /**
   * 获取总时长
   */
  get duration(): number {
    return this._state.duration;
  }

  /**
   * 设置总时长
   */
  set duration(duration: number) {
    this.setState({ duration });
  }

  /**
   * 获取音量
   */
  get volume(): number {
    return this._state.volume;
  }

  /**
   * 设置音量
   */
  set volume(volume: number) {
    this.setState({ volume });
  }

  /**
   * 获取静音状态
   */
  get muted(): boolean {
    return this._state.muted;
  }

  /**
   * 设置静音状态
   */
  set muted(muted: boolean) {
    this.setState({ muted });
  }

  /**
   * 获取播放速率
   */
  get playbackRate(): number {
    return this._state.playbackRate;
  }

  /**
   * 设置播放速率
   */
  set playbackRate(rate: number) {
    this.setState({ playbackRate: rate });
  }

  /**
   * 获取全屏状态
   */
  get fullscreen(): boolean {
    return this._state.fullscreen;
  }

  /**
   * 设置全屏状态
   */
  set fullscreen(fullscreen: boolean) {
    this.setState({ fullscreen });
  }

  /**
   * 获取画中画状态
   */
  get pictureInPicture(): boolean {
    return this._state.pictureInPicture;
  }

  /**
   * 设置画中画状态
   */
  set pictureInPicture(pip: boolean) {
    this.setState({ pictureInPicture: pip });
  }

  /**
   * 设置错误
   */
  setError(error: Error): void {
    this.setState({
      error,
      playState: PlayState.ERROR
    });
  }

  /**
   * 清除错误
   */
  clearError(): void {
    this.setState({ error: undefined });
  }

  /**
   * 重置状态
   */
  reset(): void {
    this._state = {
      playState: PlayState.IDLE,
      currentTime: 0,
      duration: 0,
      buffered: 0,
      volume: this._state.volume, // 保留音量设置
      muted: this._state.muted,   // 保留静音设置
      playbackRate: 1,
      fullscreen: false,
      pictureInPicture: false,
      quality: undefined,
      subtitle: undefined,
      error: undefined,
    };
    this.emit('reset');
  }
}

