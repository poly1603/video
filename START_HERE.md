# 🎬 从这里开始 - @ldesign/video

欢迎使用 @ldesign/video 企业级视频播放器！

## 📚 文档导航

### 🚀 快速开始
1. **[快速开始指南](./QUICK_START_GUIDE.md)** - 5 分钟上手，立即使用
2. **[示例项目](./examples/)** - 查看完整的示例代码

### 📖 核心文档
3. **[README](./README.md)** - 项目主文档，功能概览
4. **[API 文档](./docs/API.md)** - 完整的 API 参考
5. **[最佳实践](./docs/BEST_PRACTICES.md)** - 性能优化建议

### 🔄 迁移和升级
6. **[迁移指南](./docs/MIGRATION_GUIDE.md)** - 从其他播放器迁移

### 📊 项目报告
7. **[完成报告](./ULTIMATE_COMPLETION_REPORT.md)** - 完整的项目统计
8. **[更新日志](./CHANGELOG.md)** - 版本更新记录

---

## 🎯 您想做什么？

### 我想快速使用
👉 阅读 [快速开始指南](./QUICK_START_GUIDE.md)

### 我想查看示例
👉 运行示例项目：
```bash
# Vue 示例
cd examples/vue-demo && npm install && npm run dev

# React 示例
cd examples/react-demo && npm install && npm run dev

# Lit 示例
cd examples/lit-demo && npm install && npm run dev
```

### 我想了解所有功能
👉 查看 [README.md](./README.md) 和 [API 文档](./docs/API.md)

### 我想迁移现有项目
👉 查看 [迁移指南](./docs/MIGRATION_GUIDE.md)

### 我想优化性能
👉 查看 [最佳实践](./docs/BEST_PRACTICES.md)

### 我想贡献代码
👉 查看项目结构和测试规范

---

## 🏗️ 项目结构

```
libraries/video/
├── src/                    # 源代码
│   ├── core/              # 核心模块
│   ├── features/          # 功能模块（13个）
│   ├── adapters/          # 框架适配器
│   ├── ui/                # UI 组件
│   ├── styles/            # 样式文件
│   └── types/             # 类型定义
├── examples/              # 示例项目
│   ├── vue-demo/         # Vue 示例
│   ├── react-demo/       # React 示例
│   └── lit-demo/         # Lit 示例
├── tests/                 # 测试文件
├── docs/                  # 文档
└── ldesign.config.ts     # 构建配置
```

---

## 💡 核心功能速览

### 基础播放
```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  controls: true,
});
```

### HLS 流媒体
```typescript
const player = new VideoPlayer('#player', {
  src: 'stream.m3u8',
  type: 'hls',
});
```

### 弹幕系统
```typescript
const player = new VideoPlayer('#player', {
  src: 'video.mp4',
  danmaku: { enable: true },
});
player.sendDanmaku('弹幕内容');
```

### 播放列表
```typescript
import { PlaylistManager } from '@ldesign/video';
const playlist = new PlaylistManager();
playlist.add([...videos]);
playlist.next();
```

### 质量分析
```typescript
import { QualityAnalyzer } from '@ldesign/video';
const analyzer = new QualityAnalyzer(player);
const metrics = analyzer.getMetrics();
```

---

## 🔧 开发和构建

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 运行测试
```bash
npm run test
```

---

## 📞 获取帮助

- 📖 查看 [文档](./docs/)
- 💬 提交 [Issue](https://github.com/ldesign/video/issues)
- 📧 联系作者

---

## ⭐ 开始使用

现在，选择您需要的文档开始吧！

**推荐路径**：
1. [快速开始](./QUICK_START_GUIDE.md) - 了解基础用法
2. [运行示例](./examples/vue-demo/) - 查看实际效果
3. [API 文档](./docs/API.md) - 深入学习
4. [最佳实践](./docs/BEST_PRACTICES.md) - 优化应用

🎉 祝您使用愉快！

