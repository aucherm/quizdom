
const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const quizSection = document.getElementById("quiz");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const progressEl = document.getElementById("progress");
const restartBtn = document.getElementById("restart-btn");
const explanationEl = document.getElementById("explanation");
const feedbackEl = document.getElementById("feedback");
const timerDisplay = document.getElementById("timer");
const progressBarEl = document.getElementById("progress-bar");

let quiz = [
  {
    question: "Quelle est la capitale du Canada ?",
    answers: ["Toronto", "Montréal", "Ottawa", "Vancouver"],
    correct: 3,
    explanation: "💡 La bonne réponse était : Ottawa ! Beaucoup pensent que c’est Toronto ou Montréal, mais Ottawa est la capitale administrative du pays."
  },
  {
    question: "Quelle est la langue la plus parlée au monde ?",
    answers: ["Anglais", "Chinois mandarin", "Espagnol", "Hindi"],
    correct: 2,
    explanation: "💡 La bonne réponse était : le chinois mandarin ! Il y a environ 1 milliard de locuteurs natifs, principalement en Chine."
  },
  {
    question: "Quelle est la phobie la plus répandue au monde ?",
    answers: ["L’arachnophobie (araignées)", "L’acrophobie (hauteur)", "La claustrophobie (espaces clos)", "La coulrophobie (clowns)"],
    correct: 1,
    explanation: "💡 La bonne réponse était : l'arachnophobie ! Environ 1 personne sur 3 a peur des araignées 🕷️"
  },
  {
    question: "Quelle est la capitale de l’Australie ?",
    answers: ["Sydney", "Adélaïde", "Melbourne", "Canberra"],
    correct: 4,
    explanation: "💡 La bonne réponse était : Canberra ! Ce n’est ni Sydney ni Melbourne, mais une ville créée pour trancher entre les deux."
  },
  {
    question: "Quel animal dort le moins au monde ?",
    answers: ["Le chat", "La girafe", "Le dauphin", "La mouche"],
    correct: 2,
    explanation: "💡 La bonne réponse était :la girafe ! Elle ne dort qu’environ 2 heures par jour, souvent debout !"
  },
  {
    question: "Combien de cœurs possède une pieuvre ?",
    answers: ["1", "2", "3", "4"],
    correct: 3,
    explanation: "💡 La bonne réponse était : 3 ! Deux pour pomper le sang vers les branchies, un pour le reste du corps."
  },
  {
    question: "Quel fruit était autrefois appelé pomme d’amour ?",
    answers: ["La tomate", "La fraise", "La cerise", "La grenade"],
    correct: 1,
    explanation: "💡 La bonne réponse était : la tomate ! Quand elle est arrivée en Europe, on croyait qu’elle avait des vertus aphrodisiaques."
  },
  {
    question: "Quelle est la boisson la plus consommée au monde après l’eau ?",
    answers: ["Le café", "Le lait", "Le soda", "Le thé"],
    correct: 4,
    explanation: "💡 La bonne réponse était : le thé ! Du matcha japonais au thé noir anglais, c’est la star mondiale des boissons chaudes."
  },
  {
    question: "Quel est le pays où l’on mange le plus de chocolat par habitant ?",
    answers: ["Belgique", "Suisse", "Allemagne", "France"],
    correct: 2,
    explanation: "💡 La bonne réponse était : la Suisse ! Environ 10 kilos par personne et par an."
  },
  {
    question: "Quelle invention a été découverte par erreur ?",
    answers: ["L'électricité", "Le téléphone", "L'imprimerie", "Le micro-ondes"],
    correct: 4,
    explanation: "💡 La bonne réponse était : le micro-ondes ! Un ingénieur a remarqué qu’une barre de chocolat fondait dans sa poche à cause d’un radar."
  }
];

//fonction mélange des questions
function shuffleQuestions(quiz) {
  const shuffled = [...quiz];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

//fonction timer
let timerLeft = 20;
let timerId;

function startTimer() {
  clearInterval(timerId);
  timerLeft = 20;
  timerDisplay.textContent = timerLeft;

  timerId = setInterval(() => {
    timerLeft--;
    timerDisplay.textContent = timerLeft;

    if (timerLeft <= 0) {
      clearInterval(timerId);
      timeUp();
    }
  }, 1000); // durée en millisecondes - exécution de la fonction toutes les ... secondes
}

function stopTimer() {
  clearInterval(timerId);
}

function timeUp() {
  hasAnswered = true;
  feedbackEl.hidden = false;
  feedbackEl.textContent = "⏰ Temps écoulé !";
  feedbackEl.style.color = "orange";
  nextBtn.disabled = false;
  [...answersEl.children].forEach(b => (b.disabled = true)); //désactive tous les boutons de réponses
  const correctIndex0 = quiz[currentQuestionIndex].correct - 1; //affiche la bonne réponse
  [...answersEl.children].forEach((btn, index) => {  //conversion de answersEl.children en tableau (spread operator) [button1, button2, button3, button4]
    if (index === correctIndex0) {
      btn.classList.add("correct"); // ✅ Bonne réponse en vert
    } else {
      btn.classList.add("wrong"); // ❌ Mauvaises réponses en rouge
    }
  });

  const exp = quiz[currentQuestionIndex].explanation; //affiche l'explication
  if (exp) {
    explanationEl.textContent = exp;
    explanationEl.hidden = false;
  }
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.length) {
      renderQuestion();
    } else {
      showResults();
    }
  }, 10000); //durée en millisecondes - exécution de la fonction toutes les ... secondes

}

