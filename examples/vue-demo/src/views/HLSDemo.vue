<template>
  <div class="demo-page">
    <h2>HLS 流媒体示例</h2>
    <p class="description">展示 HLS 自适应流媒体播放，支持多画质切换</p>
    
    <div class="player-wrapper">
      <VideoPlayer
        ref="playerRef"
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        type="hls"
        :width="'100%'"
        :height="600"
        :controls="true"
        :quality="{
          default: '720p',
          auto: true,
        }"
        @ready="onReady"
        @qualitychange="onQualityChange"
      />
    </div>
    
    <div class="controls-panel">
      <h3>画质控制</h3>
      <div class="quality-buttons">
        <button 
          v-for="quality in qualities" 
          :key="quality"
          @click="setQuality(quality)"
          class="btn"
          :class="{ active: currentQuality === quality }"
        >
          {{ quality }}
        </button>
      </div>
      
      <div class="quality-info">
        <p><strong>当前画质:</strong> {{ currentQuality }}</p>
        <p><strong>自动切换:</strong> {{ autoQuality ? '开启' : '关闭' }}</p>
      </div>
    </div>
    
    <div class="info-panel">
      <h3>质量分析</h3>
      <div class="metrics-grid">
        <div class="metric-item">
          <label>丢帧率:</label>
          <span class="metric-value">{{ metrics.droppedFrameRate.toFixed(2) }}%</span>
        </div>
        <div class="metric-item">
          <label>缓冲健康度:</label>
          <span class="metric-value health" :class="getHealthClass(metrics.bufferHealth)">
            {{ metrics.bufferHealth.toFixed(0) }}%
          </span>
        </div>
        <div class="metric-item">
          <label>卡顿次数:</label>
          <span class="metric-value">{{ metrics.stallCount }}</span>
        </div>
        <div class="metric-item">
          <label>比特率:</label>
          <span class="metric-value">{{ formatBitrate(metrics.bitrate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { VideoPlayer } from '@ldesign/video/vue';
import { QualityAnalyzer } from '@ldesign/video';

const playerRef = ref();
const currentQuality = ref('Auto');
const autoQuality = ref(true);
const qualities = ref(['Auto', '1080p', '720p', '480p', '360p']);
const metrics = ref({
  droppedFrameRate: 0,
  bufferHealth: 100,
  stallCount: 0,
  bitrate: 0,
});

let analyzer: QualityAnalyzer;
let metricsInterval: number;

const onReady = (player: any) => {
  console.log('HLS 播放器就绪', player);
  
  // 初始化质量分析器
  analyzer = new QualityAnalyzer(player);
  
  // 定期更新指标
  metricsInterval = window.setInterval(() => {
    metrics.value = analyzer.getMetrics();
  }, 1000);
};

const onQualityChange = (quality: string) => {
  currentQuality.value = quality;
};

const setQuality = (quality: string) => {
  playerRef.value?.player?.setQuality(quality);
};

const formatBitrate = (bitrate: number): string => {
  if (bitrate > 1000000) {
    return `${(bitrate / 1000000).toFixed(1)} Mbps`;
  }
  return `${(bitrate / 1000).toFixed(0)} Kbps`;
};

const getHealthClass = (health: number): string => {
  if (health >= 80) return 'good';
  if (health >= 50) return 'medium';
  return 'bad';
};

onUnmounted(() => {
  if (metricsInterval) {
    clearInterval(metricsInterval);
  }
});
</script>

<style scoped lang="scss">
.quality-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  .btn {
    padding: 10px 20px;
    border: 2px solid #409eff;
    background: white;
    color: #409eff;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #ecf5ff;
    }
    
    &.active {
      background: #409eff;
      color: white;
    }
  }
}

.quality-info {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 6px;
  
  p {
    margin: 5px 0;
    font-size: 14px;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  
  .metric-item {
    padding: 15px;
    background: #f5f7fa;
    border-radius: 6px;
    
    label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .metric-value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      
      &.health {
        &.good { color: #67c23a; }
        &.medium { color: #e6a23c; }
        &.bad { color: #f56c6c; }
      }
    }
  }
}
</style>

