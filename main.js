// ========== CONFETTI ENGINE ==========
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const COLORS = ['#FF2D7A','#FFD600','#7C3AED','#00D4C8','#FF6B00','#A3FF00','#FF88CC','#00FFDD'];
const SHAPES = ['rect','circle','triangle'];

let confettiParticles = [];

function createConfetti(x, y, count = 20, burst = false) {
  for (let i = 0; i < count; i++) {
    const angle = burst ? (Math.PI * 2 * i / count + Math.random() * 0.5) : (Math.random() * Math.PI * 2);
    const speed = burst ? (Math.random() * 9 + 5) : (Math.random() * 3 + 1);
    confettiParticles.push({
      x: x ?? Math.random() * canvas.width,
      y: y ?? -20,
      vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 2,
      vy: burst ? Math.sin(angle) * speed : (Math.random() * 1.5 + 0.5),
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: Math.random() * 8 + 5,
      alpha: 1,
      fade: burst ? 0.012 : 0,
      gravity: burst ? 0.2 : 0.05,
      burst,
    });
  }
}

function initConfetti() {
  for (let i = 0; i < 25; i++) {
    const p = createAmbientParticle();
    p.y = Math.random() * canvas.height;
    confettiParticles.push(p);
  }
}

function createAmbientParticle() {
  return {
    x: Math.random() * canvas.width,
    y: -20,
    vx: (Math.random() - 0.5) * 2,
    vy: Math.random() * 1.5 + 0.5,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    size: Math.random() * 7 + 4,
    alpha: 1,
    fade: 0,
    gravity: 0.05,
    burst: false,
  };
}

function drawConfettiParticle(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot * Math.PI / 180);
  ctx.fillStyle = p.color;
  if (p.shape === 'rect') {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else if (p.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -p.size / 2);
    ctx.lineTo(p.size / 2, p.size / 2);
    ctx.lineTo(-p.size / 2, p.size / 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles = confettiParticles.filter(p => p.alpha > 0);
  for (const p of confettiParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.99;
    p.rot += p.rotSpeed;
    if (!p.burst && p.y > canvas.height) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
      p.vy = Math.random() * 1.5 + 0.5;
      p.vx = (Math.random() - 0.5) * 2;
    }
    if (p.burst) p.alpha -= p.fade;
    drawConfettiParticle(p);
  }
  const ambientCount = confettiParticles.filter(p => !p.burst).length;
  if (ambientCount < 20 && Math.random() < 0.05) {
    confettiParticles.push(createAmbientParticle());
  }
  requestAnimationFrame(animateConfetti);
}

initConfetti();
animateConfetti();

// ========== FLOATING BALLOONS ==========
const balloonEmojis = ['🎈','🎈','🎈','🎉','🎊','⭐','✨'];
function spawnBalloon() {
  const el = document.createElement('div');
  el.className = 'balloon';
  el.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
  el.style.left = Math.random() * 90 + '%';
  const dur = Math.random() * 8 + 10;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = '0s';
  el.style.fontSize = (Math.random() * 1.5 + 2) + 'rem';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), (dur + 1) * 1000);
}
setInterval(spawnBalloon, 2000);
spawnBalloon(); spawnBalloon(); spawnBalloon();

// ========== ANIMAL CLICK MESSAGES ==========
const animalMessages = [
  'גוואק! אני כבר ספרתי את הימים! 🦆',
  'פולי רוצה קונפטי!! 🦜',
  'צפרדע קופצת לשמחה! 🐸',
  'הפלמינגו לובשת את הגאון הורוד! 🦩',
  'פינגווין מביא דגים לבופה! 🐧',
  'אריה שואג מהתרגשות! 🦁',
  'פנדה אוכלת במבוק על הריקוד! 🐼',
  'תמנון מגיע עם 8 מתנות! 🐙',
];
document.querySelectorAll('.animal').forEach((el, i) => {
  el.addEventListener('click', () => {
    showToast(animalMessages[i] || '🎉 יאיי!');
    spawnSparkle(el);
  });
});

// ========== TOAST ==========
let toastTimeout;
const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== SPARKLE ==========
function spawnSparkle(el) {
  const rect = el.getBoundingClientRect();
  const sp = document.createElement('div');
  sp.className = 'sparkle';
  sp.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
  sp.style.left = rect.left + rect.width/2 + 'px';
  sp.style.top = rect.top + 'px';
  document.body.appendChild(sp);
  setTimeout(() => sp.remove(), 800);
}

