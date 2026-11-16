// =====================================================================
// Animaciones de scroll
// Toda la animación está en css/style.css y depende de la variable
// --progress (0 a 1). Este archivo solo prepara el HTML y, en navegadores
// sin animation-timeline, calcula --progress a mano.
// =====================================================================

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cssHandlesScroll = CSS.supports("animation-timeline: view()");


// 1. Presentación: separa el texto en palabras para iluminarlas de a una.
const introText = document.querySelector(".intro-text");
const words = introText.textContent.trim().split(/\s+/);

introText.textContent = "";
words.forEach(function (word, index) {
  const wordElement = document.createElement("span");
  wordElement.className = "intro-word";
  wordElement.textContent = word;
  wordElement.style.setProperty("--word-index", index);
  introText.append(wordElement, " ");
});
introText.style.setProperty("--word-count", words.length);


// 2. Educación: numera las universidades para el crossfade.
const educationItems = document.querySelectorAll(".education-item");

educationItems.forEach(function (item, index) {
  item.style.setProperty("--item-index", index);
});
document.querySelector(".education").style.setProperty("--item-count", educationItems.length);


// 3. Tono de fondo: cuando una sección cruza el centro de la pantalla,
//    el <body> toma su tono (data-tone="alt" o "base").
const toneObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      document.body.classList.toggle("tone-alt", entry.target.dataset.tone === "alt");
    }
  });
}, { rootMargin: "-50% 0px -50% 0px" });

document.querySelectorAll("[data-tone]").forEach(function (section) {
  toneObserver.observe(section);
});


// 4. Respaldo para navegadores sin animation-timeline.
//    Usa los mismos rangos que el CSS (sección 3 de style.css).
function calculateProgress(element) {
  const box = element.getBoundingClientRect();
  const screenHeight = window.innerHeight;
  let progress;

  if (element.classList.contains("scroll-scene")) {
    // Sección fija: 0 cuando su borde superior llega arriba, 1 cuando su borde inferior llega abajo.
    progress = -box.top / (box.height - screenHeight);
  } else {
    // Proyecto: 0 cuando asoma por abajo, 1 cuando desaparece por arriba.
    progress = (screenHeight - box.top) / (box.height + screenHeight);
  }

  return Math.min(Math.max(progress, 0), 1);
}

if (!cssHandlesScroll && !reduceMotion) {
  const progressBar = document.querySelector(".scroll-progress");
  const elementsOnScreen = new Set();
  let frameRequested = false;

  // Solo se recalculan los elementos que están en pantalla.
  // Al entrar o salir se fija su valor final (0 o 1) para que nada quede a medias.
  const visibilityObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        elementsOnScreen.add(entry.target);
      } else {
        elementsOnScreen.delete(entry.target);
      }
      entry.target.style.setProperty("--progress", calculateProgress(entry.target));
    });
  });

  document.querySelectorAll(".scroll-scene, .scroll-item").forEach(function (element) {
    visibilityObserver.observe(element);
  });

  // Un solo listener de scroll; como máximo un cálculo por cuadro.
  function updateProgress() {
    frameRequested = false;
    elementsOnScreen.forEach(function (element) {
      element.style.setProperty("--progress", calculateProgress(element));
    });

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.setProperty("--progress", window.scrollY / scrollableHeight);
  }

  function requestUpdate() {
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(updateProgress);
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
}
