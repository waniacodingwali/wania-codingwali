
import { Subtitle, SubtitleStyle } from '../types';

export async function exportVideoWithSubtitles(
  videoElement: HTMLVideoElement, 
  subtitles: Subtitle[], 
  style: SubtitleStyle
): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Could not initialize canvas context");

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studio_export_${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wasPaused = videoElement.paused;
  const originalTime = videoElement.currentTime;
  
  videoElement.pause();
  videoElement.currentTime = 0;
  
  await new Promise(r => {
    const seekListener = () => {
      videoElement.removeEventListener('seeked', seekListener);
      r(null);
    };
    videoElement.addEventListener('seeked', seekListener);
  });

  recorder.start();

  const fps = 30;
  const frameInterval = 1 / fps;

  const drawFrame = async () => {
    if (videoElement.currentTime >= videoElement.duration) {
      recorder.stop();
      videoElement.currentTime = originalTime;
      if (!wasPaused) videoElement.play();
      return;
    }

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const sub = subtitles.find(s => videoElement.currentTime >= s.startTime && videoElement.currentTime <= s.endTime);
    
    if (sub) {
      ctx.save();
      
      const responsiveFontSize = style.fontSize * (canvas.width / 1280);
      ctx.font = `bold ${responsiveFontSize}px ${style.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const paddingX = responsiveFontSize * 1.5;
      const paddingY = responsiveFontSize * 0.5;

      let y = canvas.height * 0.85;
      if (style.position === 'top') y = canvas.height * 0.15;
      if (style.position === 'middle') y = canvas.height / 2;

      let alpha = 1;
      let offsetY = 0;
      let scaleEffect = 1;
      let blurEffect = 0;
      let displayText = sub.text;
      let clipWidth = canvas.width;

      const durationElapsed = videoElement.currentTime - sub.startTime;
      const subDuration = sub.endTime - sub.startTime;

      // Animation Logic
      if (style.animation === 'fade') {
        const f = 0.2;
        if (durationElapsed < f) alpha = durationElapsed / f;
        else if (sub.endTime - videoElement.currentTime < f) alpha = (sub.endTime - videoElement.currentTime) / f;
      } else if (style.animation === 'slide-up') {
        const s = 0.3;
        if (durationElapsed < s) {
          const t = durationElapsed / s;
          offsetY = (1 - t) * 40;
          alpha = t;
        }
      } else if (style.animation === 'zoom-in') {
        const z = 0.15;
        if (durationElapsed < z) {
          const t = durationElapsed / z;
          scaleEffect = 0.85 + (0.15 * t);
          alpha = t;
        }
      } else if (style.animation === 'typing') {
        const revealPercent = Math.min(1, durationElapsed / (subDuration * 0.6));
        const charCount = Math.floor(sub.text.length * revealPercent);
        displayText = sub.text.substring(0, charCount);
      } else if (style.animation === 'bounce') {
        const b = 0.4;
        if (durationElapsed < b) {
          const t = durationElapsed / b;
          // Spring curve
          scaleEffect = Math.sin(t * Math.PI * 1.5) * 0.2 * (1 - t) + 1;
          alpha = Math.min(1, t * 2);
        }
      } else if (style.animation === 'blur') {
        const bl = 0.5;
        if (durationElapsed < bl) {
          const t = durationElapsed / bl;
          blurEffect = (1 - t) * 20;
          alpha = t;
          scaleEffect = 0.95 + (0.05 * t);
        }
      } else if (style.animation === 'swipe') {
        const sw = 0.8;
        const revealPercent = Math.min(1, durationElapsed / sw);
        clipWidth = canvas.width * revealPercent;
      }

      ctx.translate(canvas.width / 2, y + offsetY);
      ctx.scale(scaleEffect, scaleEffect);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      
      if (blurEffect > 0) {
        ctx.filter = `blur(${blurEffect}px)`;
      }

      const metrics = ctx.measureText(displayText);
      const textWidth = metrics.width;
      const textHeight = responsiveFontSize;

      if (style.animation === 'swipe') {
        const revealX = (canvas.width - textWidth) / 2 + (textWidth * (durationElapsed / 0.8));
        ctx.beginPath();
        ctx.rect(-canvas.width/2, -canvas.height/2, clipWidth, canvas.height);
        ctx.clip();
      }

      if (style.backgroundColor && style.backgroundColor !== 'transparent' && displayText.length > 0) {
        ctx.fillStyle = style.backgroundColor;
        const rw = textWidth + paddingX;
        const rh = textHeight + paddingY * 2;
        
        const bx = -rw / 2;
        const by = -rh / 2;
        const radius = 20;
        ctx.beginPath();
        ctx.moveTo(bx + radius, by);
        ctx.lineTo(bx + rw - radius, by);
        ctx.quadraticCurveTo(bx + rw, by, bx + rw, by + radius);
        ctx.lineTo(bx + rw, by + rh - radius);
        ctx.quadraticCurveTo(bx + rw, by + rh, bx + rw - radius, by + rh);
        ctx.lineTo(bx + radius, by + rh);
        ctx.quadraticCurveTo(bx, by + rh, bx, by + rh - radius);
        ctx.lineTo(bx, by + radius);
        ctx.quadraticCurveTo(bx, by, bx + radius, by);
        ctx.closePath();
        ctx.fill();
      }

      if (style.outline && displayText.length > 0) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 4;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = responsiveFontSize * 0.1;
        ctx.strokeText(displayText, 0, 0);
      }

      ctx.fillStyle = style.textColor;
      ctx.fillText(displayText, 0, 0);
      
      ctx.restore();
    }

    videoElement.currentTime += frameInterval;
    
    videoElement.onseeked = () => {
      videoElement.onseeked = null;
      requestAnimationFrame(drawFrame);
    };
  };

  drawFrame();
}
