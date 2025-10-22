/**
 * EventEmitter 单元测试
 */

import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '../../src/core/EventEmitter';

describe('EventEmitter', () => {
  it('should register and trigger event', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();

    emitter.on('test', handler);
    emitter.emit('test', 'data');

    expect(handler).toHaveBeenCalledWith('data');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should support once event', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();

    emitter.once('test', handler);
    emitter.emit('test');
    emitter.emit('test');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();

    emitter.on('test', handler);
    emitter.off('test', handler);
    emitter.emit('test');

    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove all listeners for event', () => {
    const emitter = new EventEmitter();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    emitter.on('test', handler1);
    emitter.on('test', handler2);
    emitter.off('test');
    emitter.emit('test');

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it('should get listener count', () => {
    const emitter = new EventEmitter();

    emitter.on('test', () => { });
    emitter.on('test', () => { });

    expect(emitter.listenerCount('test')).toBe(2);
  });

  it('should get event names', () => {
    const emitter = new EventEmitter();

    emitter.on('event1', () => { });
    emitter.on('event2', () => { });

    const names = emitter.eventNames();
    expect(names).toContain('event1');
    expect(names).toContain('event2');
  });

  it('should remove all listeners', () => {
    const emitter = new EventEmitter();

    emitter.on('event1', () => { });
    emitter.on('event2', () => { });
    emitter.removeAllListeners();

    expect(emitter.eventNames()).toHaveLength(0);
  });
});

