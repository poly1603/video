/**
 * E2E 测试 - 基础播放
 */

import { test, expect } from '@playwright/test';

test.describe('Basic Playback', () => {
  test('should load video player', async ({ page }) => {
    await page.goto('/basic');

    // 等待播放器加载
    const player = page.locator('.ldesign-video-player');
    await expect(player).toBeVisible();
  });

  test('should play video', async ({ page }) => {
    await page.goto('/basic');

    // 点击播放按钮
    const playButton = page.locator('button:has-text("播放")');
    await playButton.click();

    // 等待一段时间
    await page.waitForTimeout(2000);

    // 检查状态显示为"播放中"
    const status = page.locator('.status.playing');
    await expect(status).toBeVisible();
  });

  test('should pause video', async ({ page }) => {
    await page.goto('/basic');

    // 先播放
    await page.click('button:has-text("播放")');
    await page.waitForTimeout(1000);

    // 再暂停
    await page.click('button:has-text("暂停")');

    // 检查状态
    const status = page.locator('.status.paused');
    await expect(status).toBeVisible();
  });

  test('should seek to specific time', async ({ page }) => {
    await page.goto('/basic');

    // 点击跳转按钮
    await page.click('button:has-text("跳转到 30秒")');

    // 等待一下
    await page.waitForTimeout(500);

    // 检查时间显示
    const timeDisplay = page.locator('.info-item:has-text("当前时间")');
    await expect(timeDisplay).toContainText('00:30');
  });

  test('should adjust volume', async ({ page }) => {
    await page.goto('/basic');

    // 点击音量按钮
    await page.click('button:has-text("音量 50%")');

    // 等待一下
    await page.waitForTimeout(300);

    // 检查音量显示
    const volumeDisplay = page.locator('.info-item:has-text("音量")');
    await expect(volumeDisplay).toContainText('50%');
  });

  test('should take screenshot', async ({ page }) => {
    await page.goto('/basic');

    // 等待视频加载
    await page.waitForTimeout(2000);

    // 监听下载事件
    const downloadPromise = page.waitForEvent('download');

    // 点击截图按钮
    await page.click('button:has-text("截图")');

    // 等待下载
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/screenshot-\d+\.png/);
  });
});

