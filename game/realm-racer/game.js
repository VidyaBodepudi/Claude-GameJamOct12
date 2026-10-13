const CONFIG = {
  laps: 2,
  roadHalf: 90,
  carRadius: 17,
  trackSpacing: 50,
  accel: 520,
  brake: 700,
  reverseMax: -150,
  maxSpeed: 520,
  nitroAccel: 520,
  nitroMax: 780,
  nitroDrain: 45,
  nitroPickup: 35,
  nitroStart: 50,
  steer: 3.0,
  offTrackDrag: 2.5,
  mudDrag: 2.2,
  slickGrip: 0.15,
  slickSteer: 0.5,
  countdown: 3,
  pickupRespawn: 5,
  skidThreshold: 110,
  maxSkids: 1000,
  bumpRestitution: 0.5,
  spinTime: 0.8,
  spinnerKick: 260,
};

const DRONES = [
  { name: 'Drone Alpha', color: '#7b7f8a', speed: 1, grid: 0, lane: -35 },
  { name: 'Drone Beta', color: '#4f6a94', speed: 0.94, grid: 4, lane: 35 },
  { name: 'Drone Gamma', color: '#94704f', speed: 0.88, grid: 8, lane: -35 },
];

const spread = (count, from = 0.08, to = 0.92) => Array.from({ length: count }, (_, k) => from + ((to - from) * k) / (count - 1));

// Control points are scaled so the centerline matches `length` px.
const REALMS = [
  {
    name: 'Ice Realm', hint: 'Low grip everywhere. Shiny slick patches have almost none.',
    bg: '#bcd9ea', road: '#e9f6ff', edge: '#6fa3c7', skid: 'rgba(60,110,150,0.35)',
    grip: 2, drag: 0.4, droneSpeed: 400, length: 9000, slick: spread(6, 0.12, 0.9),
    pts: [[1400, 400], [2400, 400], [3100, 550, 500], [3400, 1000, 400], [3300, 1400, 160], [3500, 1750, 160], [3400, 2300, 300], [3050, 2650, 250], [2400, 2650], [1900, 2600, 200], [1700, 2300, 200], [1700, 1750, 150], [1450, 1500, 120], [1200, 1750, 150], [1200, 2300, 200], [950, 2650, 200], [500, 2650, 250], [250, 2200, 300], [300, 1500, 300], [600, 1100, 200], [350, 750, 200], [400, 400, 200]],
  },
  {
    name: 'Swamp Realm', hint: 'Mud pools drain your speed. Steer around them.',
    bg: '#2f3b22', road: '#6a6850', edge: '#3c2f1e',
    grip: 7, drag: 0.6, droneSpeed: 470, length: 9500, mud: spread(7, 0.1, 0.9),
    pts: [[600, 400], [900, 400], [1150, 260, 120], [1400, 400, 120], [1650, 540, 120], [1900, 400, 120], [2600, 400, 300], [3000, 700, 350], [3000, 1200, 200], [2700, 1550, 200], [3000, 1900, 200], [2800, 2300, 250], [2300, 2350, 250], [1800, 2000, 200], [1300, 2350, 200], [800, 2350, 250], [400, 2050, 250], [200, 1500, 300], [500, 1100, 150], [200, 800, 150], [300, 450, 250]],
  },
  {
    name: 'Lava Realm', hint: 'Vents glow, then erupt. Get caught and you spin out.',
    bg: '#2a0d05', road: '#4a3a35', edge: '#ff5a1f',
    grip: 7, drag: 0.5, droneSpeed: 485, length: 11000, vents: spread(10),
    pts: [[1000, 300], [1700, 300], [2900, 300, 250], [3250, 650, 300], [2900, 1000, 250], [2200, 1000], [1900, 880, 120], [1600, 1000, 120], [1100, 1000, 150], [800, 1200, 150], [1100, 1400, 150], [1800, 1400], [2500, 1500, 300], [3000, 1400, 250], [3350, 1750, 250], [3000, 2100, 250], [2000, 2100], [1000, 2200, 400], [300, 2100, 300], [100, 1600, 300], [150, 800, 300], [400, 300, 250]],
  },
  {
    name: 'Storm Realm', hint: 'Wind gusts shove you around. Watch the arrow.',
    bg: '#232836', road: '#4a4f5c', edge: '#c9c94a',
    grip: 6, drag: 0.5, droneSpeed: 440, length: 12000, wind: 140,
    pts: [[1100, 350], [1800, 300], [3000, 450, 600], [3600, 900, 500], [3700, 1500, 500], [3300, 1950, 300], [2700, 1900, 200], [2400, 1650, 150], [2100, 1900, 200], [1700, 2300, 400], [1100, 2400, 400], [600, 2100, 250], [700, 1600, 250], [300, 1200, 300], [250, 700, 300], [500, 400, 250]],
  },
  {
    name: 'Water Realm', hint: 'Floaty handling. Currents carry you across the road.',
    bg: '#0d3b66', road: '#2b6f99', edge: '#a8e4ff', skid: 'rgba(255,255,255,0.25)',
    grip: 3, drag: 0.35, droneSpeed: 525, length: 10000, currents: spread(8), currentSpeed: 280,
    pts: [[300, 500], [800, 300], [1300, 550], [1800, 300], [2300, 550], [2800, 300], [3300, 500], [3600, 1000, 350], [3300, 1500], [2800, 1700], [2300, 1500], [1800, 1700], [1300, 1500], [800, 1700], [300, 1500], [100, 1000, 350]],
  },
  {
    name: 'Junk Realm', hint: 'Tight 90-degree corners and scrap you bounce off.',
    bg: '#4a4237', road: '#6b6359', edge: '#c08a3e',
    grip: 7, drag: 0.5, droneSpeed: 430, length: 10500, junk: 20,
    pts: [[1100, 300], [1800, 300], [2000, 500], [2000, 700], [1800, 900], [1600, 900], [1400, 1100], [1400, 1300], [1600, 1500], [2600, 1500], [2800, 1300], [2800, 700], [3000, 500], [3200, 500], [3400, 700], [3400, 1200], [3250, 1450], [3400, 1700], [3400, 2000], [3200, 2200], [1800, 2300], [500, 2200], [300, 2000], [300, 1200], [300, 500], [500, 300]],
  },
  {
    name: 'Roto Realm', hint: 'Spinning arms bat you away. Time your pass.',
    bg: '#1d2a2a', road: '#3d4f4f', edge: '#38e0c0',
    grip: 7, drag: 0.5, droneSpeed: 380, length: 10000, spinners: spread(7, 0.1, 0.9),
    pts: [[1700, 220], [2200, 250], [2900, 600, 400], [3100, 1200, 300], [2800, 1700, 200], [2300, 1600, 150], [2000, 1300, 150], [1600, 1500, 150], [1700, 2000, 200], [2200, 2300, 130], [1600, 2600, 200], [900, 2500, 300], [300, 2000, 300], [200, 1200, 300], [500, 600, 300], [1100, 250, 300]],
  },
  {
    name: 'Cosmo Realm', hint: 'Low drag. Gravity wells drag you in; touch a core and you spin.',
    bg: '#05030f', road: '#1e1640', edge: '#b26bff', skid: 'rgba(178,107,255,0.3)',
    grip: 4, drag: 0.25, droneSpeed: 580, length: 14000, wells: spread(6, 0.1, 0.88), stars: true,
    pts: [[900, 250], [1500, 200], [2300, 450, 150], [2700, 300, 150], [3500, 300, 300], [4100, 700, 500], [4200, 1300, 500], [3800, 1700, 250], [3300, 1500, 150], [2900, 1700, 150], [3300, 2100, 150], [3900, 2300, 300], [4100, 2900, 300], [3500, 3200, 300], [2500, 3100], [1900, 3200, 250], [1300, 3000, 250], [1000, 2500, 250], [1300, 2000, 250], [1900, 1800, 300], [2200, 1300, 200], [1700, 900, 200], [1100, 1100, 300], [600, 1500, 250], [200, 1100, 250], [300, 400, 300]],
  },
];

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const STORE_KEY = 'realmRacerBest_v2';
const keys = {};
let phase = 'intro';
let realmIndex = 0;
let totalTime = 0;
let best = loadBest();
let realm, track, player, drones, pickups, mud, slick, vents, currents, junk, spinners, wells, stars, skids, streaks;
let wind, time, countdown, lastTick, lapStart, flash, newBest, winner;

