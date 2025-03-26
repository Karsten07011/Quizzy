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

// Create floating particles background
function createParticles() {
  const particlesContainer = document.querySelector(".particles");
  const particleCount = Math.floor(window.innerWidth / 10);

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random size between 1px and 3px
    const size = Math.random() * 2 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Random animation
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

    particlesContainer.appendChild(particle);
  }

  // Add CSS for animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translate(0, 0);
      }
      25% {
        transform: translate(${Math.random() * 100 - 50}px, ${
    Math.random() * 100 - 50
  }px);
      }
      50% {
        transform: translate(${Math.random() * 100 - 50}px, ${
    Math.random() * 100 - 50
  }px);
      }
      75% {
        transform: translate(${Math.random() * 100 - 50}px, ${
    Math.random() * 100 - 50
  }px);
      }
    }
  `;
  document.head.appendChild(style);
}

// Optimized navigation with requestAnimationFrame
function navigateToQuiz(page) {
  const transition = document.querySelector(".page-transition");
  transition.classList.add("active");

  // Use rAF for smoother animation start
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.location.href = page;
    }, 600);
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
          }, index * 100);
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
  // Create particles background
  createParticles();

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
    // Recreate particles on resize
    const particles = document.querySelector(".particles");
    particles.innerHTML = "";
    createParticles();
  }, 100)
);