// ========== DUCK CLICK GAME ==========
let duckActive = false;
let duckScore = 0;
let duckTimerInterval, duckMoveInterval;
let duckTimeLeft = 15;

const duckArena = document.getElementById('duck-arena');
const duckEl = document.getElementById('duck-game-duck');
const duckScoreEl = document.getElementById('duck-score');
const duckBtn = document.getElementById('duck-start-btn');
const duckTimerBar = document.getElementById('duck-timer-bar');

function moveDuck() {
  const maxX = Math.max(10, duckArena.clientWidth - 65);
  const maxY = Math.max(10, duckArena.clientHeight - 65);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  duckEl.style.left = x + 'px';
  duckEl.style.top = y + 'px';
  duckEl.style.transform = x > maxX / 2 ? 'scaleX(-1)' : 'scaleX(1)';
}

function startDuckGame() {
  if (duckActive) return;
  duckActive = true;
  duckScore = 0;
  duckTimeLeft = 15;
  duckScoreEl.textContent = '0';
  duckTimerBar.style.width = '100%';
  duckBtn.disabled = true;
  duckBtn.textContent = '⏳ שחק!';
  duckEl.classList.remove('inactive');
  moveDuck();
  duckMoveInterval = setInterval(moveDuck, 1200);
  duckTimerInterval = setInterval(() => {
    duckTimeLeft -= 0.1;
    duckTimerBar.style.width = (duckTimeLeft / 15 * 100) + '%';
    if (duckTimeLeft <= 0) endDuckGame();
  }, 100);
}

function endDuckGame() {
  clearInterval(duckTimerInterval);
  clearInterval(duckMoveInterval);
  duckActive = false;
  duckEl.classList.add('inactive');
  duckBtn.disabled = false;
  duckBtn.textContent = 'שחק שוב! 🦆';
  duckTimerBar.style.width = '0%';
  saveDuckScore(duckScore);
  showToast('המשחק נגמר! קלטת ' + duckScore + ' ברווזים! 🦆');
  if (duckScore >= 5) createConfetti(canvas.width/2, canvas.height/2, 40, true);
}

duckEl.addEventListener('click', onDuckClick);
duckEl.addEventListener('touchstart', (e) => { e.preventDefault(); onDuckClick(e); }, { passive: false });

function onDuckClick(e) {
  if (!duckActive) return;
  e.stopPropagation();
  duckScore++;
  duckScoreEl.textContent = duckScore;
  const duckX = parseFloat(duckEl.style.left) + 20;
  const duckY = parseFloat(duckEl.style.top);
  showHitText(duckX, duckY);
  moveDuck();
  if (duckScore % 5 === 0) {
    const rect = duckArena.getBoundingClientRect();
    createConfetti(rect.left + rect.width / 2, rect.top, 20, true);
  }
}

function showHitText(x, y) {
  const ht = document.createElement('div');
  ht.className = 'hit-text';
  ht.textContent = '+1 🦆';
  ht.style.left = x + 'px';
  ht.style.top = y + 'px';
  duckArena.appendChild(ht);
  setTimeout(() => ht.remove(), 800);
}

let duckHighScores = [];
function saveDuckScore(score) {
  duckHighScores.push(score);
  duckHighScores.sort((a,b) => b-a);
  duckHighScores = duckHighScores.slice(0,3);
  const lb = document.getElementById('duck-leaderboard');
  lb.style.display = 'block';
  const entries = document.getElementById('duck-lb-entries');
  entries.innerHTML = duckHighScores.map((s,i) =>
    `<div class="lb-entry"><span>${['🥇','🥈','🥉'][i]} מקום ${i+1}</span><span>${s} ברווזים</span></div>`
  ).join('');
}

// ========== BALLOON POP GAME ==========
const balloonArena = document.getElementById('balloon-arena');
const balloonScoreEl = document.getElementById('balloon-score');
const balloonBtn = document.getElementById('balloon-start-btn');
const balloonTimerBarEl = document.getElementById('balloon-timer-bar');

let balloonActive = false;
let balloonScore = 0;
let balloonTimeLeft = 15;
let balloonInterval, balloonTimerInterval2;
const balloonTypes = ['🎈','🎈','🎈','🟠','🟡','🟣','🔵'];

