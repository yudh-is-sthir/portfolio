/* =========================================================
   AADITYA S J PORTFOLIO — SCRIPT.JS
   ========================================================= */
'use strict';

/* ── 1. CUSTOM CURSOR ────────────────────────────────────── */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.width  = '14px'; cursorDot.style.height = '14px';
    cursorRing.style.width = '52px'; cursorRing.style.height = '52px';
    cursorRing.style.borderColor = 'var(--gold-light)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.width  = ''; cursorDot.style.height = '';
    cursorRing.style.width = ''; cursorRing.style.height = '';
    cursorRing.style.borderColor = '';
  });
});

/* ── 2. CANVAS PARTICLE NETWORK ─────────────────────────── */
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 80;
const particles = [];
const gold = { r: 201, g: 168, b: 76  };
const cyan = { r: 103, g: 232, b: 249 };

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.8 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color   = Math.random() > 0.7 ? cyan : gold;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
    ctx.fill();
  }
}
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

const MAX_DIST = 120;
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < MAX_DIST) {
        const alpha = (1 - d / MAX_DIST) * 0.2;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${gold.r},${gold.g},${gold.b},${alpha})`;
        ctx.lineWidth = 0.5; ctx.stroke();
      }
    }
  }
}

let heroMX = canvas.width / 2, heroMY = canvas.height / 2;
document.getElementById('hero').addEventListener('mousemove', e => { heroMX = e.clientX; heroMY = e.clientY; });

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width*0.7);
  grad.addColorStop(0, 'rgba(13,21,37,1)'); grad.addColorStop(1, 'rgba(10,15,30,1)');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const mGrad = ctx.createRadialGradient(heroMX, heroMY, 0, heroMX, heroMY, 200);
  mGrad.addColorStop(0, 'rgba(201,168,76,0.06)'); mGrad.addColorStop(1, 'rgba(201,168,76,0)');
  ctx.fillStyle = mGrad; ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── 3. NAVBAR ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── 4. MOBILE NAV ───────────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');
navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
document.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

/* ── 5. TYPEWRITER ───────────────────────────────────────── */
const titles  = ['Game QA Tester', 'Full-Stack Developer', 'Bug Hunter', 'Systems Thinker', 'Code Craftsman'];
let titleIdx  = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-title');

function type() {
  const current = titles[titleIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(type, 2200); return; }
  } else {
    typedEl.textContent = current.substring(0, --charIdx);
    if (charIdx === 0) { deleting = false; titleIdx = (titleIdx + 1) % titles.length; }
  }
  setTimeout(type, deleting ? 60 : 95);
}
setTimeout(type, 800);

/* ── 6. HERO STATUS SEQUENCE ─────────────────────────────── */
const statusEl  = document.getElementById('status-text');
const statusSeq = ['INITIALIZING...', 'LOADING PROFILE...', 'VERIFYING SKILLS...', 'SYSTEM READY ✓'];
let sIdx = 0;
function cycleStatus() {
  statusEl.textContent = statusSeq[sIdx++];
  if (sIdx < statusSeq.length) setTimeout(cycleStatus, 900);
}
cycleStatus();

/* ── 7. COUNTER ANIMATION ────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  let current  = 0;
  const step   = Math.max(1, target / 60);
  const timer  = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current) + (el.dataset.suffix || '+');
    if (current >= target) clearInterval(timer);
  }, 28);
}
// Custom suffix for certain stats
document.querySelectorAll('.stat-num').forEach(el => { el.dataset.suffix = '+'; });

/* ── 8. SCROLL REVEAL ────────────────────────────────────── */
const reveals    = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const skillFills = document.querySelectorAll('.skill-fill');
let statsAnimated = false;
const skillsAnimated = new Set();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
    setTimeout(() => el.classList.add('revealed'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(el => observer.observe(el));

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target;
    if (!skillsAnimated.has(fill)) {
      skillsAnimated.add(fill);
      setTimeout(() => fill.classList.add('animated'), 300);
    }
  });
}, { threshold: 0.5 });
skillFills.forEach(f => skillObserver.observe(f));

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
    }
  }, { threshold: 0.5 });
  counterObserver.observe(heroStats);
}

/* ── 9. PROJECT FILTER ───────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) card.style.animation = 'fadeInUp 0.4s ease forwards';
    });
  });
});

/* ── 10. CONTACT FORM ────────────────────────────────────── */
const form      = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit-btn');
form.addEventListener('submit', e => {
  e.preventDefault();
  const inner = submitBtn.querySelector('.btn-inner');
  inner.textContent = 'Sending...'; submitBtn.disabled = true;
  setTimeout(() => {
    inner.textContent = 'Message Sent! ✓';
    submitBtn.style.background = 'linear-gradient(135deg,#4ade80,#22c55e)';
    setTimeout(() => {
      inner.textContent = 'Send Message'; submitBtn.disabled = false;
      submitBtn.style.background = ''; form.reset();
    }, 3000);
  }, 1500);
});

/* ── 11. ACTIVE NAV SECTION ──────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));

/* ── 12. PARALLAX HERO ───────────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrollY    = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
    heroContent.style.opacity   = Math.max(0, 1 - scrollY / 600);
  }
});

/* ── 13. 3D TILT EFFECT ──────────────────────────────────── */
document.querySelectorAll('.project-card, .edu-card, .blog-card, .bug-card, .bugmeta-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x  = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = rect.width / 2,        cy = rect.height / 2;
    const rotX = (y - cy) / cy * -5;
    const rotY = (x - cx) / cx * 5;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── 14. HUD GRID BACKGROUND ─────────────────────────────── */
function drawHUDGrid() {
  const heroEl    = document.getElementById('hero');
  const gridCanvas = document.createElement('canvas');
  Object.assign(gridCanvas.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%',
    opacity: '0.035', pointerEvents: 'none', zIndex: '1'
  });
  heroEl.appendChild(gridCanvas);
  function draw() {
    gridCanvas.width  = heroEl.offsetWidth;
    gridCanvas.height = heroEl.offsetHeight;
    const gc = gridCanvas.getContext('2d');
    gc.strokeStyle = 'rgba(201,168,76,1)'; gc.lineWidth = 0.5;
    const spacing = 55;
    for (let x = 0; x < gridCanvas.width;  x += spacing) { gc.beginPath(); gc.moveTo(x, 0); gc.lineTo(x, gridCanvas.height); gc.stroke(); }
    for (let y = 0; y < gridCanvas.height; y += spacing) { gc.beginPath(); gc.moveTo(0, y); gc.lineTo(gridCanvas.width, y);   gc.stroke(); }
  }
  draw(); window.addEventListener('resize', draw);
}
drawHUDGrid();

/* ── 15. SEVERITY BADGE GLOW PULSE ──────────────────────── */
document.querySelectorAll('.bug-card[data-severity="high"]').forEach(card => {
  let t = 0;
  setInterval(() => {
    t += 0.05;
    const a = (Math.sin(t) * 0.5 + 0.5) * 0.15;
    card.style.boxShadow = `0 0 ${20 + Math.sin(t)*10}px rgba(255,77,109,${a})`;
  }, 50);
});

/* ── 16. TERMINAL REVEAL ─────────────────────────────────── */
document.querySelectorAll('.t-output').forEach((line, i) => {
  const html = line.innerHTML;
  line.innerHTML = '';
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => { line.innerHTML = html; }, i * 180);
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(line);
});

/* ── INJECTED STYLES ─────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nav-link.active { color: var(--gold) !important; }
  .nav-link.active::after { left: 10% !important; right: 10% !important; }
`;
document.head.appendChild(style);

console.log('%c Aaditya Subramanya Bhat S J', 'color:#c9a84c;font-size:20px;font-weight:bold;font-family:monospace');
console.log('%c Game QA Tester · Full-Stack Developer · Bengaluru, India', 'color:#8da3c0;font-size:13px;font-family:monospace');
console.log('%c github.com/yudh-is-sthir', 'color:#67e8f9;font-family:monospace');
