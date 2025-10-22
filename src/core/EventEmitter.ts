/**
 * 事件发射器
 */

import type { EventHandler } from '../types';

/**
 * 事件监听器
 */
interface EventListener {
  handler: EventHandler;
  once?: boolean;
}

/**
 * 事件发射器类
 */
export class EventEmitter {
  private events: Map<string, EventListener[]> = new Map();

  /**
   * 监听事件
   */
  on(event: string, handler: EventHandler, once = false): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event)!.push({ handler, once });
  }

  /**
   * 监听一次事件
   */
  once(event: string, handler: EventHandler): void {
    this.on(event, handler, true);
  }

  /**
   * 取消监听事件
   */
  off(event: string, handler?: EventHandler): void {
    if (!this.events.has(event)) return;

    if (!handler) {
      this.events.delete(event);
      return;
    }

    const listeners = this.events.get(event)!;
    const index = listeners.findIndex(listener => listener.handler === handler);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  /**
   * 触发事件
   */
  emit(event: string, ...args: any[]): void {
    if (!this.events.has(event)) return;

    const listeners = this.events.get(event)!.slice();

    for (const listener of listeners) {
      try {
        listener.handler(...args);

        if (listener.once) {
          this.off(event, listener.handler);
        }
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    }
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.length || 0;
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

