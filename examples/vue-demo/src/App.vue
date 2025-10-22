<template>
  <div class="app">
    <header class="app-header">
      <h1>@ldesign/video Vue 示例</h1>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/basic">基础播放</router-link>
        <router-link to="/hls">HLS 流媒体</router-link>
        <router-link to="/danmaku">弹幕系统</router-link>
        <router-link to="/subtitle">字幕功能</router-link>
        <router-link to="/advanced">高级特性</router-link>
      </nav>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>&copy; 2024 @ldesign/video - 企业级视频播放器</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// App 组件
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  h1 {
    margin: 0 0 15px;
    font-size: 28px;
    font-weight: 600;
  }
  
  .nav {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    
    a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.3s;
      font-size: 14px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      &.router-link-active {
        background: rgba(255, 255, 255, 0.3);
        font-weight: 500;
      }
    }
  }
}

.app-main {
  flex: 1;
  padding: 30px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  background: #f5f7fa;
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #e4e7ed;
}
</style>

