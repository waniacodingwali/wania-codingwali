
import { Subtitle } from '../types';

function formatTime(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);
  const hh = date.getUTCHours().toString().padStart(2, '0');
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  const ms = (seconds % 1).toFixed(3).substring(2).padStart(3, '0');
  return `${hh}:${mm}:${ss},${ms}`;
}

export function generateSRT(subtitles: Subtitle[]): string {
  return subtitles
    .sort((a, b) => a.startTime - b.startTime)
    .map((sub, index) => {
      const start = formatTime(sub.startTime);
      const end = formatTime(sub.endTime);
      return `${index + 1}\n${start} --> ${end}\n${sub.text}\n`;
    })
    .join('\n');
}