function startBalloonGame() {
  if (balloonActive) return;
  balloonActive = true;
  balloonScore = 0;
  balloonTimeLeft = 15;
  balloonScoreEl.textContent = '0';
  balloonTimerBarEl.style.width = '100%';
  balloonBtn.disabled = true;
  balloonBtn.textContent = '⏳ פוצץ!';
  balloonArena.innerHTML = '';

  balloonInterval = setInterval(spawnPopBalloon, 600);
  balloonTimerInterval2 = setInterval(() => {
    balloonTimeLeft -= 0.1;
    balloonTimerBarEl.style.width = (balloonTimeLeft / 15 * 100) + '%';
    if (balloonTimeLeft <= 0) endBalloonGame();
  }, 100);
}

function endBalloonGame() {
  clearInterval(balloonInterval);
  clearInterval(balloonTimerInterval2);
  balloonActive = false;
  balloonArena.innerHTML = '';
  balloonBtn.disabled = false;
  balloonBtn.textContent = 'שחק שוב! 🎈';
  balloonTimerBarEl.style.width = '0%';
  showToast('פוצצת ' + balloonScore + ' בלונים! 🎈');
  if (balloonScore >= 10) createConfetti(canvas.width/2, canvas.height/2, 50, true);
}

function spawnPopBalloon() {
  if (!balloonActive) return;
  const b = document.createElement('div');
  b.className = 'pop-balloon';
  b.textContent = balloonTypes[Math.floor(Math.random() * balloonTypes.length)];
  const arenaH = balloonArena.clientHeight;
  const arenaW = balloonArena.clientWidth;
  const maxX = arenaW - 50;
  b.style.left = Math.random() * maxX + 'px';
  b.style.top = (arenaH - 10) + 'px';
  const dur = Math.random() * 1.5 + 2;
  b.style.animationDuration = dur + 's';

  let popped = false;
  function pop(e) {
    if (!balloonActive || popped) return;
    popped = true;
    e.preventDefault();
    e.stopPropagation();
    balloonScore++;
    balloonScoreEl.textContent = balloonScore;
    b.textContent = '💥';
    b.style.animation = 'none';
    b.style.fontSize = '3.5rem';
    b.style.opacity = '0';
    b.style.transition = 'opacity 0.2s, font-size 0.15s';
    const bRect = b.getBoundingClientRect();
    createConfetti(bRect.left + bRect.width/2, bRect.top + bRect.height/2, 10, true);
    setTimeout(() => b.remove(), 250);
  }

  b.addEventListener('click', pop);
  b.addEventListener('touchstart', pop, { passive: false });
  balloonArena.appendChild(b);
  setTimeout(() => { if (b.parentNode) b.remove(); }, dur * 1000 + 200);
}

// ========== CONFETTI CANNON GAME ==========
let cannonCount = 0;
const cannonEmoji = document.getElementById('cannon-emoji');
const cannonCountEl = document.getElementById('cannon-count');

function fireCannon() {
  cannonCount++;
  cannonCountEl.textContent = 'ירות: ' + cannonCount;
  cannonEmoji.classList.remove('cannon-fire');
  void cannonEmoji.offsetWidth;
  cannonEmoji.classList.add('cannon-fire');

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  createConfetti(cx, cy, 60, true);
  createConfetti(Math.random() * canvas.width, Math.random() * canvas.height / 2, 30, true);

  const msgs = [
    '💥 בום! קונפטי בכל מקום!',
    '🎊 יאיי! המסיבה מתחילה!',
    '🎉 עוד ועוד קונפטי!',
    '✨ כמה יופי של קונפטי!',
    '🌈 צבעים לכל עבר!',
  ];
  showToast(msgs[Math.floor(Math.random() * msgs.length)]);

  if (cannonCount === 10) showToast('🏆 10 ירות! אתה מלך הקונפטי! 👑');
  if (cannonCount === 25) showToast('🔥 25 ירות! אגדה חייה! 🎆');
}

