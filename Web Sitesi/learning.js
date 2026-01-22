console.log("learning.js loaded");

// Load element data
const ELEMENTS = window.ELEMENTS_DATA || [];
const FIRST_20 = ELEMENTS.filter(e => e.atomicNumber <= 20);

console.log("Elements available:", ELEMENTS.length);
console.log("Sample element:", ELEMENTS[0]);

if (!ELEMENTS.length) {
    console.error("No element data found. Check elements-data.js");
}

const questionEl = document.querySelector(".question");
const answerButtons = document.querySelectorAll(".answer-btn");
const scoreEl = document.querySelector(".quiz-meta");
const nextBtn = document.querySelector(".next-btn");
const progressEl = document.querySelector(".progress");
const quizTypeEl = document.querySelector(".quiz-type");

const QUESTION_TYPE_LABELS = {
    "symbol-from-name": "Symbols",
    "name-from-symbol": "Element Names",
    "atomic-number": "Atomic Numbers",
    "category": "Element Categories",
    "compare": "Comparison",
    "comparison": "Property Comparison"
};

let currentQuestion = null;
let score = 0;
let questionIndex = 0;
const TOTAL_QUESTIONS = 10;
let currentDifficulty = "easy"; // easy, medium, hard
let timer = null;
let timeLeft = 15;
let correctCount = 0;
let wrongCount = 0;
let answered = false;
let questionHistory = [];

const screens = {
    start: document.getElementById("start-screen"),
    quiz: document.getElementById("quiz-screen"),
    result: document.getElementById("result-screen")
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
}

showScreen("start");

const startQuizBtn = document.getElementById("start-quiz-btn");

startQuizBtn.addEventListener("click", () => {
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    questionIndex = 0;
    questionHistory = [];

    showScreen("quiz");
    loadQuestion();
    startTimer();
});

const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const DIFFICULTY_RULES = {
  easy: {
    optionCount: 4,
    elements: FIRST_20,
    types: ["symbol", "name", "atomic-number"]
  },
  medium: {
    optionCount: 4,
    elements: ELEMENTS,
    types: [
      "symbol",
      "name",
      "atomic-number",
      "category",
      "compare-first-20"
    ]
  },
  hard: {
    optionCount: 4,
    elements: ELEMENTS,
    types: [
      "symbol",
      "name",
      "atomic-number",
      "category",
      "compare-any"
    ]
  }
};


difficultyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentDifficulty = btn.dataset.difficulty;

        difficultyButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        score = 0;
        questionIndex = 0;
        scoreEl.textContent = "Score: 0";
        answerButtons.forEach(b => b.style.display = "inline-block");
        nextBtn.style.display = "inline-block";
    });
});

const timerEl = document.querySelector(".timer");

function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerEl.textContent = `⏱ ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `⏱ ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    if(answered) return;
    wrongCount++;
    answered = true;
    nextBtn.disabled = false;

    answerButtons.forEach(b =>{
        b.disabled = true;
        if (b.textContent == currentQuestion.correctAnswer){
            b.classList.add("correct");
        }
    });
}

function showResults() {
    clearInterval(timer);
    showScreen("result");

    document.getElementById("result-correct").textContent = correctCount;
    document.getElementById("result-wrong").textContent = wrongCount;
    document.getElementById("result-score").textContent =
        `${correctCount} / ${TOTAL_QUESTIONS}`;

    const reviewList = document.getElementById("review-list");
    reviewList.innerHTML = "";

    questionHistory.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "review-item";

        div.innerHTML = `
            <p><strong>${index + 1}. ${item.question}</strong></p>
            <p>
                ${item.isCorrect ? "✅" : "❌"}
                Your Answer: <strong>${item.userAnswer}</strong>
            </p>
            ${!item.isCorrect
                ? `<p>✅ Correct Answer: <strong>${item.correctAnswer}</strong></p>`
                :""}
        `;

        reviewList.appendChild(div);
    });
}

