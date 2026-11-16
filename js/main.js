// =====================================================================
// Animaciones de scroll
// Toda la animación está en css/style.css y depende de la variable
// --progress (0 a 1). Este archivo marca la sección actual y, en
// navegadores sin animation-timeline, calcula --progress a mano.
// =====================================================================

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cssHandlesScroll = CSS.supports("animation-timeline: view()");


// 1. Sección actual: cuando una sección cruza el centro de la pantalla,
//    el fondo toma su tono (data-tone="alt" o "base") y su enlace de la
//    barra de navegación se resalta.
const navbarLinks = document.querySelectorAll(".navbar-links a");

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    document.body.classList.toggle("tone-alt", entry.target.dataset.tone === "alt");

    navbarLinks.forEach(function (link) {
      link.classList.toggle("is-current", link.hash === "#" + entry.target.id);
    });
  });
}, { rootMargin: "-50% 0px -50% 0px" });

document.querySelectorAll("[data-tone]").forEach(function (section) {
  sectionObserver.observe(section);
});


// 2. Respaldo para navegadores sin animation-timeline.
//    Usa el mismo rango que el CSS (sección 3 de style.css):
//    0 cuando el elemento asoma por abajo, 1 cuando desaparece por arriba.
//    Se mide la posición original del elemento en la página (offsetTop),
//    no la que tiene mientras se anima, igual que hace CSS.
function distanceFromPageTop(element) {
  let distance = 0;
  while (element) {
    distance += element.offsetTop;
    element = element.offsetParent;
  }
  return distance;
}

function calculateProgress(element) {
  const screenHeight = window.innerHeight;
  const elementTopOnScreen = distanceFromPageTop(element) - window.scrollY;
  const progress = (screenHeight - elementTopOnScreen) / (element.offsetHeight + screenHeight);

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

  document.querySelectorAll(".scroll-item").forEach(function (element) {
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
