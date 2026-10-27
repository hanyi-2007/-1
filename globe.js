/* 拾光机位 · 3D 地球
   原生 WebGL，无第三方库。支持拖拽旋转、滚轮/双指缩放、点击取经纬度、光点标记。 */
(function () {
  'use strict';

  const DEG = Math.PI / 180;
  const EARTH_TEXTURE = 'earth-texture.jpg';
  const EARTH_TEXTURE_FALLBACK = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';

  const VERT = `
    attribute vec3 aPos;
    attribute vec2 aUV;
    uniform mat4 uProj;
    uniform mat4 uModel;
    uniform float uDist;
    varying vec2 vUV;
    varying vec3 vNormal;
    void main() {
      vec4 world = uModel * vec4(aPos, 1.0);
      vNormal = mat3(uModel) * aPos;
      vUV = aUV;
      gl_Position = uProj * vec4(world.xyz - vec3(0.0, 0.0, uDist), 1.0);
    }`;

  const FRAG = `
    precision mediump float;
    uniform sampler2D uTex;
    uniform float uUseTex;
    uniform vec3 uLight;
    varying vec2 vUV;
    varying vec3 vNormal;
    void main() {
      vec3 n = normalize(vNormal);
      float diff = clamp(dot(n, normalize(uLight)), 0.0, 1.0);
      vec3 base = vec3(0.035, 0.075, 0.12);
      if (uUseTex > 0.5) base = texture2D(uTex, vUV).rgb;
      vec3 col = base * (0.6 + 0.7 * diff);
      float rim = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.4);
      col += vec3(0.14, 0.42, 0.62) * rim * 0.85;
      gl_FragColor = vec4(col, 1.0);
    }`;

  const LINE_VERT = `
    attribute vec3 aPos;
    uniform mat4 uProj;
    uniform mat4 uModel;
    uniform float uDist;
    void main() {
      vec4 world = uModel * vec4(aPos, 1.0);
      gl_Position = uProj * vec4(world.xyz - vec3(0.0, 0.0, uDist), 1.0);
    }`;

  const LINE_FRAG = `
    precision mediump float;
    uniform vec4 uColor;
    void main() { gl_FragColor = uColor; }`;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }
  function program(gl, vs, fs) {
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    return prog;
  }

  function perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0,
    ]);
  }

  function modelMatrix(yaw, pitch) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    return new Float32Array([
      cy, sp * sy, -cp * sy, 0,
      0, cp, sp, 0,
      sy, -sp * cy, cp * cy, 0,
      0, 0, 0, 1,
    ]);
  }

  function rotate(yaw, pitch, v) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x1 = cy * v.x + sy * v.z;
    const z1 = -sy * v.x + cy * v.z;
    return {
      x: x1,
      y: cp * v.y - sp * z1,
      z: sp * v.y + cp * z1,
    };
  }

  function inverseRotate(yaw, pitch, v) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    return {
      x: cy * v.x + sp * sy * v.y - cp * sy * v.z,
      y: cp * v.y + sp * v.z,
      z: sy * v.x - sp * cy * v.y + cp * cy * v.z,
    };
  }

  function geoToVec(lat, lng) {
    const la = lat * DEG, lo = lng * DEG;
    return { x: Math.cos(la) * Math.sin(lo), y: Math.sin(la), z: Math.cos(la) * Math.cos(lo) };
  }
  function vecToGeo(v) {
    const lat = Math.asin(Math.max(-1, Math.min(1, v.y))) / DEG;
    let lng = Math.atan2(v.x, v.z) / DEG;
    if (lng < -180) lng += 360;
    if (lng > 180) lng -= 360;
    return { lat, lng };
  }

  function sphereGeometry(step) {
    const positions = [];
    const uvs = [];
    const indices = [];
    const rows = [];
    for (let lat = -90; lat <= 90; lat += step) {
      const row = [];
      for (let lng = -180; lng <= 180; lng += step) {
        const v = geoToVec(lat, lng);
        positions.push(v.x, v.y, v.z);
        uvs.push((lng + 180) / 360, (lat + 90) / 180);
        row.push(positions.length / 3 - 1);
      }
      rows.push(row);
    }
    const cols = rows[0].length;
    for (let i = 0; i < rows.length - 1; i += 1) {
      for (let j = 0; j < cols - 1; j += 1) {
        const a = rows[i][j], b = rows[i + 1][j], c = rows[i + 1][j + 1], d = rows[i][j + 1];
        indices.push(a, b, d, b, c, d);
      }
    }
    return { positions: new Float32Array(positions), uvs: new Float32Array(uvs), indices: new Uint16Array(indices) };
  }

  function graticuleGeometry() {
    const positions = [];
    const addLine = (points) => {
      for (let i = 0; i < points.length - 1; i += 1) {
        positions.push(points[i].x * 1.004, points[i].y * 1.004, points[i].z * 1.004);
        positions.push(points[i + 1].x * 1.004, points[i + 1].y * 1.004, points[i + 1].z * 1.004);
      }
    };
    for (let lat = -60; lat <= 60; lat += 30) {
      const line = [];
      for (let lng = -180; lng <= 180; lng += 4) line.push(geoToVec(lat, lng));
      addLine(line);
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const line = [];
      for (let lat = -90; lat <= 90; lat += 4) line.push(geoToVec(lat, lng));
      addLine(line);
    }
    return new Float32Array(positions);
  }

  window.createGlobe = function createGlobe(container, options = {}) {
    const opts = {
      onSelect: options.onSelect || (() => {}),
      onPick: options.onPick || (() => {}),
      onReady: options.onReady || (() => {}),
      textureUrl: options.textureUrl === undefined ? EARTH_TEXTURE : options.textureUrl,
    };
    const canvas = document.createElement('canvas');
    const pins = document.createElement('div');
    pins.className = 'globe-pins';
    container.appendChild(canvas);
    container.appendChild(pins);

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) {
      container.innerHTML = '<div class="globe-fallback">当前浏览器不支持 WebGL，无法显示 3D 地球。</div>';
      return { setPoints() {}, setFilter() {}, focus() {}, reset() {}, setAutoRotate() {}, destroy() {} };
    }

    const prog = program(gl, VERT, FRAG);
    const loc = {
      aPos: gl.getAttribLocation(prog, 'aPos'),
      aUV: gl.getAttribLocation(prog, 'aUV'),
      uProj: gl.getUniformLocation(prog, 'uProj'),
      uModel: gl.getUniformLocation(prog, 'uModel'),
      uDist: gl.getUniformLocation(prog, 'uDist'),
      uTex: gl.getUniformLocation(prog, 'uTex'),
      uUseTex: gl.getUniformLocation(prog, 'uUseTex'),
      uLight: gl.getUniformLocation(prog, 'uLight'),
    };
    const lineProg = program(gl, LINE_VERT, LINE_FRAG);
    const lineLoc = {
      aPos: gl.getAttribLocation(lineProg, 'aPos'),
      uProj: gl.getUniformLocation(lineProg, 'uProj'),
      uModel: gl.getUniformLocation(lineProg, 'uModel'),
      uDist: gl.getUniformLocation(lineProg, 'uDist'),
      uColor: gl.getUniformLocation(lineProg, 'uColor'),
    };

    const sphere = sphereGeometry(3);
    const spherePos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, spherePos);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.positions, gl.STATIC_DRAW);
    const sphereUV = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereUV);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.uvs, gl.STATIC_DRAW);
    const sphereIdx = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);

    const grid = graticuleGeometry();
    const gridBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuf);
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([12, 24, 38, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    let useTexture = false;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const image = new Image();
    image.crossOrigin = 'anonymous';
    let textureFallbackTimer = setTimeout(() => {
      if (!useTexture) image.src = EARTH_TEXTURE_FALLBACK;
    }, 4200);
    image.onload = () => {
      clearTimeout(textureFallbackTimer);
      try {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        useTexture = true;
        container.dataset.tex = 'on';
        container.dataset.glerror = String(gl.getError());
        opts.onReady({ texture: true });
      } catch (error) {
        useTexture = false;
        container.dataset.tex = `upload-fail:${error.message}`;
        opts.onReady({ texture: false });
      }
    };
    image.onerror = () => {
      if (!image.src.includes('earth_atmos_2048')) {
        clearTimeout(textureFallbackTimer);
        image.src = EARTH_TEXTURE_FALLBACK;
        return;
      }
      clearTimeout(textureFallbackTimer);
      container.dataset.tex = 'img-error';
      opts.onReady({ texture: false });
    };
    if (opts.textureUrl) image.src = opts.textureUrl;
    else opts.onReady({ texture: false });

    let yaw = -108 * DEG;
    let pitch = 32 * DEG;
    let dist = 3.35;
    const MIN_DIST = 1.48;
    const MAX_DIST = 6.2;
    let autoRotate = false;
    let lastInteract = 0;
    let dragging = false;
    let moved = 0;
    let last = { x: 0, y: 0 };
    let pointers = new Map();
    let pinchStart = 0;
    let pinchDist = 0;
    let animation = null;
    let frame = 0;
    let width = 1, height = 1, dpr = 1;
    let points = [];
    let filter = () => true;
    const pinNodes = new Map();

    function resize() {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    function project(lat, lng) {
      const p = rotate(yaw, pitch, geoToVec(lat, lng));
      if (p.z <= 0.01) return null;
      const fov = 34 * DEG;
      const f = 1 / Math.tan(fov / 2);
      const aspect = width / height;
      const camZ = p.z - dist;
      if (-camZ <= 0.1) return null;
      const x = (p.x * f / aspect) / -camZ;
      const y = (p.y * f) / -camZ;
      if (Math.abs(x) > 1.4 || Math.abs(y) > 1.4) return null;
      return { x: (x + 1) * 0.5 * width, y: (1 - y) * 0.5 * height };
    }

    function updatePins() {
      pinNodes.forEach((node) => {
        const p = node.point;
        if (!filter(p)) { node.el.classList.add('is-hidden'); return; }
        const screen = project(p.lat, p.lng);
        if (!screen) { node.el.classList.add('is-hidden'); return; }
        node.el.classList.remove('is-hidden');
        node.el.style.transform = `translate3d(${screen.x}px, ${screen.y}px, 0) translate(-50%, -50%)`;
        const world = rotate(yaw, pitch, geoToVec(p.lat, p.lng));
        node.el.style.zIndex = String(Math.round(500 + world.z * 100));
      });
    }

    function draw() {
      frame = requestAnimationFrame(draw);
      const now = performance.now();
      if (animation) {
        const t = Math.min(1, (now - animation.start) / animation.duration);
        const ease = 1 - Math.pow(1 - t, 3);
        yaw = animation.from.yaw + (animation.to.yaw - animation.from.yaw) * ease;
        pitch = animation.from.pitch + (animation.to.pitch - animation.from.pitch) * ease;
        dist = animation.from.dist + (animation.to.dist - animation.from.dist) * ease;
        if (t >= 1) animation = null;
      } else if (autoRotate && !dragging && now - lastInteract > 3200) {
        yaw += 0.0011;
      }

      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const proj = perspective(34 * DEG, width / height, 0.1, 40);
      const model = modelMatrix(yaw, pitch);

      gl.useProgram(prog);
      gl.uniformMatrix4fv(loc.uProj, false, proj);
      gl.uniformMatrix4fv(loc.uModel, false, model);
      gl.uniform1f(loc.uDist, dist);
      gl.uniform3f(loc.uLight, 0.6, 0.35, 0.8);
      gl.uniform1f(loc.uUseTex, useTexture ? 1 : 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(loc.uTex, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, spherePos);
      gl.enableVertexAttribArray(loc.aPos);
      gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, sphereUV);
      gl.enableVertexAttribArray(loc.aUV);
      gl.vertexAttribPointer(loc.aUV, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIdx);
      gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(lineProg);
      gl.uniformMatrix4fv(lineLoc.uProj, false, proj);
      gl.uniformMatrix4fv(lineLoc.uModel, false, model);
      gl.uniform1f(lineLoc.uDist, dist);
      gl.uniform4f(lineLoc.uColor, 0.55, 0.78, 0.86, 0.15);
      gl.bindBuffer(gl.ARRAY_BUFFER, gridBuf);
      gl.enableVertexAttribArray(lineLoc.aPos);
      gl.vertexAttribPointer(lineLoc.aPos, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.LINES, 0, grid.length / 3);
      gl.disable(gl.BLEND);
      gl.depthMask(true);

      updatePins();
    }

    function setPoints(next) {
      points = next.filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number');
      pins.innerHTML = '';
      pinNodes.clear();
      points.forEach((point) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = `globe-pin pin-${point.type}`;
        el.title = point.name + (point.place ? ` · ${point.place}` : '');
        el.setAttribute('aria-label', point.name);
        el.addEventListener('click', (event) => {
          event.stopPropagation();
          opts.onSelect(point);
        });
        pins.appendChild(el);
        pinNodes.set(point.key || `${point.type}-${point.id}`, { el, point });
      });
    }

    function setFilter(fn) {
      filter = fn || (() => true);
      updatePins();
    }

    function focus(lat, lng, nextDist = 2.7) {
      const targetYaw = -lng * DEG;
      let delta = targetYaw - yaw;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      animation = {
        start: performance.now(),
        duration: 900,
        from: { yaw, pitch, dist },
        to: { yaw: yaw + delta, pitch: Math.max(-1.2, Math.min(1.2, lat * DEG)), dist: Math.max(MIN_DIST, Math.min(MAX_DIST, nextDist)) },
      };
      lastInteract = performance.now();
    }

    function reset() {
      animation = {
        start: performance.now(),
        duration: 700,
        from: { yaw, pitch, dist },
        to: { yaw: -108 * DEG, pitch: 32 * DEG, dist: 3.35 },
      };
    }

    function pick(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = 1 - ((clientY - rect.top) / rect.height) * 2;
      const fov = 34 * DEG;
      const tan = Math.tan(fov / 2);
      const aspect = rect.width / rect.height;
      let dir = { x: nx * tan * aspect, y: ny * tan, z: -1 };
      const len = Math.hypot(dir.x, dir.y, dir.z);
      dir = { x: dir.x / len, y: dir.y / len, z: dir.z / len };
      const o = { x: 0, y: 0, z: dist };
      const b = o.x * dir.x + o.y * dir.y + o.z * dir.z;
      const c = o.x * o.x + o.y * o.y + o.z * o.z - 1;
      const disc = b * b - c;
      if (disc < 0) return null;
      const t = -b - Math.sqrt(disc);
      if (t <= 0) return null;
      const hit = { x: o.x + dir.x * t, y: o.y + dir.y * t, z: o.z + dir.z * t };
      const object = inverseRotate(yaw, pitch, hit);
      return vecToGeo(object);
    }

    canvas.addEventListener('pointerdown', (event) => {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      canvas.setPointerCapture(event.pointerId);
      dragging = true;
      moved = 0;
      last = { x: event.clientX, y: event.clientY };
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
        pinchDist = dist;
      }
      canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('pointermove', (event) => {
      if (pointers.has(event.pointerId)) pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const current = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchStart > 10) {
          dist = Math.max(MIN_DIST, Math.min(MAX_DIST, pinchDist * (pinchStart / current)));
        }
        return;
      }
      if (!dragging) return;
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      last = { x: event.clientX, y: event.clientY };
      moved += Math.abs(dx) + Math.abs(dy);
      yaw += dx * 0.0052;
      pitch = Math.max(-1.25, Math.min(1.25, pitch + dy * 0.0045));
      lastInteract = performance.now();
      animation = null;
    });
    function endPointer(event) {
      const wasDragging = dragging;
      pointers.delete(event.pointerId);
      if (pointers.size === 0) {
        dragging = false;
        canvas.style.cursor = 'grab';
        if (wasDragging && moved < 5) {
          const geo = pick(event.clientX, event.clientY);
          if (geo) opts.onPick(geo);
        }
      }
    }
    canvas.addEventListener('pointerup', endPointer);
    canvas.addEventListener('pointercancel', endPointer);
    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      dist = Math.max(MIN_DIST, Math.min(MAX_DIST, dist + event.deltaY * 0.0016));
      lastInteract = performance.now();
      animation = null;
    }, { passive: false });

    draw();

    return {
      setPoints,
      setFilter,
      focus,
      reset,
      setAutoRotate(value) { autoRotate = value; },
      zoom(factor) { dist = Math.max(MIN_DIST, Math.min(MAX_DIST, dist * factor)); },
      destroy() {
        cancelAnimationFrame(frame);
        observer.disconnect();
        image.onload = null;
        image.onerror = null;
        gl.deleteProgram(prog);
        gl.deleteProgram(lineProg);
        gl.deleteTexture(texture);
        container.innerHTML = '';
      },
    };
  };
})();
