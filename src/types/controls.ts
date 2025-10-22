/**
 * 控制条类型定义
 */

/**
 * 控制条按钮
 */
export type ControlButton =
  | 'play'
  | 'volume'
  | 'time'
  | 'progress'
  | 'settings'
  | 'pip'
  | 'fullscreen'
  | 'danmaku'
  | 'subtitle'
  | 'quality'
  | 'screenshot';

/**
 * 控制条配置
 */
export interface ControlsConfig {
  /** 是否显示控制条 */
  show?: boolean;

  /** 自动隐藏延迟(ms) */
  autoHideDelay?: number;

  /** 控制条按钮 */
  buttons?: ControlButton[];

  /** 自定义按钮 */
  customButtons?: CustomButton[];

  /** 进度条配置 */
  progressBar?: ProgressBarConfig;

  /** 音量配置 */
  volume?: VolumeConfig;
}

/**
 * 自定义按钮
 */
export interface CustomButton {
  /** 按钮 ID */
  id: string;

  /** 按钮图标 */
  icon: string;

  /** 按钮文本 */
  text?: string;

  /** 按钮提示 */
  tooltip?: string;

  /** 按钮位置 */
  position?: 'left' | 'right';

  /** 点击回调 */
  onClick: () => void;
}

/**
 * 进度条配置
 */
export interface ProgressBarConfig {
  /** 是否显示缩略图预览 */
  thumbnails?: boolean;

  /** 缩略图 URL 模板 */
  thumbnailUrl?: string;

  /** 是否显示时间提示 */
  timeTooltip?: boolean;

  /** 是否支持拖拽 */
  seekable?: boolean;
}

/**
 * 音量配置
 */
export interface VolumeConfig {
  /** 是否显示音量滑块 */
  slider?: boolean;

  /** 是否记住音量 */
  remember?: boolean;
}

/**
 * 设置菜单项
 */
export interface SettingsMenuItem {
  /** 菜单 ID */
  id: string;

  /** 菜单标题 */
  label: string;

  /** 菜单图标 */
  icon?: string;

  /** 子菜单 */
  children?: SettingsMenuOption[];

  /** 点击回调 */
  onClick?: () => void;
}

/**
 * 设置菜单选项
 */
export interface SettingsMenuOption {
  /** 选项值 */
  value: string;

  /** 选项标签 */
  label: string;

  /** 是否选中 */
  selected?: boolean;

  /** 点击回调 */
  onClick?: () => void;
}

