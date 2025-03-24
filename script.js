// Debounce function to optimize resize/scroll events
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Optimized navigation with requestAnimationFrame
function navigateToQuiz(page) {
  const transition = document.querySelector(".page-transition");
  transition.classList.add("active");

  // Use rAF for smoother animation start
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.location.href = page;
    }, 600); // Reduced from 800ms to 600ms
  });
}

// Optimized load animations using IntersectionObserver
function initAnimations() {
  const header = document.querySelector(".header");
  const frames = document.querySelectorAll(".frame");

  // Load header first
  requestAnimationFrame(() => {
    header.classList.add("loaded");
  });

  // Use IntersectionObserver for frames
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            requestAnimationFrame(() => {
              entry.target.classList.add("loaded");
            });
          }, index * 100); // Reduced delay between frames
        }
      });
    },
    { threshold: 0.1 }
  );

  frames.forEach((frame) => {
    observer.observe(frame);
  });
}

// Initialize with DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Use rAF to ensure smooth start
  requestAnimationFrame(() => {
    initAnimations();
  });

  // Optimize hover effects
  const frames = document.querySelectorAll(".frame");
  frames.forEach((frame) => {
    frame.addEventListener(
      "mouseenter",
      debounce(() => {
        frame.classList.add("hover-active");
      }, 50)
    );

    frame.addEventListener(
      "mouseleave",
      debounce(() => {
        frame.classList.remove("hover-active");
      }, 50)
    );
  });
});

// Optimize window resize
window.addEventListener(
  "resize",
  debounce(() => {
    // Handle any responsive adjustments
  }, 100)
);
