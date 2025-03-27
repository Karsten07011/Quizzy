document.addEventListener("DOMContentLoaded", () => {
  setupScrollAnimations();
  setupPlayButtons();
  setupIntersectionObserver();
});

function setupScrollAnimations() {
  window.addEventListener("scroll", checkVisibility);
  checkVisibility(); 
}

function setupPlayButtons() {
  document.querySelectorAll(".play-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("onclick").match(/'([^']+)'/)[1];
      navigateToQuiz(url);
    });
  });
}

function setupIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("info-section")) {
            entry.target.classList.add("visible");
          }
          if (entry.target.classList.contains("quiz-frame")) {
            entry.target.classList.remove("scroll-out");
          }
        } else {
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

  document.querySelectorAll(".quiz-frame, .info-section").forEach((element) => {
    observer.observe(element);
  });
}

function navigateToQuiz(url) {
  const frames = document.querySelectorAll(".quiz-frame, .info-section");
  frames.forEach((frame) => {
    frame.classList.add("exiting");
  });

  const transition = document.getElementById("pageTransition");
  transition.innerHTML = '<div class="loading-spinner"></div>';
  transition.classList.add("active");

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
