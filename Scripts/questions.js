document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quiz");

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

  let currentQuiz = null;
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let quizCompleted = false;
  let selectedAnswerIndex = null;

  async function loadQuiz() {
    try {
      questionText.textContent = "Loading quiz...";

      const response = await fetch("../quizzes.yml");
      if (!response.ok) throw new Error("Failed to load quizzes");

      const ymlString = await response.text();
      const parsedData = jsyaml.load(ymlString);

      if (!parsedData.quizzes) throw new Error("Invalid quiz format");

      currentQuiz = parsedData.quizzes.find((q) => q.id === quizId);

      if (!currentQuiz) {
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
    quizTitle.textContent = currentQuiz.title;
    quizDescription.textContent = currentQuiz.description;

    totalQuestionsElement.textContent = questions.length;

    const savedScore = localStorage.getItem(`quizScore_${quizId}`);
    if (savedScore) {
      score = parseInt(savedScore);
    }

    showQuestion();
  }

  function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
      showResults();
      return;
    }

    selectedAnswerIndex = null;

    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;

    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.className = "option-button";
      button.addEventListener("click", () => selectAnswer(index, button));
      optionsContainer.appendChild(button);
    });

    updateProgress();

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
    const optionButtons = document.querySelectorAll(".option-button");
    optionButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    selectedAnswerIndex = index;
    button.classList.add("selected");

    confirmButton.classList.remove("hidden");
  }

  function confirmAnswer() {
    if (selectedAnswerIndex === null) return;

    const question = questions[currentQuestionIndex];
    const optionButtons = document.querySelectorAll(".option-button");

    optionButtons.forEach((button) => {
      button.disabled = true;
    });

    const isCorrect = selectedAnswerIndex === question.correctAnswer;

    if (isCorrect) {
      score++;
      localStorage.setItem(`quizScore_${quizId}`, score);

      optionButtons[selectedAnswerIndex].classList.add("correct");
      feedbackElement.textContent = "Correct!";
      feedbackElement.className = "feedback correct";
    } else {
      optionButtons[selectedAnswerIndex].classList.add("incorrect");
      optionButtons[question.correctAnswer].classList.add("correct");
      feedbackElement.textContent = `Incorrect. The correct answer is: ${
        question.options[question.correctAnswer]
      }`;
      feedbackElement.className = "feedback incorrect";
    }

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

    progressFill.style.width = "100%";

    localStorage.setItem(`quizScore_${quizId}`, score);
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
    selectedAnswerIndex = null;

    localStorage.removeItem(`quizScore_${quizId}`);

    questionText.classList.remove("hidden");
    optionsContainer.classList.remove("hidden");
    resultsContainer.classList.add("hidden");
    feedbackElement.classList.add("hidden");
    nextButton.classList.add("hidden");
    confirmButton.classList.add("hidden");

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

  nextButton.addEventListener("click", nextQuestion);
  restartButton.addEventListener("click", restartQuiz);
  confirmButton.addEventListener("click", confirmAnswer);

  if (chooseAnotherButton) {
    chooseAnotherButton.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  if (quizId) {
    loadQuiz();
  } else {
    window.location.href = "../index.html";
  }
});