// ========== COUNTDOWN TIMER ==========
const partyDate = new Date('2026-04-18T21:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = partyDate - now;
  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '🎉';
    document.getElementById('cd-hours').textContent = '🎉';
    document.getElementById('cd-mins').textContent = '🎉';
    document.getElementById('cd-secs').textContent = '🎉';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ========== GUEST LIST (API-backed) ==========
const guestEmojis = ['🦆','🎉','🌟','🦩','🐸','🦜','🎊','⭐','🦁','🐼','🦋','🐧'];
let guestList = [];
let pendingRemoveName = null;

function renderGuestList() {
  const grid = document.getElementById('guest-list-grid');
  const countLine = document.getElementById('guest-count-line');
  if (guestList.length === 0) {
    countLine.textContent = 'עדיין אין מגיעים — היה הראשון!';
    grid.innerHTML = '';
    return;
  }
  countLine.textContent = `🎉 ${guestList.length} אנשים מגיעים למסיבה!`;
  grid.innerHTML = guestList.map((name, i) => {
    const emoji = guestEmojis[i % guestEmojis.length];
    const safeName = name.replace(/"/g, '&quot;');
    return `<div class="guest-chip">${emoji} ${name}<button class="guest-chip-remove" onclick="askRemove('${safeName}')" title="הסר">✕</button></div>`;
  }).join('');
}

async function fetchGuests() {
  try {
    const r = await fetch('/api/guests');
    if (r.ok) { guestList = await r.json(); renderGuestList(); }
  } catch {}
}

async function addGuest(name) {
  try {
    const r = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (r.ok) { guestList = await r.json(); renderGuestList(); }
  } catch { showToast('שגיאת חיבור 😢'); }
}

function askRemove(name) {
  pendingRemoveName = name;
  document.getElementById('pw-removing-name').textContent = 'הסרה: ' + name;
  document.getElementById('pw-input').value = '';
  document.getElementById('pw-error').textContent = '';
  const modal = document.getElementById('pw-modal');
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('pw-input').focus(), 100);
}

function closePwModal() {
  document.getElementById('pw-modal').style.display = 'none';
  pendingRemoveName = null;
}

async function confirmRemove() {
  const pw = document.getElementById('pw-input').value;
  if (!pendingRemoveName) return;
  try {
    const r = await fetch('/api/guests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pendingRemoveName, password: pw }),
    });
    if (r.status === 403) {
      document.getElementById('pw-error').textContent = '❌ סיסמה שגויה!';
      document.getElementById('pw-input').value = '';
      document.getElementById('pw-input').focus();
      return;
    }
    if (r.ok) {
      guestList = await r.json();
      renderGuestList();
      showToast('🗑️ ' + pendingRemoveName + ' הוסר/ה מהרשימה');
      closePwModal();
    }
  } catch { showToast('שגיאת חיבור 😢'); }
}

document.getElementById('pw-input').addEventListener('keydown', e => { if (e.key === 'Enter') confirmRemove(); });
document.getElementById('pw-modal').addEventListener('click', e => { if (e.target === document.getElementById('pw-modal')) closePwModal(); });

fetchGuests();

// ========== RSVP ==========
function sendRSVP(coming) {
  const name = document.getElementById('rsvp-name').value.trim() || 'חבר/ה';
  const msg = coming
    ? `${name}, יאיי! מחכים לך! 🎉🦆`
    : `${name}, חבל מאוד! נחסרת! 😢`;
  document.getElementById('rsvp-form').style.display = 'none';
  const success = document.getElementById('rsvp-success');
  success.style.display = 'flex';
  document.getElementById('rsvp-success-msg').textContent = msg;
  if (coming) {
    addGuest(name);
    createConfetti(canvas.width/2, canvas.height/2, 80, true);
    showToast('🎊 ' + name + ' מגיע/ה! יאיי!');
  }
}

function resetRSVP() {
  document.getElementById('rsvp-name').value = '';
  document.getElementById('rsvp-form').style.display = 'flex';
  document.getElementById('rsvp-success').style.display = 'none';
}

// ========== MEMORY GAME ==========
const MEMORY_EMOJIS = ['🦆','🦜','🐸','🦩','🐧','🦁','🐼','🐙'];
let memFlipped = [], memMatched = 0, memLocked = false, memScore = 0;

function startMemoryGame() {
  const grid = document.getElementById('memory-grid');
  const btn = document.getElementById('memory-start-btn');
  btn.textContent = '🔄 שחק שוב!';
  memFlipped = []; memMatched = 0; memLocked = false; memScore = 0;
  document.getElementById('memory-score').textContent = '0';

  const pairs = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  grid.innerHTML = pairs.map((emoji, i) => `
    <div class="mem-card" data-index="${i}" data-emoji="${emoji}" onclick="flipCard(this)">
      <div class="mem-card-inner mem-card-back">❓</div>
      <div class="mem-card-inner mem-card-front">${emoji}</div>
    </div>
  `).join('');
}

