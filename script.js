/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */
// Altere para a data em que vocês começaram a se conhecer / ficar juntos
const START_DATE = new Date('2024-01-01T00:00:00');

/* =========================================================
   FUNDO ANIMADO DE CORAÇÕES
   ========================================================= */
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawHeart(x, y, size, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(0, 0, -10, 0, -10, -6);
  ctx.bezierCurveTo(-10, -12, 0, -12, 0, -4);
  ctx.bezierCurveTo(0, -12, 10, -12, 10, -6);
  ctx.bezierCurveTo(10, 0, 0, 0, 0, 6);
  ctx.closePath();
  ctx.fillStyle = `rgba(179, 50, 95, ${alpha})`;
  ctx.fill();
  ctx.restore();
}

const hearts = Array.from({ length: 40 }, () => createHeart());

function createHeart() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * canvas.height,
    size: 8 + Math.random() * 18,
    speed: 0.3 + Math.random() * 0.8,
    drift: (Math.random() - 0.5) * 0.6,
    alpha: 0.05 + Math.random() * 0.15
  };
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    drawHeart(h.x, h.y, h.size, h.alpha);
    h.y -= h.speed;
    h.x += h.drift;
    if (h.y < -30) {
      h.y = canvas.height + 30;
      h.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

/* =========================================================
   MÚSICA DE FUNDO
   ========================================================= */
const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicBtn.classList.add('playing');
    musicBtn.querySelector('.music-icon').textContent = '❚❚';
  } else {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
    musicBtn.querySelector('.music-icon').textContent = '♪';
  }
});

/* =========================================================
   BOTÃO "COMEÇAR NOSSA HISTÓRIA"
   ========================================================= */
document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
});

/* =========================================================
   ANIMAÇÕES AO ENTRAR NA TELA (Intersection Observer)
   ========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.reveal-text, .timeline-item, .message-card')
  .forEach(el => revealObserver.observe(el));

/* =========================================================
   CARROSSEL DE FOTOS
   ========================================================= */
const track = document.getElementById('carousel-track');
const dotsContainer = document.getElementById('carousel-dots');
let currentSlide = 0;

function setupCarousel() {
  const images = track.querySelectorAll('.carousel-img');
  dotsContainer.innerHTML = '';
  images.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  updateCarousel();
}

function updateCarousel() {
  const images = track.querySelectorAll('.carousel-img');
  if (!images.length) return;
  currentSlide = (currentSlide + images.length) % images.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

document.getElementById('prev-btn').addEventListener('click', () => {
  currentSlide--;
  updateCarousel();
});
document.getElementById('next-btn').addEventListener('click', () => {
  currentSlide++;
  updateCarousel();
});

// Wait a tick so onerror removals (missing foto5/foto6) settle first
window.addEventListener('load', () => setTimeout(setupCarousel, 50));

/* =========================================================
   LIGHTBOX (zoom da foto)
   ========================================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

track.addEventListener('click', (e) => {
  if (e.target.classList.contains('carousel-img') && e.target.tagName === 'IMG') {
    lightboxImg.src = e.target.src;
    lightbox.classList.add('active');
  }
});

document.getElementById('lightbox-close').addEventListener('click', () => {
  lightbox.classList.remove('active');
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});

/* =========================================================
   CONTADOR DE TEMPO
   ========================================================= */
function updateCounter() {
  const now = new Date();
  let diff = Math.max(0, now - START_DATE);

  const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;

  const days = Math.floor(diff / day);
  diff -= days * day;
  const hours = Math.floor(diff / hour);
  diff -= hours * hour;
  const minutes = Math.floor(diff / minute);
  diff -= minutes * minute;
  const seconds = Math.floor(diff / second);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}
updateCounter();
setInterval(updateCounter, 1000);

/* =========================================================
   CARTA / ENVELOPE
   ========================================================= */
const envelope = document.getElementById('envelope');
envelope.addEventListener('click', () => {
  envelope.classList.toggle('open');
});

/* =========================================================
   PEDIDO FINAL — BOTÃO "NÃO" FOGE DO CURSOR
   ========================================================= */
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const finaleButtons = document.querySelector('.finale-buttons');

function moveNoButton() {
  const container = finaleButtons.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = container.width - btnRect.width;
  const maxY = 140; // limita o deslocamento vertical

  const newX = Math.random() * maxX;
  const newY = (Math.random() - 0.5) * maxY;

  noBtn.style.position = 'absolute';
  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY}px`;
}

// Desktop: fugir do mouse ao passar perto
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('mouseover', moveNoButton);

// Clique acidental: ainda foge (nunca permite clicar)
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});

// Mobile: muda de posição aleatoriamente em toques
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
});

/* =========================================================
   BOTÃO "SIM" — CELEBRAÇÃO FINAL
   ========================================================= */
yesBtn.addEventListener('click', () => {
  const celebration = document.getElementById('celebration');
  celebration.classList.add('active');
  celebration.scrollIntoView({ behavior: 'smooth' });

  // Música romântica
  const romanticMusic = document.getElementById('romantic-music');
  romanticMusic.play().catch(() => {});
  bgMusic.pause();

  // Chuva de corações
  startHeartRain();

  // Fogos de artifício
  startFireworks();
});

function startHeartRain() {
  const celebration = document.getElementById('celebration');
  const symbols = ['❤', '💕', '💗', '💖', '💘'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.className = 'falling-heart';
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (1 + Math.random() * 2) + 'rem';
      heart.style.animationDuration = (4 + Math.random() * 4) + 's';
      celebration.appendChild(heart);
      setTimeout(() => heart.remove(), 9000);
    }, i * 150);
  }
}

/* =========================================================
   FOGOS DE ARTIFÍCIO (canvas)
   ========================================================= */
const fireworksCanvas = document.getElementById('fireworks-canvas');
const fctx = fireworksCanvas.getContext('2d');
let fireworkParticles = [];
let fireworksRunning = false;

function resizeFireworks() {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}
resizeFireworks();
window.addEventListener('resize', resizeFireworks);

function launchFirework() {
  const x = Math.random() * fireworksCanvas.width;
  const y = Math.random() * fireworksCanvas.height * 0.5 + 40;
  const colors = ['#ffd9e6', '#d8b46a', '#ff9bb3', '#ffffff', '#f48fb1'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < 40; i++) {
    const angle = (Math.PI * 2 * i) / 40;
    const speed = 1 + Math.random() * 3;
    fireworkParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color
    });
  }
}

function animateFireworks() {
  fctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fireworkParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02;
    p.alpha -= 0.012;
    fctx.globalAlpha = Math.max(p.alpha, 0);
    fctx.fillStyle = p.color;
    fctx.beginPath();
    fctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    fctx.fill();
  });
  fctx.globalAlpha = 1;
  fireworkParticles = fireworkParticles.filter(p => p.alpha > 0);

  if (fireworksRunning) requestAnimationFrame(animateFireworks);
}

function startFireworks() {
  fireworksRunning = true;
  animateFireworks();
  const interval = setInterval(launchFirework, 500);
  // Após 12s, reduz a frequência mas mantém um brilho ocasional
  setTimeout(() => {
    clearInterval(interval);
    setInterval(launchFirework, 3000);
  }, 12000);
}