function loadBest() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveBest() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(best)); } catch { /* storage unavailable */ }
}

// ---------- Audio ----------
const SOUND_NAMES = ['tick', 'go', 'pickup', 'bump', 'spin', 'lap', 'lose', 'win', 'splash', 'zap'];
const sounds = Object.fromEntries(SOUND_NAMES.map((n) => [n, new Audio(`sounds/${n}.wav`)]));
const engineSnd = new Audio('sounds/engine.wav');
const boostSnd = new Audio('sounds/boost.wav');
engineSnd.loop = boostSnd.loop = true;
engineSnd.preservesPitch = engineSnd.webkitPreservesPitch = false;
let muted = false;
let audioUnlocked = false;

function play(name, vol = 0.6) {
  if (muted || !audioUnlocked) return;
  const a = sounds[name].cloneNode();
  a.volume = vol;
  a.play().catch(() => {});
}

function loopSound(snd, on, vol) {
  if (on) {
    snd.volume = vol;
    if (snd.paused) snd.play().catch(() => {});
  } else if (!snd.paused) snd.pause();
}

function updateEngine() {
  const on = audioUnlocked && !muted && (phase === 'racing' || phase === 'countdown');
  loopSound(engineSnd, on, 0.35);
  loopSound(boostSnd, on && player.boosting, 0.4);
  if (on) engineSnd.playbackRate = Math.min(4, 0.7 + Math.hypot(player.vx, player.vy) / 300);
}

// ---------- Input ----------
addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  audioUnlocked = true;
  keys[e.code] = true;
  if (!e.repeat) onKey(e.code);
});
addEventListener('keyup', (e) => { keys[e.code] = false; });

function onKey(code) {
  if (code === 'KeyM') muted = !muted;
  if (code === 'Enter') {
    if (phase === 'intro') { realmIndex = 0; totalTime = 0; startRealm(); }
    else if (phase === 'realmWon') {
      realmIndex++;
      if (realmIndex >= REALMS.length) finishCampaign();
      else startRealm();
    } else if (phase === 'realmLost') startRealm();
    else if (phase === 'victory') phase = 'intro';
  }
  if (code === 'KeyR' && phase !== 'intro' && phase !== 'victory') startRealm();
}

