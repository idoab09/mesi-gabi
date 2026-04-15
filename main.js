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
let duckLastScore = 0;

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
  // 30% harder: move every 840ms instead of 1200ms
  duckMoveInterval = setInterval(moveDuck, 840);
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
  duckLastScore = duckScore;
  showToast('המשחק נגמר! קלטת ' + duckScore + ' ברווזים! 🦆');
  if (duckScore >= 5) createConfetti(canvas.width/2, canvas.height/2, 20, true);
  showLbSubmit('duck', duckScore);
  fetchLeaderboard('duck');
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

// ========== BALLOON POP GAME ==========
const balloonArena = document.getElementById('balloon-arena');
const balloonScoreEl = document.getElementById('balloon-score');
const balloonBtn = document.getElementById('balloon-start-btn');
const balloonTimerBarEl = document.getElementById('balloon-timer-bar');

let balloonActive = false;
let balloonScore = 0;
let balloonTimeLeft = 15;
let balloonInterval, balloonTimerInterval2;
let balloonLastScore = 0;
// More balloon types including "bombs" (💣) that you should NOT pop — penalizes misclicks
const balloonTypes = ['🎈','🎈','🎈','🎈','🟠','🟡','🟣','🔵','💣','💣'];

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

  // 30% harder: spawn every 420ms instead of 600ms
  balloonInterval = setInterval(spawnPopBalloon, 420);
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
  balloonLastScore = balloonScore;
  showToast('פוצצת ' + balloonScore + ' בלונים! 🎈');
  if (balloonScore >= 10) createConfetti(canvas.width/2, canvas.height/2, 25, true);
  showLbSubmit('balloon', balloonScore);
  fetchLeaderboard('balloon');
}

