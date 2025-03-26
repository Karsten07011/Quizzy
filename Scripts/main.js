// main.js - Enhanced Version
document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations
  setupScrollAnimations();
  setupPlayButtons();
  setupIntersectionObserver();
});

function setupScrollAnimations() {
  // Fade in elements on scroll
  window.addEventListener("scroll", checkVisibility);
  checkVisibility(); // Initial check
}

function setupPlayButtons() {
  // Add click event listeners to all play buttons
  document.querySelectorAll(".play-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("onclick").match(/'([^']+)'/)[1];
      navigateToQuiz(url);
    });
  });
}

function setupIntersectionObserver() {
  // Create intersection observer for frames
  const frameObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.intersectionRatio < 0.1) {
          entry.target.classList.add("scroll-out");
        } else {
          entry.target.classList.remove("scroll-out");
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe all quiz frames
  document.querySelectorAll(".quiz-frame").forEach((frame) => {
    frameObserver.observe(frame);
  });

  // Observer for info sections
  const infoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".info-section").forEach((section) => {
    infoObserver.observe(section);
  });
}

function navigateToQuiz(url) {
  // Fade out all quiz frames
  const frames = document.querySelectorAll(".quiz-frame");
  frames.forEach((frame) => {
    frame.classList.add("exiting");
  });

  // Show loading transition
  const transition = document.getElementById("pageTransition");
  transition.innerHTML = '<div class="loading-spinner"></div>';
  transition.classList.add("active");

  // Navigate after animation
  setTimeout(() => {
    window.location.href = url;
  }, 800);
}

function checkVisibility() {
  const infoSections = document.querySelectorAll(".info-section");
  infoSections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.75) {
      section.classList.add("visible");
    }
  });
}
