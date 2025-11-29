/* ============================================================
    LOADING SCREEN
============================================================ */
window.addEventListener("load", () => {
  const loading = document.getElementById("loading-screen");
  if (loading) setTimeout(() => loading.classList.add("hide"), 1800);
});

/* ============================================================
    CARROSSEL (Fade + Swipe + Dots)
============================================================ */

const photosCarousel = [
  { src: "images/49.png", caption: "Pedido de namoro 💍" },
  { src: "images/3.jpg", caption: "Nosso date no shopping 🍕" },
  { src: "images/6.jpg", caption: "No cinema 🎬💗" },
  { src: "images/13.jpg", caption: "Beijo no parque 🌿" },
  { src: "images/12.jpg", caption: "Final do culto 🙏✨" },
  { src: "images/45.jpg", caption: "Leão de Judá 🌅" },
  { src: "images/47.jpg", caption: "Caminhada juntos 💚" },
  { src: "images/8.jpg", caption: "Momentos felizes juntos 💗" }
];

const carouselInner = document.getElementById("carousel-inner");
const dotsContainer = document.getElementById("carousel-dots");

let currentSlide = 0;
let slides = [];
let dots = [];
let captionEl;
let carouselTimer = null;

function createSlides() {
  if (!carouselInner) return;

  photosCarousel.forEach((photo, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.style.backgroundImage = `url('${photo.src}')`;

    if (i === 0) slide.classList.add("active");

    carouselInner.appendChild(slide);
    slides.push(slide);

    const dot = document.createElement("div");
    dot.className = "carousel-dot";
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      currentSlide = i;
      updateSlide();
      restartCarouselTimer();
    });

    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  captionEl = document.createElement("div");
  captionEl.className = "carousel-caption show";
  captionEl.innerText = photosCarousel[0].caption;

  carouselInner.insertAdjacentElement("afterend", captionEl);
}

function updateSlide() {
  slides.forEach((s, idx) =>
    s.classList.toggle("active", idx === currentSlide)
  );

  dots.forEach((d, idx) =>
    d.classList.toggle("active", idx === currentSlide)
  );

  if (captionEl) {
    captionEl.classList.remove("show");
    setTimeout(() => {
      captionEl.innerText = photosCarousel[currentSlide].caption;
      captionEl.classList.add("show");
    }, 200);
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % photosCarousel.length;
  updateSlide();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + photosCarousel.length) % photosCarousel.length;
  updateSlide();
}

function restartCarouselTimer() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(nextSlide, 6000);
}

createSlides();
restartCarouselTimer();

document.getElementById("btn-next")?.addEventListener("click", () => {
  nextSlide();
  restartCarouselTimer();
});

document.getElementById("btn-prev")?.addEventListener("click", () => {
  prevSlide();
  restartCarouselTimer();
});

/* ===== Swipe ===== */
let startX = 0;
let swiping = false;

carouselInner?.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  swiping = true;
});

carouselInner?.addEventListener("touchend", e => {
  if (!swiping) return;
  const diff = e.changedTouches[0].clientX - startX;

  if (diff > 40) prevSlide();
  if (diff < -40) nextSlide();

  restartCarouselTimer();
  swiping = false;
});


/* ============================================================
    QUIZ
============================================================ */
document.querySelectorAll(".quiz-options button").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

document.getElementById("btn-quiz")?.addEventListener("click", () => {
  let correct = document.querySelectorAll('button.selected[data-correct="true"]').length;
  const result = document.getElementById("quiz-result");

  result.textContent =
    correct >= 6
      ? "PER-FEI-TO! Você lembra de tudo 💘 Já podemos casar ?"
      : "Quase perfeito! Falta pouco 😄";
});


/* ============================================================
    MÚSICA (compatível com iPhone e GitHub Pages)
============================================================ */

const audio = document.getElementById("bg-music");
const soundOverlay = document.getElementById("sound-overlay");
const playButton = document.getElementById("btn-play-music");

if (audio) {
  audio.muted = false;

  const startMusic = async () => {
    try {
      audio.volume = 0.6;
      await audio.play();
      soundOverlay?.classList.add("hidden");
    } catch {
      soundOverlay?.classList.remove("hidden");
    }
  };

  document.getElementById("love-modal-btn")?.addEventListener("click", startMusic);

  playButton?.addEventListener("click", startMusic);

  /* botão flutuante */
  const musicToggle = document.createElement("button");
  musicToggle.id = "music-toggle";
  musicToggle.className = "floating-btn";
  musicToggle.textContent = "🎵";
  document.body.appendChild(musicToggle);

  musicToggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      musicToggle.textContent = "🎵";
    } else {
      audio.pause();
      musicToggle.textContent = "⏸️";
    }
  });
}


/* ============================================================
    SCROLL REVEAL
============================================================ */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


/* ============================================================
    CONTADOR — TEMPO JUNTOS
============================================================ */