function spawnPopBalloon() {
  if (!balloonActive) return;
  // Limit balloons on screen to keep it challenging (can't just click a pile)
  if (balloonArena.querySelectorAll('.pop-balloon').length >= 6) return;
  const b = document.createElement('div');
  b.className = 'pop-balloon';
  const type = balloonTypes[Math.floor(Math.random() * balloonTypes.length)];
  b.textContent = type;
  b.dataset.bomb = type === '💣' ? '1' : '0';
  const arenaH = balloonArena.clientHeight;
  const arenaW = balloonArena.clientWidth;
  const maxX = arenaW - 50;
  b.style.left = Math.random() * maxX + 'px';
  b.style.top = (arenaH - 10) + 'px';
  // 30% harder: shorter float time (1.1–2.0s instead of 2.0–3.5s)
  const dur = Math.random() * 0.9 + 1.1;
  b.style.animationDuration = dur + 's';

  let popped = false;
  function pop(e) {
    if (!balloonActive || popped) return;
    popped = true;
    e.preventDefault();
    e.stopPropagation();
    if (b.dataset.bomb === '1') {
      // Hit a bomb — lose a point
      balloonScore = Math.max(0, balloonScore - 1);
      balloonScoreEl.textContent = balloonScore;
      b.textContent = '💥';
      b.style.animation = 'none';
      b.style.opacity = '0';
      b.style.transition = 'opacity 0.2s';
      showToast('💣 בום! פוצצת פצצה! -1');
      setTimeout(() => b.remove(), 250);
      return;
    }
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
let memLastScore = 0;

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
        memLastScore = memScore;
        createConfetti(canvas.width/2, canvas.height/3, 25, true);
        showToast('🏆 מצאת את כל הזוגות! ' + memScore + ' נקודות!');
        showLbSubmit('memory', memScore);
        fetchLeaderboard('memory');
      }
    } else {
      // 30% harder: flip back after 630ms instead of 900ms, penalty -2 instead of -1
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        memFlipped = [];
        memLocked = false;
        memScore = Math.max(0, memScore - 2);
        document.getElementById('memory-score').textContent = memScore;
      }, 630);
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

  // 30% harder: start at 490ms instead of 700ms, floor at 210ms instead of 300ms
  let spawnDelay = 490;
  function spawnLoop() {
    if (!whackActive) return;
    popRandomDuck();
    spawnDelay = Math.max(210, spawnDelay - 8);
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
  // 30% harder: visible for 420–840ms instead of 600–1400ms
  h.timer = setTimeout(() => {
    h.el.classList.remove('up');
    h.up = false;
  }, Math.random() * 420 + 420);
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
  showLbSubmit('whack', whackScore);
  fetchLeaderboard('whack');
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
  // 30% harder: shorter initial pause and faster light flashes
  const onDur = Math.max(180, 350 - simonLevel * 10);
  const offDur = Math.max(100, 140 - simonLevel * 5);
  await sleep(400);
  for (const idx of simonSeq) {
    simonLightBtn(idx, true);
    playTone(SIMON_FREQS[idx], onDur / 1000);
    await sleep(onDur);
    simonLightBtn(idx, false);
    await sleep(offDur);
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
    showLbSubmit('simon', simonLevel);
    fetchLeaderboard('simon');
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

// ========== TRIVIA GAME ==========
const TRIVIA_QUESTIONS = [
  { q: 'איזו להקה שרה "Get Lucky"?', opts: ['Daft Punk', 'Stardust', 'Modjo', 'Justice'], a: 0 },
  { q: 'מה שם השיר שמתחיל ב-"Do you remember..."?', opts: ['September', 'October', 'December', 'November'], a: 0 },
  { q: 'מה קוד הלבוש למסיגבי?', opts: ['חליפת ערב', 'גי של קארטה', 'שמלת ים', 'פיג\'מה'], a: 1 },
  { q: 'איפה מתקיימת המסיגבי?', opts: ['מיורקה', 'קפריסין', 'סנטוריני', 'מלטה'], a: 2 },
  { q: 'מה החיה האייקונית של המסיגבי?', opts: ['🐧 פינגווין', '🦆 ברווז', '🦜 תוכי', '🐸 צפרדע'], a: 1 },
  { q: 'באיזו שעה מתחילה המסיבה?', opts: ['20:00', '22:00', '19:00', '21:00'], a: 3 },
  { q: 'מה השם המלא של האתר?', opts: ['גביפארטי', 'מסיגבי', 'המסיבה של גבי', 'נייט גבי'], a: 1 },
  { q: 'כמה חיות יש בפרד החיות של האתר?', opts: ['6', '7', '8', '9'], a: 2 },
  { q: 'באיזה תאריך מתקיימת המסיגבי?', opts: ['3 באוגוסט', '14 ביולי', '7 באוגוסט', '21 ביוני'], a: 2 },
  { q: 'כמה חתולים יש לגבי ומאור?', opts: ['1', '2', '3', '4'], a: 2 },
  { q: 'איזה חגורה יש לגבי בקארטה?', opts: ['חומה', 'כחולה', 'שחורה', 'ירוקה'], a: 2 },
  { q: 'האם גבי אוכל בשר?', opts: ['לא', 'כן', 'רק עוף', 'רק בימים זוגיים'], a: 0 },
  { q: 'איפה גבי עובד?', opts: ['גוגל', 'מיקרוסופט', 'אפל', 'אמזון'], a: 2 },
  { q: 'מה היה השם המקורי של גבי?', opts: ['גבריאל אלחנדרו', 'פטריסיו חבייר', 'חואן קרלוס', 'דייגו מראדונה'], a: 1 },
  { q: 'מאיזו מדינה גבי עלה?', opts: ['ברזיל', 'ספרד', 'צ\'ילה', 'ארגנטינה'], a: 3 },
  { q: 'איך קוראים לבן של גבי?', opts: ['תום', 'רום', 'עומרי', 'גיא'], a: 1 },
  { q: 'באיזה צבע הגיטרה החשמלית של גבי?', opts: ['שחור ולבן', 'אדום', 'כחול מטאלי', 'ירוק וזהב'], a: 3 },
  { q: 'כמה ילדים יש לגבי?', opts: ['1', '2', '3', '4'], a: 1 },
  { q: 'איך קוראים לחברה של גבי?', opts: ['מיכל', 'שיר', 'מאור', 'יעל'], a: 2 },
  { q: 'באיזו עיר נמצא הדוג\'ו שגבי מלמד בו?', opts: ['תל אביב', 'רמת גן', 'גבעתיים', 'הרצליה'], a: 2 }
];

const TRIVIA_COUNT = 8;
const TRIVIA_TIME = 12;

let triviaActive = false;
let triviaPool = [];
let triviaIdx = 0;
let triviaScore = 0;
let triviaTimerInterval = null;
let triviaTimeLeft = TRIVIA_TIME;
let triviaAnswered = false;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startTrivia() {
  triviaActive = true;
  triviaScore = 0;
  triviaIdx = 0;
  triviaPool = shuffleArray(TRIVIA_QUESTIONS).slice(0, TRIVIA_COUNT);

  document.getElementById('trivia-score').textContent = '0';
  document.getElementById('trivia-status').style.display = 'none';
  document.getElementById('trivia-result-wrap').style.display = 'none';
  document.getElementById('trivia-question-wrap').style.display = 'block';
  document.getElementById('trivia-start-btn').style.display = 'none';
  showTriviaQuestion();
}

function showTriviaQuestion() {
  if (triviaIdx >= triviaPool.length) { endTrivia(); return; }

  const q = triviaPool[triviaIdx];
  triviaAnswered = false;

  document.getElementById('trivia-q-num').textContent = `שאלה ${triviaIdx + 1}/${triviaPool.length}`;
  document.getElementById('trivia-question').textContent = q.q;

  const optsEl = document.getElementById('trivia-options');
  optsEl.innerHTML = q.opts.map((opt, i) =>
    `<button class="trivia-opt" onclick="answerTrivia(${i})">${opt}</button>`
  ).join('');

  // Animate question in
  const qEl = document.getElementById('trivia-question');
  qEl.classList.remove('trivia-q-in');
  void qEl.offsetWidth;
  qEl.classList.add('trivia-q-in');

  triviaTimeLeft = TRIVIA_TIME;
  document.getElementById('trivia-timer-bar').style.width = '100%';
  document.getElementById('trivia-time-left').textContent = TRIVIA_TIME + 's';
  clearInterval(triviaTimerInterval);
  triviaTimerInterval = setInterval(() => {
    triviaTimeLeft -= 0.1;
    document.getElementById('trivia-timer-bar').style.width = (triviaTimeLeft / TRIVIA_TIME * 100) + '%';
    document.getElementById('trivia-time-left').textContent = Math.ceil(triviaTimeLeft) + 's';
    if (triviaTimeLeft <= 0) {
      clearInterval(triviaTimerInterval);
      if (!triviaAnswered) timeoutTrivia();
    }
  }, 100);
}

function answerTrivia(chosen) {
  if (triviaAnswered) return;
  triviaAnswered = true;
  clearInterval(triviaTimerInterval);

  const q = triviaPool[triviaIdx];
  const opts = document.querySelectorAll('.trivia-opt');
  const correct = chosen === q.a;

  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.a) btn.classList.add('trivia-opt-correct');
    else if (i === chosen) btn.classList.add('trivia-opt-wrong');
  });

  if (correct) {
    const timeBonus = Math.floor(triviaTimeLeft / 2);
    const points = 5 + timeBonus;
    triviaScore += points;
    document.getElementById('trivia-score').textContent = triviaScore;
    showToast(`✅ נכון! +${points} נקודות`);
    createConfetti(canvas.width / 2, canvas.height / 2, 10, true);
  } else {
    showToast('❌ טעות! התשובה: ' + q.opts[q.a]);
  }

  setTimeout(() => { triviaIdx++; showTriviaQuestion(); }, 1200);
}

