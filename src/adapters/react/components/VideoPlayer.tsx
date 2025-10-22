/**
 * React VideoPlayer Component
 */

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { VideoPlayer as VideoPlayerCore } from '../../../core/VideoPlayer';
import type { VideoPlayerConfig } from '../../../types';

export interface VideoPlayerProps {
  src: string | string[];
  type?: 'video' | 'hls' | 'dash';
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRate?: number;
  controls?: boolean;
  width?: number | string;
  height?: number | string;
  theme?: string;
  className?: string;
  style?: React.CSSProperties;
  danmaku?: any;
  subtitle?: any;
  quality?: any;
  onReady?: (player: VideoPlayerCore) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onFullscreenChange?: (fullscreen: boolean) => void;
  onError?: (error: Error) => void;
}

export interface VideoPlayerRef {
  player: VideoPlayerCore | undefined;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  screenshot: () => string;
  reload: () => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>((props, ref) => {
  const {
    src,
    type = 'video',
    poster,
    autoplay = false,
    loop = false,
    muted = false,
    volume = 1,
    playbackRate = 1,
    controls = true,
    width,
    height,
    theme = 'default',
    className,
    style,
    danmaku,
    subtitle,
    quality,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onVolumeChange,
    onFullscreenChange,
    onError,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoPlayerCore>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 初始化播放器
  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // 销毁旧实例
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        const config: VideoPlayerConfig = {
          src,
          type,
          poster,
          autoplay,
          loop,
          muted,
          volume,
          playbackRate,
          controls,
          theme,
          danmaku,
          subtitle,
          quality,
        };

        playerRef.current = new VideoPlayerCore(containerRef.current, config);

        // 绑定事件
        playerRef.current.on('ready', () => {
          setIsLoading(false);
          onReady?.(playerRef.current!);
        });

        playerRef.current.on('play', () => onPlay?.());
        playerRef.current.on('pause', () => onPause?.());
        playerRef.current.on('ended', () => onEnded?.());
        playerRef.current.on('timeupdate', (time) => onTimeUpdate?.(time));
        playerRef.current.on('volumechange', (vol, mut) => onVolumeChange?.(vol, mut));
        playerRef.current.on('fullscreenchange', (fs) => onFullscreenChange?.(fs));
        playerRef.current.on('error', (err) => {
          setError(err);
          onError?.(err);
        });
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
        onError?.(err as Error);
      }
    };

    initPlayer();

    return () => {
      playerRef.current?.destroy();
    };
  }, [src, type]); // 这些变化需要重新初始化

  // 更新音量
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  // 更新静音
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setMuted(muted);
    }
  }, [muted]);

  // 更新播放速率
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(playbackRate);
    }
  }, [playbackRate]);

  // 暴露方法
  useImperativeHandle(ref, () => ({
    player: playerRef.current,
    play: async () => {
      if (playerRef.current) {
        await playerRef.current.play();
      }
    },
    pause: () => {
      playerRef.current?.pause();
    },
    toggle: async () => {
      if (playerRef.current) {
        await playerRef.current.toggle();
      }
    },
    seek: (time: number) => {
      playerRef.current?.seek(time);
    },
    setVolume: (vol: number) => {
      playerRef.current?.setVolume(vol);
    },
    setMuted: (mut: boolean) => {
      playerRef.current?.setMuted(mut);
    },
    setPlaybackRate: (rate: number) => {
      playerRef.current?.setPlaybackRate(rate);
    },
    requestFullscreen: async () => {
      if (playerRef.current) {
        await playerRef.current.requestFullscreen();
      }
    },
    exitFullscreen: async () => {
      if (playerRef.current) {
        await playerRef.current.exitFullscreen();
      }
    },
    screenshot: () => {
      return playerRef.current?.screenshot() || '';
    },
    reload: () => {
      playerRef.current?.reload();
    },
  }));

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height || '400px',
    position: 'relative',
    backgroundColor: '#000',
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={`ldesign-video-player-react ${className || ''} ${isLoading ? 'is-loading' : ''}`}
      style={containerStyle}
    >
      {isLoading && <div className="video-loading">加载中...</div>}
      {error && <div className="video-error">{error.message}</div>}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;

