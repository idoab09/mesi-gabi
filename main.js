// ========== CURSOR GLOW ==========
const cursorGlow = document.getElementById('cursor-glow');
let glowX = window.innerWidth / 2, glowY = window.innerHeight / 2;
let currentGlowX = glowX, currentGlowY = glowY;

window.addEventListener('mousemove', e => {
  glowX = e.clientX;
  glowY = e.clientY;
});

function animateGlow() {
  currentGlowX += (glowX - currentGlowX) * 0.07;
  currentGlowY += (glowY - currentGlowY) * 0.07;
  cursorGlow.style.left = currentGlowX + 'px';
  cursorGlow.style.top = currentGlowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();


// ========== ANCHOR SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

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
  if (ambientCount < 3 && Math.random() < 0.008) {
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
  if (duckScore >= 5) createConfetti(canvas.width/2, canvas.height/2, 20, true);
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
    createConfetti(rect.left + rect.width / 2, rect.top, 10, true);
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
  if (balloonScore >= 10) createConfetti(canvas.width/2, canvas.height/2, 25, true);
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
  createConfetti(cx, cy, 25, true);
  createConfetti(Math.random() * canvas.width, Math.random() * canvas.height / 2, 12, true);

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
const partyDate = new Date('2026-08-07T21:00:00');

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
let rsvpName = '';

function sendRSVP(coming) {
  const name = document.getElementById('rsvp-name').value.trim();
  if (!name) {
    const input = document.getElementById('rsvp-name');
    input.focus();
    input.classList.add('input-shake');
    setTimeout(() => input.classList.remove('input-shake'), 600);
    return;
  }
  rsvpName = name;
  const msg = coming
    ? `${name}, יאיי! מחכים לך! 🎉🦆`
    : `${name}, חבל מאוד! נחסרת! 😢`;
  document.getElementById('rsvp-form').style.display = 'none';
  const success = document.getElementById('rsvp-success');
  success.style.display = 'flex';
  document.getElementById('rsvp-success-msg').textContent = msg;
  if (coming) {
    addGuest(name);
    createConfetti(canvas.width/2, canvas.height/2, 30, true);
    if (window.balloons) window.balloons();
    showToast('🎊 ' + name + ' מגיע/ה! יאיי!');
  }
}

function resetRSVP() {
  rsvpName = '';
  document.getElementById('rsvp-name').value = '';
  document.getElementById('rsvp-form').style.display = 'flex';
  document.getElementById('rsvp-success').style.display = 'none';
}

// ========== NOTICEBOARD ==========
let noticeboardMessages = [];

function renderNoticeboard() {
  const list = document.getElementById('noticeboard-list');
  if (noticeboardMessages.length === 0) {
    list.innerHTML = '<p class="noticeboard-empty">אין הודעות עדיין — היה/י הראשון/ה! 📝</p>';
    return;
  }
  list.innerHTML = noticeboardMessages.slice().reverse().map(m => {
    const date = new Date(m.ts).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
    return `<div class="notice-item">
      <div class="notice-header"><span class="notice-name">${escapeHtml(m.name)}</span><span class="notice-date">${date}</span></div>
      <div class="notice-text">${escapeHtml(m.text)}</div>
    </div>`;
  }).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function fetchNoticeboard() {
  try {
    const r = await fetch('/api/messages');
    if (r.ok) { noticeboardMessages = await r.json(); renderNoticeboard(); }
  } catch {}
}

async function postNoticeboardMessage() {
  const name = document.getElementById('noticeboard-name').value.trim();
  const text = document.getElementById('noticeboard-input').value.trim();
  if (!name) {
    const inp = document.getElementById('noticeboard-name');
    inp.focus(); inp.classList.add('input-shake');
    setTimeout(() => inp.classList.remove('input-shake'), 600);
    return;
  }
  if (!text) {
    const inp = document.getElementById('noticeboard-input');
    inp.focus(); inp.classList.add('input-shake');
    setTimeout(() => inp.classList.remove('input-shake'), 600);
    return;
  }
  const btn = document.querySelector('.noticeboard-form .btn-party');
  btn.disabled = true;
  btn.textContent = 'שולח...';
  try {
    const r = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, text }),
    });
    if (r.ok) {
      noticeboardMessages = await r.json();
      renderNoticeboard();
      document.getElementById('noticeboard-name').value = '';
      document.getElementById('noticeboard-input').value = '';
      showToast('📌 ההודעה פורסמה!');
    }
  } catch { showToast('שגיאת חיבור 😢'); }
  btn.disabled = false;
  btn.textContent = 'פרסם הודעה 📌';
}