function finishCampaign() {
  phase = 'victory';
  newBest = !best.total || totalTime < best.total;
  if (newBest) { best.total = totalTime; saveBest(); }
}

// ---------- Track ----------
// Centripetal Catmull-Rom avoids loops when control points are unevenly spaced.
function centripetal(p0, p1, p2, p3, s) {
  const knot = (a, b) => Math.max(1e-4, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])));
  const t1 = knot(p0, p1), t2 = t1 + knot(p1, p2), t3 = t2 + knot(p2, p3);
  const u = t1 + (t2 - t1) * s;
  const lerp = (a, b, ta, tb) => [0, 1].map((k) => ((tb - u) * a[k] + (u - ta) * b[k]) / (tb - ta));
  const A1 = lerp(p0, p1, 0, t1), A2 = lerp(p1, p2, t1, t2), A3 = lerp(p2, p3, t2, t3);
  return lerp(lerp(A1, A2, 0, t2), lerp(A2, A3, t1, t3), t1, t2);
}

// Replaces each corner point [x, y, radius] with entry/exit points so roads stay straight between corners.
function expandCorners(pts) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const [px, py, r = 220] = pts[i];
    const [ax, ay] = pts[(i - 1 + n) % n], [bx, by] = pts[(i + 1) % n];
    const lin = Math.hypot(px - ax, py - ay), lout = Math.hypot(bx - px, by - py);
    const din = [(px - ax) / lin, (py - ay) / lin], dout = [(bx - px) / lout, (by - py) / lout];
    const dot = din[0] * dout[0] + din[1] * dout[1];
    if (dot > 0.985 || dot < -0.8) { out.push([px, py]); continue; }
    const rr = Math.min(r, 0.45 * lin, 0.45 * lout);
    out.push([px - din[0] * rr, py - din[1] * rr], [px + dout[0] * rr, py + dout[1] * rr]);
  }
  return out;
}

function buildTrack(r) {
  const ctrl = expandCorners(r.pts), n = ctrl.length;
  const raw = [];
  for (let i = 0; i < n; i++) {
    for (let s = 0; s < 20; s++) raw.push(centripetal(ctrl[(i - 1 + n) % n], ctrl[i], ctrl[(i + 1) % n], ctrl[(i + 2) % n], s / 20));
  }
  let rawLen = 0;
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i], b = raw[(i + 1) % raw.length];
    rawLen += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  const scale = r.length / rawLen;
  const step = CONFIG.trackSpacing / scale;
  const pts = [{ x: raw[0][0] * scale, y: raw[0][1] * scale }];
  let since = 0;
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i], b = raw[(i + 1) % raw.length];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let along = step - since;
    while (along <= d) {
      const f = along / d;
      pts.push({ x: (a[0] + (b[0] - a[0]) * f) * scale, y: (a[1] + (b[1] - a[1]) * f) * scale });
      along += step;
    }
    since = d - (along - step);
  }
  if (Math.hypot(pts.at(-1).x - pts[0].x, pts.at(-1).y - pts[0].y) < CONFIG.trackSpacing * 0.5) pts.pop();

  const N = pts.length;
  const segLen = [], segAng = [];
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % N];
    segLen.push(Math.hypot(b.x - a.x, b.y - a.y));
    segAng.push(Math.atan2(b.y - a.y, b.x - a.x));
  }
  const turn = segAng.map((ang, i) => Math.abs(wrapAngle(ang - segAng[(i - 1 + N) % N])));
  // Corner speed from heading change over the next ~400px.
  const speedFactor = turn.map((_, i) => {
    let sum = 0;
    for (let k = -2; k <= 6; k++) sum += turn[(i + k + N) % N];
    return Math.max(0.36, Math.min(1, 1 - 0.22 * sum));
  });
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  return {
    pts, N, segLen, segAng, speedFactor,
    minX: Math.min(...xs) - 400, maxX: Math.max(...xs) + 400,
    minY: Math.min(...ys) - 400, maxY: Math.max(...ys) + 400,
  };
}

function wrapAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function pointOnTrack(i, offset) {
  const k = ((Math.floor(i) % track.N) + track.N) % track.N;
  const p = track.pts[k], a = track.segAng[k];
  return { x: p.x - Math.sin(a) * offset, y: p.y + Math.cos(a) * offset };
}

function nearestSegment(x, y) {
  let bestI = 0, bestD = Infinity;
  for (let i = 0; i < track.N; i++) {
    const a = track.pts[i], b = track.pts[(i + 1) % track.N];
    const dx = b.x - a.x, dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy)));
    const d = Math.hypot(x - (a.x + dx * t), y - (a.y + dy * t));
    if (d < bestD) { bestD = d; bestI = i; }
  }
  return { i: bestI, d: bestD };
}

