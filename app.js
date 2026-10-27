/* 拾光机位 — 前端应用（无构建、无依赖） */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const app = $('#app');
  const modalRoot = $('#modal-root');
  const toastRoot = $('#toast-root');

  const SEASONS = ['春', '夏', '秋', '冬'];
  const TIMES = ['清晨', '上午', '正午', '午后', '黄昏', '夜晚', '蓝调'];
  const DIRS = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];

  const BIOMES = [
    {
      id: 'water', name: '水乡', en: 'WATER TOWN', region: '江苏 · 扬州', lat: 32.40, lng: 119.43,
      remote: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=2000&q=80',
      local: '/uploads/materials/m-28.jpg', localFirst: true,
      title: '水乡：把城市交给水面',
      text: '长江与京杭大运河在江苏交叠，水面把城市拆成很多条街。梅雨前后，雾气和炊烟会一起低下来，桥洞里的光比岸上慢半拍。',
      fact: '江苏的湿地与湖荡群塑造了“水乡”的底色：太湖、洪泽湖与里下河地区，构成了中国最密集的平原水网之一。',
      video: '江苏 水乡 航拍',
    },
    {
      id: 'danxia', name: '丹霞', en: 'DANXIA', region: '甘肃 · 张掖', lat: 38.95, lng: 100.45,
      remote: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=2000&q=80',
      local: '/uploads/materials/m-56.jpg', localFirst: true,
      title: '丹霞：时间的指纹',
      text: '彩色丘陵是白垩纪砂岩在抬升与风化中被一层层剥开的颜色。下午四点以后，斜光才把红层真正点燃，山体的褶皱像被火烧过。',
      fact: '丹霞地貌以陡崖坡为特征，红色砂砾岩在差异风化、流水侵蚀与重力崩塌下，形成城堡状、峰林状的山体。',
      video: '张掖丹霞 航拍',
    },
    {
      id: 'karst', name: '喀斯特', en: 'KARST', region: '广西 · 桂林', lat: 25.27, lng: 110.29,
      remote: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=2000&q=80',
      local: '/uploads/materials/m-54.jpg', localFirst: true,
      title: '喀斯特：水把山雕空',
      text: '桂林的峰林是石灰岩被水溶蚀后剩下的孤峰，漓江在峰林之间切出一条弯曲的走廊。清晨的雾把山脚藏起来，只留下一个个尖顶。',
      fact: '喀斯特作用以溶蚀为主，雨水与二氧化碳形成弱酸，沿裂隙溶解石灰岩，最终形成峰丛、峰林、溶洞与地下河。',
      video: '桂林 喀斯特 航拍',
    },
    {
      id: 'snow', name: '雪山', en: 'SNOW MOUNTAIN', region: '西藏 · 喜马拉雅', lat: 27.99, lng: 86.93,
      remote: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80',
      local: '/uploads/materials/m-38.jpg',
      title: '雪山：离太阳最近的墙',
      text: '喜马拉雅的雪线随季节上下移动。日出前半小时，山体会先变成玫瑰色，然后一寸寸退回白色；云从南坡涌上来，往往在中午前封住山口。',
      fact: '雪线是常年积雪的下界，受纬度、坡向与降水共同影响。同一座山，南坡接受印度洋水汽，雪线通常低于北坡。',
      video: '喜马拉雅 雪山 日出',
    },
    {
      id: 'desert', name: '沙漠', en: 'DESERT', region: '内蒙古 · 巴丹吉林', lat: 40.00, lng: 102.00,
      remote: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=2000&q=80',
      local: '/uploads/materials/m-29.jpg',
      title: '沙漠：风写下的地形',
      text: '巴丹吉林的沙丘能长到两百米高，风把沙脊修成刀刃，也把湖泊留在丘间。日落前的半小时，迎风面是金色，背风面是紫色。',
      fact: '沙丘的移动速度与风速的三次方相关；植被覆盖与水分条件，决定一片沙地是流动、半固定还是固定。',
      video: '巴丹吉林 沙漠 航拍',
    },
    {
      id: 'forest', name: '森林', en: 'FOREST', region: '大兴安岭', lat: 48.50, lng: 121.00,
      remote: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2000&q=80',
      local: '/uploads/materials/m-48.jpg', localFirst: true,
      title: '森林：光被叶子分拣',
      text: '温带针阔混交林的秋天只有两周。落叶松先黄，白桦随后，晨雾从河谷里升起来，把树干分成一层一层的灰。',
      fact: '森林的垂直结构分为乔木层、灌木层、草本层与地被层；层次越完整，光照、水分与养分的利用越充分。',
      video: '大兴安岭 秋色 航拍',
    },
    {
      id: 'coast', name: '海岸', en: 'COAST', region: '福建 · 霞浦', lat: 26.90, lng: 120.10,
      remote: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=80',
      local: '/uploads/materials/m-36.jpg',
      title: '海岸：潮汐每天重画一次',
      text: '霞浦的滩涂随潮汐每天换一次纹理，退潮后的潮沟像树的根系。渔民把竹竿插成阵列，逆光时是一行五线谱。',
      fact: '潮间带是海陆交界的生态系统，潮差、泥沙供给与波浪能量共同决定滩涂、沙坝与潟湖的形态。',
      video: '霞浦 滩涂 航拍',
    },
    {
      id: 'grass', name: '草原', en: 'STEPPE', region: '内蒙古 · 呼伦贝尔', lat: 49.20, lng: 119.70,
      remote: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=2000&q=80',
      local: '/uploads/materials/m-38.jpg',
      title: '草原：风过时整片地都在动',
      text: '呼伦贝尔的草甸在八月抽穗，风过时整片草原向同一个方向倒。云影跑得比人快，一条路可以一直开到地平线。',
      fact: '草原土壤以黑钙土为主，深厚的根系层储存了大量有机碳；过度放牧会让草甸向沙地退化，恢复需要多年。',
      video: '呼伦贝尔 草原 航拍',
    },
    {
      id: 'cloudsea', name: '云海', en: 'CLOUD SEA', region: '安徽 · 黄山', lat: 30.13, lng: 118.17,
      remote: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80',
      local: '/uploads/materials/m-38.jpg', localFirst: true,
      title: '云海：山只露出一个尖',
      text: '黄山的云海多出现在雨后的清晨。冷暖空气在谷底交汇，雾沿着山脊往上爬，最后只剩几座峰顶浮在云上。',
      fact: '云海是低层云在群山间积聚形成的景观，逆温层像盖子一样压住水汽；雨后天晴、风速小的清晨最容易出现。',
      video: '黄山 云海 日出',
    },
    {
      id: 'rime', name: '雾凇', en: 'RIME', region: '吉林 · 雾凇岛', lat: 42.40, lng: 128.10,
      remote: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2000&q=80',
      local: '/uploads/materials/m-48.jpg', localFirst: true,
      title: '雾凇：冷空气写下的白',
      text: '松花江的水汽在零下二十度的夜里凝在树枝上，天亮时整排树都变成白色。太阳出来以后，雾凇会一片片落下来。',
      fact: '雾凇是过冷水滴在物体表面冻结形成的白色冰晶，需要充足水汽、低于冰点的温度和微风；风速过大反而无法附着。',
      video: '吉林 雾凇 清晨',
    },
    {
      id: 'aurora', name: '极光', en: 'AURORA', region: '黑龙江 · 漠河', lat: 53.47, lng: 122.34,
      remote: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=2000&q=80',
      local: '/uploads/materials/m-55.jpg',
      title: '极光：太阳风落在夜空',
      text: '漠河的极光多出现在地磁暴之后。肉眼看到的是灰白色，相机长曝光才显出绿色；零下三十度，电池比人先撑不住。',
      fact: '极光由太阳风带电粒子沿磁力线进入高层大气，与氧、氮原子碰撞发光；绿色来自约 100–150 公里高度的氧。',
      video: '漠河 极光',
    },
  ];

  const CITY_COORDS = {
    宿迁: [33.96, 118.28], 扬州: [32.40, 119.43], 南京: [32.06, 118.79],
    镇江: [32.20, 119.47], 张掖: [38.95, 100.45],
  };

  const WORLD = [
    { id: 'sahara', name: '撒哈拉', region: '非洲 · 北非', lat: 23.0, lng: 13.0, kind: 'desert', type: '自然地理',
      text: '撒哈拉不是一片平沙。风把沙丘推成脊线，也把砾石留成黑色戈壁；绿洲像针脚一样缝在干涸的河床上。',
      fact: '撒哈拉约占非洲面积的三成，副热带高压与信风共同造成干旱；沙丘只覆盖约五分之一，其余是砾漠与岩漠。', video: '撒哈拉 沙漠 航拍' },
    { id: 'amazon', name: '亚马孙', region: '南美洲 · 巴西', lat: -3.0, lng: -60.0, kind: 'forest', type: '自然地理',
      text: '亚马孙的雨林不是静止的绿，它每天都在制造自己的云和雨。河在树下面走，树在水上面走。',
      fact: '亚马孙流域拥有世界最大的热带雨林，蒸腾作用把水汽送回大气，形成“飞行的河流”，影响南美乃至全球降水。', video: '亚马孙 雨林 航拍' },
    { id: 'iceland', name: '冰岛', region: '欧洲 · 北大西洋', lat: 64.9, lng: -19.0, kind: 'aurora', type: '自然地理',
      text: '冰岛的极光常和火山一起出现。白天是黑色熔岩与绿色苔原，夜里，天空开始流动。',
      fact: '冰岛位于大西洋中脊，火山与冰川共存；极光出现在地磁暴后的晴夜，绿色来自高层大气中的氧原子。', video: '冰岛 极光 火山' },
    { id: 'alps', name: '阿尔卑斯', region: '欧洲 · 中南部', lat: 46.0, lng: 10.0, kind: 'snow', type: '自然地理',
      text: '阿尔卑斯的雪线在夏天也会后退。山脊像一把把刀，把云切成两半，一半留在意大利，一半飘向瑞士。',
      fact: '阿尔卑斯是非洲板块与欧亚板块碰撞形成的褶皱山系，冰川侵蚀出 U 形谷与湖泊，是欧洲重要的水源地。', video: '阿尔卑斯 雪山 航拍' },
    { id: 'reef', name: '大堡礁', region: '大洋洲 · 澳大利亚', lat: -18.0, lng: 147.0, kind: 'coast', type: '自然地理',
      text: '大堡礁在退潮时露出浅浅的脊背。海水从绿松石变成深蓝，只隔着一道珊瑚的边缘。',
      fact: '大堡礁由约三千个珊瑚礁与九百座岛屿组成，是地球上最大的珊瑚礁系统；海水升温会导致珊瑚白化。', video: '大堡礁 珊瑚 航拍' },
    { id: 'baikal', name: '贝加尔湖', region: '亚洲 · 俄罗斯', lat: 53.5, lng: 108.0, kind: 'water', type: '自然地理',
      text: '贝加尔湖的蓝是很深的蓝。冬天结成冰，冰里还有裂纹和气泡，像一整片冻住的地图。',
      fact: '贝加尔湖是世界上最深的湖泊，最深处约 1642 米，蓄水量占全球淡水湖的五分之一；湖底仍在缓慢扩张。', video: '贝加尔湖 蓝冰' },
    { id: 'uluru', name: '乌卢鲁', region: '大洋洲 · 澳大利亚中部', lat: -25.3, lng: 131.0, kind: 'desert', type: '自然地理',
      text: '乌卢鲁在日落时从赭红变成深红。它周围的沙漠很平，所以这块巨石显得像从地里长出来的心脏。',
      fact: '乌卢鲁是砂岩残丘，因岩层中的铁矿物氧化而呈红色；它是澳大利亚原住民阿南古人的圣地。', video: '乌鲁鲁 日落 航拍' },
    { id: 'kyoto', name: '京都', region: '亚洲 · 日本', lat: 35.0, lng: 135.8, kind: 'forest', type: '人文地理',
      text: '京都的美是被人安排过的：一条石板路、一株枫树、一扇借景的窗。季节一变，整座城就换一套颜色。',
      fact: '京都保留了大量町家、寺院与庭园，借景与枯山水体现日本传统景观思想；秋季红叶与春季樱花是最强的季节景观。', video: '京都 秋叶 庭园' },
    { id: 'polder', name: '荷兰圩田', region: '欧洲 · 荷兰', lat: 52.3, lng: 4.9, kind: 'grass', type: '人文地理',
      text: '荷兰的地平线是画出来的。风车、堤坝与笔直的运河把海水挡在外面，也把土地切成规整的格子。',
      fact: '圩田是通过筑堤、排水从海或湖中围垦的土地，荷兰约三分之一国土低于海平面，须德海工程是典型代表。', video: '荷兰 圩田 航拍' },
  ];

  const state = {
    bootstrap: null,
    me: null,
    routeSeq: 0,
    spotsCache: [],
    materials: [],
    featured: [],
    atlas: null,
  };

  let activeGlobe = null;
  let activeAtmosphere = null;

  function disposeGlobe() {
    if (activeGlobe) {
      activeGlobe.destroy();
      activeGlobe = null;
    }
    if (activeAtmosphere) {
      activeAtmosphere.destroy();
      activeAtmosphere = null;
    }
  }

  function atmosphereFor(id) {
    return {
      water: 'mist', danxia: 'dust', karst: 'rain', snow: 'snow', desert: 'dust',
      forest: 'leaves', coast: 'waves', grass: 'dust', cloudsea: 'mist', rime: 'snow', aurora: 'aurora',
    }[id] || 'mist';
  }

  function biomeGlyph(id) {
    const shapes = {
      water: '<path d="M2 11c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".6"/>',
      danxia: '<path d="M2 15l4-6 3 3 4-6 3 4 3-2 3 7" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 15h20" stroke="currentColor" stroke-width="1.1" opacity=".5"/>',
      karst: '<path d="M3 16l3-9 3 5 2-8 3 9 2-4 4 7" fill="none" stroke="currentColor" stroke-width="1.3"/>',
      snow: '<path d="M2 16l5-9 3 5 4-8 4 7 3-4 3 9" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M7 7l1.5 2 1.5-2" fill="currentColor" opacity=".5"/>',
      desert: '<path d="M2 15c3-4 6-4 9-1s7 3 11-2v4H2z" fill="currentColor" opacity=".55"/><circle cx="18" cy="5" r="2" fill="currentColor" opacity=".7"/>',
      forest: '<path d="M6 16l3-7 3 7M5 16h8M14 16l2.5-5 2.5 5M13 16h7" fill="none" stroke="currentColor" stroke-width="1.3"/>',
      coast: '<path d="M2 14c4 0 4-2 8-2s4 2 8 2 3-1 4-1" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="17" cy="5" r="2.2" fill="currentColor" opacity=".7"/>',
      grass: '<path d="M2 15c3-3 6-3 9 0s6 3 11 0v3H2z" fill="currentColor" opacity=".45"/><path d="M6 12l1-4 1 4M12 12l1-5 1 5" stroke="currentColor" stroke-width="1.1" fill="none"/>',
      cloudsea: '<path d="M4 12c0-2 2-3 3.5-2.5C8 7.5 11 7 12.5 9c2-1 4 .5 4 2.5 2 0 3 1 3 2.5H4c-1.2 0-1.2-2 0-2z" fill="currentColor" opacity=".45"/><path d="M2 16h20" stroke="currentColor" stroke-width="1.1" opacity=".5"/>',
      rime: '<path d="M12 3v12M6 6l12 6M18 6L6 12" stroke="currentColor" stroke-width="1.1"/><circle cx="12" cy="12" r="2" fill="currentColor" opacity=".6"/>',
      aurora: '<path d="M3 4c4 2 3 7 7 8s4 3 7 2 3-4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 7c3 2 3 5 6 6s4 2 6 1" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>',
    };
    return `<svg class="biome-glyph" viewBox="0 0 24 18" aria-hidden="true">${shapes[id] || shapes.water}</svg>`;
  }

  /* ---------------- identity ---------------- */

  const TOKEN_KEY = 'shiguang.token';
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = (crypto.randomUUID && crypto.randomUUID()) || `tg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(TOKEN_KEY, token);
  }

  class ApiError extends Error {
    constructor(status, code, message) {
      super(message);
      this.status = status;
      this.code = code;
    }
  }

  async function api(path, options = {}) {
    const headers = { 'X-User-Token': token };
    let body;
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.body);
    }
    const res = await fetch(path, { method: options.method || 'GET', headers, body });
    let data = {};
    try { data = await res.json(); } catch { /* noop */ }
    if (!res.ok) {
      const err = data && data.error;
      throw new ApiError(res.status, err?.code || 'error', err?.message || '请求失败，请稍后重试');
    }
    return data;
  }

  function requireProfile() {
    if (state.me && state.me.name) return true;
    openNameModal();
    return false;
  }

  async function guard(fn) {
    if (!requireProfile()) return;
    try {
      await fn();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'profile-required') {
        openNameModal();
        return;
      }
      toast(err.message || '操作失败', 'error');
    }
  }

  /* ---------------- helpers ---------------- */

  const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const cx = (...parts) => parts.filter(Boolean).join(' ');

  function avatar(name) {
    const ch = (name || '?').trim().slice(0, 1).toUpperCase();
    let hash = 0;
    for (const c of String(name || '')) hash = (hash * 31 + c.charCodeAt(0)) % 360;
    return `<span class="avatar" style="background:linear-gradient(135deg,hsl(${hash} 42% 52%),hsl(${(hash + 40) % 360} 38% 34%))">${esc(ch)}</span>`;
  }

  function direction(deg) {
    if (deg === null || deg === undefined || Number.isNaN(Number(deg))) return '未标注';
    const value = ((Number(deg) % 360) + 360) % 360;
    return DIRS[Math.round(value / 45) % 8] + ' ' + value + '°';
  }

  function crowdDots(level) {
    let out = '';
    for (let i = 1; i <= 5; i += 1) out += `<i class="${i <= level ? 'on' : ''}"></i>`;
    return `<span class="crowd-dots" aria-hidden="true">${out}</span>`;
  }

  function seasonBadge(season, extra = '') {
    return `<span class="badge season-${season} ${extra}">${esc(season)}</span>`;
  }

  function timeBadge(time, extra = '') {
    return `<span class="badge time-badge ${extra}">${esc(time)}</span>`;
  }

  function timeAgo(value) {
    if (!value) return '';
    const then = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(then.getTime())) return '';
    const diff = Math.max(0, Date.now() - then.getTime());
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins} 分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} 小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} 天前`;
    return `${Math.floor(days / 30)} 个月前`;
  }

  function seasonOf(date) {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return '春';
    if (month >= 6 && month <= 8) return '夏';
    if (month >= 9 && month <= 11) return '秋';
    return '冬';
  }

  function timeSlotOf(date) {
    const hour = date.getHours();
    if (hour >= 5 && hour < 8) return '清晨';
    if (hour >= 8 && hour < 11) return '上午';
    if (hour >= 11 && hour < 14) return '正午';
    if (hour >= 14 && hour < 17) return '午后';
    if (hour >= 17 && hour < 19) return '黄昏';
    if (hour >= 19 && hour < 23) return '夜晚';
    return '蓝调';
  }

  function localDateValue(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function toast(message, type = '') {
    const el = document.createElement('div');
    el.className = cx('toast', type);
    el.textContent = message;
    toastRoot.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function openModal(html, { onMount, className = '' } = {}) {
    modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><div class="modal ${className}" role="dialog" aria-modal="true">${html}</div></div>`;
    const backdrop = $('.modal-backdrop', modalRoot);
    const close = () => { modalRoot.innerHTML = ''; document.removeEventListener('keydown', onKey); };
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) close();
      if (event.target.closest('[data-close-modal]') && event.target === backdrop) close();
      const btn = event.target.closest('[data-modal-close]');
      if (btn) close();
    });
    if (onMount) onMount(close);
    return close;
  }

  function openNameModal() {
    const current = state.me?.name || '';
    openModal(`
      <button class="close-btn" type="button" data-modal-close aria-label="关闭">×</button>
      <h2 class="modal-title">给自己起个名字</h2>
      <p class="modal-desc">发布作品、点赞和评论需要一个昵称。它只保存在这台设备上，随时可以改。</p>
      <form class="modal-body" id="name-form">
        <div class="field">
          <label for="nickname">昵称</label>
          <input id="nickname" class="input" maxlength="20" placeholder="例如：北纬三十度" value="${esc(current)}" required />
          <p class="help">1–20 个字符，会显示在你的作品和评论旁。</p>
        </div>
        <div class="error-text hidden" id="name-error"></div>
        <div class="modal-actions">
          <button type="button" class="btn ghost small" data-modal-close>稍后</button>
          <button type="submit" class="btn primary small">保存昵称</button>
        </div>
      </form>
    `, {
      onMount(close) {
        const form = $('#name-form');
        const input = $('#nickname');
        input?.focus();
        form?.addEventListener('submit', async (event) => {
          event.preventDefault();
          const name = input.value.trim();
          if (!name) return;
          try {
            const data = await api('/api/me', { method: 'POST', body: { name } });
            state.me = data.user;
            renderUserChip();
            toast('昵称已保存');
            close();
          } catch (err) {
            const box = $('#name-error');
            box.textContent = err.message;
            box.classList.remove('hidden');
          }
        });
      },
    });
  }

  function renderUserChip() {
    $$('[data-bind="user-name"]').forEach((el) => { el.textContent = state.me?.name || '未登录'; });
  }

  /* ---------------- components ---------------- */

  function spotCard(spot) {
    return `
      <article class="spot-card">
        <a class="spot-media" href="#/spot/${spot.id}" aria-label="${esc(spot.name)}">
          <img class="spot-img" src="${esc(spot.thumb || spot.cover)}" alt="${esc(spot.name)}" loading="lazy" />
          <div class="spot-badges">
            ${spot.bestSeasons.map((s) => seasonBadge(s, 'on-image')).join('')}
          </div>
          <span class="spot-count">${spot.workCount} 张实拍</span>
        </a>
        <div class="spot-body">
          <h3 class="spot-title"><a href="#/spot/${spot.id}">${esc(spot.name)}</a></h3>
          <p class="spot-loc">${esc(spot.province)} · ${esc(spot.city)}${spot.district ? ` · ${esc(spot.district)}` : ''} · ${esc(spot.category)}</p>
          <div class="spot-tags">
            ${spot.bestTimes.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
            <span class="tag jade">实拍收录</span>
          </div>
          <div class="spot-foot">
            <span class="crowd" title="人流程度">${crowdDots(spot.crowd)} <span>人流 ${spot.crowd}/5</span></span>
            <span>${spot.likeCount} 人喜欢</span>
          </div>
        </div>
      </article>`;
  }

  function workCard(work, { showSpot = true } = {}) {
    const meta = [];
    if (showSpot && work.spotName) meta.push(esc(work.spotName));
    if (work.angleDeg !== null && work.angleDeg !== undefined) meta.push(direction(work.angleDeg));
    if (work.lens) meta.push(esc(work.lens));
    return `
      <article class="work-card">
        <a class="work-media" href="#/work/${work.id}" aria-label="${esc(work.title)}">
          <img class="work-img" src="${esc(work.thumb)}" alt="${esc(work.title)}" loading="lazy" />
          <div class="work-overlay">
            ${seasonBadge(work.season)}
            ${timeBadge(work.timeSlot)}
          </div>
        </a>
        <div class="work-body">
          <h3 class="work-title"><a href="#/work/${work.id}">${esc(work.title)}</a></h3>
          <p class="work-meta">${meta.map((item, index) => `<span class="${index ? 'dot' : ''}">${item}</span>`).join('')}</p>
          ${work.poem ? `<p class="work-poem">${esc(work.poem.split('——')[0])}</p>` : ''}
          <div class="work-foot">
            <span class="author">${avatar(work.author)}${esc(work.author)}</span>
            <div style="display:flex;gap:2px;align-items:center">
              <button class="like-btn ${work.liked ? 'liked' : ''}" type="button" data-like="${work.id}" aria-label="喜欢这张作品">
                <span class="heart">${work.liked ? '♥' : '♡'}</span><span data-like-count>${work.likes}</span>
              </button>
              <a class="like-btn" href="#/work/${work.id}" aria-label="查看评论">
                <span class="heart">💬</span><span>${work.commentCount}</span>
              </a>
            </div>
          </div>
        </div>
      </article>`;
  }

  function emptyState(title, sub, action = '') {
    return `<div class="empty"><strong>${esc(title)}</strong><span>${esc(sub)}</span>${action ? `<div style="margin-top:16px">${action}</div>` : ''}</div>`;
  }

  /* ---------------- 本机影像 ---------------- */

  function fmtDay(value) {
    return String(value || '').slice(0, 10).replaceAll('-', '.');
  }

  function materialCard(m, { masonry = false } = {}) {
    return `
      <figure class="material-card" data-material-card="${m.id}">
        <button class="material-media" type="button" data-lightbox="${m.id}" aria-label="查看 ${esc(m.title)}">
          <img src="${esc(m.thumb)}" alt="${esc(m.title)} · ${esc(m.place)}" loading="lazy" ${masonry ? `width="${m.width || 1200}" height="${m.height || 800}"` : ''} />
        </button>
        <figcaption class="material-cap">
          <span class="material-no">NO.${String(m.index).padStart(3, '0')} · ${esc(m.season)} · ${esc(m.timeSlot)}</span>
          <div class="material-title">${esc(m.title)}</div>
          <span class="material-place">${esc(m.place)} · ${fmtDay(m.takenAt)}</span>
        </figcaption>
      </figure>`;
  }

  function openLightbox(id, list) {
    const items = (list && list.length ? list : state.materials);
    const position = items.findIndex((item) => String(item.id) === String(id));
    if (position < 0) return;
    const item = items[position];
    const prev = items[(position - 1 + items.length) % items.length];
    const next = items[(position + 1) % items.length];
    openModal(`
      <button class="close-btn" type="button" data-modal-close aria-label="关闭">×</button>
      <div class="lightbox-grid">
        <div class="lightbox-image"><img src="${esc(item.image)}" alt="${esc(item.title)}" /></div>
        <div class="lightbox-meta">
          <p class="eyebrow">NO.${String(item.index).padStart(3, '0')} / 本机影像</p>
          <h3>${esc(item.title)}</h3>
          <p class="place">${esc(item.place)} · ${esc(item.takenAt.replace(' ', ' · '))}</p>
          ${item.caption ? `<p class="caption">${esc(item.caption)}</p>` : ''}
          <div class="facts">
            <div class="fact"><span class="fact-label">季节</span><span class="fact-value">${esc(item.season)} · ${esc(item.timeSlot)}</span></div>
            <div class="fact"><span class="fact-label">坐标</span><span class="fact-value">${item.lat ? `${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}` : '这张照片没有 GPS'}</span></div>
            <div class="fact"><span class="fact-label">尺寸</span><span class="fact-value">${item.width} × ${item.height}</span></div>
            <div class="fact"><span class="fact-label">来源</span><span class="fact-value">桌面「素材」· ${esc(item.source)}</span></div>
          </div>
          ${item.spotId ? `<div style="margin-top:16px"><a class="btn ghost small" href="#/spot/${item.spotId}" data-modal-close>查看所在机位</a></div>` : ''}
          ${item.lat ? `<div style="margin-top:10px"><a class="btn ghost small" href="#/atlas?material=${item.id}" data-modal-close>在地图上查看</a></div>` : ''}
          <div class="lightbox-nav">
            <button class="btn ghost small" type="button" data-lightbox-prev="${prev.id}">← 上一张</button>
            <button class="btn ghost small" type="button" data-lightbox-next="${next.id}">下一张 →</button>
          </div>
        </div>
      </div>
    `, {
      className: 'lightbox',
      onMount(close) {
        const nav = $('.lightbox-nav', modalRoot);
        if (!nav) return;
        nav.addEventListener('click', (event) => {
          const button = event.target.closest('[data-lightbox-prev], [data-lightbox-next]');
          if (!button) return;
          close();
          openLightbox(button.dataset.lightboxPrev || button.dataset.lightboxNext, items);
        });
      },
    });
  }

  /* ---------------- 地理 ---------------- */

  function haversine(a, b) {
    const rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad;
    const dLng = (b.lng - a.lng) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  }

  function projectAtlas(points, width, height, pad) {
    const valid = points.filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number');
    if (!valid.length) return null;
    const lat0 = valid.reduce((sum, p) => sum + p.lat, 0) / valid.length;
    const kx = Math.cos((lat0 * Math.PI) / 180);
    const xs = valid.map((p) => p.lng * kx);
    const ys = valid.map((p) => p.lat);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const spanX = Math.max(maxX - minX, 0.02);
    const spanY = Math.max(maxY - minY, 0.02);
    /* 示意地图：横纵分别铺满画布，保证小范围地理关系可读 */
    const scaleX = (width - pad * 2) / spanX;
    const scaleY = (height - pad * 2) / spanY;
    return {
      width, height,
      xy: (p) => [pad + (p.lng * kx - minX) * scaleX, height - pad - (p.lat - minY) * scaleY],
    };
  }

  function atlasSvg(points, { width = 1000, height = 640, pad = 58, mini = false, region = '江苏', me = null } = {}) {
    const all = me ? [...points, me] : points;
    const projection = projectAtlas(all, width, height, pad);
    if (!projection) return `<div class="atlas-empty" style="padding:30px">这里还没有带坐标的影像。</div>`;
    const { xy } = projection;
    const path = (list) => list.map((p, index) => `${index ? 'L' : 'M'}${xy(p)[0].toFixed(1)},${xy(p)[1].toFixed(1)}`).join(' ');

    const contours = Array.from({ length: mini ? 5 : 9 }, (_, i) => {
      const y = 46 + i * (height / (mini ? 6 : 10));
      const lift = 18 + (i % 3) * 9;
      return `<path d="M0,${y.toFixed(1)} C ${width * 0.22},${y - lift} ${width * 0.42},${y + lift} ${width * 0.62},${y - lift * 0.4} S ${width * 0.9},${y + lift} ${width},${y - 6}" fill="none" stroke="#c9bfa9" stroke-width="1" opacity="0.55" />`;
    }).join('');

    let water = '';
    if (region === '江苏') {
      const river = [
        { lat: 32.06, lng: 118.55 }, { lat: 32.12, lng: 118.82 }, { lat: 32.22, lng: 119.18 },
        { lat: 32.28, lng: 119.52 }, { lat: 32.30, lng: 119.92 }, { lat: 32.10, lng: 120.32 },
      ];
      const canal = [
        { lat: 34.12, lng: 118.26 }, { lat: 33.55, lng: 118.65 }, { lat: 32.95, lng: 119.05 },
        { lat: 32.45, lng: 119.40 }, { lat: 32.20, lng: 119.46 },
      ];
      water = `
        <path d="${path(river)}" fill="none" stroke="#9fb9bd" stroke-width="${mini ? 2.2 : 3}" opacity="0.85" />
        <path d="${path(canal)}" fill="none" stroke="#b7c9c6" stroke-width="${mini ? 1.2 : 1.8}" stroke-dasharray="6 5" opacity="0.8" />
      `;
    }

    const cityMarks = region === '江苏'
      ? [{ name: '宿迁', lat: 33.96, lng: 118.28 }, { name: '扬州', lat: 32.40, lng: 119.43 },
         { name: '南京', lat: 32.06, lng: 118.79 }, { name: '镇江', lat: 32.20, lng: 119.47 }]
      : region === '甘肃'
        ? [{ name: '张掖', lat: 38.93, lng: 100.45 }]
        : [];
    const cityLabels = cityMarks.map((city) => {
      const [x, y] = xy(city);
      if (x < pad * 0.6 || x > width - pad * 0.6 || y < pad * 0.6 || y > height - pad * 0.6) return '';
      return `<g opacity="0.75"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#7c7466" />
        <text x="${(x + 6).toFixed(1)}" y="${(y + 13).toFixed(1)}" font-family="serif" font-size="${mini ? 9 : 12}" fill="#7c7466" letter-spacing="2">${city.name}</text></g>`;
    }).join('');

    const spotPins = points.filter((p) => p.type === 'spot').map((p) => {
      const [x, y] = xy(p);
      return `<g class="pin-spot" data-atlas-spot="${p.id}" style="cursor:pointer">
        <title>${esc(p.name)} · ${esc(p.city)}</title>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${mini ? 3.4 : 7}" fill="#fffdf8" stroke="#1c1a16" stroke-width="1.4" />
        ${mini ? '' : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#1c1a16" />`}
      </g>`;
    }).join('');

    const materialPins = points.filter((p) => p.type === 'material').map((p) => {
      const [x, y] = xy(p);
      const angle = (p.id * 2.399) % (Math.PI * 2);
      const jitter = mini ? 0 : 4.5;
      const px = x + Math.cos(angle) * jitter;
      const py = y + Math.sin(angle) * jitter;
      return `<g class="pin-material" data-atlas-material="${p.id}" style="cursor:pointer">
        <title>${esc(p.name)} · ${esc(p.place)}</title>
        <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${mini ? 2.2 : 4}" fill="${p.season === '秋' ? '#c2462c' : p.season === '夏' ? '#2f7f8f' : p.season === '春' ? '#7ba05b' : '#6f86a6'}" opacity="0.9" />
      </g>`;
    }).join('');

    const mePin = me ? (() => {
      const [x, y] = xy(me);
      return `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="none" stroke="#2f6a5f" stroke-width="1.2" opacity="0.7" />
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#2f6a5f" />
        <text x="${(x + 14).toFixed(1)}" y="${(y + 4).toFixed(1)}" font-size="10" fill="#2f6a5f">你在这里</text></g>`;
    })() : '';

    const watermark = mini ? '' : `<text x="${width - 24}" y="${height - 24}" text-anchor="end" font-family="serif" font-size="72" fill="#1c1a16" opacity="0.045">${esc(region)}</text>`;

    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(region)}机位与影像分布示意图">
      <rect width="${width}" height="${height}" fill="#f3ede1" />
      <g>${contours}</g>
      ${water}
      <g>${cityLabels}${materialPins}${spotPins}${mePin}</g>
      ${watermark}
    </svg>`;
  }


  function skeletonBlocks(count = 3, tall = false) {
    return Array.from({ length: count }, () => `<div class="skeleton" style="height:${tall ? 320 : 280}px"></div>`).join('');
  }

  function errorBox(message) {
    return `<div class="empty"><strong>出了点问题</strong><span>${esc(message)}</span><div style="margin-top:16px"><button class="btn ghost small" type="button" onclick="location.reload()">刷新页面</button></div></div>`;
  }

  function setNav(path) {
    const section = path === '/' ? 'home'
      : path.startsWith('/spot') || path.startsWith('/spots') || path.startsWith('/work') ? 'spots'
      : path.startsWith('/gallery') ? 'gallery'
      : path.startsWith('/atlas') ? 'atlas'
      : path.startsWith('/upload') ? 'upload'
      : path.startsWith('/me') ? 'me' : '';
    $$('[data-nav]').forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === section);
    });
  }

  /* ---------------- like / comment ---------------- */

  async function toggleLike(button) {
    const workId = button.dataset.like;
    await guard(async () => {
      const data = await api(`/api/works/${workId}/like`, { method: 'POST' });
      $$(`[data-like="${workId}"]`).forEach((btn) => {
        btn.classList.toggle('liked', data.liked);
        const heart = btn.querySelector('.heart');
        if (heart) heart.textContent = data.liked ? '♥' : '♡';
        const count = btn.querySelector('[data-like-count]');
        if (count) count.textContent = data.likes;
        btn.setAttribute('aria-pressed', data.liked ? 'true' : 'false');
      });
      const big = $('#work-like');
      if (big) {
        big.classList.toggle('liked', data.liked);
        big.innerHTML = `<span class="heart">${data.liked ? '♥' : '♡'}</span> ${data.liked ? '已喜欢' : '喜欢'} · <span>${data.likes}</span>`;
      }
    });
  }

  /* ---------------- compass ---------------- */

  function compassMarkup(angle = 0) {
    const ticks = Array.from({ length: 24 }, (_, i) => {
      const deg = i * 15;
      const rad = (deg * Math.PI) / 180;
      const r1 = i % 6 === 0 ? 44 : 48;
      const x1 = 60 + Math.sin(rad) * r1;
      const y1 = 60 - Math.cos(rad) * r1;
      const x2 = 60 + Math.sin(rad) * 52;
      const y2 = 60 - Math.cos(rad) * 52;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${i % 6 === 0 ? '#1c1a16' : '#cfc5b2'}" stroke-width="${i % 6 === 0 ? 1.6 : 1}" />`;
    }).join('');
    return `
      <svg class="compass" id="compass" viewBox="0 0 120 120" role="img" aria-label="机位角度罗盘">
        <circle cx="60" cy="60" r="52" fill="#fffdf8" stroke="#e2dacb" />
        ${ticks}
        <text x="60" y="15" text-anchor="middle" font-size="9" fill="#7c7466">北</text>
        <text x="108" y="63" text-anchor="middle" font-size="9" fill="#7c7466">东</text>
        <text x="60" y="110" text-anchor="middle" font-size="9" fill="#7c7466">南</text>
        <text x="12" y="63" text-anchor="middle" font-size="9" fill="#7c7466">西</text>
        <line id="needle" x1="60" y1="60" x2="60" y2="16" stroke="#c2462c" stroke-width="2.4" stroke-linecap="round" />
        <circle id="needle-dot" cx="60" cy="16" r="4" fill="#c2462c" />
        <circle cx="60" cy="60" r="3.2" fill="#1c1a16" />
      </svg>`;
  }

  function bindCompass(initial = 0) {
    const svg = $('#compass');
    const input = $('#angle-deg');
    const readout = $('#compass-readout');
    if (!svg || !input) return;
    let angle = Number(initial) || 0;
    const apply = (deg) => {
      angle = ((Math.round(deg) % 360) + 360) % 360;
      input.value = angle;
      const rad = (angle * Math.PI) / 180;
      const x = 60 + Math.sin(rad) * 44;
      const y = 60 - Math.cos(rad) * 44;
      const needle = $('#needle');
      const dot = $('#needle-dot');
      if (needle) { needle.setAttribute('x2', x.toFixed(1)); needle.setAttribute('y2', y.toFixed(1)); }
      if (dot) { dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1)); }
      if (readout) {
        readout.innerHTML = `<strong>${direction(angle)}</strong><span>镜头朝向（0° 为正北）</span>`;
      }
      input.dispatchEvent(new CustomEvent('anglechange', { detail: angle }));
    };
    apply(angle);
    const setFromEvent = (event) => {
      const rect = svg.getBoundingClientRect();
      const dx = event.clientX - rect.left - rect.width / 2;
      const dy = event.clientY - rect.top - rect.height / 2;
      if (Math.hypot(dx, dy) < 6) return;
      const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
      apply(deg);
    };
    let dragging = false;
    svg.addEventListener('pointerdown', (event) => {
      dragging = true;
      svg.setPointerCapture(event.pointerId);
      setFromEvent(event);
    });
    svg.addEventListener('pointermove', (event) => { if (dragging) setFromEvent(event); });
    svg.addEventListener('pointerup', () => { dragging = false; });
    const range = $('#angle-range');
    if (range) {
      range.addEventListener('input', () => apply(Number(range.value)));
    }
    input.addEventListener('input', () => apply(Number(input.value) || 0));
  }

  function angleRosette(works) {
    const items = works.filter((w) => w.angleDeg !== null && w.angleDeg !== undefined);
    if (!items.length) return '<p class="muted" style="font-size:12.5px">还没有人标注角度。</p>';
    const colors = { 春: '#7ba05b', 夏: '#2f7f8f', 秋: '#c07a2c', 冬: '#6f86a6' };
    const lines = items.slice(0, 24).map((w) => {
      const rad = (Number(w.angleDeg) * Math.PI) / 180;
      const x = 60 + Math.sin(rad) * 42;
      const y = 60 - Math.cos(rad) * 42;
      return `<line x1="60" y1="60" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${colors[w.season] || '#c2462c'}" stroke-width="1.4" opacity="0.75" />`;
    }).join('');
    const legend = SEASONS.map((s) => `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10.5px;color:var(--muted)"><i style="width:6px;height:6px;border-radius:50%;background:${colors[s]};display:inline-block"></i>${s}</span>`).join('');
    return `
      <div style="display:flex;gap:14px;align-items:center">
        <svg viewBox="0 0 120 120" style="width:104px;height:104px;flex:none" role="img" aria-label="作品角度分布">
          <circle cx="60" cy="60" r="52" fill="#f6f2e9" stroke="#e2dacb" />
          <circle cx="60" cy="60" r="26" fill="none" stroke="#e2dacb" stroke-dasharray="2 4" />
          <text x="60" y="14" text-anchor="middle" font-size="8" fill="#7c7466">北</text>
          <text x="60" y="111" text-anchor="middle" font-size="8" fill="#7c7466">南</text>
          <text x="108" y="63" text-anchor="middle" font-size="8" fill="#7c7466">东</text>
          <text x="12" y="63" text-anchor="middle" font-size="8" fill="#7c7466">西</text>
          ${lines}
          <circle cx="60" cy="60" r="2.6" fill="#1c1a16" />
        </svg>
        <div style="display:flex;flex-direction:column;gap:6px">${legend}<span style="font-size:10.5px;color:var(--muted)">${items.length} 个角度标注</span></div>
      </div>`;
  }

  /* ---------------- pages ---------------- */

  async function renderHome() {
    const now = state.bootstrap.now;
    app.innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">机位 · 光线 · 地理志</p>
          <h1 class="hero-title">在人多的地方，<br />找到<span class="accent">没人的角度</span>。</h1>
          <p class="lede">从本机「素材」里的 ${state.bootstrap.stats.materials} 张风景照出发，把照片放回它发生的地方：宿迁的湖堤、扬州的巷子、镇江的江雾。看别人在什么时间、站在哪里、朝哪个方向按下快门，再决定你的下一次出发。</p>
          <p class="hero-quote">“登山则情满于山，观海则意溢于海。”<span>刘勰 · 文心雕龙</span></p>
          <div class="hero-actions">
            <a class="btn primary" href="#/gallery">走进影像志</a>
            <a class="btn ghost" href="#/atlas">打开地理</a>
          </div>
          <div class="hero-stats">
            <div><span class="stat-num">${state.bootstrap.stats.spots}</span><span class="stat-label">个小众机位</span></div>
            <div><span class="stat-num">${state.bootstrap.stats.works}</span><span class="stat-label">张实拍标注</span></div>
            <div><span class="stat-num">${state.bootstrap.stats.materials}</span><span class="stat-label">张本机影像</span></div>
            <div><span class="stat-num">${state.bootstrap.stats.materialCities}</span><span class="stat-label">座城市</span></div>
          </div>
        </div>
        <div class="hero-stack" id="hero-stack">
          <span class="hero-issue">影像志 · 二〇二五 — 二〇二六</span>
          <div class="stack-tag">此刻 · ${esc(now.season)} · ${esc(now.timeSlot)}</div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <span class="section-index">01 / 本机影像</span>
            <h2 class="section-title">从自己的硬盘里，长出一部地方影像志。</h2>
            <p class="section-sub">${state.bootstrap.stats.materials} 张风景照，来自桌面「素材」文件夹；视频、插画与人群密集照已跳过。</p>
          </div>
          <a class="section-link" href="#/gallery">走进影像志 →</a>
        </div>
        <div class="material-row" id="featured-materials">${skeletonBlocks(4)}</div>
      </section>

      <section class="section">
        <div class="now-strip">
          <div class="now-head">
            <p class="eyebrow" style="margin-bottom:6px">NOW / 此刻</p>
            <div class="now-date">${esc(now.dateLabel)}</div>
            <p class="now-meta">${esc(now.season)}季 · ${esc(now.timeSlot)}光线<br />这些机位现在正好。</p>
          </div>
          <div class="now-list" id="now-list">${skeletonBlocks(3)}</div>
        </div>
      </section>

      <section class="section">
        <div class="geo-band">
          <div class="geo-copy">
            <span class="section-index">02 / 地理</span>
            <h3>把照片放回<br />它发生的地方。</h3>
            <p>GPS 把 ${state.bootstrap.stats.materials} 张照片落在同一张纸上：${state.bootstrap.cities.map((c) => c.city).join('、')}。打开地理页，看看每座城市的机位，以及离你最近的那个。</p>
            <div class="geo-cities" id="geo-cities">
              ${state.bootstrap.cities.map((c) => `<a class="chip" href="#/atlas?city=${encodeURIComponent(c.city)}">${esc(c.city)} <span class="count-pill">${c.count}</span></a>`).join('')}
            </div>
            <p style="margin-top:18px"><a class="btn ghost small" href="#/atlas">打开地理 →</a></p>
          </div>
          <div class="geo-mini" id="geo-mini"><div class="skeleton" style="height:240px"></div></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <span class="section-index">03 / 在地机位</span>
            <h2 class="section-title">照片落点附近的机位</h2>
            <p class="section-sub">从本机影像的 GPS 里长出来的七个江苏机位</p>
          </div>
          <a class="section-link" href="#/spots?province=${encodeURIComponent('江苏')}">全部 →</a>
        </div>
        <div class="spot-grid" id="local-spots">${skeletonBlocks(3, true)}</div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">本周热门机位</h2>
            <p class="section-sub">收藏最多、角度标注最全的机位</p>
          </div>
          <a class="section-link" href="#/spots?sort=hot">查看全部 →</a>
        </div>
        <div class="spot-grid" id="hot-spots">${skeletonBlocks(3, true)}</div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">按季节找光</h2>
            <p class="section-sub">同一个地方，四季是四张不同的照片</p>
          </div>
        </div>
        <div class="season-tabs" id="season-tabs">
          ${SEASONS.map((s) => `<button type="button" data-season-tab="${s}" class="${s === now.season ? 'active' : ''}">${s}</button>`).join('')}
        </div>
        <div class="spot-grid" id="season-spots">${skeletonBlocks(3, true)}</div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">最新作品</h2>
            <p class="section-sub">每一张都标了时间、季节和镜头朝向</p>
          </div>
          <a class="section-link" href="#/spots?sort=new">去机位库 →</a>
        </div>
        <div class="work-grid" id="latest-works">${skeletonBlocks(3)}</div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">从省份开始</h2>
            <p class="section-sub">先选一个方向，再选一个季节</p>
          </div>
        </div>
        <div class="province-cloud">
          ${state.bootstrap.provinces.map((p) => `<a class="chip" href="#/spots?province=${encodeURIComponent(p)}">${esc(p)}</a>`).join('')}
        </div>
      </section>
    `;

    try {
      const province = '江苏';
      const [hot, seasonal, latest, localSpots, featured, atlas] = await Promise.all([
        api('/api/spots?sort=hot&limit=6'),
        api(`/api/spots?season=${encodeURIComponent(now.season)}&sort=hot&limit=6`),
        api('/api/works?sort=new&limit=6'),
        api(`/api/spots?province=${encodeURIComponent(province)}&sort=hot&limit=6`),
        api('/api/materials?featured=1&limit=12'),
        api('/api/atlas'),
      ]);
      state.spotsCache = hot.spots;
      state.featured = featured.materials;
      state.materials = featured.materials;

      const landscape = featured.materials.filter((m) => m.width >= m.height);
      const heroOrder = [47, 17, 56, 36, 52, 21, 29];
      const heroPicks = [];
      heroOrder.forEach((index) => {
        if (heroPicks.length >= 3) return;
        const found = featured.materials.find((m) => m.index === index);
        if (found) heroPicks.push(found);
      });
      if (!heroPicks.length) heroPicks.push(...landscape.slice(0, 3));
      const stack = $('#hero-stack');
      if (stack && heroPicks.length) {
        const frames = ['a', 'b', 'c'];
        stack.innerHTML = heroPicks.map((m, index) => `
          <figure class="stack-img ${frames[index]}">
            <img src="${esc(m.image)}" alt="${esc(m.title)}" />
            <figcaption>${esc(m.title)} · ${esc(m.city)}</figcaption>
          </figure>`).join('') + `
          <span class="hero-issue">影像志 · 二〇二五 — 二〇二六</span>
          <span class="stack-tag">此刻 · ${esc(now.season)} · ${esc(now.timeSlot)}</span>`;
      }

      const featuredGrid = $('#featured-materials');
      if (featuredGrid) {
        featuredGrid.innerHTML = featured.materials.slice(0, 8).map((m) => materialCard(m)).join('')
          || emptyState('还没有本机影像', '把风景照放进桌面「素材」文件夹，然后重新导入');
      }

      const geoMini = $('#geo-mini');
      if (geoMini) {
        geoMini.innerHTML = atlasSvg(atlas.points.filter((p) => p.province === province), {
          region: province, mini: true, width: 620, height: 300, pad: 34,
        });
      }

      const localGrid = $('#local-spots');
      if (localGrid) {
        localGrid.innerHTML = localSpots.spots.slice(0, 3).map(spotCard).join('')
          || emptyState('还没有在地机位', '带 GPS 的风景照会自动落到附近的机位');
      }

      const nowList = $('#now-list');
      if (nowList) {
        nowList.innerHTML = seasonal.spots.slice(0, 3).map((spot) => `
          <a class="now-item" href="#/spot/${spot.id}">
            <img class="now-thumb" src="${esc(spot.thumb)}" alt="" loading="lazy" />
            <div><strong>${esc(spot.name)}</strong><span>${esc(spot.bestTimes.join(' / '))} · ${spot.workCount} 张</span></div>
          </a>
        `).join('') || emptyState('这个季节还没有机位', '换个季节看看？');
      }
      const hotGrid = $('#hot-spots');
      if (hotGrid) hotGrid.innerHTML = hot.spots.map(spotCard).join('');
      const seasonGrid = $('#season-spots');
      if (seasonGrid) seasonGrid.innerHTML = seasonal.spots.map(spotCard).join('') || emptyState('这个季节还没有机位', '试试其它季节');
      const latestGrid = $('#latest-works');
      if (latestGrid) latestGrid.innerHTML = latest.works.map((w) => workCard(w)).join('');

      const tabs = $('#season-tabs');
      if (tabs) {
        tabs.addEventListener('click', async (event) => {
          const button = event.target.closest('[data-season-tab]');
          if (!button) return;
          $$('[data-season-tab]', tabs).forEach((tab) => tab.classList.toggle('active', tab === button));
          const grid = $('#season-spots');
          grid.innerHTML = skeletonBlocks(3, true);
          try {
            const data = await api(`/api/spots?season=${encodeURIComponent(button.dataset.seasonTab)}&sort=hot&limit=6`);
            grid.innerHTML = data.spots.map(spotCard).join('') || emptyState('这个季节还没有机位', '换个季节看看');
          } catch (err) {
            grid.innerHTML = errorBox(err.message);
          }
        });
      }
    } catch (err) {
      $('#hot-spots').innerHTML = errorBox(err.message);
      $('#latest-works').innerHTML = '';
      $('#season-spots').innerHTML = '';
    }
  }

  async function renderGallery() {
    const data = await api('/api/materials?limit=300');
    const materials = data.materials;
    state.materials = materials;
    const query = new URLSearchParams((location.hash.split('?')[1] || ''));
    const current = {
      city: query.get('city') || '',
      season: query.get('season') || '',
    };
    const cities = [];
    materials.forEach((m) => { if (!cities.includes(m.city)) cities.push(m.city); });
    const cityOrder = ['宿迁', '扬州', '南京', '镇江', '张掖', '未定位'];
    cities.sort((a, b) => {
      const ai = cityOrder.indexOf(a);
      const bi = cityOrder.indexOf(b);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });

    app.innerHTML = `
      <section class="page-head">
        <p class="eyebrow">影像志 / LOCAL ARCHIVE</p>
        <h1 class="page-title">从自己的硬盘里，<br />长出一部地方影像志。</h1>
        <p class="page-sub">${materials.length} 张风景照，来自桌面「素材」文件夹。视频不导入；二次元插画、人群密集的海边照与宠物照已经剔除，风景里的零星路人保留为尺度。点开任意一张，可以看见它的地点、时间与坐标。</p>
      </section>
      <div class="gallery-note">
        <span>“山有山的时辰，水有水的方向。照片只是替我们记住了那一刻。”</span>
        <em>照片时间跨度为 ${state.bootstrap.stats.firstShot || '—'} 至 ${state.bootstrap.stats.lastShot || '—'} · 坐标来自照片 GPS</em>
      </div>
      <div class="gallery-toolbar">
        <div class="chip-row" id="gallery-cities">
          <button type="button" class="chip ${!current.city ? 'active' : ''}" data-gallery-city="">全部 ${materials.length}</button>
          ${cities.map((city) => {
            const count = materials.filter((m) => m.city === city).length;
            return `<button type="button" class="chip ${current.city === city ? 'active' : ''}" data-gallery-city="${esc(city)}">${esc(city)} ${count}</button>`;
          }).join('')}
        </div>
        <div class="chip-row" id="gallery-seasons">
          <button type="button" class="chip tiny ${!current.season ? 'active' : ''}" data-gallery-season="">全部季节</button>
          ${SEASONS.map((s) => `<button type="button" class="chip tiny ${current.season === s ? 'active' : ''}" data-gallery-season="${s}">${s}</button>`).join('')}
        </div>
      </div>
      <p class="result-count" id="gallery-count"></p>
      <div class="material-masonry" id="gallery-grid"></div>
    `;

    function paint() {
      const filtered = materials.filter((m) =>
        (!current.city || m.city === current.city) && (!current.season || m.season === current.season));
      const grid = $('#gallery-grid');
      grid.innerHTML = filtered.length
        ? filtered.map((m) => materialCard(m, { masonry: true })).join('')
        : emptyState('这个组合还没有照片', '换一座城市或一个季节看看');
      const count = $('#gallery-count');
      count.textContent = `${filtered.length} 张 · ${filtered.filter((m) => m.lat).length} 张带坐标`;
      $$('#gallery-cities [data-gallery-city]').forEach((chip) => {
        chip.classList.toggle('active', (chip.dataset.galleryCity || '') === current.city);
      });
      $$('#gallery-seasons [data-gallery-season]').forEach((chip) => {
        chip.classList.toggle('active', (chip.dataset.gallerySeason || '') === current.season);
      });
      const params = new URLSearchParams();
      if (current.city) params.set('city', current.city);
      if (current.season) params.set('season', current.season);
      history.replaceState(null, '', `#/gallery${params.toString() ? `?${params}` : ''}`);
      state.galleryList = filtered;
    }

    $('#gallery-cities').addEventListener('click', (event) => {
      const chip = event.target.closest('[data-gallery-city]');
      if (!chip) return;
      current.city = chip.dataset.galleryCity || '';
      paint();
    });
    $('#gallery-seasons').addEventListener('click', (event) => {
      const chip = event.target.closest('[data-gallery-season]');
      if (!chip) return;
      current.season = chip.dataset.gallerySeason || '';
      paint();
    });
    paint();
  }

  async function renderAtlasLegacy() {
    const query = new URLSearchParams((location.hash.split('?')[1] || ''));
    const atlas = await api('/api/atlas');
    const allCities = state.bootstrap.cities;
    const materialFocus = query.get('material');
    const cityParam = query.get('city') || '';
    let region = query.get('region') || (cityParam && allCities.find((c) => c.city === cityParam)?.province) || '江苏';
    let city = cityParam;
    let season = '';
    let me = null;
    let focus = null;

    app.innerHTML = `
      <section class="page-head">
        <p class="eyebrow">地理 / ATLAS</p>
        <h1 class="page-title">先看见地方，<br />再决定去哪里等光。</h1>
        <p class="page-sub">坐标来自本机照片的 GPS，机位来自你上传与收录的机位。点一个圆点，看看那里有什么；允许定位后，会按距离替你排一遍。</p>
      </section>
      <div class="atlas-layout">
        <div class="atlas-main">
          <div class="atlas-toolbar">
            <div class="chip-row" id="atlas-regions">
              ${['江苏', '甘肃', '全国'].map((item) => `<button type="button" class="chip ${item === region ? 'active' : ''}" data-atlas-region="${item}">${item}</button>`).join('')}
            </div>
            <select class="select" id="atlas-season" style="height:36px" aria-label="按季节筛选影像">
              <option value="">全部季节</option>
              ${SEASONS.map((s) => `<option value="${s}">${s}</option>`).join('')}
            </select>
            <span class="spacer"></span>
            <button class="btn ghost small" type="button" id="atlas-locate">⌖ 定位我</button>
          </div>
          <div class="atlas-map" id="atlas-map"></div>
          <div class="atlas-legend">
            <span><i style="background:#c2462c"></i>影像（按季节着色）</span>
            <span><i style="background:#fffdf8;border:1.4px solid #1c1a16"></i>机位</span>
            <span><i style="background:#2f6a5f"></i>你的位置</span>
            <span>示意图 · 不含行政边界</span>
          </div>
        </div>
        <aside class="atlas-side">
          <div class="panel atlas-focus" id="atlas-focus"></div>
          <div class="panel">
            <div class="panel-title">地点索引</div>
            <div class="atlas-cities" id="atlas-cities"></div>
          </div>
          <div class="panel hidden" id="atlas-nearby-panel">
            <div class="panel-title">离你最近</div>
            <div class="atlas-cities" id="atlas-nearby"></div>
          </div>
        </aside>
      </div>
    `;

    function filteredPoints() {
      let points = atlas.points.filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number');
      if (region === '江苏' || region === '甘肃') {
        points = points.filter((p) => p.province === region);
      }
      if (city) points = points.filter((p) => p.city === city);
      if (season) points = points.filter((p) => p.type === 'spot' || p.season === season);
      return points;
    }

    function paint() {
      const points = filteredPoints();
      const spots = points.filter((p) => p.type === 'spot');
      const map = $('#atlas-map');
      map.innerHTML = atlasSvg(points, { region, width: 1000, height: 620, pad: 62, me });

      const citiesBox = $('#atlas-cities');
      citiesBox.innerHTML = allCities.map((item) => `
        <button type="button" class="atlas-city ${city === item.city ? 'active' : ''}" data-atlas-city="${esc(item.city)}" data-atlas-province="${esc(item.province)}">
          <span>${esc(item.city)} · ${esc(item.province)}</span><span>${item.count} 张</span>
        </button>`).join('') + (city ? `<button type="button" class="chip tiny" id="atlas-clear" style="margin-top:10px">清除城市筛选 ×</button>` : '');

      $$('#atlas-regions [data-atlas-region]').forEach((chip) => chip.classList.toggle('active', chip.dataset.atlasRegion === region));
      const seasonSelect = $('#atlas-season');
      if (seasonSelect) seasonSelect.value = season;

      const focusBox = $('#atlas-focus');
      if (!focus) {
        focusBox.innerHTML = `<div class="panel-title">从地图开始</div>
          <p class="muted" style="font-size:12.5px;line-height:1.8">当前范围：${esc(region)}${city ? ` · ${esc(city)}` : ''} · ${spots.length} 个机位、${points.length - spots.length} 张影像。点击任意圆点查看细节。</p>
          ${me ? `<p class="help">已定位，右侧“离你最近”按直线距离排序。</p>` : `<p class="help">允许定位后，会显示你与每个机位的直线距离。</p>`}`;
      } else if (focus.type === 'material') {
        focusBox.innerHTML = `
          <img src="${esc(focus.thumb)}" alt="${esc(focus.name)}" />
          <strong>${esc(focus.name)}</strong>
          <div class="focus-meta">${esc(focus.place)}<br />${esc(focus.takenAt || '')} · ${esc(focus.season)}</div>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn ghost small" type="button" data-focus-lightbox="${focus.id}">查看大图</button>
            ${focus.spotId ? `<a class="btn ghost small" href="#/spot/${focus.spotId}">所在机位</a>` : ''}
          </div>`;
      } else {
        focusBox.innerHTML = `
          <div class="panel-title">${esc(focus.name)}</div>
          <div class="focus-meta">${esc(focus.province)} · ${esc(focus.city)}<br />坐标 ${Number(focus.lat).toFixed(4)}, ${Number(focus.lng).toFixed(4)}</div>
          <div style="margin-top:12px"><a class="btn ghost small" href="#/spot/${focus.id}">进入机位 →</a></div>`;
      }

      const nearbyPanel = $('#atlas-nearby-panel');
      if (me && spots.length) {
        const ranked = spots
          .map((spot) => ({ ...spot, distance: haversine(me, spot) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 6);
        nearbyPanel.classList.remove('hidden');
        $('#atlas-nearby').innerHTML = ranked.map((spot) => `
          <a class="atlas-city" href="#/spot/${spot.id}" data-atlas-spot-link="${spot.id}">
            <span>${esc(spot.name)}</span><span>${spot.distance < 1 ? `${Math.round(spot.distance * 1000)} m` : `${spot.distance.toFixed(1)} km`}</span>
          </a>`).join('');
      } else {
        nearbyPanel.classList.add('hidden');
      }
    }

    $('#atlas-regions').addEventListener('click', (event) => {
      const chip = event.target.closest('[data-atlas-region]');
      if (!chip) return;
      region = chip.dataset.atlasRegion;
      if (region === '全国') city = '';
      paint();
    });
    $('#atlas-season').addEventListener('change', (event) => {
      season = event.target.value;
      paint();
    });
    $('#atlas-map').addEventListener('click', (event) => {
      const spotPin = event.target.closest('[data-atlas-spot]');
      if (spotPin) {
        focus = atlas.points.find((p) => p.type === 'spot' && String(p.id) === spotPin.dataset.atlasSpot);
        paint();
        return;
      }
      const materialPin = event.target.closest('[data-atlas-material]');
      if (materialPin) {
        focus = atlas.points.find((p) => p.type === 'material' && String(p.id) === materialPin.dataset.atlasMaterial);
        paint();
      }
    });
    $('#atlas-cities').addEventListener('click', (event) => {
      const clear = event.target.closest('#atlas-clear');
      if (clear) { city = ''; paint(); return; }
      const item = event.target.closest('[data-atlas-city]');
      if (!item) return;
      city = item.dataset.atlasCity;
      region = item.dataset.atlasProvince;
      paint();
    });
    $('#atlas-locate').addEventListener('click', () => {
      if (!navigator.geolocation) { toast('这台浏览器不支持定位', 'error'); return; }
      toast('正在请求定位…');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          me = { lat: position.coords.latitude, lng: position.coords.longitude };
          toast('定位成功，已按距离排序');
          paint();
        },
        () => toast('定位失败：请允许浏览器访问位置', 'error'),
        { enableHighAccuracy: false, timeout: 8000 },
      );
    });
    if (materialFocus) {
      await api(`/api/materials/${materialFocus}`).then((res) => {
        const found = atlas.points.find((p) => p.type === 'material' && String(p.id) === String(materialFocus));
        if (found) focus = found;
        if (!state.materials.some((m) => String(m.id) === String(materialFocus))) {
          state.materials = [res.material];
        }
      }).catch(() => {});
    }
    paint();
  }

  async function renderAtlas() {
    disposeGlobe();
    const atlas = await api('/api/atlas');
    const query = new URLSearchParams((location.hash.split('?')[1] || ''));
    const localBackground = query.get('bg') === 'local';
    const cities = state.bootstrap.cities.slice(0, 6);
    const saved = localStorage.getItem('sg.biome');
    let biome = BIOMES.find((item) => item.id === saved) || BIOMES[0];
    let filter = 'all';
    let season = '';
    let me = null;
    let bgIndex = 0;
    let panel = { type: 'default' };
    let points = atlas.points.map((p) => ({ ...p, key: `${p.type}-${p.id}` }));
    const biomePoints = BIOMES.map((item) => ({
      type: 'biome', id: item.id, key: `biome-${item.id}`, name: item.name,
      place: item.region, lat: item.lat, lng: item.lng, season: '', thumb: '',
    }));
    points = [...points, ...biomePoints];

    app.innerHTML = `
      <section class="atlas-stage">
        <div class="atlas-bg on" data-bg="a"></div>
        <div class="atlas-bg" data-bg="b"></div>
        <div class="atlas-veil"></div>
        <div class="shell atlas-top">
          <p class="eyebrow">地理 / ATLAS · 3D EARTH</p>
          <h1 class="atlas-title">先看见地方，<br />再决定去哪里等光。</h1>
          <p class="atlas-sub">拖动地球旋转，滚轮或双指缩放；点陆地上的任意位置，看看那里有什么。光点是本机影像，圆圈是机位，菱形是地貌档案。</p>
        </div>
        <div class="shell atlas-body">
          <div class="globe-wrap">
            <div class="globe-stage" id="globe-stage"></div>
            <div class="globe-status" id="globe-status">正在加载地球…</div>
            <div class="globe-readout" id="globe-readout"><strong>江苏 · 扬州</strong><span>32.40°N · 119.43°E</span></div>
            <div class="globe-legend">
              <span><i style="background:#e49e66"></i>我的影像</span>
              <span><i style="background:#f8f2e4;border:1px solid #fff"></i>机位</span>
              <span><i style="background:#8fd0dd;border-radius:1px"></i>地貌档案</span>
            </div>
            <div class="globe-tools">
              <button type="button" data-globe-tool="in" aria-label="放大">＋</button>
              <button type="button" data-globe-tool="out" aria-label="缩小">－</button>
              <button type="button" data-globe-tool="rotate" class="wide">开始自转</button>
              <button type="button" data-globe-tool="reset" class="wide">重置</button>
            </div>
          </div>
          <aside class="atlas-panel" id="atlas-panel"></aside>
        </div>
        <div class="shell biome-strip-wrap">
          <div class="biome-strip-label">想看的地貌 / CHOOSE A LANDSCAPE</div>
          <div class="biome-strip" id="biome-strip"></div>
        </div>
        <p class="shell atlas-credit">背景：Unsplash 与本机「素材」 · 地球贴图：NASA Blue Marble（three.js 示例资源） · 示意地理，不含行政边界</p>
      </section>

      <section class="shell section atlas-index">
        <div class="section-head">
          <div>
            <span class="section-index">城市 / CITIES</span>
            <h2 class="section-title">从一张照片，走到一座城。</h2>
            <p class="section-sub">点击城市，地球会转过去，并把背景切换成那里的地貌。</p>
          </div>
          <a class="section-link" href="#/gallery">查看全部影像 →</a>
        </div>
        <div class="city-cards" id="city-cards">
          ${cities.map((city) => {
            const coord = CITY_COORDS[city.city] || [34, 110];
            return `<button type="button" class="city-card" data-city="${esc(city.city)}" data-lat="${coord[0]}" data-lng="${coord[1]}" data-province="${esc(city.province)}">
              <em>${esc(city.province).toUpperCase()}</em>
              <strong>${esc(city.city)}</strong>
              <span>${city.count} 张本机影像</span>
            </button>`;
          }).join('')}
        </div>
        <div class="section-head" style="margin-top:44px">
          <div>
            <span class="section-index">世界 / WORLD</span>
            <h2 class="section-title">把地球转到别的国家。</h2>
            <p class="section-sub">自然地理与人文地理各选几处，点击会转动地球、切换地貌背景，并打开档案。配图为同类地貌氛围图，非该地实拍。</p>
          </div>
        </div>
        <div class="world-grid" id="world-cards">
          ${WORLD.map((item) => {
            const look = BIOMES.find((b) => b.id === item.kind) || BIOMES[0];
            return `<button type="button" class="world-card" data-world="${item.id}">
              <img class="world-bg" src="${look.local}" alt="" loading="lazy" />
              <span class="world-glyph">${biomeGlyph(item.kind)}</span>
              <span class="world-note">氛围图</span>
              <span class="world-type">${esc(item.type)}</span>
              <span class="world-name">${esc(item.name)}</span>
              <span class="world-region">${esc(item.region)}</span>
            </button>`;
          }).join('')}
        </div>
      </section>
    `;

    const globeStage = $('#globe-stage');
    const globe = window.createGlobe(globeStage, {
      textureUrl: query.get('notex') === '1' ? '' : undefined,
      onSelect: (point) => {
        if (point.type === 'biome') {
          selectBiome(point.id, { focus: false });
          panel = { type: 'biome', id: point.id };
        } else if (point.type === 'material') {
          panel = { type: 'material', point };
        } else if (point.type === 'spot') {
          panel = { type: 'spot', point };
        } else if (point.type === 'me') {
          panel = { type: 'me' };
        }
        renderPanel();
        updateReadout(point.lat, point.lng, point.place || point.name);
      },
      onPick: ({ lat, lng }) => {
        const nearBiome = nearestBiome(lat, lng);
        const nearPoint = nearestPoint(lat, lng);
        panel = { type: 'pick', lat, lng, biome: nearBiome && nearBiome.distance < 1600 ? nearBiome.biome : null, nearest: nearPoint };
        renderPanel();
        updateReadout(lat, lng, nearBiome && nearBiome.distance < 450 ? nearBiome.biome.region : '地球上的这一点');
      },
      onReady: ({ texture }) => {
        const status = $('#globe-status');
        if (!status) return;
        status.textContent = texture ? '' : '贴图未加载 · 线框地球';
        if (texture) status.remove();
        else setTimeout(() => status.remove(), 2600);
      },
    });
    activeGlobe = globe;
    activeAtmosphere = window.createAtmosphere($('.atlas-stage'), atmosphereFor(biome.id));
    globe.setPoints(points);

    function nearestBiome(lat, lng) {
      let best = null;
      BIOMES.forEach((item) => {
        const distance = haversine({ lat, lng }, item);
        if (!best || distance < best.distance) best = { biome: item, distance };
      });
      return best;
    }
    function nearestPoint(lat, lng) {
      let best = null;
      points.filter((p) => p.type === 'material' || p.type === 'spot').forEach((item) => {
        const distance = haversine({ lat, lng }, item);
        if (!best || distance < best.distance) best = { point: item, distance };
      });
      return best;
    }
    function updateReadout(lat, lng, place) {
      const box = $('#globe-readout');
      if (!box) return;
      box.innerHTML = `<strong>${esc(place || '地球上的这一点')}</strong><span>${Number(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} · ${Number(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}</span>`;
    }
    function setBackground(item) {
      const layers = $$('.atlas-bg');
      const next = layers[bgIndex % 2];
      const prev = layers[(bgIndex + 1) % 2];
      const first = item.localFirst ? item.local : item.remote;
      const second = item.localFirst ? item.remote : item.local;
      next.style.backgroundImage = localBackground ? `url("${item.local}")` : `url("${first}"), url("${second}")`;
      next.classList.add('on');
      prev.classList.remove('on');
      bgIndex += 1;
    }
    function selectBiome(id, { focus = true, showPanel = true } = {}) {
      const item = BIOMES.find((entry) => entry.id === id);
      if (!item) return;
      biome = item;
      localStorage.setItem('sg.biome', item.id);
      setBackground(item);
      if (activeAtmosphere) activeAtmosphere.setMode(atmosphereFor(item.id));
      $$('#biome-strip [data-biome]').forEach((chip) => chip.classList.toggle('active', chip.dataset.biome === item.id));
      if (focus) globe.focus(item.lat, item.lng, 3.05);
      if (showPanel) {
        panel = { type: 'biome', id: item.id };
        renderPanel();
      }
      updateReadout(item.lat, item.lng, item.region);
    }
    function applyFilter() {
      globe.setFilter((point) => {
        if (point.type === 'me') return true;
        if (season && point.type === 'material' && point.season !== season) return false;
        if (filter === 'mine') return point.type === 'material';
        if (filter === 'spots') return point.type === 'spot';
        if (filter === 'biomes') return point.type === 'biome';
        return true;
      });
      $$('#atlas-panel [data-globe-filter]').forEach((chip) => chip.classList.toggle('active', chip.dataset.globeFilter === filter));
    }

    function renderPanel() {
      const box = $('#atlas-panel');
      if (!box) return;
      if (panel.type === 'default' || panel.type === 'pick') {
        const picked = panel.type === 'pick' ? panel : null;
        const mineCount = points.filter((p) => p.type === 'material').length;
        const spotCount = points.filter((p) => p.type === 'spot').length;
        const biomeCount = points.filter((p) => p.type === 'biome').length;
        box.innerHTML = `
          <div class="panel">
            <div class="panel-head-row">
              <div class="panel-title">${picked ? '你点到了这里' : '从地球开始'}</div>
              <small>${picked ? `${picked.lat.toFixed(1)}° / ${picked.lng.toFixed(1)}°` : 'DRAG · ZOOM · TAP'}</small>
            </div>
            <p class="help" style="font-size:11.5px;line-height:1.8">${filter === 'mine' ? `这些光点连起来，就是你在 ${state.bootstrap.stats.firstShot || ''}—${state.bootstrap.stats.lastShot || ''} 之间的足迹。` : picked ? '你点到了这里。最近的影像与地貌档案在下面。' : '拖动旋转，滚轮缩放，点击陆地上的任意位置。'}</p>
            <div class="filter-chips">
              ${[['all', `全部 ${points.length}`], ['mine', `我的影像 ${mineCount}`], ['spots', `机位 ${spotCount}`], ['biomes', `地貌 ${biomeCount}`]].map(([id, label]) => `<button type="button" class="chip tiny ${filter === id ? 'active' : ''}" data-globe-filter="${id}">${label}</button>`).join('')}
              <select class="select" id="globe-season" aria-label="按季节筛选影像" style="height:30px;font-size:11px;background-color:transparent;color:inherit;border-color:rgba(248,242,228,.22)">
                <option value="">全部季节</option>
                ${SEASONS.map((s) => `<option value="${s}" ${season === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            ${picked && picked.biome ? `
              <div style="margin-top:16px">
                <div class="focus-place">最近的地貌 · ${esc(picked.biome.name)} · 约 ${Math.round(picked.biome.distance)} km</div>
                <button type="button" class="btn ghost small" data-biome="${picked.biome.id}" style="margin-top:8px">查看 ${esc(picked.biome.name)} 档案</button>
              </div>` : ''}
            ${picked && picked.nearest ? `
              <div style="margin-top:16px">
                <div class="focus-place">最近的${picked.nearest.point.type === 'spot' ? '机位' : '影像'} · ${picked.nearest.distance < 1 ? `${Math.round(picked.nearest.distance * 1000)} m` : `${picked.nearest.distance.toFixed(0)} km`}</div>
                <div class="focus-title" style="font-size:17px">${esc(picked.nearest.point.name)}</div>
                <button type="button" class="btn ghost small" data-jump="${picked.nearest.point.type}:${picked.nearest.point.id}" style="margin-top:8px">查看</button>
              </div>` : ''}
            <div style="margin-top:18px">
              <div class="focus-place">城市</div>
              <div id="panel-cities">
                ${cities.map((city) => `<button type="button" class="city-line" data-city="${esc(city.city)}" data-lat="${(CITY_COORDS[city.city] || [34, 110])[0]}" data-lng="${(CITY_COORDS[city.city] || [34, 110])[1]}" data-province="${esc(city.province)}"><span>${esc(city.city)} · ${esc(city.province)}</span><span>${city.count} 张</span></button>`).join('')}
              </div>
            </div>
            <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="btn ghost small" data-locate>⌖ 按我的位置</button>
              <button type="button" class="btn ghost small" data-biome="${biome.id}">看 ${esc(biome.name)} 档案</button>
            </div>
          </div>`;
        applyFilter();
        return;
      }
      if (panel.type === 'biome') {
        const item = BIOMES.find((entry) => entry.id === panel.id) || biome;
        box.innerHTML = `
          <div class="panel">
            <p class="eyebrow">${item.en} / 地貌档案</p>
            <div class="focus-title">${esc(item.title)}</div>
            <div class="focus-place">${esc(item.region)} · ${item.lat.toFixed(2)}°N ${item.lng.toFixed(2)}°E</div>
            <p class="focus-text">${esc(item.text)}</p>
            <div class="focus-fact"><b>地理注脚 · </b>${esc(item.fact)}</div>
            <div class="focus-actions">
              <a class="btn primary small" href="https://search.bilibili.com/all?keyword=${encodeURIComponent(item.video)}" target="_blank" rel="noopener noreferrer">看视频</a>
              <button type="button" class="btn ghost small" data-biome-focus="${item.id}">转到地球</button>
              <button type="button" class="btn ghost small" data-biome-bg="${item.id}">设为背景</button>
            </div>
            <p class="help" style="margin-top:10px">背景影像：Unsplash / 本机素材</p>
          </div>`;
        return;
      }
      if (panel.type === 'world') {
        const item = WORLD.find((entry) => entry.id === panel.id);
        if (!item) { panel = { type: 'default' }; return renderPanel(); }
        const look = BIOMES.find((entry) => entry.id === item.kind) || BIOMES[0];
        box.innerHTML = `
          <div class="panel">
            <img class="focus-thumb" src="${look.local}" alt="${esc(item.name)}" loading="lazy" />
            <p class="eyebrow" style="margin-top:12px">${esc(item.type)} / 世界地理</p>
            <div class="focus-title">${esc(item.name)}</div>
            <div class="focus-place">${esc(item.region)} · ${item.lat.toFixed(2)}°, ${item.lng.toFixed(2)}°</div>
            <p class="focus-text">${esc(item.text)}</p>
            <div class="focus-fact"><b>地理注脚 · </b>${esc(item.fact)}</div>
            <div class="focus-actions">
              <a class="btn primary small" href="https://search.bilibili.com/all?keyword=${encodeURIComponent(item.video)}" target="_blank" rel="noopener noreferrer">看视频</a>
              <button type="button" class="btn ghost small" data-world-focus="${item.id}">转到地球</button>
              <button type="button" class="btn ghost small" data-biome-bg="${look.id}">设为背景</button>
            </div>
            <p class="help" style="margin-top:10px">配图为同类地貌氛围图 · Unsplash / 本机素材</p>
          </div>`;
        return;
      }
      if (panel.type === 'material') {
        const item = panel.point;
        box.innerHTML = `
          <div class="panel">
            <img class="focus-thumb" src="${esc(item.thumb)}" alt="${esc(item.name)}" />
            <div class="focus-title">${esc(item.name)}</div>
            <div class="focus-place">${esc(item.place)} · ${esc(item.takenAt || '')} · ${esc(item.season || '')}</div>
            <div class="focus-actions">
              <button type="button" class="btn ghost small" data-focus-lightbox="${item.id}">查看大图</button>
              ${item.spotId ? `<a class="btn ghost small" href="#/spot/${item.spotId}">所在机位</a>` : ''}
              <button type="button" class="btn ghost small" data-locate>定位我</button>
            </div>
            <p class="help" style="margin-top:10px">这是你桌面「素材」里的影像，坐标为拍摄时的 GPS。</p>
          </div>`;
        return;
      }
      if (panel.type === 'spot') {
        const item = panel.point;
        box.innerHTML = `
          <div class="panel">
            <p class="eyebrow">机位 / SPOT</p>
            <div class="focus-title">${esc(item.name)}</div>
            <div class="focus-place">${esc(item.province)} · ${esc(item.city)} · ${item.lat.toFixed(3)}, ${item.lng.toFixed(3)}</div>
            <p class="focus-text">这是地球上的一个机位。进入机位页可以看到光线日历、作品与镜头朝向。</p>
            <div class="focus-actions">
              <a class="btn primary small" href="#/spot/${item.id}">进入机位</a>
              <button type="button" class="btn ghost small" data-locate>按我的位置测距</button>
            </div>
          </div>`;
        return;
      }
      if (panel.type === 'me') {
        box.innerHTML = mePanelHtml();
        return;
      }
    }

    function mePanelHtml() {
      const spots = atlas.points.filter((p) => p.type === 'spot');
      const ranked = me ? spots.map((spot) => ({ spot, distance: haversine(me, spot) })).sort((a, b) => a.distance - b.distance).slice(0, 6) : [];
      return `
        <div class="panel">
          <div class="panel-title">你在这里</div>
          ${me ? `<p class="help">${me.lat.toFixed(4)}, ${me.lng.toFixed(4)}</p>` : '<p class="help">允许浏览器定位后，会按直线距离列出最近的机位。</p>'}
          ${ranked.length ? `<div style="margin-top:12px">${ranked.map(({ spot, distance }) => `
            <a class="city-line" href="#/spot/${spot.id}"><span>${esc(spot.name)}</span><span>${distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}</span></a>`).join('')}</div>` : ''}
          <div style="margin-top:14px"><button type="button" class="btn ghost small" data-locate>重新定位</button></div>
        </div>`;
    }

    $('#biome-strip').innerHTML = BIOMES.map((item) => `
      <button type="button" class="biome-chip ${item.id === biome.id ? 'active' : ''}" data-biome="${item.id}">
        ${biomeGlyph(item.id)}${esc(item.name)}<span style="opacity:.45;font-size:10px">${esc(item.en)}</span>
      </button>`).join('');

    $('#biome-strip').addEventListener('click', (event) => {
      const chip = event.target.closest('[data-biome]');
      if (chip) selectBiome(chip.dataset.biome, { focus: true });
    });

    $('#atlas-panel').addEventListener('click', (event) => {
      const filterChip = event.target.closest('[data-globe-filter]');
      if (filterChip) {
        filter = filterChip.dataset.globeFilter;
        panel = { type: panel.type === 'pick' ? 'pick' : 'default', ...(panel.type === 'pick' ? panel : {}) };
        renderPanel();
        return;
      }
      const locate = event.target.closest('[data-locate]');
      if (locate) { locateMe(); return; }
      const city = event.target.closest('[data-city]');
      if (city) { focusCity(city.dataset.city, Number(city.dataset.lat), Number(city.dataset.lng), city.dataset.province); return; }
      const biomeBtn = event.target.closest('[data-biome]');
      if (biomeBtn) { selectBiome(biomeBtn.dataset.biome, { focus: true }); panel = { type: 'biome', id: biomeBtn.dataset.biome }; renderPanel(); return; }
      const biomeFocus = event.target.closest('[data-biome-focus]');
      if (biomeFocus) { const item = BIOMES.find((entry) => entry.id === biomeFocus.dataset.biomeFocus); if (item) globe.focus(item.lat, item.lng, 2.95); return; }
      const biomeBg = event.target.closest('[data-biome-bg]');
      if (biomeBg) { selectBiome(biomeBg.dataset.biomeBg, { focus: false, showPanel: false }); toast('背景已切换'); return; }
      const worldFocus = event.target.closest('[data-world-focus]');
      if (worldFocus) { focusWorld(worldFocus.dataset.worldFocus); return; }
      const jump = event.target.closest('[data-jump]');
      if (jump) {
        const [kind, id] = jump.dataset.jump.split(':');
        const found = points.find((p) => p.type === kind && String(p.id) === String(id));
        if (found) {
          panel = { type: kind === 'spot' ? 'spot' : 'material', point: found };
          renderPanel();
          globe.focus(found.lat, found.lng, 2.9);
        }
        return;
      }
      const lightbox = event.target.closest('[data-focus-lightbox]');
      if (lightbox) {
        api(`/api/materials/${lightbox.dataset.focusLightbox}`)
          .then((res) => openLightbox(lightbox.dataset.focusLightbox, [res.material]))
          .catch((err) => toast(err.message, 'error'));
      }
    });

    $('#atlas-panel').addEventListener('change', (event) => {
      if (event.target.id === 'globe-season') {
        season = event.target.value;
        applyFilter();
      }
    });

    $('#city-cards').addEventListener('click', (event) => {
      const card = event.target.closest('[data-city]');
      if (!card) return;
      focusCity(card.dataset.city, Number(card.dataset.lat), Number(card.dataset.lng), card.dataset.province);
    });

    function focusWorld(id) {
      const item = WORLD.find((entry) => entry.id === id);
      if (!item) return;
      const look = BIOMES.find((entry) => entry.id === item.kind) || BIOMES[0];
      selectBiome(look.id, { focus: false, showPanel: false });
      globe.focus(item.lat, item.lng, 2.6);
      panel = { type: 'world', id: item.id };
      renderPanel();
      updateReadout(item.lat, item.lng, `${item.name} · ${item.region}`);
      document.querySelector('.atlas-stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    $('#world-cards').addEventListener('click', (event) => {
      const card = event.target.closest('[data-world]');
      if (card) focusWorld(card.dataset.world);
    });

    $('.globe-tools').addEventListener('click', (event) => {
      const tool = event.target.closest('[data-globe-tool]');
      if (!tool) return;
      const action = tool.dataset.globeTool;
      if (action === 'in') globe.zoom(0.86);
      if (action === 'out') globe.zoom(1.16);
      if (action === 'reset') globe.reset();
      if (action === 'rotate') {
        tool.dataset.spinning = tool.dataset.spinning === '1' ? '0' : '1';
        const spinning = tool.dataset.spinning === '1';
        tool.textContent = spinning ? '暂停自转' : '开始自转';
        globe.setAutoRotate(spinning);
      }
    });

    function focusCity(city, lat, lng, province) {
      const target = BIOMES.find((item) => item.id === (province === '甘肃' ? 'danxia' : 'water')) || biome;
      selectBiome(target.id, { focus: false, showPanel: false });
      globe.focus(lat, lng, 2.9);
      filter = 'all';
      panel = { type: 'default' };
      renderPanel();
      updateReadout(lat, lng, `${province} · ${city}`);
      document.querySelector('.atlas-stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function locateMe() {
      if (!navigator.geolocation) { toast('这台浏览器不支持定位', 'error'); return; }
      toast('正在请求定位…');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          me = { type: 'me', id: 'me', key: 'me', name: '你在这里', lat: position.coords.latitude, lng: position.coords.longitude, season: '', thumb: '' };
          if (!points.some((p) => p.type === 'me')) points = [...points, me];
          globe.setPoints(points);
          applyFilter();
          const near = nearestBiome(me.lat, me.lng);
          if (near) selectBiome(near.biome.id, { focus: false, showPanel: false });
          globe.focus(me.lat, me.lng, 2.75);
          panel = { type: 'me' };
          renderPanel();
          updateReadout(me.lat, me.lng, '你在这里');
          toast('已定位，看看离你最近的地方');
        },
        () => toast('定位失败：请在浏览器中允许位置权限', 'error'),
        { enableHighAccuracy: false, timeout: 9000 },
      );
    }

    panel = { type: 'default' };
    selectBiome(biome.id, { focus: true, showPanel: false });
    renderPanel();
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'granted') locateMe();
      }).catch(() => {});
    }
  }

  function spotFilterChips(provinces, current) {
    return ['全部', ...provinces].map((province) => `
      <button type="button" class="chip ${province === current ? 'active' : ''}" data-province="${province === '全部' ? '' : esc(province)}">${esc(province)}</button>
    `).join('');
  }

  async function renderSpots() {
    const query = new URLSearchParams((location.hash.split('?')[1] || ''));
    const current = {
      q: query.get('q') || '',
      province: query.get('province') || '',
      city: query.get('city') || '',
      district: query.get('district') || '',
      category: query.get('category') || '',
      season: query.get('season') || '',
      time: query.get('time') || '',
      sort: query.get('sort') || 'hot',
    };
    const geo = state.bootstrap.geo || [];
    const provinceNode = geo.find((node) => node.province === current.province);
    const cityNode = provinceNode && provinceNode.cities.find((node) => node.city === current.city);
    app.innerHTML = `
      <section class="page-head">
        <p class="eyebrow">机位库 / SPOT ATLAS</p>
        <h1 class="page-title">按光线找地方，<br />而不是按热门榜单。</h1>
        <p class="page-sub">${state.bootstrap.stats.spots} 个实拍机位，覆盖 ${state.bootstrap.stats.provinces} 个省份。只收录有真实照片来源的机位；省 → 市 → 区县逐级筛选，条件会写进网址。</p>
      </section>
      <div class="filter-bar">
        <label class="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <input id="spot-search" type="search" placeholder="搜索景点、城市或省份" value="${esc(current.q)}" aria-label="搜索机位" />
        </label>
        <select class="select" id="filter-province" aria-label="按省份筛选">
          <option value="">全部省份</option>
          ${geo.map((node) => `<option value="${esc(node.province)}" ${node.province === current.province ? 'selected' : ''}>${esc(node.province)}</option>`).join('')}
        </select>
        <select class="select" id="filter-city" aria-label="按城市筛选">
          <option value="">全部城市</option>
          ${(provinceNode ? provinceNode.cities : []).map((node) => `<option value="${esc(node.city)}" ${node.city === current.city ? 'selected' : ''}>${esc(node.city)}</option>`).join('')}
        </select>
        <select class="select" id="filter-district" aria-label="按区县筛选">
          <option value="">全部区县</option>
          ${(cityNode ? cityNode.districts : []).map((node) => `<option value="${esc(node.district)}" ${node.district === current.district ? 'selected' : ''}>${esc(node.district)}</option>`).join('')}
        </select>
        <select class="select" id="filter-category" aria-label="按类型筛选">
          <option value="">全部类型</option>
          ${state.bootstrap.categories.map((c) => `<option value="${esc(c)}" ${c === current.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}
        </select>
        <select class="select" id="filter-season" aria-label="按季节筛选">
          <option value="">全部季节</option>
          ${SEASONS.map((s) => `<option value="${s}" ${s === current.season ? 'selected' : ''}>${s}季</option>`).join('')}
        </select>
        <select class="select" id="filter-sort" aria-label="排序">
          <option value="hot" ${current.sort === 'hot' ? 'selected' : ''}>最受欢迎</option>
          <option value="new" ${current.sort === 'new' ? 'selected' : ''}>最近添加</option>
          <option value="name" ${current.sort === 'name' ? 'selected' : ''}>按名称</option>
        </select>
      </div>
      <p class="result-count" id="spot-count">正在寻找…</p>
      <div class="spot-grid" id="spot-results">${skeletonBlocks(6, true)}</div>
    `;

    const updateUrl = (patch) => {
      const params = new URLSearchParams(current);
      Object.entries(patch).forEach(([key, value]) => {
        if (value) params.set(key, value); else params.delete(key);
      });
      Object.assign(current, patch);
      const qs = params.toString();
      history.replaceState(null, '', `#/spots${qs ? `?${qs}` : ''}`);
    };

    let seq = 0;
    async function load() {
      const id = ++seq;
      const params = new URLSearchParams();
      Object.entries(current).forEach(([key, value]) => { if (value) params.set(key, value); });
      try {
        const data = await api(`/api/spots?${params.toString()}`);
        if (id !== seq) return;
        const results = $('#spot-results');
        const count = $('#spot-count');
        count.textContent = data.total ? `找到 ${data.total} 个机位` : '没有匹配的机位';
        results.innerHTML = data.spots.length
          ? data.spots.map(spotCard).join('')
          : emptyState('没有找到匹配的机位', '试试去掉一两个筛选条件，或换一个省份', '<a class="btn ghost small" href="#/spots">清空筛选</a>');
      } catch (err) {
        if (id !== seq) return;
        $('#spot-results').innerHTML = errorBox(err.message);
      }
    }

    let timer = null;
    $('#spot-search').addEventListener('input', (event) => {
      clearTimeout(timer);
      const value = event.target.value.trim();
      timer = setTimeout(() => { updateUrl({ q: value }); load(); }, 280);
    });
    $('#filter-category').addEventListener('change', (event) => { updateUrl({ category: event.target.value }); load(); });
    $('#filter-season').addEventListener('change', (event) => { updateUrl({ season: event.target.value }); load(); });
    $('#filter-sort').addEventListener('change', (event) => { updateUrl({ sort: event.target.value }); load(); });

    function fillCities(province, selectedCity = '') {
      const node = geo.find((item) => item.province === province);
      const citySelect = $('#filter-city');
      citySelect.innerHTML = `<option value="">全部城市</option>${(node ? node.cities : []).map((city) => `<option value="${esc(city.city)}" ${city.city === selectedCity ? 'selected' : ''}>${esc(city.city)}</option>`).join('')}`;
      const cityNode = node && node.cities.find((city) => city.city === selectedCity);
      fillDistricts(cityNode, '');
    }
    function fillDistricts(cityNode, selectedDistrict = '') {
      const select = $('#filter-district');
      select.innerHTML = `<option value="">全部区县</option>${(cityNode ? cityNode.districts : []).map((district) => `<option value="${esc(district.district)}" ${district.district === selectedDistrict ? 'selected' : ''}>${esc(district.district)}</option>`).join('')}`;
    }

    $('#filter-province').addEventListener('change', (event) => {
      const province = event.target.value;
      current.city = '';
      current.district = '';
      updateUrl({ province, city: '', district: '' });
      fillCities(province);
      load();
    });
    $('#filter-city').addEventListener('change', (event) => {
      const city = event.target.value;
      current.city = city;
      current.district = '';
      const node = geo.find((item) => item.province === current.province);
      const cityNode = node && node.cities.find((item) => item.city === city);
      updateUrl({ city, district: '' });
      fillDistricts(cityNode);
      load();
    });
    $('#filter-district').addEventListener('change', (event) => {
      current.district = event.target.value;
      updateUrl({ district: current.district });
      load();
    });

    await load();
    if (current.q) {
      const input = $('#spot-search');
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  async function renderSpot(spotId) {
    app.innerHTML = `<div style="padding-top:28px"><div class="skeleton" style="height:360px"></div></div>`;
    const { spot } = await api(`/api/spots/${spotId}`);
    const counts = {};
    TIMES.forEach((t) => { counts[t] = {}; SEASONS.forEach((s) => { counts[t][s] = 0; }); });
    spot.works.forEach((work) => {
      if (counts[work.timeSlot] && counts[work.timeSlot][work.season] !== undefined) {
        counts[work.timeSlot][work.season] += 1;
      }
    });
    const calendar = `
      <div class="calendar">
        <span></span>
        ${SEASONS.map((s) => `<span class="cal-head">${s}</span>`).join('')}
        ${TIMES.map((t) => `
          <span class="cal-row">${t}</span>
          ${SEASONS.map((s) => {
            const n = counts[t][s];
            const cls = n >= 3 ? 'hot' : n > 0 ? 'on' : '';
            return `<span class="cal-cell ${cls}" title="${t} · ${s}：${n} 张">${n ? `<span class="n">${n}</span>` : ''}</span>`;
          }).join('')}
        `).join('')}
      </div>`;

    app.innerHTML = `
      <div class="detail">
        <nav class="breadcrumb"><a href="#/">发现</a><span class="sep">/</span><a href="#/spots">机位库</a><span class="sep">/</span><span>${esc(spot.province)}</span></nav>
        <header class="detail-head">
          <div>
            <h1 class="detail-title">${esc(spot.name)}</h1>
            <p class="detail-loc">${esc(spot.province)} · ${esc(spot.city)}${spot.district ? ` · ${esc(spot.district)}` : ''} · ${esc(spot.category)} · ${esc(spot.ticket)}</p>
            <div class="spot-tags" style="margin-top:12px">
              ${spot.bestSeasons.map((s) => `<span class="tag">最佳 ${esc(s)}季</span>`).join('')}
              ${spot.bestTimes.map((t) => `<span class="tag jade">${esc(t)}</span>`).join('')}
              <span class="tag gold">人流 ${spot.crowd}/5</span>
              <span class="tag">实拍收录</span>
            </div>
          </div>
          <div class="detail-stats">
            <div><strong>${spot.workCount}</strong><span>张作品</span></div>
            <div><strong>${spot.authorCount}</strong><span>位摄影师</span></div>
            <div><strong>${spot.likeCount}</strong><span>次喜欢</span></div>
          </div>
        </header>

        <div class="detail-cover">
          ${spot.cover
            ? `<img class="cover-img" src="${esc(spot.cover)}" alt="${esc(spot.name)}" />
               <span class="cover-credit">封面 · ${esc(spot.coverAuthor || '本机影像')}${spot.coverCredit ? ` · ${esc(spot.coverCredit)}` : ''}</span>`
            : `<div class="cover-placeholder"><span>这个机位还没有作品</span><em>成为第一个在这里上传的人</em></div>`}
        </div>

        <div class="detail-grid">
          <div class="detail-main">
            <p class="prose">${esc(spot.intro)}</p>
            <div class="subhead">机位经验</div>
            <div class="tip-box">${esc(spot.accessTips)}</div>

            <div class="work-filter">
              <div class="group" id="work-season-filter">
                <button type="button" class="chip tiny active" data-work-season="">全部季节</button>
                ${SEASONS.map((s) => `<button type="button" class="chip tiny" data-work-season="${s}">${s}</button>`).join('')}
              </div>
              <select class="select" id="work-time-filter" style="height:38px" aria-label="按时段筛选作品">
                <option value="">全部时段</option>
                ${TIMES.map((t) => `<option value="${t}">${t}</option>`).join('')}
              </select>
            </div>
            <div class="work-grid" id="spot-works"></div>

            <div class="panel" style="margin-top:30px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap">
              <div>
                <div class="panel-title" style="margin-bottom:4px">你去过这里？</div>
                <p class="muted" style="font-size:13px">上传你的照片，标上拍摄时间、时段和镜头朝向，帮下一个人少走弯路。</p>
              </div>
              <a class="btn primary small" href="#/upload?spot=${spot.id}">上传这个机位</a>
            </div>
          </div>

          <aside class="aside">
            <div class="panel">
              <div class="panel-title">机位档案</div>
              <div class="facts">
                <div class="fact"><span class="fact-label">最佳季节</span><span class="fact-value">${esc(spot.bestSeasons.join(' / '))}</span></div>
                <div class="fact"><span class="fact-label">最佳时段</span><span class="fact-value">${esc(spot.bestTimes.join(' / '))}</span></div>
                <div class="fact"><span class="fact-label">人流</span><span class="fact-value" style="display:flex;align-items:center;gap:8px">${crowdDots(spot.crowd)} ${spot.crowd}/5</span></div>
                <div class="fact"><span class="fact-label">门票</span><span class="fact-value">${esc(spot.ticket || '免费')}</span></div>
                <div class="fact"><span class="fact-label">位置</span><span class="fact-value">${spot.lat !== null && spot.lng !== null ? `${Number(spot.lat).toFixed(3)}, ${Number(spot.lng).toFixed(3)}` : '未标注'}</span></div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-title">光线日历</div>
              <p class="muted" style="font-size:11.5px;margin:-6px 0 12px">颜色越深，说明这个时段的作品越多。</p>
              ${calendar}
            </div>
            <div class="panel">
              <div class="panel-title">镜头朝向分布</div>
              ${angleRosette(spot.works)}
            </div>
          </aside>
        </div>
      </div>
    `;

    const worksBox = $('#spot-works');
    let seasonFilter = '';
    let timeFilter = '';
    function paintWorks() {
      const items = spot.works.filter((work) =>
        (!seasonFilter || work.season === seasonFilter) && (!timeFilter || work.timeSlot === timeFilter));
      worksBox.innerHTML = items.length
        ? items.map((work) => workCard(work, { showSpot: false })).join('')
        : emptyState('这个组合还没有作品', '换一个季节或时段，或者成为第一个上传的人');
    }
    paintWorks();

    $('#work-season-filter').addEventListener('click', (event) => {
      const button = event.target.closest('[data-work-season]');
      if (!button) return;
      seasonFilter = button.dataset.workSeason;
      $$('#work-season-filter .chip').forEach((chip) => chip.classList.toggle('active', chip === button));
      paintWorks();
    });
    $('#work-time-filter').addEventListener('change', (event) => {
      timeFilter = event.target.value;
      paintWorks();
    });
  }

  async function renderWork(workId) {
    app.innerHTML = `<div style="padding-top:28px"><div class="skeleton" style="height:420px"></div></div>`;
    const { work } = await api(`/api/works/${workId}`);
    const comments = work.comments || [];
    app.innerHTML = `
      <div class="work-detail">
        <nav class="breadcrumb"><a href="#/">发现</a><span class="sep">/</span><a href="#/spots">机位库</a><span class="sep">/</span><a href="#/spot/${work.spotId}">${esc(work.spotName)}</a><span class="sep">/</span><span>作品</span></nav>

        <div class="work-hero" style="margin-top:16px">
          <img src="${esc(work.image)}" alt="${esc(work.title)}" />
        </div>

        <div class="work-layout">
          <div>
            <h1 class="work-caption">${esc(work.title)}</h1>
            <p class="work-sub">
              <a href="#/spot/${work.spotId}" style="border-bottom:1px solid var(--line-strong)">${esc(work.spotName)}</a>
              · ${esc(work.province)} ${esc(work.city)}${work.district ? ` ${esc(work.district)}` : ''} · 拍摄于 ${esc(work.shotAt || work.createdAt)} · ${esc(work.season)} · ${esc(work.timeSlot)}
            </p>
            ${work.poem ? `<blockquote class="poem-block"><span>${esc(work.poem.split('——')[0])}</span><cite>——${esc(work.poem.split('——')[1] || '')}</cite></blockquote>` : ''}
            ${work.caption ? `<p class="story">${esc(work.caption)}</p>` : ''}
            ${work.tip ? `<div class="tip-box" style="margin-top:18px"><strong>拍摄提示 · </strong>${esc(work.tip)}</div>` : ''}

            <div class="action-row">
              <button class="like-big ${work.liked ? 'liked' : ''}" type="button" id="work-like" data-like="${work.id}">
                <span class="heart">${work.liked ? '♥' : '♡'}</span> ${work.liked ? '已喜欢' : '喜欢'} · <span>${work.likes}</span>
              </button>
              <span class="muted" style="font-size:12px"><span id="comment-count">${work.commentCount}</span> 条评论</span>
            </div>

            <section class="comments">
              <div class="comments-head">
                <h3>评论</h3>
                <span class="muted" style="font-size:12px"><span id="comment-head-count">${comments.length}</span> 条</span>
              </div>
              <div id="comment-list">
                ${comments.length ? comments.map(commentHtml).join('') : `<p class="muted" style="font-size:13px;padding:14px 0">还没有评论，来问点拍摄细节吧。</p>`}
              </div>
              <form class="comment-form" id="comment-form">
                <label class="sr-only" for="comment-body">写下评论</label>
                <textarea class="textarea" id="comment-body" maxlength="300" placeholder="这个机位几点到最合适？需要带长焦吗？"></textarea>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
                  <span class="help">尊重彼此的经验，别发广告。</span>
                  <button class="btn primary small" type="submit">发表评论</button>
                </div>
              </form>
            </section>
          </div>

          <aside class="aside">
            <div class="panel">
              <div class="panel-title">拍摄信息</div>
              <div class="meta-table">
                <div class="meta-row"><span class="meta-key">机位</span><span class="meta-val"><a href="#/spot/${work.spotId}">${esc(work.spotName)}</a></span></div>
                <div class="meta-row"><span class="meta-key">拍摄时间</span><span class="meta-val">${esc(work.shotAt || '未填写')}</span></div>
                <div class="meta-row"><span class="meta-key">季节</span><span class="meta-val">${esc(work.season)}</span></div>
                <div class="meta-row"><span class="meta-key">时段</span><span class="meta-val">${esc(work.timeSlot)}</span></div>
                <div class="meta-row"><span class="meta-key">镜头朝向</span><span class="meta-val">${direction(work.angleDeg)}</span></div>
                ${work.angleNote ? `<div class="meta-row"><span class="meta-key">站位</span><span class="meta-val">${esc(work.angleNote)}</span></div>` : ''}
                <div class="meta-row"><span class="meta-key">地点</span><span class="meta-val">${esc(work.province)} · ${esc(work.city)}${work.district ? ` · ${esc(work.district)}` : ''}</span></div>
                <div class="meta-row"><span class="meta-key">来源</span><span class="meta-val">${esc(work.credit || '本机影像')} · ${esc(work.author)}</span></div>
                <div class="meta-row"><span class="meta-key">镜头</span><span class="meta-val">${esc(work.lens || '未填写')}</span></div>
              </div>
            </div>
            <div class="panel">
              <div class="author-card">
                ${avatar(work.author)}
                <div><strong>${esc(work.author)}</strong><span>机位猎人 · ${timeAgo(work.createdAt)}发布</span></div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-title">同机位的其他作品</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                ${(work.related || []).slice(0, 4).map((item) => `
                  <a href="#/work/${item.id}" style="display:block">
                    <img src="${esc(item.thumb)}" alt="${esc(item.title)}" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:9px" />
                  </a>`).join('') || '<p class="muted" style="font-size:12px">这是这个机位的第一张作品。</p>'}
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;

    $('#comment-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const body = $('#comment-body').value.trim();
      if (body.length < 2) { toast('评论太短了', 'error'); return; }
      await guard(async () => {
        const data = await api(`/api/works/${work.id}/comments`, { method: 'POST', body: { body } });
        const list = $('#comment-list');
        if (list && list.querySelector('.muted')) list.innerHTML = '';
        list?.insertAdjacentHTML('beforeend', commentHtml(data.comment));
        $('#comment-body').value = '';
        const count = $('#comment-count');
        if (count) count.textContent = String(Number(count.textContent) + 1);
        const headCount = $('#comment-head-count');
        if (headCount) headCount.textContent = String(Number(headCount.textContent) + 1);
        toast('评论已发布');
      });
    });
  }

  function commentHtml(comment) {
    return `
      <article class="comment">
        <div class="comment-head">${avatar(comment.author)}<strong>${esc(comment.author)}</strong><time>${timeAgo(comment.createdAt)}</time></div>
        <p class="comment-body">${esc(comment.body)}</p>
      </article>`;
  }

  async function renderUpload() {
    if (window.__STATIC__) {
      app.innerHTML = `
        <section class="page-head">
          <p class="eyebrow">公开演示 / READ ONLY</p>
          <h1 class="page-title">这是公开演示站，<br />上传功能只在本地完整版。</h1>
          <p class="page-sub">你现在访问的是从本机数据导出的静态站：可以浏览全部机位、影像、3D 地球与地貌档案，但不能发布、点赞或评论。要上传自己的照片，请在本机运行 <code>python server.py</code>。</p>
          <div style="margin-top:22px"><a class="btn primary" href="#/">继续浏览</a></div>
        </section>`;
      return;
    }
    const presetSpot = new URLSearchParams(location.hash.split('?')[1] || '').get('spot');
    const spots = await api('/api/spots?limit=120&sort=hot');
    state.spotsCache = spots.spots;
    const nowValue = localDateValue(new Date());

    app.innerHTML = `
      <section class="page-head">
        <p class="eyebrow">上传 / CONTRIBUTE</p>
        <h1 class="page-title">把你的机位，<br />留给下一个等光的人。</h1>
        <p class="page-sub">照片会压缩后保存在本机。地点、时间、季节、时段和镜头朝向由你手动填写，这些细节比照片本身更有用。</p>
      </section>

      <div class="upload-grid" style="margin-top:26px">
        <form class="form-card" id="upload-form" novalidate>
          <h2 class="form-section-title">1 · 选择机位</h2>
          <div class="field spot-picker">
            <label for="spot-search">所属机位 <span class="required">*</span></label>
            <input class="input" id="spot-search" placeholder="搜索机位，例如「故宫角楼」" autocomplete="off" value="" />
            <input type="hidden" id="spot-id" value="${esc(presetSpot || '')}" />
            <div class="spot-options hidden" id="spot-options"></div>
            <p class="help" id="spot-hint">从机位库里选一个；找不到就勾选下面的「新建机位」。</p>
          </div>
          <label class="chip" style="align-self:flex-start;gap:8px">
            <input type="checkbox" id="new-spot-toggle" style="accent-color:var(--accent)" /> 新建机位
          </label>
          <div class="form-grid hidden" id="new-spot-fields">
            <div class="field"><label for="new-name">机位名称 <span class="required">*</span></label><input id="new-name" maxlength="30" placeholder="例如：洱海 · 海舌舌尖" /></div>
            <div class="field"><label for="new-province">省份 <span class="required">*</span></label><input id="new-province" maxlength="20" placeholder="云南" /></div>
            <div class="field"><label for="new-city">城市</label><input id="new-city" maxlength="20" placeholder="大理" /></div>
            <div class="field"><label for="new-category">类型</label>
              <select id="new-category">${state.bootstrap.categories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select>
            </div>
            <div class="field" style="grid-column:1/-1"><label for="new-intro">一句话介绍</label><textarea id="new-intro" class="textarea" style="min-height:70px" maxlength="300" placeholder="这个机位有什么特别？"></textarea></div>
          </div>

          <h2 class="form-section-title">2 · 照片</h2>
          <div class="dropzone" id="dropzone">
            <strong>点击选择，或把照片拖进来</strong>
            <span>支持 JPG / PNG / WebP，会自动压缩到长边 1600px</span>
            <input type="file" id="file-input" accept="image/jpeg,image/png,image/webp" />
          </div>
          <div class="preview-card hidden" id="preview-card">
            <div class="preview-frame"><img id="preview-img" alt="待上传照片预览" /></div>
            <div class="preview-meta"><span id="preview-size"></span><button type="button" class="btn link" id="remove-photo">重新选择</button></div>
          </div>

          <h2 class="form-section-title">3 · 时间与光线</h2>
          <div class="form-grid">
            <div class="field">
              <label for="shot-at">拍摄时间</label>
              <input type="datetime-local" id="shot-at" value="${nowValue}" />
            </div>
            <div class="field">
              <label for="season">季节 <span class="required">*</span></label>
              <select id="season">${SEASONS.map((s) => `<option value="${s}">${s}</option>`).join('')}</select>
            </div>
            <div class="field">
              <label for="time-slot">时段 <span class="required">*</span></label>
              <select id="time-slot">${TIMES.map((t) => `<option value="${t}">${t}</option>`).join('')}</select>
            </div>
            <div class="field">
              <label for="lens">镜头 / 焦段</label>
              <input id="lens" maxlength="40" placeholder="例如：70-200mm" />
            </div>
          </div>

          <div class="field">
            <label>镜头朝向</label>
            <div class="compass-wrap">
              ${compassMarkup(0)}
              <div class="compass-readout" id="compass-readout"></div>
              <input type="hidden" id="angle-deg" value="0" />
              <input class="range" id="angle-range" type="range" min="0" max="359" value="0" aria-label="镜头朝向角度" />
            </div>
            <p class="help">在罗盘上拖动，或滑动滑块。0° 为正北，90° 为正东。</p>
          </div>
          <div class="field">
            <label for="angle-note">具体站位</label>
            <input id="angle-note" maxlength="80" placeholder="例如：东南角楼对岸，河岸第二棵柳树下" />
          </div>

          <h2 class="form-section-title">4 · 作品信息</h2>
          <div class="field">
            <label for="title">作品标题 <span class="required">*</span></label>
            <input id="title" maxlength="40" placeholder="例如：火烧云只给了十分钟" />
          </div>
          <div class="field">
            <label for="caption">这张照片背后的故事</label>
            <textarea id="caption" class="textarea" maxlength="400" placeholder="等了多久？为什么是这个角度？"></textarea>
          </div>
          <div class="field">
            <label for="poem">题一句诗（可选）</label>
            <input id="poem" maxlength="100" placeholder="不填会按季节自动配一句" />
          </div>
          <div class="field">
            <label for="tip">给后来者的拍摄提示</label>
            <textarea id="tip" class="textarea" style="min-height:80px" maxlength="300" placeholder="例如：日落后 15 分钟进入蓝调，别急着收机器。"></textarea>
          </div>

          <div class="error-text hidden" id="upload-error"></div>
          <button class="btn primary block" type="submit" id="upload-submit">发布作品</button>
          <p class="help center">发布即表示你拥有这张照片的版权，并同意在本应用中公开展示。</p>
        </form>

        <aside class="aside">
          <div class="panel">
            <div class="panel-title">为什么这些细节重要</div>
            <p class="muted" style="font-size:13px;line-height:1.9">同一座山，清晨和黄昏是两张照片；同一个季节，上午和下午的光线也不是一回事。把时间、时段和朝向写清楚，别人才能复现你看到的画面。</p>
          </div>
          <div class="panel">
            <div class="panel-title">照片可以是什么</div>
            <p class="muted" style="font-size:13px;line-height:1.9">一张能说明“机位”的照片：有前景、有参照物更好。也可以是你拍到的光线、天气和季节变化。请不要上传他人作品。</p>
          </div>
          <div class="panel">
            <div class="panel-title">本次发布</div>
            <div class="facts" id="upload-summary">
              <div class="fact"><span class="fact-label">机位</span><span class="fact-value" id="sum-spot">未选择</span></div>
              <div class="fact"><span class="fact-label">时间</span><span class="fact-value" id="sum-time">—</span></div>
              <div class="fact"><span class="fact-label">光线</span><span class="fact-value" id="sum-light">—</span></div>
              <div class="fact"><span class="fact-label">朝向</span><span class="fact-value" id="sum-angle">北 0°</span></div>
            </div>
          </div>
        </aside>
      </div>
    `;

    const spotSearch = $('#spot-search');
    const spotIdInput = $('#spot-id');
    const options = $('#spot-options');
    const hint = $('#spot-hint');
    let chosen = null;
    let photo = null;

    function updateSummary() {
      $('#sum-spot').textContent = chosen ? chosen.name : '未选择';
      const dateValue = $('#shot-at').value;
      $('#sum-time').textContent = dateValue ? dateValue.replace('T', ' ') : '—';
      $('#sum-light').textContent = `${$('#season').value} · ${$('#time-slot').value}`;
      $('#sum-angle').textContent = direction(Number($('#angle-deg').value));
    }

    function pick(spot) {
      chosen = spot;
      spotIdInput.value = spot.id;
      spotSearch.value = spot.name;
      options.classList.add('hidden');
      hint.textContent = `${spot.province} · ${spot.city} · ${spot.category}${spot.workCount ? ` · 已有 ${spot.workCount} 张作品` : ''}`;
      updateSummary();
    }

    if (presetSpot && state.spotsCache.some((spot) => String(spot.id) === String(presetSpot))) {
      pick(state.spotsCache.find((spot) => String(spot.id) === String(presetSpot)));
    }
    const initialMoment = new Date();
    $('#season').value = seasonOf(initialMoment);
    $('#time-slot').value = timeSlotOf(initialMoment);

    function paintOptions(keyword = '') {
      const key = keyword.trim().toLowerCase();
      const list = state.spotsCache
        .filter((spot) => !key || `${spot.name} ${spot.city} ${spot.province}`.toLowerCase().includes(key))
        .slice(0, 8);
      options.innerHTML = list.length
        ? `<div class="spot-option-group">机位库</div>` + list.map((spot) => `
            <button type="button" class="spot-option" data-spot="${spot.id}">
              <span>${esc(spot.name)}</span><small>${esc(spot.province)} · ${esc(spot.city)}</small>
            </button>`).join('')
        : `<div class="spot-option-group">没有找到，勾选「新建机位」自己填</div>`;
      options.classList.remove('hidden');
    }

    spotSearch.addEventListener('focus', () => paintOptions(spotSearch.value));
    spotSearch.addEventListener('input', () => { chosen = null; spotIdInput.value = ''; paintOptions(spotSearch.value); hint.textContent = '从机位库里选一个；找不到就勾选下面的「新建机位」。'; updateSummary(); });
    options.addEventListener('mousedown', (event) => {
      const button = event.target.closest('[data-spot]');
      if (!button) return;
      const spot = state.spotsCache.find((item) => String(item.id) === button.dataset.spot);
      if (spot) pick(spot);
    });

    const newToggle = $('#new-spot-toggle');
    newToggle.addEventListener('change', () => {
      $('#new-spot-fields').classList.toggle('hidden', !newToggle.checked);
      if (newToggle.checked) {
        chosen = null;
        spotIdInput.value = '';
        spotSearch.value = '';
        hint.textContent = '将使用下面填写的新机位。';
      } else {
        hint.textContent = '从机位库里选一个；找不到就勾选下面的「新建机位」。';
      }
      updateSummary();
    });

    bindCompass(0);

    $('#shot-at').addEventListener('change', (event) => {
      const date = new Date(event.target.value);
      if (!Number.isNaN(date.getTime())) {
        $('#season').value = seasonOf(date);
        $('#time-slot').value = timeSlotOf(date);
      }
      updateSummary();
    });
    $('#season').addEventListener('change', updateSummary);
    $('#time-slot').addEventListener('change', updateSummary);
    $('#angle-deg').addEventListener('anglechange', updateSummary);

    const dropzone = $('#dropzone');
    const fileInput = $('#file-input');
    const previewCard = $('#preview-card');

    async function acceptFile(file) {
      if (!file) return;
      if (!file.type.startsWith('image/')) { toast('请选择图片文件', 'error'); return; }
      if (file.size > 25 * 1024 * 1024) { toast('图片太大，请选择 25MB 以内的照片', 'error'); return; }
      const error = $('#upload-error');
      error.classList.add('hidden');
      try {
        photo = await compressImage(file);
        $('#preview-img').src = photo.dataUrl;
        $('#preview-size').textContent = `${photo.width} × ${photo.height} · ${(photo.bytes / 1024).toFixed(0)} KB`;
        previewCard.classList.remove('hidden');
        dropzone.classList.add('hidden');
        const stamp = new Date(file.lastModified || Date.now());
        if (stamp.getTime() && !Number.isNaN(stamp.getTime())) {
          $('#shot-at').value = localDateValue(stamp);
          $('#season').value = seasonOf(stamp);
          $('#time-slot').value = timeSlotOf(stamp);
        }
        updateSummary();
      } catch (err) {
        toast(err.message || '无法读取这张照片', 'error');
      }
    }

    fileInput.addEventListener('change', () => acceptFile(fileInput.files[0]));
    ['dragenter', 'dragover'].forEach((type) => dropzone.addEventListener(type, (event) => {
      event.preventDefault(); dropzone.classList.add('dragover');
    }));
    ['dragleave', 'drop'].forEach((type) => dropzone.addEventListener(type, (event) => {
      event.preventDefault(); dropzone.classList.remove('dragover');
    }));
    dropzone.addEventListener('drop', (event) => {
      const file = event.dataTransfer?.files?.[0];
      if (file) acceptFile(file);
    });
    $('#remove-photo').addEventListener('click', () => {
      photo = null;
      fileInput.value = '';
      previewCard.classList.add('hidden');
      dropzone.classList.remove('hidden');
    });

    $('#upload-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const errorBox = $('#upload-error');
      const fail = (message) => {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
      errorBox.classList.add('hidden');
      const title = $('#title').value.trim();
      if (!photo) return fail('先选一张照片吧。');
      if (!title) return fail('给作品起个标题吧。');
      if (!chosen && !newToggle.checked) return fail('请选择一个机位，或新建机位。');
      if (newToggle.checked && (!$('#new-name').value.trim() || !$('#new-province').value.trim())) {
        return fail('新机位需要名称和省份。');
      }
      if (!requireProfile()) return;

      const submit = $('#upload-submit');
      submit.disabled = true;
      submit.textContent = '正在发布…';
      try {
        let spotId = chosen ? chosen.id : null;
        if (newToggle.checked) {
          const created = await api('/api/spots', {
            method: 'POST',
            body: {
              name: $('#new-name').value.trim(),
              province: $('#new-province').value.trim(),
              city: $('#new-city').value.trim() || $('#new-province').value.trim(),
              category: $('#new-category').value,
              intro: $('#new-intro').value.trim(),
              bestSeasons: [$('#season').value],
              bestTimes: [$('#time-slot').value],
            },
          });
          spotId = created.spotId;
        }
        const data = await api('/api/works', {
          method: 'POST',
          body: {
            spotId,
            title,
            caption: $('#caption').value.trim(),
            image: photo.dataUrl,
            shotAt: $('#shot-at').value.replace('T', ' '),
            season: $('#season').value,
            timeSlot: $('#time-slot').value,
            angleDeg: Number($('#angle-deg').value) || 0,
            angleNote: $('#angle-note').value.trim(),
            lens: $('#lens').value.trim(),
            tip: $('#tip').value.trim(),
            poem: $('#poem').value.trim(),
          },
        });
        toast('作品已发布');
        location.hash = `#/work/${data.work.id}`;
      } catch (err) {
        submit.disabled = false;
        submit.textContent = '发布作品';
        if (err instanceof ApiError && err.code === 'profile-required') {
          openNameModal();
          return;
        }
        fail(err.message || '发布失败');
      }
    });

    updateSummary();
  }

  async function compressImage(file) {
    let source;
    try {
      source = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      source = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('无法读取这张照片，换一张试试'));
        img.src = URL.createObjectURL(file);
      });
    }
    const maxEdge = 1600;
    const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);
    if (source.close) source.close();
    const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
    const bytes = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
    return { dataUrl, width, height, bytes };
  }

  async function renderMe() {
    if (window.__STATIC__) {
      app.innerHTML = `
        <section class="page-head">
          <p class="eyebrow">我的 / PROFILE</p>
          <h1 class="page-title">公开演示站不保存个人资料。</h1>
          <p class="page-sub">昵称、点赞、评论与上传都依赖本地 SQLite。要在本机建立自己的机位档案，请运行 <code>python server.py</code> 后访问 127.0.0.1:5187。</p>
          <div style="margin-top:22px"><a class="btn primary" href="#/spots">去看机位库</a></div>
        </section>`;
      return;
    }
    let data;
    try {
      data = await api('/api/me');
    } catch (err) {
      app.innerHTML = `<div class="page-head">${errorBox(err.message)}</div>`;
      return;
    }
    state.me = data.user;
    renderUserChip();

    if (!data.user) {
      app.innerHTML = `
        <section class="page-head">
          <p class="eyebrow">我的 / PROFILE</p>
          <h1 class="page-title">先给自己起个名字。</h1>
          <p class="page-sub">昵称只保存在这台设备上，用于标记你发布的作品、点赞和评论。</p>
        </section>
        <div class="form-card" style="max-width:460px;margin-top:24px">
          <form class="form-row" id="inline-name-form">
            <div class="field"><label for="inline-name">昵称</label><input id="inline-name" class="input" maxlength="20" placeholder="例如：北纬三十度" required /></div>
            <button class="btn primary" type="submit">保存并开始</button>
          </form>
        </div>`;
      $('#inline-name-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = $('#inline-name').value.trim();
        if (!name) return;
        try {
          await api('/api/me', { method: 'POST', body: { name } });
          toast('昵称已保存');
          renderMe();
        } catch (err) { toast(err.message, 'error'); }
      });
      return;
    }

    app.innerHTML = `
      <section class="profile-head">
        <div class="profile-id">
          ${avatar(data.user.name)}
          <div>
            <h1 class="profile-name">${esc(data.user.name)}</h1>
            <p class="profile-sub">这台设备上的机位档案 · 数据保存在本机</p>
          </div>
        </div>
        <form class="nickname-form" id="rename-form">
          <input class="input" id="rename-input" maxlength="20" value="${esc(data.user.name)}" aria-label="修改昵称" style="height:40px;width:160px" />
          <button class="btn ghost small" type="submit">改昵称</button>
        </form>
      </section>

      <div class="profile-stats">
        <div><strong>${data.stats.works}</strong><span>发布作品</span></div>
        <div><strong>${data.stats.likes}</strong><span>收获喜欢</span></div>
        <div><strong>${data.stats.comments}</strong><span>写下评论</span></div>
      </div>

      <section class="section" style="padding-top:20px">
        <div class="section-head">
          <div><h2 class="section-title">我的作品</h2><p class="section-sub">你标注过的机位与光线</p></div>
          <a class="section-link" href="#/upload">再传一张 →</a>
        </div>
        <div class="work-grid">
          ${data.works.length ? data.works.map((w) => workCard(w)).join('') : emptyState('还没有作品', '拍到的第一张就可以传上来', '<a class="btn primary small" href="#/upload">上传作品</a>')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><h2 class="section-title">我喜欢的</h2><p class="section-sub">留给下一次出发</p></div></div>
        <div class="work-grid">
          ${data.liked.length ? data.liked.map((w) => workCard(w)).join('') : emptyState('还没有收藏', '看到喜欢的机位，点一下心形')}
        </div>
      </section>
    `;

    $('#rename-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = $('#rename-input').value.trim();
      if (!name) return;
      try {
        await api('/api/me', { method: 'POST', body: { name } });
        state.me = { name };
        toast('昵称已更新');
        renderMe();
      } catch (err) { toast(err.message, 'error'); }
    });
  }

  /* ---------------- router ---------------- */

  async function route() {
    const raw = location.hash.slice(1) || '/';
    const [path] = raw.split('?');
    const seq = ++state.routeSeq;
    state.galleryList = null;
    disposeGlobe();
    setNav(path);
    const renderPage = async () => {
      try {
        if (path === '/' || path === '') {
          await renderHome();
        } else if (path === '/spots') {
          await renderSpots();
        } else if (path === '/gallery') {
          await renderGallery();
        } else if (path === '/atlas') {
          await renderAtlas();
        } else if (/^\/spot\/\d+$/.test(path)) {
          await renderSpot(Number(path.split('/')[2]));
        } else if (/^\/work\/\d+$/.test(path)) {
          await renderWork(Number(path.split('/')[2]));
        } else if (path === '/upload') {
          await renderUpload();
        } else if (path === '/me') {
          await renderMe();
        } else {
          app.innerHTML = `<div class="page-head">${emptyState('页面不存在', '回到发现页继续找机位', '<a class="btn primary small" href="#/">回到首页</a>')}</div>`;
        }
      } catch (err) {
        if (seq !== state.routeSeq) return;
        app.innerHTML = `<div class="page-head">${errorBox(err.message || '页面加载失败')}</div>`;
      }
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduceMotion) {
      try {
        await document.startViewTransition(() => renderPage()).finished;
      } catch {
        await renderPage();
      }
    } else {
      await renderPage();
    }
    if (seq === state.routeSeq) window.scrollTo(0, 0);
  }

  /* ---------------- global events ---------------- */

  document.addEventListener('click', (event) => {
    const lightbox = event.target.closest('[data-lightbox]');
    if (lightbox) {
      event.preventDefault();
      const list = state.galleryList && state.galleryList.length ? state.galleryList : state.materials;
      openLightbox(lightbox.dataset.lightbox, list);
      return;
    }
    const focusLightbox = event.target.closest('[data-focus-lightbox]');
    if (focusLightbox) {
      return;
    }
    const like = event.target.closest('[data-like]');
    if (like) {
      event.preventDefault();
      toggleLike(like);
      return;
    }
    const profile = event.target.closest('[data-action="edit-profile"]');
    if (profile) {
      event.preventDefault();
      openNameModal();
      return;
    }
    if (!event.target.closest('.spot-picker')) {
      $$('.spot-options').forEach((list) => list.classList.add('hidden'));
    }
    const focusSearch = event.target.closest('[data-action="focus-search"]');
    if (focusSearch) {
      event.preventDefault();
      if (location.hash.startsWith('#/spots')) {
        $('#spot-search')?.focus();
      } else {
        location.hash = '#/spots';
      }
    }
  });

  window.addEventListener('hashchange', route);

  (async function init() {
    try {
      state.bootstrap = await api('/api/bootstrap');
      state.me = state.bootstrap.user;
    } catch (err) {
      app.innerHTML = `<div class="page-head">${errorBox('无法连接本地服务：' + err.message)}</div>`;
      return;
    }
    if (window.__STATIC__) {
      const bar = document.createElement('div');
      bar.className = 'static-bar';
      bar.innerHTML = '<strong>公开演示站 · 只读</strong><span>可以浏览全部机位、影像、诗文与 3D 地球；发布 / 点赞 / 评论请在本机运行完整版。</span>';
      const topbar = document.querySelector('.topbar');
      topbar?.insertAdjacentElement('afterend', bar);
      document.querySelector('.user-chip span:last-child')?.replaceChildren(document.createTextNode('访客'));
    }
    renderUserChip();
    route();
  })();
})();