fetchNoticeboard();

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
        createConfetti(canvas.width/2, canvas.height/3, 25, true);
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
  if (whackScore >= 15) createConfetti(canvas.width/2, canvas.height/2, 25, true);
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
    if (simonLevel >= 5) createConfetti(canvas.width/2, canvas.height/2, 15, true);
    return;
  }

  simonPlayerIdx++;
  if (simonPlayerIdx === simonSeq.length) {
    document.getElementById('simon-status').textContent = '✅ כל הכבוד! עובר לשלב הבא...';
    if (simonLevel % 3 === 0) createConfetti(canvas.width/2, canvas.height/2, 12, true);
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

// ========== DJ PLAYER ==========
(function() {
  const audio        = document.getElementById('dj-audio');
  const vinyl        = document.getElementById('vinyl');
  const platter      = document.getElementById('platter');
  const turntableWrap = document.querySelector('.turntable-wrap');
  const tonearm      = document.getElementById('tonearm');
  const playBtn      = document.getElementById('dj-play-btn');
  const playIcon     = document.getElementById('dj-play-icon');
  const fill         = document.getElementById('dj-progress-fill');
  const head         = document.getElementById('dj-progress-head');
  const timeCur      = document.getElementById('dj-time-cur');
  const timeTot      = document.getElementById('dj-time-tot');
  const trackName    = document.getElementById('track-name');
  const trackArtist  = document.getElementById('track-artist');
  const vinylLabelTitle = document.getElementById('vinyl-label-title');
  const vinylLabelSub   = document.getElementById('vinyl-label-sub');
  const eqBars       = Array.from(document.querySelectorAll('.eq-bar'));
  const volSlider    = document.getElementById('dj-vol');
  const albumCards   = Array.from(document.querySelectorAll('.album-card'));
  const flyingVinyl  = document.getElementById('flying-vinyl');

  let playing = false;
  let eqRaf = null;
  let currentTrackSrc = null;

  // Format seconds -> M:SS
  function fmt(s) {
    s = Math.floor(s) || 0;
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  audio.addEventListener('loadedmetadata', () => {
    timeTot.textContent = fmt(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (scratching) return; // don't override during scratch
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = pct + '%';
    head.style.left  = pct + '%';
    timeCur.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    setPlaying(false);
  });

  window.djTogglePlay = function() {
    if (!currentTrackSrc) {
      // Flash the crate label to hint the user what to do
      const crate = document.getElementById('album-crate');
      if (crate) {
        crate.style.transition = 'box-shadow 0.3s';
        crate.style.boxShadow = '0 0 40px rgba(255,45,122,0.6)';
        setTimeout(() => { crate.style.boxShadow = ''; }, 600);
      }
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  window.djSetVol = function(v) {
    audio.volume = v;
  };

  window.djSeek = function(e) {
    const wrap = document.getElementById('dj-progress-wrap');
    const rect = wrap.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audio.duration) audio.currentTime = ratio * audio.duration;
  };

  function setPlaying(state) {
    playing = state;
    if (state) {
      vinyl.classList.add('playing');
      platter.classList.add('playing');
      tonearm.classList.add('on-record');
      playIcon.textContent = '⏸';
      playBtn.classList.add('is-playing');
      startEQ();
    } else {
      vinyl.classList.remove('playing');
      platter.classList.remove('playing');
      tonearm.classList.remove('on-record');
      playIcon.textContent = '▶';
      playBtn.classList.remove('is-playing');
      stopEQ();
    }
  }

  // ---- SCRATCH ----
  let scratching = false;
  let scratchStartAngle = 0;   // angle of pointer at drag start (degrees)
  let scratchStartTime  = 0;   // audio.currentTime at drag start
  let scratchLastAngle  = 0;
  let scratchLastTime   = 0;   // wall-clock ms
  let wasPlaying = false;
  let scratchVinylAngle = 0;   // current visual rotation of vinyl during scratch

  // Web Audio for pitch-shifted scratch playback
  let audioCtx = null;
  let scratchSource = null;
  let scratchGain = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function getAngleFromEvent(e) {
    const rect = vinyl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }

  function angleDiff(a, b) {
    let d = a - b;
    if (d > 180)  d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  vinyl.addEventListener('mousedown',  startScratch);
  vinyl.addEventListener('touchstart', startScratch, { passive: true });

  function startScratch(e) {
    scratching = true;
    wasPlaying = playing;
    if (playing) audio.pause();
    vinyl.classList.add('scratching');
    vinyl.classList.remove('playing');

    scratchStartAngle = getAngleFromEvent(e);
    scratchLastAngle  = scratchStartAngle;
    scratchStartTime  = audio.currentTime;
    scratchLastTime   = performance.now();

    // Freeze visual angle at current rotation
    const computed = getComputedStyle(vinyl).transform;
    if (computed && computed !== 'none') {
      const m = computed.match(/matrix\(([^)]+)\)/);
      if (m) {
        const vals = m[1].split(',');
        scratchVinylAngle = Math.atan2(parseFloat(vals[1]), parseFloat(vals[0])) * (180 / Math.PI);
      }
    }
    vinyl.style.transform = `rotate(${scratchVinylAngle}deg)`;
    vinyl.style.animationPlayState = 'paused';

    window.addEventListener('mousemove',  doScratch);
    window.addEventListener('mouseup',    endScratch);
    window.addEventListener('touchmove',  doScratch, { passive: true });
    window.addEventListener('touchend',   endScratch);
  }

  function doScratch(e) {
    if (!scratching) return;
    const now = performance.now();
    const angle = getAngleFromEvent(e);
    const delta = angleDiff(angle, scratchLastAngle);

    // Rotate vinyl visually
    scratchVinylAngle += delta;
    vinyl.style.transform = `rotate(${scratchVinylAngle}deg)`;

    // Map rotation to audio time: one full rotation = 2.4s of audio (matches spin speed)
    const secondsPerDegree = 2.4 / 360;
    const timeDelta = delta * secondsPerDegree;
    let newTime = audio.currentTime + timeDelta;
    newTime = Math.max(0, Math.min(audio.duration || 0, newTime));
    audio.currentTime = newTime;

    // Update progress bar during scratch
    const pct = audio.duration ? (newTime / audio.duration) * 100 : 0;
    fill.style.width = pct + '%';
    head.style.left  = pct + '%';
    timeCur.textContent = fmt(newTime);

    // Pitch/speed effect: play a tiny burst at adjusted rate
    const dt = now - scratchLastTime;
    if (dt > 0 && Math.abs(delta) > 0.5) {
      const degreesPerMs = delta / dt;
      // 360 deg in 2400ms = 0.15 deg/ms at normal speed → playback rate
      const rate = Math.max(-4, Math.min(4, degreesPerMs / 0.15));
      playScratchBurst(newTime, rate);
    }

    scratchLastAngle = angle;
    scratchLastTime  = now;
  }

  function endScratch() {
    if (!scratching) return;
    scratching = false;
    vinyl.classList.remove('scratching');
    vinyl.style.transform = '';
    vinyl.style.animationPlayState = '';

    stopScratchBurst();

    if (wasPlaying) {
      audio.play();
      setPlaying(true);
    }

    window.removeEventListener('mousemove',  doScratch);
    window.removeEventListener('mouseup',    endScratch);
    window.removeEventListener('touchmove',  doScratch);
    window.removeEventListener('touchend',   endScratch);
  }

  // Play audio at a custom playback rate for scratch sound
  let scratchBurstSource = null;
  let scratchBuffer = null;
  let scratchBufferSrc = null;
  let scratchBufferLoading = null;

  async function ensureScratchBuffer() {
    if (!currentTrackSrc) return null;
    if (scratchBuffer && scratchBufferSrc === currentTrackSrc) return scratchBuffer;
    if (scratchBufferLoading === currentTrackSrc) return null;
    const src = currentTrackSrc;
    scratchBufferLoading = src;
    try {
      const ctx = getAudioCtx();
      const resp = await fetch(src);
      const ab   = await resp.arrayBuffer();
      // If the track changed while we were loading, discard
      if (currentTrackSrc !== src) return null;
      scratchBuffer = await ctx.decodeAudioData(ab);
      scratchBufferSrc = src;
    } catch(err) {
      // ignore
    } finally {
      if (scratchBufferLoading === src) scratchBufferLoading = null;
    }
    return scratchBuffer;
  }

  function playScratchBurst(atTime, rate) {
    if (!scratchBuffer) return;
    const ctx = getAudioCtx();

    // Kill previous burst
    if (scratchBurstSource) {
      try { scratchBurstSource.stop(); } catch(e) {}
      scratchBurstSource = null;
    }

    if (rate === 0) return;

    const source = ctx.createBufferSource();
    source.buffer = scratchBuffer;
    source.playbackRate.value = Math.abs(rate);

    const gain = ctx.createGain();
    // Boost scratch volume slightly, apply soft ramp
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(audio.volume * 1.1, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);

    source.connect(gain);
    gain.connect(ctx.destination);

    // Clamp offset within buffer
    const offset = Math.max(0, Math.min(atTime, scratchBuffer.duration - 0.001));
    source.start(0, offset, 0.08);
    scratchBurstSource = source;
  }

  function stopScratchBurst() {
    if (scratchBurstSource) {
      try { scratchBurstSource.stop(); } catch(e) {}
      scratchBurstSource = null;
    }
  }

  // ---- EQ ----
  const eqTargets = eqBars.map(() => 4);

  function animateEQ() {
    eqBars.forEach((bar, i) => {
      if (Math.random() < 0.15) {
        eqTargets[i] = 4 + Math.random() * 34;
      }
      const current = parseFloat(bar.style.height) || 4;
      const next = current + (eqTargets[i] - current) * 0.18;
      bar.style.height = next + 'px';
    });
    eqRaf = requestAnimationFrame(animateEQ);
  }

  function startEQ() { if (!eqRaf) animateEQ(); }

  function stopEQ() {
    if (eqRaf) { cancelAnimationFrame(eqRaf); eqRaf = null; }
    eqBars.forEach(b => b.style.height = '4px');
    eqTargets.fill(4);
  }

  // Set initial volume
  audio.volume = parseFloat(volSlider.value);

  // ---- TRACK LOADING ----
  // Distinct accent colors for each album so the flying vinyl label matches
  const LABEL_COLORS = {
    'assets/get-lucky.mp3': '#FFD600',
    'assets/september.mp3': '#FF6B00',
    'assets/music-sounds-better-with-you.mp3': '#00D4C8',
    'assets/lady-hear-me-out-tonight.mp3': '#FF2D7A',
    'assets/dance-till-youre-dead.mp3': '#A3FF00',
    'assets/celebration.mp3': '#FF9500',
    'assets/canned-heat.mp3': '#7C3AED',
  };

  const deckBg = document.getElementById('dj-deck-bg');

  function loadTrack(card, autoplay) {
    const src    = card.dataset.src;
    const title  = card.dataset.title;
    const artist = card.dataset.artist;
    currentTrackSrc = src;
    audio.src = src;
    audio.load();
    trackName.textContent = title;
    trackArtist.textContent = artist;
    vinylLabelTitle.textContent = title.length > 14 ? title.slice(0, 12) + '…' : title;
    vinylLabelSub.textContent = artist;
    // Tint vinyl label
    const label = document.getElementById('vinyl-label');
    const color = LABEL_COLORS[src] || '#FF2D7A';
    label.style.background = `linear-gradient(135deg, ${color}, #7C3AED)`;
    // Update deck background with album art
    if (deckBg && card.dataset.cover) {
      deckBg.classList.remove('visible');
      setTimeout(() => {
        deckBg.style.backgroundImage = `url('${card.dataset.cover}')`;
        deckBg.classList.add('visible');
      }, 300);
    }
    // Mark which album is currently playing
    albumCards.forEach(c => c.classList.toggle('now-playing', c === card));
    // Pre-load scratch buffer for this track
    scratchBuffer = null;
    scratchBufferSrc = null;
    ensureScratchBuffer();
    if (autoplay) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        setPlaying(true);
      }
    }
  }

  // ---- DRAG & DROP (unified pointer events) ----
  // Drop target highlight styles
  const dropTargetStyle = document.createElement('style');
  dropTargetStyle.textContent = `
    .platter.drop-target {
      box-shadow: 0 0 0 6px rgba(0,212,200,0.4), 0 0 60px rgba(0,212,200,0.7),
                  0 0 120px rgba(0,212,200,0.4), inset 0 4px 20px rgba(0,0,0,0.6);
      transform: scale(1.04);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .turntable-wrap.drop-target { transform: scale(1.02); }
  `;
  document.head.appendChild(dropTargetStyle);

  albumCards.forEach(card => {
    const handle = card.querySelector('.vinyl-drag-handle');
    // Disable the old HTML5 draggable — we're using pointer events
    handle.setAttribute('draggable', 'false');
    handle.style.touchAction = 'none'; // let us hijack touches for dragging

    let ghost = null;
    let activePointerId = null;
    let startX = 0, startY = 0;
    let dragging = false;

    function makeGhost(x, y) {
      const size = handle.offsetWidth;
      const g = document.createElement('div');
      g.style.cssText = `
        position:fixed;
        left:${x - size/2}px;
        top:${y - size/2}px;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        pointer-events:none;
        z-index:10001;
        opacity:0.95;
        background:radial-gradient(circle at center,
          #c026d3 0 13%,
          #1a0030 13.5% 18%,
          #2d0050 18.5% 30%,
          #0f0020 30.5% 45%,
          #1a0030 45.5% 55%,
          #0f0020 55.5% 70%,
          #1a0030 70.5% 80%,
          #0f0020 80.5% 100%);
        box-shadow:0 0 40px rgba(192,38,211,0.7), 0 8px 32px rgba(0,0,0,0.8);
        transform:scale(1.1);
        will-change:left, top;
      `;
      document.body.appendChild(g);
      return g;
    }

    function updateDropTarget(x, y) {
      const pr = turntableWrap.getBoundingClientRect();
      const over = x >= pr.left && x <= pr.right && y >= pr.top && y <= pr.bottom;
      platter.classList.toggle('drop-target', over);
      turntableWrap.classList.toggle('drop-target', over);
      return over;
    }

    function endDrag(x, y, shouldDrop) {
      if (activePointerId !== null) {
        try { handle.releasePointerCapture(activePointerId); } catch (_) {}
      }
      const wasDragging = dragging;
      dragging = false;
      activePointerId = null;
      platter.classList.remove('drop-target');
      turntableWrap.classList.remove('drop-target');
      if (ghost) { ghost.remove(); ghost = null; }
      if (wasDragging && shouldDrop && x !== null) {
        const pr = turntableWrap.getBoundingClientRect();
        if (x >= pr.left && x <= pr.right && y >= pr.top && y <= pr.bottom) {
          dropAlbumOnPlatter(card);
        }
      }
    }

    handle.addEventListener('pointerdown', e => {
      if (activePointerId !== null) return;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      dragging = false;
      // Capture the pointer so we keep receiving events outside the handle
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    });

    handle.addEventListener('pointermove', e => {
      if (e.pointerId !== activePointerId) return;

      if (!dragging) {
        // Start dragging after 6px of movement
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.hypot(dx, dy) < 6) return;
        dragging = true;
        ghost = makeGhost(e.clientX, e.clientY);
        if (navigator.vibrate && e.pointerType === 'touch') navigator.vibrate(20);
      }

      e.preventDefault();
      const size = ghost.offsetWidth;
      ghost.style.left = (e.clientX - size / 2) + 'px';
      ghost.style.top  = (e.clientY - size / 2) + 'px';
      updateDropTarget(e.clientX, e.clientY);
    });

    handle.addEventListener('pointerup', e => {
      if (e.pointerId !== activePointerId) return;
      endDrag(e.clientX, e.clientY, true);
    });

    handle.addEventListener('pointercancel', e => {
      if (e.pointerId !== activePointerId) return;
      endDrag(null, null, false);
    });
  });

  // ---- DROP ANIMATION ----
  let pendingOnEnd = null;

  function dropAlbumOnPlatter(card) {
    const src = card.dataset.src;
    // Already playing this track? Just ensure it plays.
    if (currentTrackSrc === src) {
      if (!playing) {
        audio.play().then(() => setPlaying(true)).catch(() => {});
      }
      return;
    }

    // Cancel any in-progress drop animation
    if (pendingOnEnd) {
      flyingVinyl.removeEventListener('animationend', pendingOnEnd);
      pendingOnEnd = null;
      flyingVinyl.classList.remove('animating');
      vinyl.style.opacity = '';
      platter.classList.remove('drop-target');
      document.querySelectorAll('.album-card.ejecting').forEach(c => c.classList.remove('ejecting'));
    }

    // Stop any current playback
    if (playing) {
      audio.pause();
      setPlaying(false);
    }

    // Eject animation on the card
    card.classList.add('ejecting');

    // Compute flight path: from album center → platter center
    const startRect = card.querySelector('.album-art').getBoundingClientRect();
    const endRect   = platter.getBoundingClientRect();
    const fvW       = flyingVinyl.offsetWidth || 190;
    const fvH       = flyingVinyl.offsetHeight || 190;
    const startX    = startRect.left + startRect.width / 2 - fvW / 2;
    const startY    = startRect.top  + startRect.height / 2 - fvH / 2;
    const endX      = endRect.left   + endRect.width / 2  - fvW / 2;
    const endY      = endRect.top    + endRect.height / 2 - fvH / 2;

    // Set accent color and CSS vars for the keyframe
    const color = LABEL_COLORS[src] || '#FF2D7A';
    flyingVinyl.style.setProperty('--fv-label-color', color);
    flyingVinyl.style.setProperty('--fv-start-x', startX + 'px');
    flyingVinyl.style.setProperty('--fv-start-y', startY + 'px');
    flyingVinyl.style.setProperty('--fv-end-x',   endX   + 'px');
    flyingVinyl.style.setProperty('--fv-end-y',   endY   + 'px');

    // Hide the real vinyl briefly so it looks like the flying one lands on it
    vinyl.style.opacity = '0';
    platter.classList.add('drop-target');

    // Trigger the animation
    flyingVinyl.classList.remove('animating');
    void flyingVinyl.offsetWidth; // reflow to restart animation
    flyingVinyl.classList.add('animating');

    // When the animation ends, load the track & start playing
    const onEnd = () => {
      if (pendingOnEnd !== onEnd) return; // stale listener, ignore
      flyingVinyl.removeEventListener('animationend', onEnd);
      pendingOnEnd = null;
      flyingVinyl.classList.remove('animating');
      vinyl.style.opacity = '';
      platter.classList.remove('drop-target');
      card.classList.remove('ejecting');
      loadTrack(card, true);
    };
    pendingOnEnd = onEnd;
    flyingVinyl.addEventListener('animationend', onEnd);

    // Safety timeout in case animationend doesn't fire
    setTimeout(() => {
      if (flyingVinyl.classList.contains('animating')) onEnd();
    }, 1200);
  }
})();

// Scroll hint: 1.5s after load, nudge the crate right then snap back
setTimeout(() => {
  const crate = document.getElementById('album-crate');
  if (!crate || crate.scrollWidth <= crate.clientWidth) return;
  crate.scrollTo({ left: 140, behavior: 'smooth' });
  setTimeout(() => crate.scrollTo({ left: 0, behavior: 'smooth' }), 700);
}, 1500);

// ========== EXCUSE GENERATOR ==========
const EXCUSES = [
  "המקרר שלי עשה חרם עובדים.",
  "נבלעתי על ידי ספה של איקאה.",
  "הכלב אכל לי את האוטו.",
  "בלעתי בטעות רמקול בלוטות' רועש.",
  "שדד אותי חד-קרן חסר רחמים.",
  "התגייסתי בטעות לצבא של נרניה.",
  "שתיתי שיקוי ואני רואה ואינו נראה.",
  "עכבר המחשב קם לתחייה וברח.",
  "השמפו והמרכך דורשים הדרן במקלחת.",
  "הפיצה שומרת עליי כבן ערובה.",
  "החתול נתן ספין-קיק למקבוק שלי.",
  "טים קוק מינה את החתול לבוס.",
  "קרב קארטה עם החתול על הקידוד.",
  "החתול פרץ לאייפון ודורש קאטות.",
  "החתול עשה לי הפלת קארטה."
];

let lastExcuseIndex = -1;
function generateExcuse() {
  const el = document.getElementById('excuse-text');
  let idx;
  do { idx = Math.floor(Math.random() * EXCUSES.length); } while (idx === lastExcuseIndex);
  lastExcuseIndex = idx;
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = '"' + EXCUSES[idx] + '"';
    el.style.opacity = '1';
  }, 150);
}