function atualizarTempo() {
  const inicio = new Date("2023-12-02T00:00:00");
  const agora = new Date();

  const diff = agora - inicio;

  const diasTotais = Math.floor(diff / 86400000);
  const horasTotais = Math.floor(diff / 3600000);
  const minutosTotais = Math.floor(diff / 60000);
  const segundosTotais = Math.floor(diff / 1000);

  let anos = agora.getFullYear() - inicio.getFullYear();
  let meses = agora.getMonth() - inicio.getMonth();
  let dias = agora.getDate() - inicio.getDate();

  if (dias < 0) {
    meses--;
    dias += new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
  }
  if (meses < 0) {
    anos--;
    meses += 12;
  }

  document.getElementById("timer-format-1").innerHTML =
    `<strong>${anos}</strong> anos, <strong>${meses}</strong> meses e <strong>${dias}</strong> dias`;

  document.getElementById("timer-format-2").textContent = `${diasTotais} dias juntos`;

  document.getElementById("timer-format-3").textContent =
    `${horasTotais} horas • ${minutosTotais} minutos • ${segundosTotais} segundos de nós dois ❤️`;
}

setInterval(atualizarTempo, 1000);
atualizarTempo();


/* ============================================================
    NAVBAR SCROLL
============================================================ */
window.addEventListener("scroll", () => {
  document.querySelector(".navbar")?.classList.toggle("scrolled", window.scrollY > 40);
});


/* ============================================================
    ZOOM NAS FOTOS
============================================================ */
const galleryImages = document.querySelectorAll(".gallery img");

if (galleryImages.length) {
  const overlay = document.createElement("div");
  overlay.id = "zoom-overlay";
  overlay.innerHTML = `
    <div class="zoom-content">
      <img />
      <span class="zoom-close">×</span>
    </div>
  `;
  document.body.appendChild(overlay);

  const zoomImg = overlay.querySelector("img");

  overlay.querySelector(".zoom-close").addEventListener("click", () =>
    overlay.classList.remove("show")
  );

  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.remove("show");
  });

  galleryImages.forEach(img =>
    img.addEventListener("click", () => {
      zoomImg.src = img.src;
      overlay.classList.add("show");
    })
  );
}


/* ============================================================
    POP-UP INICIAL
============================================================ */
const loveModal = document.createElement("div");
loveModal.id = "love-modal";
loveModal.innerHTML = `
  <div class="love-modal-card">
    <h2>Oi, meu amor 💗</h2>
    <p>
      Esse site é só um pedacinho de tudo o que eu sinto por você.<br/>
      Obrigado por caminhar comigo e por deixar Deus escrever a nossa história.
    </p>
    <button id="love-modal-btn" class="btn-primary">Entrar no nosso mundo 💕</button>
  </div>
`;
document.body.appendChild(loveModal);

document.getElementById("love-modal-btn").addEventListener("click", () =>
  loveModal.classList.add("hidden")
);


/* ============================================================
    RODAPÉ — TEXTO DIGITADO
============================================================ */
const footerEl = document.querySelector(".footer p");
if (footerEl) {
  const txt = footerEl.textContent.trim();
  footerEl.textContent = "";
  let i = 0;

  function type() {
    footerEl.textContent = txt.slice(0, i++);
    if (i <= txt.length) setTimeout(type, 50);
  }
  setTimeout(type, 800);
}


/* ============================================================
    DARK MODE
============================================================ */
const themeToggle = document.createElement("button");
themeToggle.id = "theme-toggle";
themeToggle.className = "floating-btn theme";
themeToggle.textContent = "💖";
document.body.appendChild(themeToggle);

function applyTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
}

let savedTheme = localStorage.getItem("loveTheme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  savedTheme = savedTheme === "light" ? "dark" : "light";
  localStorage.setItem("loveTheme", savedTheme);
  applyTheme(savedTheme);
});


/* ============================================================
    CORAÇÕES FLUTUANTES
============================================================ */
const heartsContainer = document.createElement("div");
heartsContainer.id = "hearts-container";
document.body.appendChild(heartsContainer);

setInterval(() => {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = "❤";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration = 3 + Math.random() * 3 + "s";
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 6000);
}, 1500);


/* ============================================================
    CARTA — ANIMAÇÃO
============================================================ */
(() => {
  const fold = document.getElementById("letter-fold");
  const open = document.getElementById("letter-open");

  if (!fold || !open) return;

  fold.addEventListener("click", () => {
    fold.style.opacity = 0;
    fold.style.transform = "scale(0.95)";
    setTimeout(() => {
      fold.style.display = "none";
      open.classList.add("show");
    }, 350);
  });
})();


/* ============================================================
    POLAROIDS — Ângulos Aleatórios
============================================================ */
document.querySelectorAll(".polaroid").forEach(p => {
  const angle = (Math.random() * 10 - 5).toFixed(1);
  p.style.transform = `rotate(${angle}deg)`;
});


/* ============================================================
    NOW PLAYING (opcional)
============================================================ */
const nowPlaying = document.getElementById("music-now-playing");

if (nowPlaying && audio) {
  audio.addEventListener("play", () => nowPlaying.style.opacity = "1");
  audio.addEventListener("pause", () => nowPlaying.style.opacity = "0");
  audio.addEventListener("ended", () => nowPlaying.style.opacity = "0");
}