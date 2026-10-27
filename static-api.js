/* 公开演示站的只读 API 适配层：把 /api/* 映射到 data/*.json */
(function () {
  'use strict';
  window.__STATIC__ = true;

  const realFetch = window.fetch.bind(window);
  const cache = new Map();

  function jsonResponse(payload, status = 200) {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  function load(name) {
    if (!cache.has(name)) {
      cache.set(name, realFetch(`data/${name}.json`, { cache: 'force-cache' }).then((res) => {
        if (!res.ok) throw new Error(`缺少数据文件 data/${name}.json`);
        return res.json();
      }));
    }
    return cache.get(name);
  }

  function applySpotFilters(items, params) {
    const q = (params.get('q') || '').trim().toLowerCase();
    const province = params.get('province') || '';
    const city = params.get('city') || '';
    const district = params.get('district') || '';
    const category = params.get('category') || '';
    const season = params.get('season') || '';
    const time = params.get('time') || '';
    let list = items.filter((spot) => {
      if (q && !`${spot.name} ${spot.city} ${spot.province} ${spot.intro} ${spot.category}`.toLowerCase().includes(q)) return false;
      if (province && spot.province !== province) return false;
      if (city && spot.city !== city) return false;
      if (district && spot.district !== district) return false;
      if (category && spot.category !== category) return false;
      if (season && !spot.bestSeasons.includes(season)) return false;
      if (time && !spot.bestTimes.includes(time)) return false;
      return true;
    });
    const sort = params.get('sort') || 'hot';
    if (sort === 'new') list = [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else list = [...list].sort((a, b) => b.likeCount - a.likeCount || b.workCount - a.workCount);
    const limit = Number(params.get('limit') || 60);
    return list.slice(0, limit);
  }

  function applyWorkFilters(items, params) {
    const season = params.get('season') || '';
    const time = params.get('time') || '';
    const province = params.get('province') || '';
    let list = items.filter((work) =>
      (!season || work.season === season) &&
      (!time || work.timeSlot === time) &&
      (!province || work.province === province));
    const sort = params.get('sort') || 'new';
    if (sort === 'hot') list = [...list].sort((a, b) => b.likes - a.likes);
    else list = [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return list.slice(0, Number(params.get('limit') || 24));
  }

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : input.url;
    if (!url.startsWith('/api/')) return realFetch(input, init);

    const method = (init.method || 'GET').toUpperCase();
    if (method !== 'GET') {
      return jsonResponse({
        error: { code: 'read-only', message: '这是公开演示站（只读）。发布、点赞与评论请在本机运行完整版。' },
      }, 403);
    }

    const parsed = new URL(url, location.href);
    const path = parsed.pathname;
    const params = parsed.searchParams;

    try {
      if (path === '/api/bootstrap') return jsonResponse(await load('bootstrap'));
      if (path === '/api/health') return jsonResponse({ ok: true, static: true });
      if (path === '/api/me') return jsonResponse({ user: null, works: [], liked: [] });

      if (path === '/api/spots') {
        const base = await load('spots');
        const spots = applySpotFilters(base.spots, params);
        return jsonResponse({ spots, total: spots.length });
      }
      const spotMatch = path.match(/^\/api\/spots\/(\d+)$/);
      if (spotMatch) return jsonResponse(await load(`spot-${spotMatch[1]}`));
      const spotWorksMatch = path.match(/^\/api\/spots\/(\d+)\/works$/);
      if (spotWorksMatch) {
        const data = await load(`spot-${spotWorksMatch[1]}`);
        const season = params.get('season') || '';
        const time = params.get('time') || '';
        const works = data.spot.works.filter((work) =>
          (!season || work.season === season) && (!time || work.timeSlot === time));
        return jsonResponse({ works });
      }

      if (path === '/api/works') {
        const base = await load('works');
        return jsonResponse({ works: applyWorkFilters(base.works, params) });
      }
      const workMatch = path.match(/^\/api\/works\/(\d+)$/);
      if (workMatch) return jsonResponse(await load(`work-${workMatch[1]}`));

      if (path === '/api/materials') {
        const base = await load('materials');
        let list = base.materials;
        const featured = params.get('featured');
        const city = params.get('city') || '';
        const season = params.get('season') || '';
        const spot = params.get('spot') || '';
        if (featured === '1') list = list.filter((item) => item.featured);
        if (city) list = list.filter((item) => item.city === city);
        if (season) list = list.filter((item) => item.season === season);
        if (spot) list = list.filter((item) => String(item.spotId) === spot);
        return jsonResponse({ materials: list.slice(0, Number(params.get('limit') || 200)), total: list.length });
      }
      const materialMatch = path.match(/^\/api\/materials\/(\d+)$/);
      if (materialMatch) return jsonResponse(await load(`material-${materialMatch[1]}`));
      if (path === '/api/atlas') return jsonResponse(await load('atlas'));

      return jsonResponse({ error: { code: 'not-found', message: '公开演示站没有这个接口' } }, 404);
    } catch (error) {
      return jsonResponse({ error: { code: 'static-data-missing', message: error.message } }, 500);
    }
  };
})();