//mise à jour de la progression
function updateProgress() {
  progressEl.textContent = `Question ${currentQuestionIndex + 1} / ${quiz.length} — Score : ${score}`;
  const progressPercent = ((currentQuestionIndex + 1) / quiz.length) * 100;
  progressBarEl.style.width = progressPercent + "%";
}

//fonction réinitialisation des réponses
function clearAnswers() {
  answersEl.innerHTML = "";
  nextBtn.disabled = true;
  feedbackEl.hidden = true;
  feedbackEl.textContent = "";
  explanationEl.hidden = true;
  explanationEl.textContent = "";

}

//fonction affichage des questions
function renderQuestion() {
  hasAnswered = false;
  const q = quiz[currentQuestionIndex];
  questionTextEl.textContent = q.question;
  clearAnswers();
  const shuffledAnswers = shuffleArray(q.answers);
const correctAnswerText = q.answers[q.correct - 1]; // texte de la bonne réponse
shuffledAnswers.forEach((label, idx) => {
  const btn = document.createElement("button");
  btn.className = "answer";
  btn.textContent = label;

  // l'indice de la bonne réponse dans le nouvel ordre
  const isCorrect = label === correctAnswerText;

  btn.addEventListener("click", () => onSelectAnswer(btn, isCorrect));
  answersEl.appendChild(btn);
});
  updateProgress();
  startTimer (); //démarre le timer à chaque question
}


//fonction gestion du clic sur une réponse
function onSelectAnswer(clickedBtn, isCorrect) {
  if (hasAnswered) return;
  hasAnswered = true;
  stopTimer();

  [...answersEl.children].forEach(b => (b.disabled = true));

  if (isCorrect) {
    score++;
    clickedBtn.classList.add("correct");
    feedbackEl.textContent = "✅ Bonne réponse !";
    feedbackEl.style.color = "green";
  } else {
    clickedBtn.classList.add("wrong");
    feedbackEl.textContent = "❌ Mauvaise réponse...";
    feedbackEl.style.color = "red";

    // mettre en vert le bouton correct
    [...answersEl.children].forEach(btn => {
      if (btn.textContent === quiz[currentQuestionIndex].answers[quiz[currentQuestionIndex].correct - 1]) {
        btn.classList.add("correct");
      }
    });
  }

  feedbackEl.hidden = false;

  const exp = quiz[currentQuestionIndex].explanation;
  if (exp) {
    explanationEl.textContent = exp;
    explanationEl.hidden = false;
  }

  nextBtn.disabled = false;
  updateProgress();
}

//question suivante
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  hasAnswered = false;
  stopTimer();
  if (currentQuestionIndex < quiz.length) {
    renderQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  stopTimer();
  endGame(score); // <-- ✅ appelle la gestion du meilleur score et de l’affichage final

  // Si tu veux aussi garder ton message actuel à l’écran :
  questionTextEl.textContent = "Quiz terminé !";
  answersEl.classList.add("results-visible");
  answersEl.innerHTML = `
    <p style="margin:0 0 10px">
      Score final : <strong>${score}</strong> / <strong>${quiz.length}</strong>
    </p>
    <p>Bravo ! Clique sur "Recommencer" pour retenter.</p>
  `;
  nextBtn.disabled = true;
  restartBtn.hidden = false;
  explanationEl.hidden = true;
  feedbackEl.textContent = "";
  progressEl.textContent = `Score final : ${score} / ${quiz.length}`;
}

//redémarre le quiz
restartBtn.addEventListener("click", () => {
  document.getElementById("end-screen").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  hasAnswered = false;
  restartBtn.hidden = true;
   quiz = shuffleQuestions(quiz);

  renderQuestion();
  
});

//démarrage du quiz
startBtn.addEventListener("click", () => {
  startScreen.hidden = true;
  quizSection.hidden = false;
  quiz = shuffleQuestions(quiz);
  currentQuestionIndex = 0;
  score = 0;
  renderQuestion();
});

// Local-Storage
function storageIsAvailable() {
  try {
    const testKey = "__test_localstorage__";
    localStorage.setItem(testKey, "ok");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

function getBestScore() {
  if (!storageIsAvailable()) return 0;
  const raw = localStorage.getItem("bestScore");
  return raw ? parseInt(raw, 10) : 0;
}

function saveBestScore(newScore) {
  if (!storageIsAvailable()) return;
  localStorage.setItem("bestScore", String(newScore));
}

function isNewHighScore(currentScore) {
  const best = getBestScore();
  return currentScore > best;
}

function updateBestScoreIfNeeded(currentScore) {
  if (isNewHighScore(currentScore)) {
    saveBestScore(currentScore);
  }
}

function displayBestScore() {
  const best = getBestScore();

  const homeElt = document.getElementById("best-score-home");
  const finalElt = document.getElementById("best-score-final");

  if (homeElt) homeElt.textContent = best;
  if (finalElt) finalElt.textContent = best;
}

window.addEventListener("DOMContentLoaded", () => {
  displayBestScore();
});

function endGame(currentScore) {
  updateBestScoreIfNeeded(currentScore);

  const currentElt = document.getElementById("current-score-final");
  if (currentElt) currentElt.textContent = currentScore;

  displayBestScore();

  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
}
