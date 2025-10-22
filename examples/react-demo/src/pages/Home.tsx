import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h2>🎬 @ldesign/video 视频播放器</h2>
        <p className="subtitle">企业级视频播放器插件，功能强大，性能卓越</p>

        <div className="features">
          <div className="feature-card">
            <div className="icon">📺</div>
            <h3>流媒体支持</h3>
            <p>支持 HLS、DASH 自适应流媒体协议</p>
          </div>

          <div className="feature-card">
            <div className="icon">💬</div>
            <h3>弹幕系统</h3>
            <p>Canvas 高性能渲染，流畅无卡顿</p>
          </div>

          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>数据分析</h3>
            <p>完整的播放数据统计和分析</p>
          </div>

          <div className="feature-card">
            <div className="icon">🔄</div>
            <h3>错误恢复</h3>
            <p>自动检测并恢复播放错误</p>
          </div>

          <div className="feature-card">
            <div className="icon">⚡</div>
            <h3>高性能</h3>
            <p>优化渲染，内存占用低</p>
          </div>

          <div className="feature-card">
            <div className="icon">🎮</div>
            <h3>快捷键</h3>
            <p>完整的键盘和手势控制</p>
          </div>
        </div>

        <div className="quick-start">
          <h3>快速开始</h3>
          <pre><code>{`npm install @ldesign/video

import { VideoPlayer } from '@ldesign/video/react';
import '@ldesign/video/style.css';

<VideoPlayer 
  src="video.mp4" 
  controls={true} 
/>`}</code></pre>
        </div>
      </div>
    </div>
  );
}

export default Home;

