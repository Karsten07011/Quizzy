// main.js
function navigateToQuiz(url) {
  const transition = document.getElementById("pageTransition");
  transition.innerHTML = '<div class="loading-spinner"></div>';
  transition.classList.add("active");

  setTimeout(() => {
    window.location.href = url;
  }, 800);
}

// Add click event listeners to all play buttons
document.querySelectorAll(".play-btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    const url = this.getAttribute("onclick").match(/'([^']+)'/)[1];
    navigateToQuiz(url);
  });
});
