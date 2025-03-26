document.addEventListener("DOMContentLoaded", () => {
  // Get quiz ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quiz");

  // DOM elements
  const quizContainer = document.querySelector(".quiz-container");
  const quizTitle = document.getElementById("quiz-title");
  const quizDescription = document.getElementById("quiz-description");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const feedbackElement = document.getElementById("feedback");
  const nextButton = document.getElementById("next-button");
  const resultsContainer = document.getElementById("results-container");
  const scoreElement = document.getElementById("score");
  const totalElement = document.getElementById("total");
  const restartButton = document.getElementById("restart-button");
  const chooseAnotherButton = document.getElementById("choose-another-button");
  const progressElement = document.getElementById("progress");
  const totalQuestionsElement = document.getElementById("total-questions");
  const progressFill = document.getElementById("progress-fill");
  const confirmButton = document.getElementById("confirm-button");

  // Quiz state
  let currentQuiz = null;
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let quizCompleted = false;
  let selectedAnswerIndex = null;

  // Load the selected quiz
  async function loadQuiz() {
    try {
      // Show loading state
      questionText.textContent = "Loading quiz...";

      // Load YML file
      const response = await fetch("../quizzes.yml");
      if (!response.ok) throw new Error("Failed to load quizzes");

      const ymlString = await response.text();
      const parsedData = jsyaml.load(ymlString);

      if (!parsedData.quizzes) throw new Error("Invalid quiz format");

      // Find the selected quiz
      currentQuiz = parsedData.quizzes.find((q) => q.id === quizId);

      if (!currentQuiz) {
        // Quiz not found, redirect to homepage after delay
        questionText.textContent = "Quiz not found. Redirecting...";
        setTimeout(() => (window.location.href = "index.html"), 2000);
        return;
      }

      questions = currentQuiz.questions;
      initializeQuiz();
    } catch (error) {
      console.error("Error loading quiz:", error);
      showError();
    }
  }

  function initializeQuiz() {
    // Set quiz title and description
    quizTitle.textContent = currentQuiz.title;
    quizDescription.textContent = currentQuiz.description;

    // Initialize progress
    totalQuestionsElement.textContent = questions.length;

    // Load saved score if exists
    const savedScore = localStorage.getItem(`quizScore_${quizId}`);
    if (savedScore) {
      score = parseInt(savedScore);
    }

    // Show first question
    showQuestion();
  }

  function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
      showResults();
      return;
    }

    // Reset selection state
    selectedAnswerIndex = null;

    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Create option buttons
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.className = "option-button";
      button.addEventListener("click", () => selectAnswer(index, button));
      optionsContainer.appendChild(button);
    });

    // Update progress
    updateProgress();

    // Hide feedback and buttons
    feedbackElement.classList.add("hidden");
    nextButton.classList.add("hidden");
    confirmButton.classList.add("hidden");
  }

  function updateProgress() {
    progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${
      questions.length
    }`;
    progressFill.style.width = `${
      ((currentQuestionIndex + 1) / questions.length) * 100
    }%`;
  }

  function selectAnswer(index, button) {
    // Reset previous selection if any
    const optionButtons = document.querySelectorAll(".option-button");
    optionButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    // Mark new selection
    selectedAnswerIndex = index;
    button.classList.add("selected");

    // Show confirm button
    confirmButton.classList.remove("hidden");
  }

  function confirmAnswer() {
    if (selectedAnswerIndex === null) return;

    const question = questions[currentQuestionIndex];
    const optionButtons = document.querySelectorAll(".option-button");

    // Disable all buttons
    optionButtons.forEach((button) => {
      button.disabled = true;
    });

    // Check if answer is correct
    const isCorrect = selectedAnswerIndex === question.correctAnswer;

    if (isCorrect) {
      // Update score
      score++;
      localStorage.setItem(`quizScore_${quizId}`, score);

      // Visual feedback
      optionButtons[selectedAnswerIndex].classList.add("correct");
      feedbackElement.textContent = "Correct!";
      feedbackElement.className = "feedback correct";
    } else {
      // Visual feedback
      optionButtons[selectedAnswerIndex].classList.add("incorrect");
      optionButtons[question.correctAnswer].classList.add("correct");
      feedbackElement.textContent = `Incorrect. The correct answer is: ${
        question.options[question.correctAnswer]
      }`;
      feedbackElement.className = "feedback incorrect";
    }

    // Hide confirm button and show next button
    confirmButton.classList.add("hidden");
    feedbackElement.classList.remove("hidden");
    nextButton.classList.remove("hidden");
  }

  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    quizCompleted = true;
    questionText.classList.add("hidden");
    optionsContainer.classList.add("hidden");
    feedbackElement.classList.add("hidden");
    nextButton.classList.add("hidden");
    confirmButton.classList.add("hidden");

    resultsContainer.classList.remove("hidden");
    scoreElement.textContent = score;
    totalElement.textContent = questions.length;

    // Update progress to 100%
    progressFill.style.width = "100%";

    // Save final score
    localStorage.setItem(`quizScore_${quizId}`, score);
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
    selectedAnswerIndex = null;

    // Clear saved score
    localStorage.removeItem(`quizScore_${quizId}`);

    // Reset UI
    questionText.classList.remove("hidden");
    optionsContainer.classList.remove("hidden");
    resultsContainer.classList.add("hidden");
    feedbackElement.classList.add("hidden");
    nextButton.classList.add("hidden");
    confirmButton.classList.add("hidden");

    // Show first question
    showQuestion();
  }

  function showError() {
    quizContainer.innerHTML = `
            <div class="error-message">
                <h2>Error Loading Quiz</h2>
                <p>There was a problem loading the quiz. Please try again later.</p>
                <a href="index.html" class="action-button">Return to Quiz Selection</a>
            </div>
        `;
  }

  // Event listeners
  nextButton.addEventListener("click", nextQuestion);
  restartButton.addEventListener("click", restartQuiz);
  confirmButton.addEventListener("click", confirmAnswer);

  if (chooseAnotherButton) {
    chooseAnotherButton.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  // Load the selected quiz when page loads
  if (quizId) {
    loadQuiz();
  } else {
    // No quiz selected, redirect to homepage
    window.location.href = "../index.html";
  }
});
