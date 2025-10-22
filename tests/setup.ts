/**
 * Vitest 测试环境设置
 */

import { beforeEach, afterEach, vi } from 'vitest';

// Mock HTMLMediaElement
class MockHTMLVideoElement {
  src = '';
  currentTime = 0;
  duration = 100;
  paused = true;
  volume = 1;
  muted = false;
  playbackRate = 1;
  buffered = {
    length: 0,
    start: () => 0,
    end: () => 0,
  };

  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  load = vi.fn();

  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn();
}

beforeEach(() => {
  // Mock DOM APIs
  global.HTMLVideoElement = MockHTMLVideoElement as any;
});

afterEach(() => {
  vi.clearAllMocks();
});

