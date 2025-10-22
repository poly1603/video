/**
 * 字幕解析器
 */

import type { SubtitleFormat, ParsedSubtitle, SubtitleCue } from '../types';

/**
 * 字幕解析器类
 */
export class SubtitleParser {
  /**
   * 解析字幕
   */
  static parse(content: string, format: SubtitleFormat): ParsedSubtitle {
    switch (format) {
      case 'srt':
        return SubtitleParser.parseSRT(content);
      case 'vtt':
        return SubtitleParser.parseVTT(content);
      case 'ass':
        return SubtitleParser.parseASS(content);
      default:
        throw new Error(`Unsupported subtitle format: ${format}`);
    }
  }

  /**
   * 解析 SRT 格式
   */
  private static parseSRT(content: string): ParsedSubtitle {
    const cues: SubtitleCue[] = [];
    const blocks = content.trim().split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.split('\n');
      if (lines.length < 3) continue;

      const timeLine = lines[1];
      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);

      if (timeMatch) {
        const startTime = this.parseTimeToSeconds(
          timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]
        );
        const endTime = this.parseTimeToSeconds(
          timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]
        );

        const text = lines.slice(2).join('\n').trim();

        cues.push({ startTime, endTime, text });
      }
    }

    return { format: 'srt', cues };
  }

  /**
   * 解析 VTT 格式
   */
  private static parseVTT(content: string): ParsedSubtitle {
    const cues: SubtitleCue[] = [];
    const lines = content.split('\n');
    let i = 0;

    // 跳过 WEBVTT 头部
    while (i < lines.length && !lines[i].includes('-->')) {
      i++;
    }

    while (i < lines.length) {
      const line = lines[i];

      if (line.includes('-->')) {
        const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);

        if (timeMatch) {
          const startTime = this.parseTimeToSeconds(
            timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]
          );
          const endTime = this.parseTimeToSeconds(
            timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]
          );

          i++;
          const textLines: string[] = [];

          while (i < lines.length && lines[i].trim() !== '') {
            textLines.push(lines[i]);
            i++;
          }

          const text = textLines.join('\n').trim();
          cues.push({ startTime, endTime, text });
        }
      }

      i++;
    }

    return { format: 'vtt', cues };
  }

  /**
   * 解析 ASS 格式
   */
  private static parseASS(content: string): ParsedSubtitle {
    const cues: SubtitleCue[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.startsWith('Dialogue:')) {
        const parts = line.substring(9).split(',');
        if (parts.length < 10) continue;

        const startTime = this.parseASSTime(parts[1].trim());
        const endTime = this.parseASSTime(parts[2].trim());
        const text = parts.slice(9).join(',').replace(/\\N/g, '\n').trim();

        cues.push({ startTime, endTime, text });
      }
    }

    return { format: 'ass', cues };
  }

  /**
   * 解析时间为秒
   */
  private static parseTimeToSeconds(
    hours: string,
    minutes: string,
    seconds: string,
    milliseconds: string
  ): number {
    return (
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(seconds) +
      parseInt(milliseconds) / 1000
    );
  }

  /**
   * 解析 ASS 时间格式
   */
  private static parseASSTime(time: string): number {
    const parts = time.split(':');
    if (parts.length !== 3) return 0;

    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseFloat(parts[2]);

    return hours * 3600 + minutes * 60 + seconds;
  }
}

