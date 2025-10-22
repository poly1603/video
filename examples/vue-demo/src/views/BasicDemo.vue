<template>
  <div class="demo-page">
    <h2>基础播放示例</h2>
    <p class="description">展示视频播放器的基础功能：播放/暂停、进度控制、音量调节、全屏等</p>
    
    <div class="player-wrapper">
      <VideoPlayer
        ref="playerRef"
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        type="hls"
        :width="'100%'"
        :height="600"
        :controls="true"
        :autoplay="false"
        theme="default"
        poster="https://via.placeholder.com/1280x720/667eea/ffffff?text=Video+Player"
        @ready="onReady"
        @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeUpdate"
        @volumechange="onVolumeChange"
        @fullscreenchange="onFullscreenChange"
      >
        <template #loading>
          <div class="custom-loading">
            <div class="spinner"></div>
            <p>视频加载中...</p>
          </div>
        </template>
      </VideoPlayer>
    </div>
    
    <div class="controls-panel">
      <h3>外部控制</h3>
      <div class="button-group">
        <button @click="play" class="btn btn-primary">播放</button>
        <button @click="pause" class="btn btn-secondary">暂停</button>
        <button @click="seek(30)" class="btn btn-info">跳转到 30秒</button>
        <button @click="setVolume(0.5)" class="btn btn-warning">音量 50%</button>
        <button @click="screenshot" class="btn btn-success">截图</button>
        <button @click="toggleFullscreen" class="btn btn-danger">全屏</button>
      </div>
    </div>
    
    <div class="info-panel">
      <h3>播放信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>当前时间:</label>
          <span>{{ formatTime(currentTime) }}</span>
        </div>
        <div class="info-item">
          <label>总时长:</label>
          <span>{{ formatTime(duration) }}</span>
        </div>
        <div class="info-item">
          <label>音量:</label>
          <span>{{ (volume * 100).toFixed(0) }}%</span>
        </div>
        <div class="info-item">
          <label>静音:</label>
          <span>{{ muted ? '是' : '否' }}</span>
        </div>
        <div class="info-item">
          <label>全屏:</label>
          <span>{{ fullscreen ? '是' : '否' }}</span>
        </div>
        <div class="info-item">
          <label>状态:</label>
          <span class="status" :class="isPlaying ? 'playing' : 'paused'">
            {{ isPlaying ? '播放中' : '已暂停' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VideoPlayer } from '@ldesign/video/vue';

const playerRef = ref();
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const muted = ref(false);
const fullscreen = ref(false);
const isPlaying = ref(false);

const onReady = (player: any) => {
  console.log('播放器准备就绪', player);
};

const onPlay = () => {
  console.log('开始播放');
  isPlaying.value = true;
};

const onPause = () => {
  console.log('暂停播放');
  isPlaying.value = false;
};

const onTimeUpdate = (time: number) => {
  currentTime.value = time;
};

const onVolumeChange = (vol: number, mut: boolean) => {
  volume.value = vol;
  muted.value = mut;
};

const onFullscreenChange = (fs: boolean) => {
  fullscreen.value = fs;
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

const setVolume = (vol: number) => {
  playerRef.value?.setVolume(vol);
};

const screenshot = () => {
  const dataUrl = playerRef.value?.screenshot();
  if (dataUrl) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `screenshot-${Date.now()}.png`;
    link.click();
  }
};

const toggleFullscreen = () => {
  playerRef.value?.requestFullscreen();
};

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};
</script>

<style scoped lang="scss">
.demo-page {
  h2 {
    margin: 0 0 10px;
    font-size: 32px;
    color: #333;
  }
  
  .description {
    color: #666;
    margin-bottom: 30px;
    font-size: 16px;
  }
  
  .player-wrapper {
    margin-bottom: 30px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .custom-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .controls-panel,
  .info-panel {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    
    h3 {
      margin: 0 0 20px;
      font-size: 20px;
      color: #333;
    }
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    &.btn-primary {
      background: #409eff;
      color: white;
    }
    
    &.btn-secondary {
      background: #909399;
      color: white;
    }
    
    &.btn-info {
      background: #17a2b8;
      color: white;
    }
    
    &.btn-warning {
      background: #e6a23c;
      color: white;
    }
    
    &.btn-success {
      background: #67c23a;
      color: white;
    }
    
    &.btn-danger {
      background: #f56c6c;
      color: white;
    }
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    
    .info-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 6px;
      
      label {
        font-weight: 500;
        margin-right: 10px;
        color: #666;
      }
      
      span {
        color: #333;
        
        &.status {
          font-weight: 500;
          
          &.playing {
            color: #67c23a;
          }
          
          &.paused {
            color: #909399;
          }
        }
      }
    }
  }
}
</style>

