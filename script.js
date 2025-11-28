// LOADING SCREEN
window.addEventListener("load", () => {
  const loading = document.getElementById("loading-screen");
  setTimeout(() => loading.classList.add("hide"), 2500);
});

/************************************************
 *  CARROSSEL (FADE + LEGENDA + SWIPE)
 ************************************************/

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
  photosCarousel.forEach((photo, index) => {
    const slide = document.createElement("div");
    slide.classList.add("carousel-slide");
    slide.style.backgroundImage = `url('${photo.src}')`;
    if (index === 0) slide.classList.add("active");
    carouselInner.appendChild(slide);
    slides.push(slide);

    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartCarouselTimer();
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  // legenda
  captionEl = document.createElement("div");
  captionEl.classList.add("carousel-caption", "show");
  captionEl.innerText = photosCarousel[0].caption;
  carouselInner.insertAdjacentElement("afterend", captionEl);
}

function updateSlide() {
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === currentSlide);
  });

  dots.forEach((d, i) => {
    d.classList.toggle("active", i === currentSlide);
  });

  if (!captionEl) return;
  captionEl.classList.remove("show");
  setTimeout(() => {
    captionEl.innerText = photosCarousel[currentSlide].caption;
    captionEl.classList.add("show");
  }, 250);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % photosCarousel.length;
  updateSlide();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + photosCarousel.length) % photosCarousel.length;
  updateSlide();
}

function goToSlide(i) {
  currentSlide = i;
  updateSlide();
}

function restartCarouselTimer() {
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(nextSlide, 5000);
}

createSlides();
restartCarouselTimer();

document.getElementById("btn-next").onclick = () => {
  nextSlide();
  restartCarouselTimer();
};
document.getElementById("btn-prev").onclick = () => {
  prevSlide();
  restartCarouselTimer();
};

/************ SWIPE NO CARROSSEL (TOUCH + MOUSE) ************/
let startX = 0;
let isSwiping = false;

function getClientX(e) {
  if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
  return e.clientX;
}

carouselInner.addEventListener("touchstart", (e) => {
  startX = getClientX(e);
  isSwiping = true;
});

carouselInner.addEventListener("touchend", (e) => {
  if (!isSwiping) return;
  const endX = getClientX(e.changedTouches ? e.changedTouches[0] : e);
  const diff = endX - startX;
  const threshold = 40;
  if (diff > threshold) {
    prevSlide();
  } else if (diff < -threshold) {
    nextSlide();
  }
  restartCarouselTimer();
  isSwiping = false;
});

carouselInner.addEventListener("mousedown", (e) => {
  startX = getClientX(e);
  isSwiping = true;
});

window.addEventListener("mouseup", (e) => {
  if (!isSwiping) return;
  const endX = getClientX(e);
  const diff = endX - startX;
  const threshold = 60;
  if (diff > threshold) {
    prevSlide();
  } else if (diff < -threshold) {
    nextSlide();
  }
  restartCarouselTimer();
  isSwiping = false;
});


/************************************************
 *  QUIZ
 ************************************************/
const quizButtons = document.querySelectorAll(".quiz-options button");

quizButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const group = btn.parentElement.querySelectorAll("button");
    group.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

document.getElementById("btn-quiz").addEventListener("click", () => {
  const selected = document.querySelectorAll(".quiz-options button.selected");
  let correct = 0;

  selected.forEach((btn) => {
    if (btn.dataset.correct === "true") correct++;
  });

  const result = document.getElementById("quiz-result");

  if (correct >= 6)
    result.textContent = "PER-FEI-TO! Você lembra de tudo. 💘 Já podemos casar ?";
  else if (correct <= 5)
    result.textContent = "Quase perfeito! 😄 Falta pouco!";
  else
    result.textContent = "Hmm… bora criar mais memórias 😜";
});


/************************************************
 *  MÚSICA (Autoplay + Fallback + Botão Flutuante)
 ************************************************/
const audio = document.getElementById("bg-music");
const soundOverlay = document.getElementById("sound-overlay");
const playButton = document.getElementById("btn-play-music");

// Quando ela clicar para entrar no site, a música começa
document.getElementById("love-modal-btn").addEventListener("click", () => {
  audio.volume = 0.5;
  audio.play().catch(() => {
    // Se ainda assim o navegador bloquear, mostra o botão de ativar música
    soundOverlay.classList.remove("hidden");
  });
});

playButton.addEventListener("click", async () => {
  try {
    await audio.play();
    soundOverlay.classList.add("hidden");
  } catch (err) {
    alert("Não consegui iniciar a música. Tenta de novo 😊");
  }
});

// botão flutuante de play/pause
const musicToggle = document.createElement("button");
musicToggle.id = "music-toggle";
musicToggle.className = "floating-btn";
musicToggle.innerText = "🎵";
document.body.appendChild(musicToggle);

musicToggle.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    musicToggle.innerText = "🎵";
  } else {
    audio.pause();
    musicToggle.innerText = "⏸️";
  }
});


/************************************************
 *  ANIMAÇÕES AO SCROLL
 ************************************************/
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
/***********************************************
 *   TEMPO JUNTOS — CONTADOR AO VIVO
 ***********************************************/