function startRealm() {
  realm = REALMS[realmIndex];
  track = buildTrack(realm);
  const at = (f, off) => pointOnTrack(track.N * f, off);
  const start = pointOnTrack(0, 35);
  player = {
    x: start.x, y: start.y, a: track.segAng[0], vx: 0, vy: 0,
    nitro: CONFIG.nitroStart, progress: 0, laps: 0, boosting: false, spin: 0, immune: 0, bumpCd: 0, lastRear: null, inCurrent: false,
  };
  drones = DRONES.map((d, k) => ({ ...d, k, t: d.grid, x: 0, y: 0, a: 0, vx: 0, vy: 0, slow: 0 }));
  pickups = spread(6, 0.15, 0.93).map((f, k) => ({ i: Math.floor(track.N * f), off: k % 2 ? 45 : -45, timer: 0 }));
  mud = (realm.mud || []).map((f, k) => ({ ...at(f, k % 2 ? 35 : -35), r: 60 }));
  slick = (realm.slick || []).map((f, k) => ({ ...at(f, [-30, 0, 30][k % 3]), r: 85 }));
  vents = (realm.vents || []).map((f, k) => ({ ...at(f, ((k % 3) - 1) * 45), r: 55, state: 'idle', timer: 1 + k * 0.6 }));
  currents = (realm.currents || []).map((f, k) => {
    const i = Math.floor(track.N * f), a = track.segAng[i], s = k % 2 ? 1 : -1;
    return { ...pointOnTrack(i, 0), r: 130, fx: -Math.sin(a) * s * realm.currentSpeed, fy: Math.cos(a) * s * realm.currentSpeed };
  });
  junk = (realm.junk ? spread(realm.junk) : []).map((f, k) => ({ ...at(f, [-55, 10, 55, -20][k % 4]), r: 22, rot: k * 0.7 }));
  // Offset from center so there is always a gap on one side.
  spinners = (realm.spinners || []).map((f, k) => ({ ...at(f, k % 2 ? 35 : -35), len: 75, ang: k, w: k % 2 ? 2 : -2 }));
  wells = (realm.wells || []).map((f, k) => ({ ...at(f, k % 2 ? 210 : -210), r: 400, pull: 280, core: 40 }));
  stars = realm.stars
    ? Array.from({ length: 900 }, () => ({
      x: track.minX + Math.random() * (track.maxX - track.minX),
      y: track.minY + Math.random() * (track.maxY - track.minY),
      s: Math.random() * 2 + 0.5,
    }))
    : [];
  streaks = realm.wind ? Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H })) : [];
  skids = [];
  wind = { x: 0, y: 0, tx: 0, ty: 0, timer: 0 };
  time = 0;
  lapStart = 0;
  flash = null;
  newBest = false;
  winner = null;
  countdown = CONFIG.countdown;
  lastTick = Math.ceil(countdown) + 1;
  phase = 'countdown';
  updateDrones(0);
}

// ---------- Simulation ----------
function collide(cx, cy, r, ovx = 0, ovy = 0, kick = 0) {
  const p = player;
  let dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy);
  const min = r + CONFIG.carRadius;
  if (d >= min) return false;
  if (d < 1e-6) { dx = -Math.sin(p.a); dy = Math.cos(p.a); d = 1; }
  const nx = dx / d, ny = dy / d;
  p.x = cx + nx * min;
  p.y = cy + ny * min;
  const vn = (p.vx - ovx) * nx + (p.vy - ovy) * ny;
  if (vn < 0) {
    p.vx -= (1 + CONFIG.bumpRestitution) * vn * nx;
    p.vy -= (1 + CONFIG.bumpRestitution) * vn * ny;
  }
  p.vx += nx * kick;
  p.vy += ny * kick;
  return true;
}

function spinOut() {
  if (player.spin > 0 || player.immune > 0) return false;
  player.spin = CONFIG.spinTime;
  player.immune = CONFIG.spinTime + 1;
  player.vx *= 0.4;
  player.vy *= 0.4;
  play('spin');
  return true;
}

// Wind, currents and wells move the car directly so grip can't cancel them.
function carryVelocity(p) {
  let cx = wind.x, cy = wind.y;
  let inCurrent = false;
  for (const c of currents) {
    if (Math.hypot(p.x - c.x, p.y - c.y) < c.r) { cx += c.fx; cy += c.fy; inCurrent = true; }
  }
  if (inCurrent && !p.inCurrent) play('splash', 0.5);
  p.inCurrent = inCurrent;
  for (const w of wells) {
    const dx = w.x - p.x, dy = w.y - p.y, d = Math.hypot(dx, dy);
    if (d < w.core && spinOut()) {
      play('zap');
      // Fling back toward the road so the core can't trap the car.
      p.vx = (-dx / (d || 1)) * 450;
      p.vy = (-dy / (d || 1)) * 450;
    }
    if (d < w.r && d > 1 && p.immune <= 0) {
      const f = w.pull * (1 - d / w.r);
      cx += (dx / d) * f;
      cy += (dy / d) * f;
    }
  }
  return { x: cx, y: cy };
}

