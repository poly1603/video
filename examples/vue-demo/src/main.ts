import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import '@ldesign/video/style.css';
import './styles/main.scss';

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/HomeView.vue'),
    },
    {
      path: '/basic',
      name: 'Basic',
      component: () => import('./views/BasicDemo.vue'),
    },
    {
      path: '/hls',
      name: 'HLS',
      component: () => import('./views/HLSDemo.vue'),
    },
    {
      path: '/danmaku',
      name: 'Danmaku',
      component: () => import('./views/DanmakuDemo.vue'),
    },
    {
      path: '/subtitle',
      name: 'Subtitle',
      component: () => import('./views/SubtitleDemo.vue'),
    },
    {
      path: '/advanced',
      name: 'Advanced',
      component: () => import('./views/AdvancedDemo.vue'),
    },
  ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');