function timeoutTrivia() {
  if (triviaAnswered) return;
  triviaAnswered = true;
  const q = triviaPool[triviaIdx];
  const opts = document.querySelectorAll('.trivia-opt');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.a) btn.classList.add('trivia-opt-correct');
  });
  showToast('⏰ נגמר הזמן! +0');
  setTimeout(() => { triviaIdx++; showTriviaQuestion(); }, 1200);
}

function endTrivia() {
  triviaActive = false;
  clearInterval(triviaTimerInterval);
  document.getElementById('trivia-question-wrap').style.display = 'none';

  const maxScore = TRIVIA_COUNT * (5 + Math.floor(TRIVIA_TIME / 2));
  const pct = triviaScore / maxScore;
  let emoji, text;
  if (pct >= 0.8)      { emoji = '🏆'; text = `${triviaScore} נקודות — גאון מסיגבי!`; }
  else if (pct >= 0.55) { emoji = '🎉'; text = `${triviaScore} נקודות — מרשים מאוד!`; }
  else if (pct >= 0.35) { emoji = '👍'; text = `${triviaScore} נקודות — לא רע בכלל!`; }
  else                  { emoji = '🦆'; text = `${triviaScore} נקודות — בא/י לתרגל עם הברווזים`; }

  document.getElementById('trivia-result-emoji').textContent = emoji;
  document.getElementById('trivia-result-text').textContent = text;
  document.getElementById('trivia-result-wrap').style.display = 'block';

  const btn = document.getElementById('trivia-start-btn');
  btn.style.display = '';
  btn.textContent = 'שחק שוב! 🧠';

  showLbSubmit('trivia', triviaScore);
  fetchLeaderboard('trivia');
}

// ========== PUBLIC LEADERBOARDS ==========
const LB_LABELS = {
  duck: 'ברווזים',
  balloon: 'בלונים',
  memory: 'נקודות',
  whack: 'מכות',
  simon: 'שלב',
  trivia: 'נקודות',
};

function toggleLeaderboard(game) {
  const panel = document.getElementById(game + '-lb-panel');
  const btn = document.querySelector(`#${game}-pub-lb .lb-toggle`);
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    btn.textContent = '🏆 לוח שיאים ▴';
    fetchLeaderboard(game);
  } else {
    panel.style.display = 'none';
    btn.textContent = '🏆 לוח שיאים ▾';
  }
}

async function fetchLeaderboard(game) {
  const el = document.getElementById(game + '-lb-entries');
  if (!el) return;
  try {
    const r = await fetch('/api/leaderboard?game=' + game);
    if (!r.ok) return;
    const entries = await r.json();
    renderLeaderboard(game, entries);
  } catch {}
}

function renderLeaderboard(game, entries) {
  const el = document.getElementById(game + '-lb-entries');
  if (!el) return;
  const medals = ['🥇','🥈','🥉'];
  const label = LB_LABELS[game] || '';
  if (entries.length === 0) {
    el.innerHTML = '<div class="lb-empty">אין שיאנים עדיין — היה/י הראשון/ה!</div>';
    return;
  }
  el.innerHTML = entries.map((e, i) =>
    `<div class="lb-entry">
      <span class="lb-rank">${medals[i] || (i + 1) + '.'}</span>
      <span class="lb-name">${escapeHtml(e.name)}</span>
      <span class="lb-score">${e.score} ${label}</span>
    </div>`
  ).join('');
}

function showLbSubmit(game, score) {
  const el = document.getElementById(game + '-lb-submit');
  if (!el) return;
  el.style.display = 'flex';
  el.dataset.score = score;
  // Open the panel automatically so the user sees the submit form
  const panel = document.getElementById(game + '-lb-panel');
  const btn = document.querySelector(`#${game}-pub-lb .lb-toggle`);
  if (panel && panel.style.display === 'none') {
    panel.style.display = 'block';
    if (btn) btn.textContent = '🏆 לוח שיאים ▴';
  }
}

async function submitScore(game) {
  const nameEl = document.getElementById(game + '-lb-name');
  const submitEl = document.getElementById(game + '-lb-submit');
  const name = nameEl.value.trim();
  if (!name) {
    nameEl.focus();
    nameEl.classList.add('input-shake');
    setTimeout(() => nameEl.classList.remove('input-shake'), 600);
    return;
  }
  const score = parseInt(submitEl.dataset.score, 10);
  if (isNaN(score)) return;
  try {
    const r = await fetch('/api/leaderboard?game=' + game, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    });
    if (r.ok) {
      const entries = await r.json();
      renderLeaderboard(game, entries);
      submitEl.style.display = 'none';
      nameEl.value = '';
      showToast('🏆 הניקוד נשמר!');
    }
  } catch { showToast('שגיאת חיבור 😢'); }
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

// ========== INVITE CARD GENERATOR ==========