function updatePlayer(dt) {
  const p = player;
  const spinning = p.spin > 0;

  const up = !spinning && (keys.ArrowUp || keys.KeyW);
  const down = !spinning && (keys.ArrowDown || keys.KeyS);
  const left = keys.ArrowLeft || keys.KeyA;
  const right = keys.ArrowRight || keys.KeyD;

  const near = nearestSegment(p.x, p.y);
  const inMud = mud.some((m) => Math.hypot(p.x - m.x, p.y - m.y) < m.r);
  const onSlick = slick.some((s) => Math.hypot(p.x - s.x, p.y - s.y) < s.r);
  const grip = spinning ? 0 : onSlick ? CONFIG.slickGrip : realm.grip;
  const drag = realm.drag + (near.d > CONFIG.roadHalf && !spinning ? CONFIG.offTrackDrag : 0) + (inMud ? CONFIG.mudDrag : 0);
  p.immune = Math.max(0, p.immune - dt);

  // Steer first, then grip pulls the old velocity toward the new heading.
  const fwdPrev = p.vx * Math.cos(p.a) + p.vy * Math.sin(p.a);
  if (spinning) {
    p.spin -= dt;
    p.a += 9 * dt;
  } else {
    const steer = (right ? 1 : 0) - (left ? 1 : 0);
    p.a += steer * CONFIG.steer * (onSlick ? CONFIG.slickSteer : 1) * dt * Math.max(-1, Math.min(1, fwdPrev / 200));
  }
  const nx = Math.cos(p.a), ny = Math.sin(p.a);
  let fwd = p.vx * nx + p.vy * ny;
  let lat = -p.vx * ny + p.vy * nx;

  p.boosting = !spinning && keys.Space && p.nitro > 0;
  const max = p.boosting ? CONFIG.nitroMax : CONFIG.maxSpeed;
  if (up && fwd < max) fwd += CONFIG.accel * dt;
  if (p.boosting) {
    fwd += CONFIG.nitroAccel * dt;
    p.nitro = Math.max(0, p.nitro - CONFIG.nitroDrain * dt);
  }
  if (down) fwd = fwd > 0 ? fwd - CONFIG.brake * dt : Math.max(CONFIG.reverseMax, fwd - CONFIG.accel * 0.5 * dt);
  if (fwd > max) fwd = max + (fwd - max) * Math.exp(-2 * dt);

  const skidding = Math.abs(lat) > CONFIG.skidThreshold || (down && fwd > 150) || spinning;
  const latAfter = lat * Math.exp(-grip * dt);
  // Most of the sideways speed that grip removes is turned into forward speed.
  fwd = Math.sign(fwd || 1) * Math.sqrt(fwd * fwd + 0.85 * (lat * lat - latAfter * latAfter));
  lat = latAfter;
  fwd *= Math.exp(-drag * dt);
  lat *= Math.exp(-drag * dt);

  p.vx = fwd * nx - lat * ny;
  p.vy = fwd * ny + lat * nx;
  const carry = carryVelocity(p);
  p.x += (p.vx + carry.x) * dt;
  p.y += (p.vy + carry.y) * dt;

  let hit = false;
  for (const j of junk) hit = collide(j.x, j.y, j.r) || hit;
  let zapped = false;
  for (const s of spinners) {
    const cx = Math.cos(s.ang) * s.len, cy = Math.sin(s.ang) * s.len;
    const t = Math.max(-1, Math.min(1, ((p.x - s.x) * cx + (p.y - s.y) * cy) / (s.len * s.len)));
    const rx = cx * t, ry = cy * t;
    if (collide(s.x + rx, s.y + ry, 8, -s.w * ry, s.w * rx, CONFIG.spinnerKick)) zapped = hit = true;
  }
  for (const d of drones) {
    if (collide(d.x, d.y, CONFIG.carRadius, d.vx, d.vy)) { hit = true; d.slow = 0.6; }
  }
  p.bumpCd -= dt;
  if (hit && p.bumpCd <= 0) { play(zapped ? 'zap' : 'bump'); p.bumpCd = 0.3; }

  if (vents.some((v) => v.state === 'erupt' && Math.hypot(p.x - v.x, p.y - v.y) < v.r)) spinOut();

  const rear = [-1, 1].map((side) => ({ x: p.x - nx * 12 - ny * 10 * side, y: p.y - ny * 12 + nx * 10 * side }));
  if ((skidding || onSlick) && p.lastRear) {
    rear.forEach((r, k) => skids.push({ x1: p.lastRear[k].x, y1: p.lastRear[k].y, x2: r.x, y2: r.y }));
    if (skids.length > CONFIG.maxSkids) skids.splice(0, skids.length - CONFIG.maxSkids);
  }
  p.lastRear = skidding || onSlick ? rear : null;

  // Only count forward progress in small steps so shortcuts and reversing don't count.
  const delta = (near.i - (p.progress % track.N) + track.N) % track.N;
  if (delta > 0 && delta < track.N / 8) p.progress += delta;

  for (const pk of pickups) {
    if (pk.timer > 0) { pk.timer -= dt; continue; }
    const pos = pointOnTrack(pk.i, pk.off);
    if (Math.hypot(p.x - pos.x, p.y - pos.y) < 35) {
      p.nitro = Math.min(100, p.nitro + CONFIG.nitroPickup);
      pk.timer = CONFIG.pickupRespawn;
      play('pickup');
    }
  }
}

function updateDrones(dt) {
  for (const d of drones) {
    const i = Math.floor(d.t) % track.N;
    d.slow = Math.max(0, d.slow - dt);
    const speed = realm.droneSpeed * d.speed * track.speedFactor[i] * (d.slow > 0 ? 0.5 : 1);
    d.t += (speed * dt) / track.segLen[i];
    const j = Math.floor(d.t), f = d.t - j;
    const lane = Math.max(-60, Math.min(60, d.lane + 25 * Math.sin(d.t * 0.15 + d.k * 2)));
    const a = pointOnTrack(j, lane), b = pointOnTrack(j + 1, lane);
    const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f;
    if (dt > 0) { d.vx = (x - d.x) / dt; d.vy = (y - d.y) / dt; }
    d.x = x;
    d.y = y;
    d.a = track.segAng[j % track.N];
  }
}

