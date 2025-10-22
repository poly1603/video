/**
 * PlaylistManager 单元测试
 */

import { describe, it, expect, vi } from 'vitest';
import { PlaylistManager } from '../../src/features/PlaylistManager';

describe('PlaylistManager', () => {
  it('should add items to playlist', () => {
    const playlist = new PlaylistManager();
    const handler = vi.fn();

    playlist.on('add', handler);
    playlist.add({ id: '1', url: 'video1.mp4', quality: '720p' });

    expect(playlist.length).toBe(1);
    expect(handler).toHaveBeenCalled();
  });

  it('should remove items from playlist', () => {
    const playlist = new PlaylistManager();

    playlist.add([
      { id: '1', url: 'video1.mp4', quality: '720p' },
      { id: '2', url: 'video2.mp4', quality: '720p' },
    ]);

    playlist.remove(0);

    expect(playlist.length).toBe(1);
    expect(playlist.getPlaylist()[0].id).toBe('2');
  });

  it('should play next video', () => {
    const playlist = new PlaylistManager();

    playlist.add([
      { id: '1', url: 'video1.mp4', quality: '720p' },
      { id: '2', url: 'video2.mp4', quality: '720p' },
    ]);

    playlist.playAt(0);
    const next = playlist.next();

    expect(next?.id).toBe('2');
  });

  it('should play previous video', () => {
    const playlist = new PlaylistManager();

    playlist.add([
      { id: '1', url: 'video1.mp4', quality: '720p' },
      { id: '2', url: 'video2.mp4', quality: '720p' },
    ]);

    playlist.playAt(1);
    const prev = playlist.previous();

    expect(prev?.id).toBe('1');
  });

  it('should shuffle playlist', () => {
    const playlist = new PlaylistManager();
    const handler = vi.fn();

    playlist.add([
      { id: '1', url: 'video1.mp4', quality: '720p' },
      { id: '2', url: 'video2.mp4', quality: '720p' },
      { id: '3', url: 'video3.mp4', quality: '720p' },
    ]);

    playlist.on('shuffle', handler);
    playlist.shuffle();

    expect(handler).toHaveBeenCalledWith(true);
  });

  it('should clear playlist', () => {
    const playlist = new PlaylistManager();

    playlist.add({ id: '1', url: 'video1.mp4', quality: '720p' });
    playlist.clear();

    expect(playlist.isEmpty).toBe(true);
    expect(playlist.length).toBe(0);
  });

  it('should move items', () => {
    const playlist = new PlaylistManager();

    playlist.add([
      { id: '1', url: 'video1.mp4', quality: '720p' },
      { id: '2', url: 'video2.mp4', quality: '720p' },
      { id: '3', url: 'video3.mp4', quality: '720p' },
    ]);

    playlist.move(0, 2);

    const items = playlist.getPlaylist();
    expect(items[2].id).toBe('1');
  });
});

