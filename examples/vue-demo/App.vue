<template>
  <div class="demo">
    <h1>@ldesign/video Vue Demo</h1>
    
    <div class="player-wrapper">
      <VideoPlayer
        ref="playerRef"
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        type="hls"
        :width="800"
        :height="450"
        :controls="true"
        :autoplay="false"
        theme="default"
        @ready="onReady"
        @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeUpdate"
      />
    </div>
    
    <div class="controls">
      <button @click="play">播放</button>
      <button @click="pause">暂停</button>
      <button @click="seek(30)">跳转到30秒</button>
      <button @click="screenshot">截图</button>
      <button @click="toggleFullscreen">全屏</button>
    </div>
    
    <div class="info">
      <p>当前时间: {{ currentTime.toFixed(2) }}s</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VideoPlayer } from '@ldesign/video/vue';

const playerRef = ref();
const currentTime = ref(0);

const onReady = (player: any) => {
  console.log('播放器准备就绪', player);
};

const onPlay = () => {
  console.log('开始播放');
};

const onPause = () => {
  console.log('暂停播放');
};

const onTimeUpdate = (time: number) => {
  currentTime.value = time;
};

const play = () => {
  playerRef.value?.play();
};

const pause = () => {
  playerRef.value?.pause();
};

const seek = (time: number) => {
  playerRef.value?.seek(time);
};

const screenshot = () => {
  const dataUrl = playerRef.value?.screenshot();
  if (dataUrl) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'screenshot.png';
    link.click();
  }
};

const toggleFullscreen = () => {
  playerRef.value?.requestFullscreen();
};
</script>

<style scoped>
.demo {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

.player-wrapper {
  margin-bottom: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.info {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>

