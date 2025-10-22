/**
 * 弹幕类型定义
 */

/**
 * 弹幕类型
 */
export enum DanmakuType {
  /** 滚动弹幕 */
  SCROLL = 'scroll',
  /** 顶部弹幕 */
  TOP = 'top',
  /** 底部弹幕 */
  BOTTOM = 'bottom',
}

/**
 * 弹幕模式
 */
export enum DanmakuMode {
  /** 无限制 */
  UNLIMITED = 'unlimited',
  /** 限制数量 */
  LIMITED = 'limited',
  /** 防重叠 */
  NO_OVERLAP = 'no-overlap',
}

/**
 * 弹幕数据
 */
export interface Danmaku {
  /** 弹幕 ID */
  id?: string;

  /** 弹幕文本 */
  text: string;

  /** 弹幕类型 */
  type?: DanmakuType;

  /** 弹幕颜色 */
  color?: string;

  /** 出现时间(秒) */
  time: number;

  /** 弹幕大小 */
  size?: number;

  /** 弹幕作者 */
  author?: string;

  /** 创建时间戳 */
  timestamp?: number;
}

/**
 * 弹幕配置
 */
export interface DanmakuConfig {
  /** 是否启用弹幕 */
  enable?: boolean;

  /** 弹幕数据源 */
  source?: string | Danmaku[];

  /** 弹幕透明度 (0-1) */
  opacity?: number;

  /** 弹幕速度 */
  speed?: number;

  /** 字体大小 */
  fontSize?: number;

  /** 弹幕模式 */
  mode?: DanmakuMode;

  /** 最大弹幕数量 */
  maxCount?: number;

  /** 同屏最大弹幕数 */
  maxOnScreen?: number;

  /** 弹幕过滤 */
  filter?: DanmakuFilter;

  /** 弹幕发送回调 */
  onSend?: (danmaku: Danmaku) => Promise<void>;

  /** 弹幕加载回调 */
  onLoad?: () => Promise<Danmaku[]>;
}

/**
 * 弹幕过滤配置
 */
export interface DanmakuFilter {
  /** 过滤类型 */
  types?: DanmakuType[];

  /** 过滤关键词 */
  keywords?: string[];

  /** 过滤用户 */
  users?: string[];

  /** 自定义过滤函数 */
  custom?: (danmaku: Danmaku) => boolean;
}

/**
 * 弹幕渲染项（内部使用）
 */
export interface DanmakuItem extends Danmaku {
  /** 渲染 ID */
  renderId: string;

  /** X 坐标 */
  x: number;

  /** Y 坐标 */
  y: number;

  /** 宽度 */
  width: number;

  /** 高度 */
  height: number;

  /** 速度 */
  speed: number;

  /** 是否存活 */
  alive: boolean;
}

/**
 * 弹幕轨道（内部使用）
 */
export interface DanmakuTrack {
  /** 轨道索引 */
  index: number;

  /** Y 坐标 */
  y: number;

  /** 当前弹幕 */
  items: DanmakuItem[];

  /** 是否可用 */
  available: boolean;
}

