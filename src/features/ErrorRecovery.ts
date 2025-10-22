/**
 * 错误恢复系统
 * 自动处理播放错误并尝试恢复
 */

import type { IVideoPlayer } from '../types';
import { EventEmitter } from '../core/EventEmitter';

export interface RetryStrategy {
  /** 最大重试次数 */
  maxRetries: number;

  /** 重试延迟（毫秒） */
  retryDelay: number;

  /** 延迟递增 */
  backoffMultiplier?: number;

  /** 最大延迟（毫秒） */
  maxDelay?: number;
}

export interface RecoveryOptions {
  /** 是否启用自动恢复 */
  enabled: boolean;

  /** 重试策略 */
  strategy: RetryStrategy;

  /** 降级策略 */
  fallbackQuality?: boolean;

  /** 日志记录 */
  logging?: boolean;
}

export class ErrorRecovery extends EventEmitter {
  private player: IVideoPlayer;
  private options: RecoveryOptions;
  private retryCount = 0;
  private lastError?: Error;
  private recoveryTimer?: number;
  private errorLog: Array<{ time: Date; error: Error; recovered: boolean }> = [];

  constructor(player: IVideoPlayer, options: Partial<RecoveryOptions> = {}) {
    super();

    this.player = player;
    this.options = {
      enabled: true,
      strategy: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        maxDelay: 10000,
      },
      fallbackQuality: true,
      logging: true,
      ...options,
    };

    if (this.options.enabled) {
      this.enable();
    }
  }

  /**
   * 启用自动恢复
   */
  enable(): void {
    this.options.enabled = true;
    this.bindEvents();
    this.emit('enabled');
  }

  /**
   * 禁用自动恢复
   */
  disable(): void {
    this.options.enabled = false;
    this.unbindEvents();
    this.emit('disabled');
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    this.player.on('error', this.handleError.bind(this));
  }

  /**
   * 解绑事件
   */
  private unbindEvents(): void {
    this.player.off('error', this.handleError.bind(this));
  }

  /**
   * 处理错误
   */
  private async handleError(error: Error): Promise<void> {
    if (!this.options.enabled) return;

    this.lastError = error;
    this.logError(error);

    this.emit('errorDetected', error);

    // 清除之前的定时器
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }

    // 检查是否可以重试
    if (this.retryCount >= this.options.strategy.maxRetries) {
      this.emit('maxRetriesReached', error);
      this.handleFallback();
      return;
    }

    // 计算延迟
    const delay = this.calculateDelay();

    this.emit('retryScheduled', this.retryCount + 1, delay);

    // 延迟重试
    this.recoveryTimer = window.setTimeout(async () => {
      await this.attemptRecovery();
    }, delay);
  }

  /**
   * 尝试恢复
   */
  private async attemptRecovery(): Promise<void> {
    this.retryCount++;
    this.emit('retryAttempt', this.retryCount);

    try {
      // 保存当前播放位置
      const currentTime = this.player.state.currentTime;
      const wasPlaying = this.player.state.playState === 'playing';

      // 重新加载视频
      this.player.reload();

      // 等待加载完成
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Recovery timeout'));
        }, 10000);

        const onLoaded = () => {
          clearTimeout(timeout);
          this.player.off('loadedmetadata', onLoaded);
          resolve();
        };

        this.player.on('loadedmetadata', onLoaded);
      });

      // 恢复播放位置
      if (currentTime > 0) {
        this.player.seek(currentTime);
      }

      // 恢复播放状态
      if (wasPlaying) {
        await this.player.play();
      }

      // 恢复成功
      this.onRecoverySuccess();

    } catch (error) {
      this.emit('retryFailed', this.retryCount, error);

      // 继续重试
      if (this.retryCount < this.options.strategy.maxRetries) {
        await this.handleError(error as Error);
      } else {
        this.handleFallback();
      }
    }
  }

  /**
   * 恢复成功
   */
  private onRecoverySuccess(): void {
    if (this.lastError) {
      this.errorLog[this.errorLog.length - 1].recovered = true;
    }

    this.emit('recoverySuccess', this.retryCount);
    this.retryCount = 0;
    this.lastError = undefined;
  }

  /**
   * 计算延迟
   */
  private calculateDelay(): number {
    const { retryDelay, backoffMultiplier = 1, maxDelay = Infinity } =
      this.options.strategy;

    const delay = retryDelay * Math.pow(backoffMultiplier, this.retryCount);
    return Math.min(delay, maxDelay);
  }

  /**
   * 处理降级
   */
  private handleFallback(): void {
    if (this.options.fallbackQuality) {
      this.emit('fallbackTriggered');

      // 尝试切换到更低画质
      // 这里需要与 QualityManager 集成
      this.emit('fallbackAttempt');
    }

    this.emit('recoveryFailed', this.lastError);
  }

  /**
   * 记录错误
   */
  private logError(error: Error): void {
    if (this.options.logging) {
      this.errorLog.push({
        time: new Date(),
        error,
        recovered: false,
      });

      // 最多保留 100 条记录
      if (this.errorLog.length > 100) {
        this.errorLog.shift();
      }
    }
  }

  /**
   * 设置重试策略
   */
  setStrategy(strategy: Partial<RetryStrategy>): void {
    this.options.strategy = {
      ...this.options.strategy,
      ...strategy,
    };
    this.emit('strategyChanged', this.options.strategy);
  }

  /**
   * 获取错误日志
   */
  getErrorLog(): ReadonlyArray<{ time: Date; error: Error; recovered: boolean }> {
    return [...this.errorLog];
  }

  /**
   * 获取恢复统计
   */
  getStats(): {
    totalErrors: number;
    recoveredErrors: number;
    failedErrors: number;
    successRate: number;
  } {
    const totalErrors = this.errorLog.length;
    const recoveredErrors = this.errorLog.filter(log => log.recovered).length;
    const failedErrors = totalErrors - recoveredErrors;
    const successRate = totalErrors > 0 ? (recoveredErrors / totalErrors) * 100 : 0;

    return {
      totalErrors,
      recoveredErrors,
      failedErrors,
      successRate,
    };
  }

  /**
   * 重置统计
   */
  reset(): void {
    this.retryCount = 0;
    this.lastError = undefined;
    this.errorLog = [];

    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
      this.recoveryTimer = undefined;
    }

    this.emit('reset');
  }
}