const CG_PERSONALITIES = {
  gabi: {
    name: 'גבי',
    title: 'הטרול החכם של אפל 🍎',
    desc: 'אתה/י חכם/ה, מצחיק/ה, קצת טרול/ית — ועובד/ת באפל.',
    colors: ['#1d1d1f', '#0071e3', '#f5f5f7'],
    accent: '#0071e3',
    bg: 'linear-gradient(135deg, #1d1d1f 0%, #0a0a0a 60%, #001a33 100%)',
    border: '#0071e3',
    quotes: [
      '"אם זה לא על אייפון, אני לא מגיע"',
      '"גם סירי לא מבינה אותי"',
      '"באגים? אני קורא לזה פיצ\'רים"',
      '"כן, יש לי מק. לא, אני לא אסביר כמה הוא עלה"',
      '"אני לא טרול, אני סתם צודק"',
      'תזכיר לי באיזה צבע החגורה שלך בקארטה?',
    ],
  },
  rom: {
    name: 'רום',
    title: 'הגאון הישן ב-11 😴',
    desc: 'חכם יחסית, ציונים? פחות. בנות? עוד פחות. שינה? הרבה.',
    colors: ['#0d0020', '#7C3AED', '#FFD600'],
    accent: '#7C3AED',
    bg: 'linear-gradient(135deg, #0d0020 0%, #1a003a 60%, #2a0060 100%)',
    border: '#7C3AED',
    quotes: [
      '"אני יכול לעשות את זה מחר"',
      '"הציון לא מייצג את האינטליגנציה שלי"',
      '"אני לא ישן, אני טוען אנרגיה"',
      '"יש לי GF — Grand Future"',
      '"טכנית לא נכשלתי, פשוט לא הצלחתי"',
    ],
  },
  party_animal: {
    name: 'חיית המסיבה',
    title: 'המלך/ה של הרחבה 🦆',
    desc: 'אתה/י הראשון/ה להגיע והאחרון/ה לעזוב. כל השירים שלך.',
    colors: ['#0D0020', '#FF2D7A', '#FFD600'],
    accent: '#FF2D7A',
    bg: 'linear-gradient(135deg, #0D0020 0%, #2a0035 50%, #1a000f 100%)',
    border: '#FF2D7A',
    quotes: [
      '"השיר הזה הוא עלי"',
      '"הברווז הזה מייצג אותי בנפש"',
      '"DJ תעלה את הווליום"',
      '"אני לא עייף/ה, המסיבה עייפה"',
      '"הגעתי ראשון/ה כי אני הכי מתרגש/ת"',
    ],
  },
  philosopher: {
    name: 'הפילוסוף/ית',
    title: 'חושב/ת יותר מדי 🧠',
    desc: 'שואל/ת שאלות עמוקות תוך כדי ריקוד. מגיע/ה רק כי "מעניין סוציולוגית".',
    colors: ['#0a1a0a', '#00D4C8', '#A3FF00'],
    accent: '#00D4C8',
    bg: 'linear-gradient(135deg, #0a1a1a 0%, #001a1a 60%, #0a2020 100%)',
    border: '#00D4C8',
    quotes: [
      '"מה זה בכלל מסיבה, אם חושבים על זה?"',
      '"הקצב הזה מזכיר לי ניטשה"',
      '"אני כאן רק כדי להתבונן"',
      '"הקונפטי הזה — מטאפורה לחיים"',
      '"טוב, אבל למה ברווז ספציפית?"',
    ],
  },
  vip: {
    name: 'ה-VIP',
    title: 'בא/ה רק לצילום 📸',
    desc: 'מגיע/ה מאוחר, יוצא/ת מוקדם, נראה/ית מושלם/ת כל הזמן.',
    colors: ['#1a1000', '#FFD600', '#FF6B00'],
    accent: '#FFD600',
    bg: 'linear-gradient(135deg, #1a1000 0%, #2a1a00 60%, #1a0a00 100%)',
    border: '#FFD600',
    quotes: [
      '"אני לא מגיע/ה, אני מופיע/ה"',
      '"כן, הוזמנתי. לא, לא אסביר איך"',
      '"הצלם עדיין כאן?"',
      '"זה הצד הטוב שלי"',
      '"כולם יזכרו את הכניסה שלי"',
    ],
  },
};

const CG_QUIZ = [
  {
    q: 'שישי בלילה — איפה אתה/י?',
    opts: [
      { text: 'ישן/ה. ברור.', scores: { rom: 3 } },
      { text: 'מסיבה כמובן', scores: { party_animal: 3 } },
      { text: 'כותב/ת קוד', scores: { gabi: 3 } },
      { text: 'קורא/ת ומהרהר/ת', scores: { philosopher: 2, vip: 1 } },
    ],
  },
  {
    q: 'מישהו שאל אותך שאלה טיפשה. מה עושה?',
    opts: [
      { text: 'עונה בציניות מלאה', scores: { gabi: 3 } },
      { text: 'מסביר/ה בסבלנות', scores: { philosopher: 2 } },
      { text: 'ממשיך/ה לרקוד', scores: { party_animal: 2 } },
      { text: 'מתעלם/ת כי עייף/ה', scores: { rom: 3 } },
    ],
  },
  {
    q: 'מה הסיכוי שתגיע/י בזמן למסיבה?',
    opts: [
      { text: 'אני מגיע/ה ראשון/ה', scores: { party_animal: 3 } },
      { text: 'כשיהיה רצון', scores: { rom: 2, philosopher: 1 } },
      { text: 'בדיוק בשעה — אפל מדויקת', scores: { gabi: 3 } },
      { text: 'מאוחר — זה ה-entrance שלי', scores: { vip: 3 } },
    ],
  },
  {
    q: 'מה הפלייליסט האידיאלי?',
    opts: [
      { text: 'כל מה שיש בספוטיפיי של גבי', scores: { gabi: 2, party_animal: 1 } },
      { text: 'לא אכפת לי, אני ישן/ה בכל מקרה', scores: { rom: 3 } },
      { text: 'September על ריפיט', scores: { party_animal: 3 } },
      { text: 'מוזיקה שמעוררת מחשבה', scores: { philosopher: 3 } },
    ],
  },
  {
    q: 'מה כתוב על החולצה שלך?',
    opts: [
      { text: 'Apple 🍎', scores: { gabi: 3 } },
      { text: 'ZZZ 💤', scores: { rom: 3 } },
      { text: '🦆 DUCK MODE', scores: { party_animal: 3 } },
      { text: 'שאלה פילוסופית ב-7 מילים', scores: { philosopher: 2, vip: 1 } },
    ],
  },
];