function flipCard(card) {
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  memFlipped.push(card);
  if (memFlipped.length === 2) {
    memLocked = true;
    const [a, b] = memFlipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched');
      b.classList.add('matched');
      memMatched++;
      memScore += 10;
      document.getElementById('memory-score').textContent = memScore;
      memFlipped = [];
      memLocked = false;
      if (memMatched === MEMORY_EMOJIS.length) {
        createConfetti(canvas.width/2, canvas.height/3, 60, true);
        showToast('🏆 מצאת את כל הזוגות! ' + memScore + ' נקודות!');
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        memFlipped = [];
        memLocked = false;
        memScore = Math.max(0, memScore - 1);
        document.getElementById('memory-score').textContent = memScore;
      }, 900);
    }
  }
}

(function() {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '<div style="color:rgba(255,255,255,0.3);font-size:0.9rem;padding:1rem;text-align:center;grid-column:1/-1;">לחץ "התחל" כדי לשחק!</div>';
})();

// ========== WHACK-A-DUCK GAME ==========
const WHACK_HOLES = 9;
const WHACK_CHARS = ['🦆','🦆','🦆','🐸','🦜','🐊'];
let whackActive = false, whackScore = 0, whackTimeLeft = 20;
let whackTimerInt, whackSpawnInt;
let whackHoles = [];

function buildWhackGrid() {
  const grid = document.getElementById('whack-grid');
  grid.innerHTML = '';
  whackHoles = [];
  for (let i = 0; i < WHACK_HOLES; i++) {
    const hole = document.createElement('div');
    hole.className = 'whack-hole';
    const duck = document.createElement('div');
    duck.className = 'whack-duck';
    duck.textContent = '🦆';
    const splat = document.createElement('div');
    splat.className = 'whack-splat';
    splat.textContent = '💥';
    hole.appendChild(duck);
    hole.appendChild(splat);
    hole.addEventListener('click', () => whackHit(hole, i));
    hole.addEventListener('touchstart', (e) => { e.preventDefault(); whackHit(hole, i); }, { passive: false });
    grid.appendChild(hole);
    whackHoles.push({ el: hole, duck, up: false, timer: null });
  }
}

buildWhackGrid();

function startWhackGame() {
  if (whackActive) return;
  whackActive = true;
  whackScore = 0;
  whackTimeLeft = 20;
  document.getElementById('whack-score').textContent = '0';
  document.getElementById('whack-timer-bar').style.width = '100%';
  document.getElementById('whack-start-btn').disabled = true;
  document.getElementById('whack-start-btn').textContent = '⏳ שחק!';

  whackHoles.forEach(h => { h.el.classList.remove('up','hit'); h.up = false; clearTimeout(h.timer); });

  let spawnDelay = 700;
  function spawnLoop() {
    if (!whackActive) return;
    popRandomDuck();
    spawnDelay = Math.max(300, spawnDelay - 10);
    whackSpawnInt = setTimeout(spawnLoop, spawnDelay);
  }
  spawnLoop();

  whackTimerInt = setInterval(() => {
    whackTimeLeft -= 0.1;
    document.getElementById('whack-timer-bar').style.width = (whackTimeLeft / 20 * 100) + '%';
    if (whackTimeLeft <= 0) endWhackGame();
  }, 100);
}

function popRandomDuck() {
  const down = whackHoles.filter(h => !h.up);
  if (down.length === 0) return;
  const h = down[Math.floor(Math.random() * down.length)];
  const char = WHACK_CHARS[Math.floor(Math.random() * WHACK_CHARS.length)];
  h.duck.textContent = char;
  h.el.classList.remove('hit');
  h.el.classList.add('up');
  h.up = true;
  h.timer = setTimeout(() => {
    h.el.classList.remove('up');
    h.up = false;
  }, Math.random() * 800 + 600);
}

function whackHit(holeEl, idx) {
  if (!whackActive) return;
  const h = whackHoles[idx];
  if (!h.up || h.el.classList.contains('hit')) return;
  clearTimeout(h.timer);
  h.el.classList.remove('up');
  h.el.classList.add('hit');
  h.up = false;
  whackScore++;
  document.getElementById('whack-score').textContent = whackScore;
  const rect = holeEl.getBoundingClientRect();
  createConfetti(rect.left + rect.width/2, rect.top + rect.height/2, 6, true);
  setTimeout(() => h.el.classList.remove('hit'), 400);
}

