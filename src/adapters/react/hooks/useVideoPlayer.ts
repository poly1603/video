/**
 * React Hook for Video Player
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { VideoPlayer } from '../../../core/VideoPlayer';
import type { VideoPlayerConfig, IVideoPlayer } from '../../../types';

/**
 * 使用视频播放器 Hook
 */
export function useVideoPlayer(
  containerRef: React.RefObject<HTMLElement>,
  config: VideoPlayerConfig
) {
  const playerRef = useRef<IVideoPlayer>();
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const player = new VideoPlayer(containerRef.current, config);
      playerRef.current = player;

      // 绑定事件
      player.on('ready', () => setIsReady(true));
      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));
      player.on('timeupdate', setCurrentTime);
      player.on('durationchange', setDuration);
      player.on('volumechange', (vol, mut) => {
        setVolume(vol);
        setMuted(mut);
      });
      player.on('fullscreenchange', setFullscreen);
      player.on('error', setError);
    } catch (err) {
      setError(err as Error);
    }

    return () => {
      playerRef.current?.destroy();
    };
  }, [containerRef, config]);

  const play = useCallback(async () => {
    await playerRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const toggle = useCallback(async () => {
    await playerRef.current?.toggle();
  }, []);

  const seek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);

  const setVol = useCallback((vol: number) => {
    playerRef.current?.setVolume(vol);
  }, []);

  const setMut = useCallback((mut: boolean) => {
    playerRef.current?.setMuted(mut);
  }, []);

  return {
    player: playerRef.current,
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    fullscreen,
    error,
    play,
    pause,
    toggle,
    seek,
    setVolume: setVol,
    setMuted: setMut,
  };
}

