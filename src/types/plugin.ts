/**
 * 插件类型定义
 */

import type { IVideoPlayer } from './player';

/**
 * 插件配置
 */
export interface PluginConfig {
  /** 插件名称 */
  name: string;

  /** 插件选项 */
  options?: Record<string, any>;
}

/**
 * 插件接口
 */
export interface IPlugin {
  /** 插件名称 */
  readonly name: string;

  /** 插件版本 */
  readonly version?: string;

  /** 插件描述 */
  readonly description?: string;

  /** 安装插件 */
  install(player: IVideoPlayer, options?: Record<string, any>): void;

  /** 卸载插件 */
  uninstall?(): void;

  /** 插件初始化 */
  init?(): void;

  /** 插件销毁 */
  destroy?(): void;
}

/**
 * 插件构造函数
 */
export type PluginConstructor = new (
  player: IVideoPlayer,
  options?: Record<string, any>
) => IPlugin;

/**
 * 插件注册信息
 */
export interface PluginRegistration {
  /** 插件名称 */
  name: string;

  /** 插件构造函数 */
  Plugin: PluginConstructor;

  /** 默认选项 */
  defaultOptions?: Record<string, any>;
}

