/**
 * 工具函数单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  formatTime,
  parseTime,
  clamp,
  deepMerge,
  isPlainObject,
} from '../../src/utils/helpers';

describe('formatTime', () => {
  it('should format seconds to MM:SS', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(125)).toBe('02:05');
  });

  it('should format seconds to HH:MM:SS', () => {
    expect(formatTime(3665, { showHours: true })).toBe('01:01:05');
  });

  it('should handle zero padding', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(5, { padZero: false })).toBe('0:5');
  });
});

describe('parseTime', () => {
  it('should parse time string to seconds', () => {
    expect(parseTime('01:05')).toBe(65);
    expect(parseTime('02:30')).toBe(150);
  });

  it('should parse time with hours', () => {
    expect(parseTime('01:30:00')).toBe(5400);
  });
});

describe('clamp', () => {
  it('should clamp value between min and max', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('deepMerge', () => {
  it('should deep merge objects', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };

    const result = deepMerge(target, source);

    expect(result.a).toBe(1);
    expect(result.b.c).toBe(2);
    expect(result.b.d).toBe(3);
    expect(result.e).toBe(4);
  });
});

describe('isPlainObject', () => {
  it('should identify plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
  });
});

