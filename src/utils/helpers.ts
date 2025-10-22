/**
 * 工具函数
 */

import type { TimeFormatOptions, BufferedRange } from '../types';

/**
 * 生成唯一 ID
 */
let idCounter = 0;
export function generateId(prefix = 'video'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

/**
 * 格式化时间
 */
export function formatTime(seconds: number, options: TimeFormatOptions = {}): string {
  const { showHours = false, padZero = true } = options;

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (num: number) => (padZero ? String(num).padStart(2, '0') : String(num));

  if (showHours || h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

/**
 * 解析时间
 */
export function parseTime(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

/**
 * 限制数值范围
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
      }, delay - (now - lastCall));
    }
  };
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;

  const source = sources.shift();
  if (!source) return target;

  for (const key in source) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      target[key] = deepMerge(
        { ...targetValue },
        sourceValue as any
      );
    } else if (sourceValue !== undefined) {
      target[key] = sourceValue as any;
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * 判断是否为普通对象
 */
export function isPlainObject(value: any): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 获取缓冲范围
 */
export function getBufferedRanges(buffered: TimeRanges): BufferedRange[] {
  const ranges: BufferedRange[] = [];
  for (let i = 0; i < buffered.length; i++) {
    ranges.push({
      start: buffered.start(i),
      end: buffered.end(i),
    });
  }
  return ranges;
}

/**
 * 获取缓冲进度百分比
 */
export function getBufferedPercent(
  buffered: TimeRanges,
  currentTime: number,
  duration: number
): number {
  if (!duration) return 0;

  for (let i = 0; i < buffered.length; i++) {
    if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) {
      return (buffered.end(i) / duration) * 100;
    }
  }
  return 0;
}

/**
 * 判断是否为移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 判断是否支持全屏
 */
export function isFullscreenSupported(): boolean {
  return !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
}

/**
 * 判断是否支持画中画
 */
export function isPictureInPictureSupported(): boolean {
  return 'pictureInPictureEnabled' in document;
}

/**
 * 请求全屏
 */
export async function requestFullscreen(element: HTMLElement): Promise<void> {
  if (element.requestFullscreen) {
    await element.requestFullscreen();
  } else if ((element as any).webkitRequestFullscreen) {
    await (element as any).webkitRequestFullscreen();
  } else if ((element as any).mozRequestFullScreen) {
    await (element as any).mozRequestFullScreen();
  } else if ((element as any).msRequestFullscreen) {
    await (element as any).msRequestFullscreen();
  }
}

/**
 * 退出全屏
 */
export async function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    await (document as any).webkitExitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    await (document as any).mozCancelFullScreen();
  } else if ((document as any).msExitFullscreen) {
    await (document as any).msExitFullscreen();
  }
}

/**
 * 获取全屏元素
 */
export function getFullscreenElement(): Element | null {
  return (
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement ||
    null
  );
}

/**
 * 加载外部脚本
 */
export function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * 创建 DOM 元素
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    className?: string;
    attrs?: Record<string, string>;
    styles?: Partial<CSSStyleDeclaration>;
    children?: (HTMLElement | string)[];
  } = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (options.styles) {
    Object.assign(element.style, options.styles);
  }

  if (options.children) {
    options.children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }

  return element;
}

