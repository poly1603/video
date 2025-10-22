/**
 * Vue Composable for Video Player
 */

import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import { VideoPlayer } from '../../../core/VideoPlayer';
import type { VideoPlayerConfig, IVideoPlayer } from '../../../types';

/**
 * 使用视频播放器
 */
export function useVideoPlayer(
  containerRef: globalThis.Ref<HTMLElement | undefined>,
  config: VideoPlayerConfig
) {
  const player = shallowRef<IVideoPlayer>();
  const isReady = ref(false);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(1);
  const muted = ref(false);
  const fullscreen = ref(false);
  const error = ref<Error | null>(null);

  const init = () => {
    if (!containerRef.value) return;

    try {
      player.value = new VideoPlayer(containerRef.value, config);

      // 绑定事件
      player.value.on('ready', () => {
        isReady.value = true;
      });

      player.value.on('play', () => {
        isPlaying.value = true;
      });

      player.value.on('pause', () => {
        isPlaying.value = false;
      });

      player.value.on('timeupdate', (time) => {
        currentTime.value = time;
      });

      player.value.on('durationchange', (dur) => {
        duration.value = dur;
      });

      player.value.on('volumechange', (vol, mut) => {
        volume.value = vol;
        muted.value = mut;
      });

      player.value.on('fullscreenchange', (fs) => {
        fullscreen.value = fs;
      });

      player.value.on('error', (err) => {
        error.value = err;
      });
    } catch (err) {
      error.value = err as Error;
    }
  };

  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    player.value?.destroy();
  });

  return {
    player,
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    fullscreen,
    error,
  };
}

