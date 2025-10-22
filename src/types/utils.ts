/**
 * 工具类型定义
 */

/**
 * 时间格式化选项
 */
export interface TimeFormatOptions {
  /** 是否显示小时 */
  showHours?: boolean;

  /** 是否补零 */
  padZero?: boolean;
}

/**
 * 缓冲范围
 */
export interface BufferedRange {
  /** 开始时间 */
  start: number;

  /** 结束时间 */
  end: number;
}

/**
 * 尺寸
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * 位置
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 矩形区域
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 深度可选类型
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 只读深度类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 提取 Promise 类型
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * 函数类型
 */
export type Fn<T = any> = (...args: any[]) => T;

/**
 * 异步函数类型
 */
export type AsyncFn<T = any> = (...args: any[]) => Promise<T>;

/**
 * 可为 null 的类型
 */
export type Nullable<T> = T | null;

/**
 * 可为 undefined 的类型
 */
export type Optional<T> = T | undefined;

/**
 * 可能的值
 */
export type Maybe<T> = T | null | undefined;

