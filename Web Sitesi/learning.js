console.log("learning.js loaded");

// Load element data
const ELEMENTS = window.ELEMENTS_DATA || [];

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
    "category": "Element Categories"
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

    showScreen("quiz");
    loadQuestion();
    startTimer();
});

const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const DIFFICULTY_RULES = {
    easy: {
        optionCount: 4,
        allowedTypes: ["symbol"]
    },
    medium: {
        optionCount: 4,
        allowedTypes: ["symbol", "atomic-number"]
    },
    hard: {
        optionCount: 4,
        allowedTypes: ["symbol", "atomic-number", "group", "period"]
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
    wrongCount++;

    answerButtons.forEach(b => {
        b.disabled = true;
        if (b.textContent === currentQuestion.correctAnswer) {
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
}

function randomElement() {
    return ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
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

const QUESTION_GENERATORS = [
    {
        difficulty: "easy",
        generator: generateSymbolFromNameQuestion
    },
    {
        difficulty: "easy",
        generator: generateNameFromSymbolQuestion
    },
    {
        difficulty: "medium",
        generator: generateAtomicNumberQuestion
    },
    {
        difficulty: "medium",
        generator: generateCategoryQuestion
    }
];

function generateQuestion() {
    const rules = DIFFICULTY_RULES[currentDifficulty];
    const type = rules.allowedTypes[
        Math.floor(Math.random() * rules.allowedTypes.length)
    ];

    switch (type) {
        case "symbol":
            return generateSymbolQuestion(currentDifficulty);
        case "atomic-number":
            return generateAtomicNumberQuestion(currentDifficulty);
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
        if (!currentQuestion) return;

        const isCorrect = btn.textContent === currentQuestion.correctAnswer;

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

/*if (!window.ELEMENTS_DATA || ELEMENTS.length === 0) {
    console.error("ELEMENTS data not found!");
} else {
    console.log("Elements available:", ELEMENTS.length);
    loadQuestion();
}

console.log("Difficulty:", currentDifficulty, currentQuestion.type);
console.log(currentQuestion.type, currentQuestion);*/