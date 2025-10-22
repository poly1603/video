/**
 * 弹幕 Web Worker
 * 将弹幕数据处理移到 Worker 线程
 */

export interface WorkerMessage {
  type: 'parse' | 'filter' | 'sort';
  data: any;
}

export interface WorkerResponse {
  type: string;
  data: any;
}

/**
 * 创建弹幕处理 Worker
 */
export function createDanmakuWorker(): Worker {
  const workerCode = `
    self.addEventListener('message', (e) => {
      const { type, data } = e.data;
      
      switch (type) {
        case 'parse':
          const parsed = parseDanmaku(data);
          self.postMessage({ type: 'parsed', data: parsed });
          break;
          
        case 'filter':
          const filtered = filterDanmaku(data.danmakus, data.filter);
          self.postMessage({ type: 'filtered', data: filtered });
          break;
          
        case 'sort':
          const sorted = sortDanmaku(data);
          self.postMessage({ type: 'sorted', data: sorted });
          break;
      }
    });
    
    function parseDanmaku(text) {
      // 解析弹幕数据
      try {
        const lines = text.split('\\n');
        const danmakus = lines.map(line => {
          const parts = line.split(',');
          return {
            time: parseFloat(parts[0]),
            type: parseInt(parts[1]),
            color: parts[2],
            text: parts.slice(3).join(','),
          };
        });
        return danmakus;
      } catch (error) {
        return [];
      }
    }
    
    function filterDanmaku(danmakus, filter) {
      return danmakus.filter(dm => {
        if (filter.keywords) {
          for (const keyword of filter.keywords) {
            if (dm.text.includes(keyword)) return false;
          }
        }
        return true;
      });
    }
    
    function sortDanmaku(danmakus) {
      return danmakus.sort((a, b) => a.time - b.time);
    }
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);

  return new Worker(workerUrl);
}

/**
 * 弹幕 Worker 管理器
 */
export class DanmakuWorkerManager {
  private worker?: Worker;
  private callbacks: Map<string, (data: any) => void> = new Map();

  constructor() {
    this.worker = createDanmakuWorker();
    this.worker.addEventListener('message', this.handleMessage.bind(this));
  }

  /**
   * 处理消息
   */
  private handleMessage(event: MessageEvent<WorkerResponse>): void {
    const { type, data } = event.data;
    const callback = this.callbacks.get(type);

    if (callback) {
      callback(data);
    }
  }

  /**
   * 解析弹幕
   */
  async parseDanmaku(text: string): Promise<any[]> {
    return new Promise((resolve) => {
      this.callbacks.set('parsed', resolve);
      this.worker?.postMessage({ type: 'parse', data: text });
    });
  }

  /**
   * 过滤弹幕
   */
  async filterDanmaku(danmakus: any[], filter: any): Promise<any[]> {
    return new Promise((resolve) => {
      this.callbacks.set('filtered', resolve);
      this.worker?.postMessage({
        type: 'filter',
        data: { danmakus, filter }
      });
    });
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.worker?.terminate();
    this.worker = undefined;
    this.callbacks.clear();
  }
}