function randomElement() {
    const pool = DIFFICULTY_RULES[currentDifficulty].elements;
    return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function generateSymbolQuestion(difficulty) {
    const rule = DIFFICULTY_RULES[difficulty];
    const correct = randomElement();

    const wrong = ELEMENTS
        .filter(e => e.symbol !== correct.symbol)
        .sort(() => Math.random() - 0.5)
        .slice(0, rule.optionCount - 1);

    const options = [...wrong, correct].sort(() => Math.random() - 0.5);

    return {
        type: "symbol-from-name",
        question: `What is the symbol for ${correct.name}?`,
        correctAnswer: correct.symbol,
        options: options.map(e => e.symbol)
    };
}

function generateNameFromSymbolQuestion() {
    const correct = randomElement();

    const wrong = ELEMENTS
        .filter(e => e.name !== correct.name)
        .slice(0, 3);

    const options = shuffle([correct, ...wrong]);

    return {
        type: "name-from-symbol",
        question: `Which element has the symbol ${correct.symbol}?`,
        correctAnswer: correct.name,
        options: options.map(e => e.name)
    };
}

function generateSymbolFromNameQuestion() {
    const correct = randomElement();

    const wrong = ELEMENTS
        .filter(e => e.symbol !== correct.symbol)
        .slice(0, 3);

    const options = shuffle([correct, ...wrong]);

    return {
        type: "symbol-from-name",
        question: `What is the symbol for ${correct.name}?`,
        correctAnswer: correct.symbol,
        options: options.map(e => e.symbol)
    };
}

function generateAtomicNumberQuestion(difficulty) {
    const rule = DIFFICULTY_RULES[difficulty];
    const correct = randomElement();

    const wrong = ELEMENTS
        .filter(e => e.atomicNumber !== correct.atomicNumber)
        .sort(() => Math.random() - 0.5)
        .slice(0, rule.optionCount - 1);

    const options = [...wrong, correct].sort(() => Math.random() - 0.5);

    return {
        type: "atomic-number",
        question: `Which element has atomic number ${correct.atomicNumber}?`,
        correctAnswer: correct.name,
        options: options.map(e => e.name)
    };
}

function generateCategoryQuestion() {
    const valid = ELEMENTS.filter(e => e.category);

    const correct = valid[Math.floor(Math.random() * valid.length)];

    const wrong = valid
        .filter(e => e.category !== correct.category)
        .slice(0, 3);

    const options = shuffle([correct, ...wrong]);

    return {
        type: "category",
        question: `Which category does ${correct.name} belong to?`,
        correctAnswer: correct.category,
        options: options.map(e => e.category)
    };
}

function generateComparisonFirst20() {
  const pool = FIRST_20;
  const a = pool[Math.floor(Math.random() * pool.length)];
  let b = pool[Math.floor(Math.random() * pool.length)];

  while (a.atomicNumber === b.atomicNumber) {
    b = pool[Math.floor(Math.random() * pool.length)];
  }

  const correct =
    a.atomicNumber > b.atomicNumber ? a.name : b.name;

  return {
    type: "compare",
    question: `Which element has the higher atomic number?`,
    correctAnswer: correct,
    options: shuffle([a.name, b.name])
  };
}

function generateComparisonAny() {
  const a = randomElement();
  let b = randomElement();

  while (a.atomicNumber === b.atomicNumber) {
    b = randomElement();
  }

  const correct =
    a.atomicNumber > b.atomicNumber ? a.name : b.name;

  return {
    type: "compare",
    question: `Which element has the higher atomic number?`,
    correctAnswer: correct,
    options: shuffle([a.name, b.name])
  };
}

function generateComparisonQuestion({
  property,
  label,
  higherIsCorrect = true,
  elementPool
}) {
  const valid = elementPool.filter(e => typeof e[property] === "number");
  if (valid.length < 2) return null;

  const [a, b] = shuffle(valid).slice(0, 2);

  const correct =
    higherIsCorrect
      ? (a[property] > b[property] ? a : b)
      : (a[property] < b[property] ? a : b);

  return {
    type: "comparison",
    question: `Which element has ${higherIsCorrect ? "higher" : "lower"} ${label}?`,
    correctAnswer: correct.name,
    options: shuffle([a.name, b.name])
  };
}

function generateMediumComparison() {
  const modes = [
    () => generateComparisonFirst20(),
    () => generateComparisonQuestion({
      property: "electronegativity",
      label: "electronegativity",
      higherIsCorrect: true,
      elementPool: FIRST_20
    })
  ];

  return modes[Math.floor(Math.random() * modes.length)]();
}

function generateHardComparison() {
  const properties = [
    { property: "electronegativity", label: "electronegativity", higherIsCorrect: true },
    { property: "ionizationEnergy", label: "ionization energy", higherIsCorrect: true },
    { property: "atomicRadius", label: "atomic radius", higherIsCorrect: false }
  ];

  const choice = properties[Math.floor(Math.random() * properties.length)];

  return generateComparisonQuestion({
    ...choice,
    elementPool: ELEMENTS
  });
}

function generateQuestion() {
  const rules = DIFFICULTY_RULES[currentDifficulty];
  const type =
    rules.types[Math.floor(Math.random() * rules.types.length)];

  switch (type) {
    case "symbol":
      return generateSymbolQuestion(currentDifficulty);

    case "name":
      return generateNameFromSymbolQuestion();

    case "atomic-number":
      return generateAtomicNumberQuestion(currentDifficulty);

    case "category":
      return generateCategoryQuestion();

    case "compare-first-20":
      return generateMediumComparison();

    case "compare-any":
      return generateHardComparison();

    default:
      return generateSymbolQuestion(currentDifficulty);
  }
}

function loadQuestion() {

    console.log("Loading question...");

    answered = false;
    nextBtn.disabled = true;

    if (questionIndex >= TOTAL_QUESTIONS) {
        showResults();
        return;
    }


    currentQuestion = generateQuestion();

    console.log(currentQuestion);

    if (!currentQuestion) return;
    questionIndex++;

    startTimer();

    questionEl.textContent = currentQuestion.question;
    quizTypeEl.textContent =
        QUESTION_TYPE_LABELS[currentQuestion.type] || "Question";

    progressEl.textContent = `Question ${questionIndex} / ${TOTAL_QUESTIONS}`;
    scoreEl.textContent = `Score: ${score}`;

    answerButtons.forEach((btn, i) => {
        btn.textContent = currentQuestion.options[i];
        btn.disabled = false;
        btn.classList.remove("correct", "wrong");
        btn.style.display = "inline-block";
    });
}

answerButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (!currentQuestion || answered) return;

        const userAnswer = btn.textContent;
        const isCorrect = userAnswer === currentQuestion.correctAnswer;

        if (isCorrect) {
            btn.classList.add("correct");
            score++;
            correctCount++;
            scoreEl.textContent = `Score: ${score}`;
        } else {
            btn.classList.add("wrong");
            wrongCount++
            answerButtons.forEach(b => {
                if (b.textContent === currentQuestion.correctAnswer) {
                    b.classList.add("correct");
                }
            });
        }

        questionHistory.push({
            question: currentQuestion.question,
            correctAnswer: currentQuestion.correctAnswer,
            userAnswer,
            isCorrect
        });

        answerButtons.forEach(b => b.disabled = true);
        answered = true;
        nextBtn.disabled = false;
        clearInterval(timer);
    });
});

nextBtn.addEventListener("click", () => {
    if (!answered) return;
    loadQuestion();
});