function updateHazards(dt) {
  if (realm.wind) {
    wind.timer -= dt;
    if (wind.timer <= 0) {
      const ang = Math.random() * Math.PI * 2;
      wind.tx = Math.cos(ang) * realm.wind;
      wind.ty = Math.sin(ang) * realm.wind;
      wind.timer = 3;
    }
    wind.x += (wind.tx - wind.x) * Math.min(1, dt * 1.5);
    wind.y += (wind.ty - wind.y) * Math.min(1, dt * 1.5);
    for (const s of streaks) {
      s.x = (((s.x + (wind.x * 4 - player.vx) * dt) % W) + W) % W;
      s.y = (((s.y + (wind.y * 4 - player.vy) * dt) % H) + H) % H;
    }
  }
  for (const v of vents) {
    v.timer -= dt;
    if (v.timer > 0) continue;
    if (v.state === 'idle') { v.state = 'warn'; v.timer = 1.2; }
    else if (v.state === 'warn') { v.state = 'erupt'; v.timer = 0.9; }
    else { v.state = 'idle'; v.timer = 2 + Math.random() * 2; }
  }
  for (const s of spinners) s.ang += s.w * dt;
}

function racePosition() {
  return 1 + drones.filter((d) => d.t > player.progress).length;
}

function update(dt) {
  if (phase === 'countdown') {
    countdown -= dt;
    const tick = Math.ceil(countdown);
    if (tick < lastTick && tick > 0) play('tick');
    lastTick = tick;
    if (countdown <= 0) { phase = 'racing'; play('go'); }
    updateHazards(dt);
    return;
  }
  if (phase !== 'racing') return;
  time += dt;
  if (flash) { flash.t -= dt; if (flash.t <= 0) flash = null; }
  updateHazards(dt);
  updatePlayer(dt);
  updateDrones(dt);

  const lapsDone = Math.floor(player.progress / track.N);
  if (lapsDone > player.laps) {
    player.laps = lapsDone;
    const lapTime = time - lapStart;
    lapStart = time;
    const rec = best[realm.name] || (best[realm.name] = {});
    if (!rec.lap || lapTime < rec.lap) {
      rec.lap = lapTime;
      saveBest();
      flash = { text: `BEST LAP ${lapTime.toFixed(2)}s`, t: 2 };
    } else flash = { text: `LAP ${lapTime.toFixed(2)}s`, t: 2 };
    play('lap');
  }

  const finish = CONFIG.laps * track.N;
  winner = drones.find((d) => d.t >= finish) || null;
  if (player.progress >= finish) {
    totalTime += time;
    const rec = best[realm.name] || (best[realm.name] = {});
    newBest = !rec.time || time < rec.time;
    if (newBest) { rec.time = time; saveBest(); }
    phase = 'realmWon';
    play('win');
  } else if (winner) {
    phase = 'realmLost';
    play('lose');
  }
}

// ---------- Rendering ----------
function drawCar(x, y, a, color, boosting) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  if (boosting) {
    ctx.fillStyle = Math.random() < 0.5 ? '#ffb000' : '#ff5a00';
    ctx.beginPath();
    ctx.moveTo(-18, -6); ctx.lineTo(-30 - Math.random() * 14, 0); ctx.lineTo(-18, 6);
    ctx.fill();
  }
  ctx.fillStyle = '#111';
  ctx.fillRect(-14, -12, 9, 4); ctx.fillRect(-14, 8, 9, 4);
  ctx.fillRect(6, -12, 9, 4); ctx.fillRect(6, 8, 9, 4);
  ctx.fillStyle = color;
  ctx.fillRect(-18, -9, 36, 18);
  ctx.fillStyle = '#9fd8ff';
  ctx.fillRect(2, -6, 8, 12);
  ctx.restore();
}

function strokeTrack(width, color, dash) {
  ctx.beginPath();
  track.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.setLineDash(dash || []);
  ctx.stroke();
  ctx.setLineDash([]);
}