function atualizarTempo() {
  const inicio = new Date("2023-12-02T00:00:00"); // DATA DE VOCÊS
  const agora = new Date();

  let diff = agora - inicio;

  // Totais
  const diasTotais = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horasTotais = Math.floor(diff / (1000 * 60 * 60));
  const minutosTotais = Math.floor(diff / (1000 * 60));
  const segundosTotais = Math.floor(diff / 1000);

  // Detalhado
  let anos = agora.getFullYear() - inicio.getFullYear();
  let meses = agora.getMonth() - inicio.getMonth();
  let dias = agora.getDate() - inicio.getDate();

  if (dias < 0) {
    meses--;
    const ultDiaMes = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
    dias += ultDiaMes;
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  document.getElementById("timer-format-1").innerHTML =
    `<strong>${anos}</strong> anos, <strong>${meses}</strong> meses e <strong>${dias}</strong> dias`;

  document.getElementById("timer-format-2").innerHTML =
    `${diasTotais} dias juntos`;

  document.getElementById("timer-format-3").innerHTML =
    `${horasTotais} horas • ${minutosTotais} minutos • ${segundosTotais} segundos de nós dois ❤️`;
}

setInterval(atualizarTempo, 1000);
atualizarTempo();


/************************************************
 *  NAVBAR FLUTUANTE
 ************************************************/
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 40) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});


/************************************************
 *  ZOOM NAS FOTOS DA GALERIA
 ************************************************/
const galleryImages = document.querySelectorAll(".gallery img");

if (galleryImages.length) {
  const zoomOverlay = document.createElement("div");
  zoomOverlay.id = "zoom-overlay";
  zoomOverlay.innerHTML = `
    <div class="zoom-content">
      <img />
      <span class="zoom-close">×</span>
    </div>
  `;
  document.body.appendChild(zoomOverlay);

  const zoomImg = zoomOverlay.querySelector("img");
  const zoomClose = zoomOverlay.querySelector(".zoom-close");

  galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
      zoomImg.src = img.src;
      zoomOverlay.classList.add("show");
    });
  });

  zoomClose.addEventListener("click", () => {
    zoomOverlay.classList.remove("show");
  });

  zoomOverlay.addEventListener("click", (e) => {
    if (e.target === zoomOverlay) {
      zoomOverlay.classList.remove("show");
    }
  });
}


/************************************************
 *  POP-UP SURPRESA INICIAL
 ************************************************/
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

document.getElementById("love-modal-btn").addEventListener("click", () => {
  loveModal.classList.add("hidden");
});


/************************************************
 *  RODAPÉ COM TEXTO DIGITADO
 ************************************************/
const footerTextEl = document.querySelector(".footer p");
if (footerTextEl) {
  const fullText = footerTextEl.textContent.trim();
  footerTextEl.textContent = "";
  let idx = 0;

  function typeFooter() {
    if (idx <= fullText.length) {
      footerTextEl.textContent = fullText.slice(0, idx);
      idx++;
      setTimeout(typeFooter, 60);
    }
  }

  setTimeout(typeFooter, 800);
}


/************************************************
 *  MODO ESCURO (DARK MODE) COM CORAÇÃO
 ************************************************/
const themeToggle = document.createElement("button");
themeToggle.id = "theme-toggle";
themeToggle.className = "floating-btn theme";
themeToggle.innerText = "💖";
document.body.appendChild(themeToggle);

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}

let savedTheme = localStorage.getItem("loveTheme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  savedTheme = savedTheme === "light" ? "dark" : "light";
  localStorage.setItem("loveTheme", savedTheme);
  applyTheme(savedTheme);
});


/************************************************
 *  CORAÇÕES FLUTUANDO NO FUNDO
 ************************************************/
const heartsContainer = document.createElement("div");
heartsContainer.id = "hearts-container";
document.body.appendChild(heartsContainer);

function createHeart() {
  const heart = document.createElement("span");
  heart.classList.add("heart");
  heart.textContent = "❤";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration = 3 + Math.random() * 3 + "s";
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 6000);
}

setInterval(createHeart, 1500);

/************************************************
 *  CARTA ABRINDO — 
 ************************************************/

(function () {
  const letterFold = document.getElementById("letter-fold");
  const letterOpen = document.getElementById("letter-open");

  if (!letterFold || !letterOpen) return;

  letterFold.addEventListener("click", () => {
    // animação sumindo
    letterFold.style.opacity = "0";
    letterFold.style.transform = "scale(0.95)";
    
    setTimeout(() => {
      letterFold.style.display = "none";
      letterOpen.classList.add("show");
    }, 350);
  });
})();


// =============================
// POLAROID: ângulos aleatórios
// =============================
const polas = document.querySelectorAll(".polaroid");

polas.forEach((pola) => {
  const angle = (Math.random() * 10 - 5).toFixed(1); // entre -5° e 5°
  pola.style.transform = `rotate(${angle}deg)`;
});
// =============================
// TOCANDO AGORA
// =============================
const nowPlaying = document.getElementById("music-now-playing");

audio.addEventListener("play", () => {
  nowPlaying.style.opacity = "1";
});

audio.addEventListener("pause", () => {
  nowPlaying.style.opacity = "0";
});

audio.addEventListener("ended", () => {
  nowPlaying.style.opacity = "0";
});

