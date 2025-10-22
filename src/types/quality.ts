/**
 * 画质类型定义
 */

/**
 * 视频源
 */
export interface VideoSource {
  /** 视频 URL */
  url: string;

  /** 画质标识 */
  quality: string;

  /** 画质标签 */
  label?: string;

  /** 视频类型 */
  type?: string;

  /** 是否默认 */
  default?: boolean;
}

/**
 * 画质配置
 */
export interface QualityConfig {
  /** 可用画质列表 */
  sources?: VideoSource[];

  /** 默认画质 */
  default?: string;

  /** 是否自动切换画质 */
  auto?: boolean;

  /** 是否记住用户选择 */
  remember?: boolean;
}

/**
 * 画质切换选项
 */
export interface QualitySwitchOptions {
  /** 是否保持播放位置 */
  keepPlaybackPosition?: boolean;

  /** 是否自动播放 */
  autoplay?: boolean;

  /** 切换回调 */
  onSwitch?: (quality: string) => void;
}

