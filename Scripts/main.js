// main.js - Complete Nederlandse Versie
document.addEventListener("DOMContentLoaded", () => {
  // Initialiseer animaties
  setupScrollAnimations();
  setupPlayButtons();
  setupIntersectionObserver();
});

function setupScrollAnimations() {
  // Controleer zichtbaarheid bij scrollen
  window.addEventListener("scroll", checkVisibility);
  checkVisibility(); // Eerste controle
}

function setupPlayButtons() {
  // Voeg klikgebeurtenissen toe aan alle speelknoppen
  document.querySelectorAll(".play-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("onclick").match(/'([^']+)'/)[1];
      navigateToQuiz(url);
    });
  });
}

function setupIntersectionObserver() {
  // Creëer een Intersection Observer voor alle animatie-elementen
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Fade-in animatie voor zichtbare elementen
          if (entry.target.classList.contains("info-section")) {
            entry.target.classList.add("visible");
          }
          if (entry.target.classList.contains("quiz-frame")) {
            entry.target.classList.remove("scroll-out");
          }
        } else {
          // Fade-out animatie voor niet-zichtbare elementen
          if (
            entry.target.classList.contains("quiz-frame") &&
            entry.intersectionRatio < 0.1
          ) {
            entry.target.classList.add("scroll-out");
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  // Observeer alle elementen die moeten animeren
  document.querySelectorAll(".quiz-frame, .info-section").forEach((element) => {
    observer.observe(element);
  });
}

function navigateToQuiz(url) {
  // Fade out animatie voor alle frames
  const frames = document.querySelectorAll(".quiz-frame, .info-section");
  frames.forEach((frame) => {
    frame.classList.add("exiting");
  });

  // Toon laadscherm
  const transition = document.getElementById("pageTransition");
  transition.innerHTML = '<div class="loading-spinner"></div>';
  transition.classList.add("active");

  // Navigeer na animatie
  setTimeout(() => {
    window.location.href = url;
  }, 800);
}

function checkVisibility() {
  const elements = document.querySelectorAll(".info-section, .quiz-frame");
  const windowHeight = window.innerHeight;

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top <= windowHeight * 0.75 && rect.bottom >= 0;

    if (isVisible) {
      if (element.classList.contains("info-section")) {
        element.classList.add("visible");
      }
      element.classList.remove("exiting");
    }
  });
}