const CG_FRAMES = [
  { id: 'neon', label: 'ניאון', draw: (ctx, w, h, accent) => {
    ctx.save();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 8;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 18;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.restore();
  }},
  { id: 'party', label: 'מסיבה', draw: (ctx, w, h, accent) => {
    ctx.save();
    const dots = ['🎊','🎉','⭐','🦆','🎈','✨'];
    ctx.font = '22px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const rx = w / 2 + Math.cos(angle) * (w / 2 - 22);
      const ry = h / 2 + Math.sin(angle) * (h / 2 - 22);
      ctx.fillText(dots[i % dots.length], rx, ry);
    }
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(30, 30, w - 60, h - 60);
    ctx.setLineDash([]);
    ctx.restore();
  }},
  { id: 'minimal', label: 'מינימל', draw: (ctx, w, h, accent) => {
    ctx.save();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    const s = 18;
    // Corner brackets
    [
      [s, s, 40, 0, 0, 40],
      [w - s, s, -40, 0, 0, 40],
      [s, h - s, 40, 0, 0, -40],
      [w - s, h - s, -40, 0, 0, -40],
    ].forEach(([x, y, dx1, dy1, dx2, dy2]) => {
      ctx.beginPath();
      ctx.moveTo(x + dx1, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy2);
      ctx.stroke();
    });
    ctx.restore();
  }},
  { id: 'glitch', label: 'גליץ\'', draw: (ctx, w, h, accent) => {
    ctx.save();
    const offsets = [-3, 3, -2, 2];
    const colors = [accent, '#FF2D7A', '#00D4C8', '#FFD600'];
    offsets.forEach((off, i) => {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.55;
      ctx.strokeRect(10 + off, 10, w - 20, h - 20);
    });
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.restore();
  }},
  { id: 'karate', label: 'קארטה', draw: (ctx, w, h, accent) => {
    ctx.save();
    // Outer border
    ctx.strokeStyle = accent;
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    // Inner thin white
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, w - 32, h - 32);
    // Corner circles
    [[16,16],[w-16,16],[16,h-16],[w-16,h-16]].forEach(([cx,cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
    });
    ctx.restore();
  }},
];

const CG_EMOJIS = ['🦆','🍎','😴','🧠','👑','🔥','⭐','🎉','🥋','🦁','🐸','💎','🌊','⚡','🎭'];

// State
let cgPhotoDataUrl = null;
let cgPersonalityKey = null;
let cgSelectedFrame = 'neon';
let cgSelectedEmoji = '🦆';
let cgSelectedQuote = null;
let cgCurrentStep = 1;
let cgStream = null;
let cgQuizAnswers = {};   // { questionIdx: optIdx }
let cgQuizStep = 0;

