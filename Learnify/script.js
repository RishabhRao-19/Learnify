let currentQuestionIndex = 0;
let score = 0;
const testQuestions = [
    { question: "What is 2 + 3?", options: ["A) 4", "B) 5", "C) 6"], answer: "B) 5" },
    { question: "Which word is a noun?", options: ["A) Run", "B) Apple", "C) Quickly"], answer: "B) Apple" },
    { question: "What color is the sky on a clear day?", options: ["A) Green", "B) Blue", "C) Yellow"], answer: "B) Blue" },
    { question: "How many legs does a dog have?", options: ["A) 2", "B) 4", "C) 3"], answer: "B) 4" },
    { question: "What comes after the letter 'B' in the alphabet?", options: ["A) A", "B) C", "C) D"], answer: "B) C" }
];

function selectAge(age) {
    document.getElementById('age-section').classList.add('hidden');
    document.getElementById('grade-section').classList.remove('hidden');
}

function selectGrade(grade) {
    document.getElementById('grade-section').classList.add('hidden');
    document.getElementById('chapters-section').classList.remove('hidden');
}

function selectChapter(chapter) {
    document.getElementById('chapters-section').classList.add('hidden');
    document.getElementById('video-section').classList.remove('hidden');
}

function takeTest() {
    document.getElementById('video-section').classList.add('hidden');
    document.getElementById('test-section').classList.remove('hidden');
    displayQuestion();
}

function displayQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = ''; // Clear previous questions

    const currentQuestion = testQuestions[currentQuestionIndex];
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `<h4>${currentQuestion.question}</h4>`; // Fixed template literal

    currentQuestion.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.innerHTML = `
            <input type="radio" name="answer" value="${option}">
            ${option}
        `;
        questionElement.appendChild(optionElement);
    });

    questionsContainer.appendChild(questionElement);
}

function submitTest() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    
    if (selectedOption) {
        const answer = selectedOption.value;
        if (answer === testQuestions[currentQuestionIndex].answer) {
            score++;
        }
        currentQuestionIndex++;

        if (currentQuestionIndex < testQuestions.length) {
            displayQuestion();
        } else {
            sendResultsToAI(); // Call the AI function when the test is complete
        }
    } else {
        alert('Please select an answer!');
    }
}

async function sendResultsToAI() {
    const resultData = {
        score: score,
        totalQuestions: testQuestions.length,
        answers: testQuestions.map((q, index) => ({
            question: q.question,
            selectedAnswer: document.querySelector(`input[name="answer"]:checked`)?.value || null
        }))
    };

    const apiKey = "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";
    const url = "";

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`, // Fixed template literal
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: resultData,
            systemMessage: "You are an AI that provides performance analysis based on test results."
        }),
    });

    const aiResult = await response.json();
    showAIResult(aiResult);
}

function showAIResult(aiResult) {
    const resultElement = document.getElementById('result');
    resultElement.classList.remove('hidden');
    resultElement.innerHTML = `
        You scored ${score} out of ${testQuestions.length}!<br>
        AI Analysis: ${aiResult.message || 'No analysis available.'}
    `;
}
