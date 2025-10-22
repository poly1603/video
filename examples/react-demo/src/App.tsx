import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// 懒加载页面
const Home = React.lazy(() => import('./pages/Home'));
const BasicDemo = React.lazy(() => import('./pages/BasicDemo'));
const HLSDemo = React.lazy(() => import('./pages/HLSDemo'));
const PlaylistDemo = React.lazy(() => import('./pages/PlaylistDemo'));
const AnalyticsDemo = React.lazy(() => import('./pages/AnalyticsDemo'));

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>@ldesign/video React 示例</h1>
        <nav className="nav">
          <Link to="/">首页</Link>
          <Link to="/basic">基础播放</Link>
          <Link to="/hls">HLS 流媒体</Link>
          <Link to="/playlist">播放列表</Link>
          <Link to="/analytics">数据分析</Link>
        </nav>
      </header>

      <main className="app-main">
        <React.Suspense fallback={<div className="loading">加载中...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/basic" element={<BasicDemo />} />
            <Route path="/hls" element={<HLSDemo />} />
            <Route path="/playlist" element={<PlaylistDemo />} />
            <Route path="/analytics" element={<AnalyticsDemo />} />
          </Routes>
        </React.Suspense>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 @ldesign/video - 企业级视频播放器</p>
      </footer>
    </div>
  );
}

export default App;
