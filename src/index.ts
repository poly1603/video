/**
 * @ldesign/video - 企业级视频播放器
 * @author ldesign
 * @license MIT
 */

// 核心类
export { VideoPlayer } from './core/VideoPlayer';
export { EventEmitter } from './core/EventEmitter';
export { StateManager } from './core/StateManager';
export { playerManager } from './core/PlayerManager';

// UI 组件
export { Controls } from './ui/Controls';

// 功能模块
export { StreamLoader } from './features/StreamLoader';
export { SubtitleParser } from './features/SubtitleParser';
export { DanmakuEngine } from './features/DanmakuEngine';
export { PlaylistManager } from './features/PlaylistManager';
export { QualityAnalyzer } from './features/QualityAnalyzer';
export { PreloadManager } from './features/PreloadManager';
export { ErrorRecovery } from './features/ErrorRecovery';
export { Analytics } from './features/Analytics';
export { Hotkeys } from './features/Hotkeys';
export { Gestures } from './features/Gestures';

// 工具函数
export * from './utils/helpers';

// 类型定义
export * from './types';

// 默认导出
export { VideoPlayer as default } from './core/VideoPlayer';