function endWhackGame() {
  clearInterval(whackTimerInt);
  clearTimeout(whackSpawnInt);
  whackActive = false;
  whackHoles.forEach(h => { clearTimeout(h.timer); h.el.classList.remove('up','hit'); h.up = false; });
  document.getElementById('whack-timer-bar').style.width = '0%';
  const btn = document.getElementById('whack-start-btn');
  btn.disabled = false;
  btn.textContent = 'שחק שוב! 🔨';
  showToast('סיימת עם ' + whackScore + ' מכות! 🔨');
  if (whackScore >= 15) createConfetti(canvas.width/2, canvas.height/2, 60, true);
}

// ========== SIMON SAYS ==========
const SIMON_FREQS = [261.6, 329.6, 392.0, 523.2];
let simonSeq = [], simonPlayerIdx = 0, simonLevel = 0, simonPlaying = false;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, duration = 0.25) {
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.start(); osc.stop(ac.currentTime + duration);
  } catch {}
}

function playErrorTone() {
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'sawtooth';
    osc.frequency.value = 120;
    gain.gain.setValueAtTime(0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
    osc.start(); osc.stop(ac.currentTime + 0.5);
  } catch {}
}

function simonLightBtn(i, on) {
  const btn = document.getElementById('s' + i);
  if (on) btn.classList.add('lit'); else btn.classList.remove('lit');
}

function setSimonBtnsDisabled(disabled) {
  for (let i = 0; i < 4; i++) {
    document.getElementById('s' + i).dataset.disabled = disabled ? 'true' : 'false';
  }
}

async function playSequence() {
  setSimonBtnsDisabled(true);
  document.getElementById('simon-status').textContent = '👀 צפה ברצף...';
  await sleep(600);
  for (const idx of simonSeq) {
    simonLightBtn(idx, true);
    playTone(SIMON_FREQS[idx]);
    await sleep(500);
    simonLightBtn(idx, false);
    await sleep(200);
  }
  setSimonBtnsDisabled(false);
  simonPlayerIdx = 0;
  document.getElementById('simon-status').textContent = '🎮 תורך! חזור על הרצף';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function startSimon() {
  simonSeq = [];
  simonLevel = 0;
  simonPlaying = true;
  document.getElementById('simon-start-btn').textContent = '🔄 התחל מחדש';
  document.getElementById('simon-level').textContent = 'שלב 0';
  for (let i = 0; i < 4; i++) document.getElementById('s' + i).classList.remove('wrong');
  nextSimonRound();
}

async function nextSimonRound() {
  simonLevel++;
  simonSeq.push(Math.floor(Math.random() * 4));
  document.getElementById('simon-level').textContent = 'שלב ' + simonLevel;
  await playSequence();
}

async function simonPress(i) {
  if (!simonPlaying) return;
  const btn = document.getElementById('s' + i);
  if (btn.dataset.disabled === 'true') return;

  setSimonBtnsDisabled(true);
  btn.classList.add('active-press');
  playTone(SIMON_FREQS[i], 0.2);
  await sleep(180);
  btn.classList.remove('active-press');
  setSimonBtnsDisabled(false);

  if (i !== simonSeq[simonPlayerIdx]) {
    simonPlaying = false;
    playErrorTone();
    for (let j = 0; j < 4; j++) document.getElementById('s' + j).classList.add('wrong');
    await sleep(600);
    for (let j = 0; j < 4; j++) document.getElementById('s' + j).classList.remove('wrong');
    document.getElementById('simon-status').textContent = `❌ טעות! הגעת לשלב ${simonLevel}`;
    document.getElementById('simon-level').textContent = 'נסה שוב!';
    setSimonBtnsDisabled(true);
    if (simonLevel >= 5) createConfetti(canvas.width/2, canvas.height/2, 30, true);
    return;
  }

  simonPlayerIdx++;
  if (simonPlayerIdx === simonSeq.length) {
    document.getElementById('simon-status').textContent = '✅ כל הכבוד! עובר לשלב הבא...';
    if (simonLevel % 3 === 0) createConfetti(canvas.width/2, canvas.height/2, 25, true);
    await sleep(900);
    nextSimonRound();
  }
}

// ========== CLICK ANYWHERE SPARKLE ==========
document.addEventListener('click', (e) => {
  if (e.target.closest('#duck-arena') || e.target.closest('#balloon-arena')) return;
  if (Math.random() < 0.3) {
    const sp = document.createElement('div');
    sp.className = 'sparkle';
    sp.textContent = ['✨','⭐','💫','🌟','🎊'][Math.floor(Math.random()*5)];
    sp.style.left = e.clientX + 'px';
    sp.style.top = e.clientY + 'px';
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 800);
  }
});
