<template>
  <div class="home">
    <div class="hero">
      <h2>🎬 @ldesign/video 视频播放器</h2>
      <p class="subtitle">企业级视频播放器插件，功能强大，性能卓越</p>
      
      <div class="features">
        <div class="feature-card">
          <div class="icon">📺</div>
          <h3>流媒体支持</h3>
          <p>支持 HLS、DASH 自适应流媒体协议</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">💬</div>
          <h3>弹幕系统</h3>
          <p>Canvas 高性能渲染，流畅无卡顿</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">📝</div>
          <h3>字幕支持</h3>
          <p>支持 SRT、VTT、ASS 多种格式</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">⚡</div>
          <h3>高性能</h3>
          <p>优化渲染，内存占用低</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">🎨</div>
          <h3>现代 UI</h3>
          <p>参考 Plyr 设计，美观易用</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">🔌</div>
          <h3>插件化</h3>
          <p>参考 Video.js 架构，易扩展</p>
        </div>
      </div>
      
      <div class="quick-start">
        <h3>快速开始</h3>
        <pre><code>npm install @ldesign/video

import { VideoPlayer } from '@ldesign/video/vue';
import '@ldesign/video/style.css';

&lt;VideoPlayer 
  src="video.mp4" 
  :controls="true" 
/&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home View
</script>

<style scoped lang="scss">
.home {
  .hero {
    text-align: center;
    
    h2 {
      font-size: 42px;
      margin: 0 0 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 50px;
    }
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin-bottom: 50px;
    
    .feature-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s, box-shadow 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
      }
      
      .icon {
        font-size: 48px;
        margin-bottom: 15px;
      }
      
      h3 {
        margin: 0 0 10px;
        font-size: 20px;
        color: #333;
      }
      
      p {
        margin: 0;
        color: #666;
        font-size: 14px;
        line-height: 1.6;
      }
    }
  }
  
  .quick-start {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 12px;
    text-align: left;
    
    h3 {
      margin: 0 0 20px;
      font-size: 24px;
    }
    
    pre {
      background: #282c34;
      color: #abb2bf;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 0;
      
      code {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.6;
      }
    }
  }
}
</style>

