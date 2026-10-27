/* 拾光机位 · 地貌氛围粒子（原生 Canvas） */
(function () {
  'use strict';

  const MODES = ['mist', 'rain', 'snow', 'dust', 'leaves', 'waves', 'aurora', 'none'];

  window.createAtmosphere = function createAtmosphere(stage, initialMode = 'mist') {
    const canvas = document.createElement('canvas');
    canvas.className = 'atmosphere';
    const veil = stage.querySelector('.atlas-veil');
    if (veil && veil.nextSibling) stage.insertBefore(canvas, veil.nextSibling);
    else stage.insertBefore(canvas, stage.firstChild);
    const ctx = canvas.getContext('2d');
    let width = 1;
    let height = 1;
    let dpr = 1;
    let mode = MODES.includes(initialMode) ? initialMode : 'mist';
    let frame = 0;
    let parts = [];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      const rect = stage.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resize();

    function rnd(min, max) { return min + Math.random() * (max - min); }

    function reset() {
      parts = [];
      const count = { mist: 14, rain: 150, snow: 130, dust: 85, leaves: 42, waves: 18, aurora: 7 }[mode] || 0;
      for (let i = 0; i < count; i += 1) {
        if (mode === 'mist') {
          parts.push({ x: rnd(-0.2, 1.2) * width, y: rnd(0.05, 0.85) * height, r: rnd(0.18, 0.42) * width, a: rnd(0.02, 0.08), vx: rnd(0.04, 0.16), vy: rnd(-0.02, 0.02) });
        } else if (mode === 'rain') {
          parts.push({ x: rnd(0, width), y: rnd(-height, height), len: rnd(14, 46), v: rnd(9, 17), a: rnd(0.08, 0.28) });
        } else if (mode === 'snow') {
          parts.push({ x: rnd(0, width), y: rnd(-height, height), r: rnd(0.8, 2.6), v: rnd(0.5, 1.8), drift: rnd(-0.4, 0.4), a: rnd(0.25, 0.8) });
        } else if (mode === 'dust') {
          parts.push({ x: rnd(0, width), y: rnd(0, height), r: rnd(0.5, 1.8), vx: rnd(0.12, 0.5), vy: rnd(-0.1, 0.05), a: rnd(0.08, 0.28) });
        } else if (mode === 'leaves') {
          parts.push({ x: rnd(0, width), y: rnd(-height, 0), r: rnd(2, 5), v: rnd(0.5, 1.4), sway: rnd(0.5, 1.8), phase: rnd(0, 6.28), a: rnd(0.2, 0.55) });
        } else if (mode === 'waves') {
          parts.push({ x: 0, y: rnd(0.55, 1.0) * height, len: rnd(0.2, 0.8) * width, v: rnd(0.08, 0.3), a: rnd(0.03, 0.1) });
        } else if (mode === 'aurora') {
          parts.push({ x: rnd(0, width), w: rnd(0.1, 0.28) * width, phase: rnd(0, 6.28), speed: rnd(0.01, 0.04), hue: Math.random() > 0.5 ? 'teal' : 'violet' });
        }
      }
    }

    function drawMist(dt) {
      parts.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x - p.r > width) p.x = -p.r;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(232,238,236,${p.a})`);
        g.addColorStop(1, 'rgba(232,238,236,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    function drawRain(dt) {
      ctx.lineWidth = 1;
      parts.forEach((p) => {
        p.y += p.v * dt * 1.3;
        p.x += p.v * dt * 0.18;
        if (p.y > height) { p.y = -p.len; p.x = Math.random() * width; }
        ctx.strokeStyle = `rgba(190,214,224,${p.a})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 3, p.y + p.len);
        ctx.stroke();
      });
    }
    function drawSnow(dt) {
      parts.forEach((p) => {
        p.y += p.v * dt * 1.2;
        p.x += Math.sin((p.y + p.r * 40) / 60) * 0.3 + p.drift * dt;
        if (p.y > height + 4) { p.y = -4; p.x = Math.random() * width; }
        ctx.fillStyle = `rgba(244,248,252,${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    function drawDust(dt) {
      parts.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x > width + 4) { p.x = -4; p.y = Math.random() * height; }
        if (p.y < -4) p.y = height;
        ctx.fillStyle = `rgba(232,196,140,${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    function drawLeaves(dt) {
      parts.forEach((p) => {
        p.y += p.v * dt * 1.3;
        p.phase += 0.02 * dt;
        p.x += Math.sin(p.phase) * p.sway * 0.4;
        if (p.y > height + 8) { p.y = -8; p.x = Math.random() * width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.phase);
        ctx.fillStyle = `rgba(205,150,62,${p.a})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }
    function drawWaves(t) {
      parts.forEach((p) => {
        const y = p.y + Math.sin(t * 0.0008 + p.y * 0.02) * 4;
        const g = ctx.createLinearGradient(p.x, y, p.x + p.len, y);
        g.addColorStop(0, 'rgba(220,238,240,0)');
        g.addColorStop(0.5, `rgba(220,238,240,${p.a})`);
        g.addColorStop(1, 'rgba(220,238,240,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x + Math.sin(t * 0.0004 + p.y) * 40, y);
        ctx.lineTo(p.x + p.len, y);
        ctx.stroke();
      });
    }
    function drawAurora(t) {
      parts.forEach((p) => {
        const x = p.x + Math.sin(t * 0.0002 + p.phase) * p.w * 0.4;
        const g = ctx.createLinearGradient(x, 0, x, height);
        const color = p.hue === 'teal' ? '120,230,200' : '150,160,245';
        g.addColorStop(0, `rgba(${color},0)`);
        g.addColorStop(0.35, `rgba(${color},0.06)`);
        g.addColorStop(0.7, `rgba(${color},0.02)`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + p.w * 0.3, height * 0.35, x - p.w * 0.2, height * 0.65, x + p.w * 0.15, height);
        ctx.lineTo(x + p.w * 0.55, height);
        ctx.bezierCurveTo(x + p.w * 0.2, height * 0.62, x + p.w * 0.6, height * 0.3, x + p.w * 0.45, 0);
        ctx.closePath();
        ctx.fill();
      });
    }

    let last = performance.now();
    function loop(now) {
      frame = requestAnimationFrame(loop);
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      ctx.clearRect(0, 0, width, height);
      if (mode === 'mist') drawMist(dt);
      else if (mode === 'rain') drawRain(dt);
      else if (mode === 'snow') drawSnow(dt);
      else if (mode === 'dust') drawDust(dt);
      else if (mode === 'leaves') drawLeaves(dt);
      else if (mode === 'waves') drawWaves(now);
      else if (mode === 'aurora') drawAurora(now);
    }

    function setMode(next) {
      mode = MODES.includes(next) ? next : 'none';
      reset();
      canvas.dataset.mode = mode;
    }
    setMode(mode);
    if (!reduce) frame = requestAnimationFrame(loop);

    return {
      setMode,
      destroy() {
        cancelAnimationFrame(frame);
        observer.disconnect();
        canvas.remove();
      },
    };
  };
})();