function cgStep(n) {
  document.getElementById(`cg-step-${cgCurrentStep}`).style.display = 'none';
  cgCurrentStep = n;
  document.getElementById(`cg-step-${n}`).style.display = 'block';
  document.getElementById(`cg-step-${n}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (n === 2) cgRenderQuiz();
  if (n === 3) cgRenderCustomize();
}

// ---- CAMERA ----
async function cgOpenCamera() {
  try {
    cgStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    const video = document.getElementById('cg-video');
    video.srcObject = cgStream;
    video.style.display = 'block';
    document.getElementById('cg-camera-overlay').style.display = 'none';
    document.getElementById('cg-camera-controls').style.display = 'flex';
    document.getElementById('cg-preview').style.display = 'none';
  } catch {
    showToast('לא ניתן לגשת למצלמה 😢');
    cgUploadInstead();
  }
}

function cgSnap() {
  const video = document.getElementById('cg-video');
  const snapCanvas = document.getElementById('cg-snap-canvas');
  snapCanvas.width = video.videoWidth || 400;
  snapCanvas.height = video.videoHeight || 300;
  snapCanvas.getContext('2d').drawImage(video, 0, 0);
  cgPhotoDataUrl = snapCanvas.toDataURL('image/jpeg', 0.9);
  cgShowPreview();
}

function cgRetake() {
  cgPhotoDataUrl = null;
  const preview = document.getElementById('cg-preview');
  preview.style.display = 'none';
  document.getElementById('cg-photo-controls').style.display = 'none';
  if (cgStream) {
    document.getElementById('cg-video').style.display = 'block';
    document.getElementById('cg-camera-controls').style.display = 'flex';
  } else {
    document.getElementById('cg-camera-overlay').style.display = 'flex';
    document.getElementById('cg-camera-controls').style.display = 'none';
  }
}

function cgShowPreview() {
  if (cgStream) {
    cgStream.getTracks().forEach(t => t.stop());
    cgStream = null;
  }
  const video = document.getElementById('cg-video');
  video.style.display = 'none';
  const preview = document.getElementById('cg-preview');
  preview.src = cgPhotoDataUrl;
  preview.style.display = 'block';
  document.getElementById('cg-camera-controls').style.display = 'none';
  document.getElementById('cg-photo-controls').style.display = 'flex';
  document.getElementById('cg-camera-overlay').style.display = 'none';
}

function cgUploadInstead() {
  document.getElementById('cg-file-input').click();
}

function cgFileChosen(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    cgPhotoDataUrl = ev.target.result;
    cgShowPreview();
  };
  reader.readAsDataURL(file);
}

// ---- QUIZ ----
function cgRenderQuiz() {
  cgQuizAnswers = {};
  cgQuizStep = 0;
  const wrap = document.getElementById('cg-quiz-wrap');
  wrap.innerHTML = '';
  cgShowQuizQuestion(wrap);
}

function cgShowQuizQuestion(wrap) {
  if (cgQuizStep >= CG_QUIZ.length) { cgComputePersonality(); return; }
  const q = CG_QUIZ[cgQuizStep];
  const total = CG_QUIZ.length;

  wrap.innerHTML = `
    <div class="cg-quiz-progress">
      <div class="cg-quiz-bar" style="width:${(cgQuizStep / total) * 100}%"></div>
    </div>
    <div class="cg-quiz-counter">${cgQuizStep + 1} / ${total}</div>
    <div class="cg-quiz-q">${q.q}</div>
    <div class="cg-quiz-opts">
      ${q.opts.map((o, i) => `<button class="cg-quiz-opt" onclick="cgAnswer(${i})">${o.text}</button>`).join('')}
    </div>
  `;
  // Animate in
  wrap.querySelector('.cg-quiz-q').classList.add('trivia-q-in');
}

function cgAnswer(optIdx) {
  cgQuizAnswers[cgQuizStep] = optIdx;
  cgQuizStep++;
  cgShowQuizQuestion(document.getElementById('cg-quiz-wrap'));
}

function cgComputePersonality() {
  const totals = {};
  Object.keys(CG_PERSONALITIES).forEach(k => totals[k] = 0);
  CG_QUIZ.forEach((q, qi) => {
    const chosen = cgQuizAnswers[qi];
    if (chosen === undefined) return;
    const scores = q.opts[chosen].scores || {};
    Object.entries(scores).forEach(([k, v]) => { totals[k] = (totals[k] || 0) + v; });
  });
  cgPersonalityKey = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  cgStep(3);
}

// ---- CUSTOMIZE + CANVAS ----
function cgRenderCustomize() {
  const p = CG_PERSONALITIES[cgPersonalityKey];

  // Show personality result
  document.getElementById('cg-result-personality').innerHTML = `
    <div class="cg-personality-badge" style="border-color:${p.border};box-shadow:0 0 20px ${p.border}44">
      <div class="cg-personality-name">${p.name}</div>
      <div class="cg-personality-title">${p.title}</div>
      <div class="cg-personality-desc">${p.desc}</div>
    </div>
  `;

  // Default selections
  cgSelectedFrame = CG_FRAMES[0].id;
  cgSelectedEmoji = cgPersonalityKey === 'gabi' ? '🍎' : cgPersonalityKey === 'rom' ? '😴' : '🦆';
  cgSelectedQuote = p.quotes[0];

  // Frame picker
  const fp = document.getElementById('cg-frame-picker');
  fp.innerHTML = CG_FRAMES.map(f =>
    `<button class="cg-frame-btn ${f.id === cgSelectedFrame ? 'selected' : ''}" data-id="${f.id}" onclick="cgSelectFrame('${f.id}')">${f.label}</button>`
  ).join('');

  // Emoji picker
  const ep = document.getElementById('cg-emoji-picker');
  ep.innerHTML = CG_EMOJIS.map(e =>
    `<button class="cg-emoji-btn ${e === cgSelectedEmoji ? 'selected' : ''}" onclick="cgSelectEmoji('${e}')">${e}</button>`
  ).join('');

  // Quote picker
  const qp = document.getElementById('cg-quote-picker');
  qp.innerHTML = p.quotes.map((q, i) =>
    `<button class="cg-quote-btn ${i === 0 ? 'selected' : ''}" data-quote="${q.replace(/"/g,'&quot;')}">${q}</button>`
  ).join('');
  qp.querySelectorAll('.cg-quote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cgSelectedQuote = btn.dataset.quote;
      qp.querySelectorAll('.cg-quote-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      cgDrawCard();
    });
  });

  // Name input live preview
  document.getElementById('cg-name-input').value = '';
  document.getElementById('cg-name-input').oninput = () => cgDrawCard();

  cgDrawCard();
}

function cgSelectFrame(id) {
  cgSelectedFrame = id;
  document.querySelectorAll('.cg-frame-btn').forEach(b => b.classList.toggle('selected', b.dataset.id === id));
  cgDrawCard();
}

function cgSelectEmoji(e) {
  cgSelectedEmoji = e;
  document.querySelectorAll('.cg-emoji-btn').forEach(b => b.classList.toggle('selected', b.textContent === e));
  cgDrawCard();
}


