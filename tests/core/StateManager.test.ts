/**
 * StateManager 单元测试
 */

import { describe, it, expect, vi } from 'vitest';
import { StateManager } from '../../src/core/StateManager';
import { PlayState } from '../../src/types';

describe('StateManager', () => {
  it('should initialize with default state', () => {
    const manager = new StateManager();
    const state = manager.state;

    expect(state.playState).toBe(PlayState.IDLE);
    expect(state.currentTime).toBe(0);
    expect(state.duration).toBe(0);
    expect(state.volume).toBe(1);
    expect(state.muted).toBe(false);
  });

  it('should update state', () => {
    const manager = new StateManager();
    const handler = vi.fn();

    manager.on('statechange', handler);
    manager.setState({ volume: 0.5 });

    expect(manager.state.volume).toBe(0.5);
    expect(handler).toHaveBeenCalled();
  });

  it('should emit property change events', () => {
    const manager = new StateManager();
    const handler = vi.fn();

    manager.on('volumechange', handler);
    manager.volume = 0.8;

    expect(handler).toHaveBeenCalledWith(0.8);
  });

  it('should set play state', () => {
    const manager = new StateManager();

    manager.playState = PlayState.PLAYING;
    expect(manager.playState).toBe(PlayState.PLAYING);
  });

  it('should set error', () => {
    const manager = new StateManager();
    const error = new Error('Test error');

    manager.setError(error);

    expect(manager.state.error).toBe(error);
    expect(manager.state.playState).toBe(PlayState.ERROR);
  });

  it('should clear error', () => {
    const manager = new StateManager();

    manager.setError(new Error('Test'));
    manager.clearError();

    expect(manager.state.error).toBeUndefined();
  });

  it('should reset state', () => {
    const manager = new StateManager();
    const handler = vi.fn();

    manager.volume = 0.5;
    manager.currentTime = 50;
    manager.on('reset', handler);
    manager.reset();

    expect(manager.state.currentTime).toBe(0);
    expect(manager.state.volume).toBe(0.5); // 音量应保留
    expect(handler).toHaveBeenCalled();
  });
});