function circle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawHazards() {
  for (const w of wells) {
    for (let k = 4; k >= 1; k--) circle(w.x, w.y, (w.r * k) / 4, `rgba(140,60,255,${0.06 + (4 - k) * 0.05})`);
    ctx.strokeStyle = 'rgba(220,180,255,0.7)';
    ctx.lineWidth = 3;
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      ctx.arc(w.x, w.y, 60 + k * 45, time * 2.5 + k * 2, time * 2.5 + k * 2 + 2);
      ctx.stroke();
    }
    circle(w.x, w.y, w.core + 6, '#b26bff');
    circle(w.x, w.y, w.core, '#000');
  }
  for (const s of slick) {
    circle(s.x, s.y, s.r, 'rgba(255,255,255,0.75)');
    ctx.strokeStyle = 'rgba(120,190,230,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x - s.r * 0.5, s.y - s.r * 0.2); ctx.lineTo(s.x + s.r * 0.3, s.y - s.r * 0.5);
    ctx.moveTo(s.x - s.r * 0.3, s.y + s.r * 0.4); ctx.lineTo(s.x + s.r * 0.5, s.y + s.r * 0.1);
    ctx.stroke();
  }
  for (const m of mud) circle(m.x, m.y, m.r, 'rgba(70,45,20,0.85)');
  for (const v of vents) {
    if (v.state === 'idle') circle(v.x, v.y, v.r * 0.6, '#3a1a0a');
    else if (v.state === 'warn') {
      circle(v.x, v.y, v.r * 0.6, '#5a200a');
      ctx.strokeStyle = `rgba(255,140,0,${0.5 + 0.5 * Math.sin(time * 20)})`;
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2); ctx.stroke();
    } else {
      circle(v.x, v.y, v.r, '#ff3b00');
      circle(v.x, v.y, v.r * 0.55, '#ffd000');
    }
  }
  for (const c of currents) {
    circle(c.x, c.y, c.r, 'rgba(120,220,255,0.25)');
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(Math.atan2(c.fy, c.fx));
    ctx.strokeStyle = 'rgba(220,250,255,0.85)';
    ctx.lineWidth = 5;
    for (let row = -1; row <= 1; row++) {
      for (let k = 0; k < 3; k++) {
        const x = ((time * 120 + k * 60) % 180) - 90;
        ctx.beginPath(); ctx.moveTo(x - 14, row * 45 - 14); ctx.lineTo(x, row * 45); ctx.lineTo(x - 14, row * 45 + 14); ctx.stroke();
      }
    }
    ctx.restore();
  }
  for (const j of junk) {
    ctx.save();
    ctx.translate(j.x, j.y);
    ctx.rotate(j.rot);
    ctx.fillStyle = '#7d6a55';
    ctx.fillRect(-j.r, -j.r, j.r * 2, j.r * 2);
    ctx.strokeStyle = '#b5652a';
    ctx.lineWidth = 3;
    ctx.strokeRect(-j.r + 4, -j.r + 4, j.r * 2 - 8, j.r * 2 - 8);
    ctx.restore();
  }
  for (const s of spinners) {
    const cx = Math.cos(s.ang) * s.len, cy = Math.sin(s.ang) * s.len;
    ctx.strokeStyle = '#d8f8f0';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s.x - cx, s.y - cy); ctx.lineTo(s.x + cx, s.y + cy); ctx.stroke();
    ctx.strokeStyle = '#ff4a6a';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(s.x + cx * 0.6, s.y + cy * 0.6); ctx.lineTo(s.x + cx, s.y + cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s.x - cx * 0.6, s.y - cy * 0.6); ctx.lineTo(s.x - cx, s.y - cy); ctx.stroke();
    ctx.lineCap = 'butt';
    circle(s.x, s.y, 14, '#38e0c0');
  }
}

function drawWorld() {
  ctx.fillStyle = realm.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.translate(Math.round(W / 2 - player.x), Math.round(H / 2 - player.y));
  for (const s of stars) {
    if (Math.abs(s.x - player.x) < W && Math.abs(s.y - player.y) < H) circle(s.x, s.y, s.s, 'rgba(255,255,255,0.8)');
  }
  ctx.lineJoin = 'round';
  strokeTrack(CONFIG.roadHalf * 2 + 16, realm.edge);
  strokeTrack(CONFIG.roadHalf * 2, realm.road);
  strokeTrack(3, 'rgba(255,255,255,0.5)', [20, 20]);

  ctx.strokeStyle = realm.skid || 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (const s of skids) { ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); }
  ctx.stroke();

  // Start/finish line; glows as the realm core on the final lap.
  const s = track.pts[0];
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(track.segAng[0]);
  for (let k = 0; k < 18; k++) {
    for (let r = 0; r < 2; r++) {
      ctx.fillStyle = (k + r) % 2 ? '#fff' : '#111';
      ctx.fillRect(r * 10 - 10, -CONFIG.roadHalf + k * 10, 10, 10);
    }
  }
  ctx.restore();
  if (player.laps === CONFIG.laps - 1) {
    const pulse = 30 + Math.sin(time * 6) * 6;
    circle(s.x, s.y, pulse + 20, 'rgba(80,220,255,0.35)');
    circle(s.x, s.y, pulse * 0.5, '#5be0ff');
  }

  drawHazards();

  for (const pk of pickups) {
    if (pk.timer > 0) continue;
    const pos = pointOnTrack(pk.i, pk.off);
    circle(pos.x, pos.y, 14 + Math.sin(time * 5) * 2, '#39ff88');
    ctx.fillStyle = '#063';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', pos.x, pos.y + 5);
  }

  for (const d of drones) drawCar(d.x, d.y, d.a, d.color, false);
  drawCar(player.x, player.y, player.a, '#e8452c', player.boosting);
  ctx.restore();

  if (streaks.length) {
    const mag = Math.hypot(wind.x, wind.y);
    const ux = wind.x / (mag || 1), uy = wind.y / (mag || 1), len = 10 + mag * 0.25;
    ctx.strokeStyle = 'rgba(230,235,255,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const st of streaks) { ctx.moveTo(st.x, st.y); ctx.lineTo(st.x - ux * len, st.y - uy * len); }
    ctx.stroke();
  }
}

const ordinal = (n) => n + (['th', 'st', 'nd', 'rd'][n] || 'th');

