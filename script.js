let questions = [];
let currentIndex = 0;
let wrongAnswers = [];
let startTime;

function startGame(numQuestions) {
    questions = generateQuestions(numQuestions);
    currentIndex = 0;
    wrongAnswers = [];
    startTime = Date.now(); // 게임 시작 시간 기록
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    nextQuestion();
}

function generateQuestions(numQuestions) {
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        questions.push({ a, b, answer: a * b });
    }
    return questions;
}

function nextQuestion() {
    if (currentIndex < questions.length) {
        const { a, b } = questions[currentIndex];
        document.getElementById("question").textContent = `${a} × ${b} = ?`;
        document.getElementById("progress").textContent = `문제: ${currentIndex + 1} / ${questions.length}`;
    } else {
        showResults();
    }
}

function submitAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    document.getElementById("answer").value = "";

    const { a, b, answer } = questions[currentIndex];
    if (userAnswer === answer) {
        console.log("정답입니다!");
    } else {
        console.log(`오답입니다! 정답은 ${answer}입니다.`);
        wrongAnswers.push(questions[currentIndex]);
    }
    currentIndex++;
    nextQuestion();
}

function retryWrongQuestions() {
    questions = [...wrongAnswers];
    currentIndex = 0;
    wrongAnswers = [];
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    nextQuestion();
}

function showMainMenu() {
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
}

function showResults() {
    const totalQuestions = questions.length;
    const correctAnswers = totalQuestions - wrongAnswers.length;

    document.getElementById("game-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";

    document.getElementById("result-summary").textContent =
        `결과: ${correctAnswers} / ${totalQuestions}`;
}

function showResults() {
    const totalQuestions = questions.length;
    const correctAnswers = totalQuestions - wrongAnswers.length;
    const endTime = Date.now(); // 게임 종료 시간 기록
    const timeTaken = Math.floor((endTime - startTime) / 1000); // 경과 시간 (초 단위)

    // 분:초 형식으로 변환
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = `${minutes}분 ${seconds}초`;

    document.getElementById("game-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";

    document.getElementById("result-summary").textContent =
        `결과: ${correctAnswers} / ${totalQuestions}   ` +
        `소요 시간: ${formattedTime}`;
}

function saveScore() {
    const previousScores = JSON.parse(localStorage.getItem("scores")) || [];
    const newScore = {
        score: correctAnswers,
        time: timeElapsed,
        date: new Date().toLocaleString()
    };
    previousScores.push(newScore);
    previousScores.sort((a, b) => b.score - a.score || a.time - b.time); // 점수 내림차순, 동일 점수는 시간 오름차순
    localStorage.setItem("scores", JSON.stringify(previousScores));
    showRankings(previousScores);
}

function showRankings(scores) {
    let rankingsHTML = "<h2>순위</h2><ol>";
    scores.forEach((score, index) => {
        rankingsHTML += `<li>순위 ${index + 1}: 점수: ${score.score}, 시간: ${score.time}초, ${score.date}</li>`;
    });
    rankingsHTML += "</ol>";
    document.getElementById("rankings").innerHTML = rankingsHTML;
}

function endGame() {
    stopTimer();
    saveScore();
}

// 게임 종료 후 순위 표시
document.getElementById("submit").onclick = function() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    if (userAnswer === correctAnswer) {
        correctAnswers++;
    }
    document.getElementById("answer").value = ""; // 입력창 비우기
    askQuestion(); // 다음 문제 출제
    endGame(); // 게임 종료 후 순위 저장
};


