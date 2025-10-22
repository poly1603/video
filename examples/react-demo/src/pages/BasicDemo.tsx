import React, { useRef, useState } from 'react';
import { VideoPlayer, type VideoPlayerRef } from '@ldesign/video/react';
import './BasicDemo.css';

function BasicDemo() {
  const playerRef = useRef<VideoPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="demo-page">
      <h2>基础播放示例</h2>
      <p className="description">展示视频播放器的基础功能</p>

      <div className="player-wrapper">
        <VideoPlayer
          ref={playerRef}
          src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
          type="hls"
          width="100%"
          height={600}
          controls={true}
          autoplay={false}
          theme="default"
          onReady={(player) => console.log('播放器就绪', player)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(time) => setCurrentTime(time)}
          onVolumeChange={(vol, mut) => {
            setVolume(vol * 100);
            setIsMuted(mut);
          }}
          onFullscreenChange={(fs) => setIsFullscreen(fs)}
        />
      </div>

      <div className="controls-panel">
        <h3>外部控制</h3>
        <div className="button-group">
          <button onClick={() => playerRef.current?.play()} className="btn btn-primary">
            播放
          </button>
          <button onClick={() => playerRef.current?.pause()} className="btn btn-secondary">
            暂停
          </button>
          <button onClick={() => playerRef.current?.seek(30)} className="btn btn-info">
            跳转到 30秒
          </button>
          <button onClick={() => playerRef.current?.setVolume(0.5)} className="btn btn-warning">
            音量 50%
          </button>
          <button onClick={() => {
            const dataUrl = playerRef.current?.screenshot();
            if (dataUrl) {
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = `screenshot-${Date.now()}.png`;
              link.click();
            }
          }} className="btn btn-success">
            截图
          </button>
          <button onClick={() => playerRef.current?.requestFullscreen()} className="btn btn-danger">
            全屏
          </button>
        </div>
      </div>

      <div className="info-panel">
        <h3>播放信息</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>当前时间:</label>
            <span>{formatTime(currentTime)}</span>
          </div>
          <div className="info-item">
            <label>总时长:</label>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="info-item">
            <label>音量:</label>
            <span>{volume.toFixed(0)}%</span>
          </div>
          <div className="info-item">
            <label>静音:</label>
            <span>{isMuted ? '是' : '否'}</span>
          </div>
          <div className="info-item">
            <label>全屏:</label>
            <span>{isFullscreen ? '是' : '否'}</span>
          </div>
          <div className="info-item">
            <label>状态:</label>
            <span className={`status ${isPlaying ? 'playing' : 'paused'}`}>
              {isPlaying ? '播放中' : '已暂停'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicDemo;