function drawHUD() {
  const lap = Math.min(CONFIG.laps, player.laps + 1);
  const pos = racePosition();
  const rec = best[realm.name] || {};
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(10, 10, 260, 150);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`${realm.name}  ${realmIndex + 1}/${REALMS.length}`, 20, 34);
  ctx.font = '15px sans-serif';
  ctx.fillText(`Lap ${lap}/${CONFIG.laps}   Time ${time.toFixed(1)}s`, 20, 58);
  ctx.fillText(`Speed ${Math.round(Math.hypot(player.vx, player.vy) / 3)}`, 20, 80);
  ctx.fillStyle = '#bbb';
  ctx.font = '13px sans-serif';
  ctx.fillText(`Best lap ${rec.lap ? rec.lap.toFixed(2) + 's' : '--'}   Best ${rec.time ? rec.time.toFixed(1) + 's' : '--'}`, 20, 102);
  ctx.fillStyle = pos === 1 ? '#39ff88' : '#ff6b6b';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`${ordinal(pos)}/${drones.length + 1}`, 180, 80);
  ctx.fillStyle = '#333';
  ctx.fillRect(20, 120, 200, 14);
  ctx.fillStyle = player.boosting ? '#ffb000' : '#39ff88';
  ctx.fillRect(20, 120, 2 * player.nitro, 14);
  ctx.fillStyle = '#fff';
  ctx.font = '11px sans-serif';
  ctx.fillText('NITRO', 24, 131);
  if (muted) ctx.fillText('MUTED (M)', 190, 152);

  if (realm.wind) {
    const mag = Math.hypot(wind.x, wind.y) / realm.wind;
    ctx.save();
    ctx.translate(W / 2, 40);
    ctx.rotate(Math.atan2(wind.y, wind.x));
    ctx.strokeStyle = '#ffe94a';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-30 * mag, 0); ctx.lineTo(30 * mag, 0);
    ctx.lineTo(18 * mag, -10); ctx.moveTo(30 * mag, 0); ctx.lineTo(18 * mag, 10);
    ctx.stroke();
    ctx.restore();
  }

  if (flash) {
    ctx.fillStyle = `rgba(255,233,74,${Math.min(1, flash.t)})`;
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(flash.text, W / 2, H - 60);
  }

  // Minimap
  const mw = 190, mh = 140, mx = W - mw - 10, my = 10;
  const sc = Math.min(mw / (track.maxX - track.minX), mh / (track.maxY - track.minY));
  const map = (p) => ({ x: mx + (p.x - track.minX) * sc, y: my + (p.y - track.minY) * sc });
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(mx, my, mw, mh);
  ctx.beginPath();
  track.pts.forEach((p, i) => { const m = map(p); i ? ctx.lineTo(m.x, m.y) : ctx.moveTo(m.x, m.y); });
  ctx.closePath();
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 3;
  ctx.stroke();
  for (const d of drones) { const m = map(d); circle(m.x, m.y, 3.5, d.color); }
  const m = map(player);
  circle(m.x, m.y, 4.5, '#ff4a2c');
}

function overlay(lines) {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  const top = H / 2 - (lines.length * 42) / 2 + 20;
  lines.forEach(([text, size, color], k) => {
    ctx.fillStyle = color || '#fff';
    ctx.font = `${size >= 30 ? 'bold ' : ''}${size}px sans-serif`;
    ctx.fillText(text, W / 2, top + k * 42);
  });
}

function draw() {
  if (phase === 'intro' || phase === 'victory') {
    ctx.fillStyle = '#0b0f1a';
    ctx.fillRect(0, 0, W, H);
  }
  if (phase === 'intro') {
    overlay([
      ['REALM RACER', 48, '#ff6a2c'],
      [`Beat ${DRONES.length} Drones through 8 Realms. Reach each Realm Core first.`, 18],
      ['Ice · Swamp · Lava · Storm', 16, '#9fd8ff'],
      ['Water · Junk · Roto · Cosmo', 16, '#9fd8ff'],
      ['Grab green N orbs for nitro. Hold Space to boost. M: mute', 16, '#39ff88'],
      [best.total ? `Best campaign: ${best.total.toFixed(1)}s` : '', 16, '#bbb'],
      ['Press Enter to start', 22, '#ffe94a'],
    ]);
    return;
  }
  if (phase === 'victory') {
    overlay([
      ['ALL REALM CORES COLLECTED', 36, '#5be0ff'],
      [`Total time: ${totalTime.toFixed(1)}s`, 22],
      [newBest ? 'NEW BEST CAMPAIGN!' : `Best: ${best.total.toFixed(1)}s`, 20, newBest ? '#39ff88' : '#bbb'],
      ['Press Enter to play again', 20, '#ffe94a'],
    ]);
    return;
  }
  drawWorld();
  drawHUD();
  if (phase === 'countdown') {
    overlay([
      [realm.name, 36, '#5be0ff'],
      [realm.hint, 18],
      [String(Math.ceil(countdown)), 48, '#ffe94a'],
    ]);
  } else if (phase === 'realmWon') {
    overlay([
      ['REALM CORE ACQUIRED', 36, '#39ff88'],
      [`${realm.name} cleared in ${time.toFixed(1)}s`, 20],
      [newBest ? 'NEW BEST TIME!' : '', 20, '#39ff88'],
      [realmIndex + 1 < REALMS.length ? 'Press Enter for the next realm' : 'Press Enter to finish', 20, '#ffe94a'],
    ]);
  } else if (phase === 'realmLost') {
    overlay([
      [`${winner.name.toUpperCase()} GOT THERE FIRST`, 34, '#ff6b6b'],
      [realm.hint, 18],
      ['Press Enter or R to retry', 20, '#ffe94a'],
    ]);
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  updateEngine();
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
