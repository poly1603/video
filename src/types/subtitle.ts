/**
 * 字幕类型定义
 */

/**
 * 字幕格式
 */
export type SubtitleFormat = 'srt' | 'vtt' | 'ass';

/**
 * 字幕轨道
 */
export interface SubtitleTrack {
  /** 字幕 ID */
  id: string;

  /** 字幕 URL */
  url: string;

  /** 字幕语言 */
  lang: string;

  /** 字幕标签 */
  label: string;

  /** 字幕格式 */
  format?: SubtitleFormat;

  /** 是否默认 */
  default?: boolean;
}

/**
 * 字幕配置
 */
export interface SubtitleConfig {
  /** 字幕轨道列表 */
  tracks?: SubtitleTrack[];

  /** 默认字幕 */
  default?: string;

  /** 字幕样式 */
  style?: SubtitleStyle;
}

/**
 * 字幕样式
 */
export interface SubtitleStyle {
  /** 字体大小 */
  fontSize?: number;

  /** 字体颜色 */
  color?: string;

  /** 背景颜色 */
  backgroundColor?: string;

  /** 字体粗细 */
  fontWeight?: string | number;

  /** 文本阴影 */
  textShadow?: string;

  /** 底部边距 */
  bottom?: number;
}

/**
 * 字幕条目
 */
export interface SubtitleCue {
  /** 开始时间(秒) */
  startTime: number;

  /** 结束时间(秒) */
  endTime: number;

  /** 字幕文本 */
  text: string;

  /** 额外样式 */
  style?: Partial<SubtitleStyle>;
}

/**
 * 解析后的字幕数据
 */
export interface ParsedSubtitle {
  /** 字幕格式 */
  format: SubtitleFormat;

  /** 字幕条目列表 */
  cues: SubtitleCue[];

  /** 元数据 */
  metadata?: Record<string, any>;
}