function cgDrawCard() {
  const cardCanvas = document.getElementById('cg-card-canvas');
  const ctx = cardCanvas.getContext('2d');
  const w = cardCanvas.width;
  const h = cardCanvas.height;
  const p = CG_PERSONALITIES[cgPersonalityKey];
  const frame = CG_FRAMES.find(f => f.id === cgSelectedFrame);
  const name = document.getElementById('cg-name-input').value.trim() || 'השם שלך';

  ctx.clearRect(0, 0, w, h);

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  const stops = p.bg.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g) || ['#0d0020', '#1a003a'];
  stops.forEach((c, i) => grad.addColorStop(i / Math.max(stops.length - 1, 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle dot grid texture
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for (let x = 20; x < w; x += 30) {
    for (let y = 20; y < h; y += 30) {
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Photo (left side)
  const photoX = 36, photoY = 60, photoW = 180, photoH = 180;
  if (cgPhotoDataUrl) {
    const img = new Image();
    img.onload = () => {
      // Clipped circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX + photoW / 2, photoY + photoH / 2, photoW / 2, 0, Math.PI * 2);
      ctx.clip();
      // Cover-fit the image
      const aspect = img.width / img.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (aspect > 1) { sw = img.height; sx = (img.width - sw) / 2; }
      else { sh = img.width; sy = (img.height - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
      ctx.restore();

      // Circle border
      ctx.beginPath();
      ctx.arc(photoX + photoW / 2, photoY + photoH / 2, photoW / 2, 0, Math.PI * 2);
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.accent;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      cgDrawCardText(ctx, w, h, p, name, photoX, photoY, photoW, photoH, frame);
    };
    img.src = cgPhotoDataUrl;
  } else {
    // Placeholder circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX + photoW / 2, photoY + photoH / 2, photoW / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fill();
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
    ctx.font = '64px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📷', photoX + photoW / 2, photoY + photoH / 2);
    cgDrawCardText(ctx, w, h, p, name, photoX, photoY, photoW, photoH, frame);
  }
}

function cgDrawCardText(ctx, w, h, p, name, photoX, photoY, photoW, photoH, frame) {
  const textX = photoX + photoW + 28;
  const textW = w - textX - 32;

  // Party label top-right
  ctx.font = 'bold 11px Heebo, Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('מסיגבי 2026 🦆', w - 28, 20);

  // Emoji badge
  ctx.font = '44px serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(cgSelectedEmoji, textX, photoY);

  // Name
  ctx.font = 'bold 32px Heebo, Arial Hebrew, Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(name, textX, photoY + 52);

  // Personality title
  ctx.font = 'bold 14px Heebo, Arial Hebrew, Arial';
  ctx.fillStyle = p.accent;
  ctx.fillText(p.title, textX, photoY + 92);

  // Personality name tag
  ctx.save();
  const tagW = Math.min(textW, 160);
  const tagH = 26;
  const tagX = textX;
  const tagY = photoY + 118;
  ctx.fillStyle = p.accent + '33';
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 1.5;
  roundRect(ctx, tagX, tagY, tagW, tagH, 6);
  ctx.fill(); ctx.stroke();
  ctx.font = 'bold 12px Heebo, Arial Hebrew, Arial';
  ctx.fillStyle = p.accent;
  ctx.textAlign = 'center';
  ctx.fillText(p.name, tagX + tagW / 2, tagY + 7);
  ctx.restore();

  // Divider line
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(photoX, photoY + photoH + 24);
  ctx.lineTo(w - 32, photoY + photoH + 24);
  ctx.stroke();

  // Quote — word-wrap
  const quote = cgSelectedQuote || '';
  ctx.font = 'italic 15px Heebo, Arial Hebrew, Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const quoteLines = cgWrapText(ctx, quote, w - 80, 230);
  quoteLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, photoY + photoH + 38 + i * 22);
  });

  // Bottom bar
  ctx.fillStyle = p.accent + '22';
  ctx.fillRect(0, h - 36, w, 36);
  ctx.font = 'bold 12px Heebo, Arial Hebrew, Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('7.8.2026 • סנטוריני, יוון • 21:00', w / 2, h - 18);

  // Frame on top
  if (frame) frame.draw(ctx, w, h, p.accent);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function cgWrapText(ctx, text, maxWidth, _startX) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function cgDownload() {
  cgDrawCard();
  setTimeout(() => {
    const canvas = document.getElementById('cg-card-canvas');
    const link = document.createElement('a');
    link.download = 'masigabi-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('🎉 הכרטיס הורד!');
    createConfetti(window.innerWidth / 2, window.innerHeight / 2, 30, true);
  }, 100);
}

function cgReset() {
  if (cgStream) { cgStream.getTracks().forEach(t => t.stop()); cgStream = null; }
  cgPhotoDataUrl = null;
  cgPersonalityKey = null;
  cgSelectedFrame = 'neon';
  cgSelectedEmoji = '🦆';
  cgSelectedQuote = null;
  cgQuizAnswers = {};
  cgQuizStep = 0;
  cgCurrentStep = 1;

  // Reset UI
  const video = document.getElementById('cg-video');
  video.style.display = 'none';
  video.srcObject = null;
  document.getElementById('cg-preview').style.display = 'none';
  document.getElementById('cg-camera-overlay').style.display = 'flex';
  document.getElementById('cg-camera-controls').style.display = 'none';
  document.getElementById('cg-photo-controls').style.display = 'none';

  [2, 3].forEach(n => document.getElementById(`cg-step-${n}`).style.display = 'none');
  document.getElementById('cg-step-1').style.display = 'block';
  document.getElementById('cg-step-1').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========== OUTFIT GENERATOR ==========
const OUTFIT_TOPS = [
  { emoji: '🥋', label: 'גי לבן קלאסי' },
  { emoji: '🥷', label: 'גי שחור של נינג\'ה' },
  { emoji: '👕', label: 'חולצת קארטה ורודה נצנצים' },
  { emoji: '🎽', label: 'גי עם פאצ\'ים זוהרים' },
  { emoji: '🌈', label: 'גי ססגוני בצבעי הקשת' },
  { emoji: '⭐', label: 'גי זהב VIP' },
  { emoji: '🌙', label: 'גי כסוף לילה' },
  { emoji: '🔥', label: 'גי עם להבות' },
];

const OUTFIT_BELTS = [
  { emoji: '🟡', label: 'חגורה צהובה — מתחיל מסגנון' },
  { emoji: '🟠', label: 'חגורה כתומה — חמאס של ריקוד' },
  { emoji: '🔵', label: 'חגורה כחולה — מסטר וייבס' },
  { emoji: '🟤', label: 'חגורה חומה — ספיישל אדמה' },
  { emoji: '⚫', label: 'חגורה שחורה — דן 10 של מסיבות' },
  { emoji: '🔴', label: 'חגורה אדומה — בוס הרצפה' },
  { emoji: '💜', label: 'חגורה סגולה — קינג ויולט' },
  { emoji: '✨', label: 'חגורה בלינג — גראן מאסטר' },
];

const OUTFIT_SHOES = [
  { emoji: '👟', label: 'נעלי ספורט זוהרות' },
  { emoji: '🥿', label: 'נעלי מסיבה שטוחות' },
  { emoji: '👠', label: 'עקבים עם קארטה-וייב' },
  { emoji: '🩴', label: 'כפכפים עם ניצוץ' },
  { emoji: '👢', label: 'מגפיים של לוחם' },
  { emoji: '🪖', label: 'בוטס קרבי — ריקוד וקרב' },
];

const OUTFIT_ACCESSORIES = [
  { emoji: '🥷', label: 'מסכת נינג\'ה (חצי)' },
  { emoji: '🕶️', label: 'משקפי שמש בלוגר' },
  { emoji: '🎭', label: 'מסכת פנסייה יצירתית' },
  { emoji: '🎩', label: 'כובע טופ-האט — כי למה לא' },
  { emoji: '👑', label: 'כתר — אתה המלך/ה הלילה' },
  { emoji: '🎀', label: 'קשת שיער ענקית' },
  { emoji: '📿', label: 'שרשרת ג\'ייד' },
  { emoji: '🌸', label: 'פרחים בשיער — קשה רך' },
];

const OUTFIT_VIBES = [
  { emoji: '🐉', text: 'וייב: דרקון מדיטרני — מסוכן אבל רומנטי' },
  { emoji: '🌊', text: 'וייב: לוחם האוקיינוס — קול אבל קטלני' },
  { emoji: '🌅', text: 'וייב: שועל המדבר — חם כמו הלילה' },
  { emoji: '⚡', text: 'וייב: ברק ביפן — מהיר ובלתי נשכח' },
  { emoji: '🌙', text: 'וייב: שומר הלילה — מסתורי ואלגנטי' },
  { emoji: '🔥', text: 'וייב: אש ורוח — לא אפשר לעמוד בפני' },
  { emoji: '💎', text: 'וייב: אבן יקרה — נדיר, יקר, מושלם' },
  { emoji: '🦋', text: 'וייב: פרפר קארטה — עדין ועוצמתי' },
  { emoji: '🏆', text: 'וייב: אלוף עולם — פשוט כי כן' },
  { emoji: '🎆', text: 'וייב: זיקוקי חופשיות — יפה מכדי להסביר' },
];

function generateOutfit() {
  const top   = OUTFIT_TOPS[Math.floor(Math.random() * OUTFIT_TOPS.length)];
  const belt  = OUTFIT_BELTS[Math.floor(Math.random() * OUTFIT_BELTS.length)];
  const shoes = OUTFIT_SHOES[Math.floor(Math.random() * OUTFIT_SHOES.length)];
  const acc   = OUTFIT_ACCESSORIES[Math.floor(Math.random() * OUTFIT_ACCESSORIES.length)];
  const vibe  = OUTFIT_VIBES[Math.floor(Math.random() * OUTFIT_VIBES.length)];

  const result = document.getElementById('outfit-result');
  const grid   = document.getElementById('outfit-grid');
  const vibeEl = document.getElementById('outfit-vibe');

  grid.innerHTML = [
    { icon: top.emoji, cat: 'חליפה', desc: top.label },
    { icon: belt.emoji, cat: 'חגורה', desc: belt.label },
    { icon: shoes.emoji, cat: 'נעליים', desc: shoes.label },
    { icon: acc.emoji, cat: 'אקססוריז', desc: acc.label },
  ].map((p, i) =>
    `<div class="outfit-piece" style="animation-delay:${i * 0.09}s">
      <div class="outfit-piece-emoji">${p.icon}</div>
      <div class="outfit-piece-category">${p.cat}</div>
      <div class="outfit-piece-name">${p.desc}</div>
    </div>`
  ).join('');

  vibeEl.innerHTML = `<span class="outfit-vibe-emoji">${vibe.emoji}</span> ${vibe.text}`;

  result.style.display = 'block';
  // Reset animation
  grid.querySelectorAll('.outfit-piece').forEach(el => {
    el.classList.remove('outfit-pop');
    void el.offsetWidth;
    el.classList.add('outfit-pop');
  });

  createConfetti(canvas.width / 2, canvas.height / 2, 15, true);
  showToast('✨ לוק מנצח! בוא/י ככה למסיגבי!');
}

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

