<template>
  <div
    ref="playerRef"
    :class="['ldesign-video-player-vue', { 'is-loading': isLoading }, customClass]"
    :style="containerStyle"
  >
    <slot v-if="isLoading" name="loading">
      <div class="video-loading">加载中...</div>
    </slot>
    <slot v-else-if="error" name="error" :error="error">
      <div class="video-error">{{ error.message }}</div>
    </slot>
    <slot name="overlay"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, shallowRef } from 'vue';
import { VideoPlayer as VideoPlayerCore } from '../../../core/VideoPlayer';
import type { VideoPlayerConfig } from '../../../types';

// Props
interface Props {
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
  customClass?: string;
  danmaku?: any;
  subtitle?: any;
  quality?: any;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'video',
  autoplay: false,
  loop: false,
  muted: false,
  volume: 1,
  playbackRate: 1,
  controls: true,
  theme: 'default',
});

// Emits
const emit = defineEmits<{
  ready: [player: VideoPlayerCore];
  play: [];
  pause: [];
  ended: [];
  timeupdate: [time: number];
  volumechange: [volume: number, muted: boolean];
  fullscreenchange: [fullscreen: boolean];
  error: [error: Error];
}>();

// State
const playerRef = ref<HTMLDivElement>();
const playerInstance = shallowRef<VideoPlayerCore>();
const isLoading = ref(true);
const error = ref<Error | null>(null);

// Computed
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height || '400px',
}));

const playerConfig = computed<VideoPlayerConfig>(() => ({
  src: props.src,
  type: props.type,
  poster: props.poster,
  autoplay: props.autoplay,
  loop: props.loop,
  muted: props.muted,
  volume: props.volume,
  playbackRate: props.playbackRate,
  controls: props.controls,
  theme: props.theme,
  danmaku: props.danmaku,
  subtitle: props.subtitle,
  quality: props.quality,
}));

// Methods
const initPlayer = () => {
  if (!playerRef.value) return;
  
  try {
    isLoading.value = true;
    error.value = null;
    
    // 销毁旧实例
    if (playerInstance.value) {
      playerInstance.value.destroy();
    }
    
    // 创建新实例
    playerInstance.value = new VideoPlayerCore(
      playerRef.value,
      playerConfig.value
    );
    
    // 绑定事件
    bindEvents();
    
    isLoading.value = false;
    emit('ready', playerInstance.value);
  } catch (err) {
    error.value = err as Error;
    isLoading.value = false;
    emit('error', err as Error);
  }
};

const bindEvents = () => {
  if (!playerInstance.value) return;
  
  playerInstance.value.on('play', () => emit('play'));
  playerInstance.value.on('pause', () => emit('pause'));
  playerInstance.value.on('ended', () => emit('ended'));
  playerInstance.value.on('timeupdate', (time) => emit('timeupdate', time));
  playerInstance.value.on('volumechange', (volume, muted) => 
    emit('volumechange', volume, muted)
  );
  playerInstance.value.on('fullscreenchange', (fullscreen) => 
    emit('fullscreenchange', fullscreen)
  );
  playerInstance.value.on('error', (err) => emit('error', err));
};

// Watch
watch(() => props.src, () => {
  initPlayer();
});

watch(() => props.volume, (newVolume) => {
  playerInstance.value?.setVolume(newVolume);
});

watch(() => props.muted, (newMuted) => {
  playerInstance.value?.setMuted(newMuted);
});

watch(() => props.playbackRate, (newRate) => {
  playerInstance.value?.setPlaybackRate(newRate);
});

// Lifecycle
onMounted(() => {
  initPlayer();
});

onUnmounted(() => {
  playerInstance.value?.destroy();
});

// Expose
defineExpose({
  player: playerInstance,
  play: () => playerInstance.value?.play(),
  pause: () => playerInstance.value?.pause(),
  toggle: () => playerInstance.value?.toggle(),
  seek: (time: number) => playerInstance.value?.seek(time),
  setVolume: (volume: number) => playerInstance.value?.setVolume(volume),
  setMuted: (muted: boolean) => playerInstance.value?.setMuted(muted),
  setPlaybackRate: (rate: number) => playerInstance.value?.setPlaybackRate(rate),
  requestFullscreen: () => playerInstance.value?.requestFullscreen(),
  exitFullscreen: () => playerInstance.value?.exitFullscreen(),
  screenshot: () => playerInstance.value?.screenshot(),
  reload: () => playerInstance.value?.reload(),
});
</script>

<style scoped>
.ldesign-video-player-vue {
  position: relative;
  width: 100%;
  min-height: 200px;
  background: #000;
}

.video-loading,
.video-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 16px;
}

.video-error {
  color: #f56c6c;
}
</style>

