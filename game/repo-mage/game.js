const CONFIG = {
  roundSeconds: 60,
  exPartyStartPoints: 10,
  spawnIntervalStart: 2.6,
  spawnIntervalMin: 1.5,
  monsterSpeed: 70,
  monsterHpStart: 2,
  monsterHpMax: 5,
  laneCount: 4,
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const TOP = 70;
const LANE_H = (H - TOP) / CONFIG.laneCount;
const VILLAGE_W = 60;
const DEF_X = 110;
const DEF_W = 110;
const DEF_H = 64;

let state;

function reset() {
  state = {
    phase: 'intro',
    time: 0,
    spawnTimer: 1.5,
    pool: 0,
    defenders: [
      { name: 'Ex-Party', points: CONFIG.exPartyStartPoints, color: '#c9a227', isExParty: true },
      { name: 'Broom', points: 0, color: '#8b5a2b' },
      { name: 'Pot Lid', points: 0, color: '#7a8a99' },
      { name: 'Rock', points: 0, color: '#6b6b6b' },
    ],
    monsters: [],
    effects: [],
    loseReason: '',
  };
}

function laneY(i) {
  return TOP + i * LANE_H + LANE_H / 2;
}

function currentMaxHp() {
  const t = Math.min(state.time / CONFIG.roundSeconds, 1);
  return Math.round(CONFIG.monsterHpStart + (CONFIG.monsterHpMax - CONFIG.monsterHpStart) * t);
}

function currentSpawnInterval() {
  const t = Math.min(state.time / CONFIG.roundSeconds, 1);
  return CONFIG.spawnIntervalStart + (CONFIG.spawnIntervalMin - CONFIG.spawnIntervalStart) * t;
}

function spawnMonster() {
  const lane = Math.floor(Math.random() * CONFIG.laneCount);
  const hp = 1 + Math.floor(Math.random() * currentMaxHp());
  state.monsters.push({ lane, hp, x: W + 20 });
}

function update(dt) {
  if (state.phase !== 'play') return;

  state.time += dt;
  if (state.time >= CONFIG.roundSeconds) {
    state.phase = 'win';
    return;
  }

  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnMonster();
    state.spawnTimer = currentSpawnInterval();
  }

  for (const m of state.monsters) {
    m.x -= CONFIG.monsterSpeed * dt;
    const def = state.defenders[m.lane];
    if (!m.dead && m.x <= DEF_X + DEF_W) {
      if (def.points >= m.hp) {
        m.dead = true;
        state.effects.push({ x: m.x, y: laneY(m.lane), t: 0.4, color: '#7CFC00' });
      } else if (def.isExParty) {
        state.phase = 'lose';
        state.loseReason = 'Your ex-party fell. You took too much.';
      } else {
        state.phase = 'lose';
        state.loseReason = `A monster got past the ${def.name} and reached the village.`;
      }
    }
  }
  state.monsters = state.monsters.filter((m) => !m.dead);

  for (const e of state.effects) e.t -= dt;
  state.effects = state.effects.filter((e) => e.t > 0);
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#5a3d2b';
  ctx.fillRect(0, TOP, VILLAGE_W, H - TOP);
  ctx.fillStyle = '#eee';
  ctx.font = '12px sans-serif';
  ctx.save();
  ctx.translate(35, H / 2 + TOP / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('VILLAGE', 0, 0);
  ctx.restore();

  for (let i = 0; i < CONFIG.laneCount; i++) {
    ctx.strokeStyle = '#2c3346';
    ctx.beginPath();
    ctx.moveTo(VILLAGE_W, TOP + i * LANE_H);
    ctx.lineTo(W, TOP + i * LANE_H);
    ctx.stroke();
  }

  state.defenders.forEach((d, i) => {
    const y = laneY(i) - DEF_H / 2;
    ctx.fillStyle = d.color;
    ctx.fillRect(DEF_X, y, DEF_W, DEF_H);
    ctx.strokeStyle = d.points > 0 ? '#9cf' : '#333';
    ctx.lineWidth = Math.min(1 + d.points, 8);
    ctx.strokeRect(DEF_X, y, DEF_W, DEF_H);
    ctx.lineWidth = 1;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '13px sans-serif';
    ctx.fillText(d.name, DEF_X + DEF_W / 2, y + 20);
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(d.points, DEF_X + DEF_W / 2, y + 50);
  });

  for (const m of state.monsters) {
    const y = laneY(m.lane);
    const def = state.defenders[m.lane];
    ctx.fillStyle = def.points >= m.hp ? '#3a7d44' : '#c0392b';
    ctx.beginPath();
    ctx.arc(m.x, y, 18 + m.hp * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m.hp, m.x, y + 6);
  }

  for (const e of state.effects) {
    ctx.globalAlpha = e.t / 0.4;
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.arc(e.x, e.y, 40 * (1 - e.t / 0.4) + 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = '#eee';
  ctx.textAlign = 'left';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`Pool: ${state.pool}`, 20, 40);
  ctx.textAlign = 'right';
  const left = Math.max(0, CONFIG.roundSeconds - state.time);
  ctx.fillText(`Time: ${left.toFixed(1)}s`, W - 20, 40);
  ctx.textAlign = 'center';
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Red = will break through. Green = will be stopped.', W / 2, 40);

  if (state.phase !== 'play') {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    if (state.phase === 'intro') {
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText('REPO MAGE', W / 2, H / 2 - 60);
      ctx.font = '18px sans-serif';
      ctx.fillText("You just got fired. Every buff on your old party's gear is yours.", W / 2, H / 2 - 15);
      ctx.fillText('Take points back, arm your junk, and survive 60 seconds.', W / 2, H / 2 + 15);
      ctx.fillText("But don't let your ex-party fall.", W / 2, H / 2 + 45);
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Click to start', W / 2, H / 2 + 95);
    } else if (state.phase === 'win') {
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText('YOU SURVIVED', W / 2, H / 2 - 10);
      ctx.font = '18px sans-serif';
      ctx.fillText('Press R to play again', W / 2, H / 2 + 30);
    } else {
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 30);
      ctx.font = '18px sans-serif';
      ctx.fillText(state.loseReason, W / 2, H / 2 + 10);
      ctx.fillText('Press R to restart', W / 2, H / 2 + 45);
    }
  }
}

function defenderAt(mx, my) {
  return state.defenders.findIndex((_, i) => {
    const y = laneY(i) - DEF_H / 2;
    return mx >= DEF_X && mx <= DEF_X + DEF_W && my >= y && my <= y + DEF_H;
  });
}

canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('mousedown', (e) => {
  if (state.phase === 'intro') {
    state.phase = 'play';
    return;
  }
  if (state.phase !== 'play') return;

  const rect = canvas.getBoundingClientRect();
  const idx = defenderAt(e.clientX - rect.left, e.clientY - rect.top);
  if (idx < 0) return;
  const def = state.defenders[idx];
  const revoke = e.button === 2 || e.shiftKey;

  if (revoke && def.points > 0) {
    def.points--;
    state.pool++;
  } else if (!revoke && state.pool > 0) {
    def.points++;
    state.pool--;
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') reset();
});

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

reset();
requestAnimationFrame(frame);
