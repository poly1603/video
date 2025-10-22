<template>
  <div class="demo-page">
    <h2>弹幕系统示例</h2>
    <p class="description">Canvas 高性能弹幕渲染，支持多种弹幕模式和过滤</p>
    
    <div class="player-wrapper">
      <VideoPlayer
        ref="playerRef"
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        type="hls"
        :width="'100%'"
        :height="600"
        :controls="true"
        :danmaku="danmakuConfig"
        @ready="onReady"
      />
    </div>
    
    <div class="controls-panel">
      <h3>弹幕控制</h3>
      
      <div class="send-danmaku">
        <input
          v-model="danmakuText"
          type="text"
          placeholder="输入弹幕内容..."
          @keyup.enter="sendDanmaku"
          class="danmaku-input"
        />
        <input
          v-model="danmakuColor"
          type="color"
          class="color-picker"
        />
        <select v-model="danmakuType" class="type-select">
          <option value="scroll">滚动</option>
          <option value="top">顶部</option>
          <option value="bottom">底部</option>
        </select>
        <button @click="sendDanmaku" class="btn btn-primary">发送</button>
      </div>
      
      <div class="danmaku-settings">
        <div class="setting-item">
          <label>弹幕透明度:</label>
          <input
            v-model.number="danmakuConfig.opacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            class="slider"
          />
          <span>{{ (danmakuConfig.opacity * 100).toFixed(0) }}%</span>
        </div>
        
        <div class="setting-item">
          <label>弹幕速度:</label>
          <input
            v-model.number="danmakuConfig.speed"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            class="slider"
          />
          <span>{{ danmakuConfig.speed.toFixed(1) }}x</span>
        </div>
        
        <div class="setting-item">
          <label>字体大小:</label>
          <input
            v-model.number="danmakuConfig.fontSize"
            type="range"
            min="16"
            max="48"
            step="2"
            class="slider"
          />
          <span>{{ danmakuConfig.fontSize }}px</span>
        </div>
      </div>
    </div>
    
    <div class="info-panel">
      <h3>弹幕统计</h3>
      <p>已发送弹幕: {{ sentCount }} 条</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { VideoPlayer } from '@ldesign/video/vue';

const playerRef = ref();
const danmakuText = ref('');
const danmakuColor = ref('#ffffff');
const danmakuType = ref<'scroll' | 'top' | 'bottom'>('scroll');
const sentCount = ref(0);

const danmakuConfig = reactive({
  enable: true,
  opacity: 0.8,
  speed: 1,
  fontSize: 24,
  maxOnScreen: 50,
});

const onReady = (player: any) => {
  console.log('弹幕播放器就绪', player);
  
  // 添加一些示例弹幕
  setTimeout(() => {
    player.sendDanmaku('欢迎使用 @ldesign/video!');
  }, 2000);
  
  setTimeout(() => {
    player.sendDanmaku('这是一个高性能的弹幕系统 🚀', { color: '#409eff' });
  }, 4000);
};

const sendDanmaku = () => {
  if (!danmakuText.value.trim()) return;
  
  playerRef.value?.player?.sendDanmaku(danmakuText.value, {
    color: danmakuColor.value,
    type: danmakuType.value,
  });
  
  sentCount.value++;
  danmakuText.value = '';
};
</script>

<style scoped lang="scss">
.send-danmaku {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
  .danmaku-input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #409eff;
    }
  }
  
  .color-picker {
    width: 50px;
    height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .type-select {
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
  }
}

.danmaku-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  .setting-item {
    display: flex;
    align-items: center;
    gap: 10px;
    
    label {
      min-width: 100px;
      font-size: 14px;
      color: #666;
    }
    
    .slider {
      flex: 1;
      max-width: 300px;
    }
    
    span {
      min-width: 60px;
      font-weight: 500;
    }
  }
}
</style>

