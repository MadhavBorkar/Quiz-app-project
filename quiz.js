const params = new URLSearchParams(window.location.search);
const subject = params.get("subject");

const title = document.getElementById("title");
const questionDiv = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const nextBtn = document.getElementById("next");
const resultBox = document.getElementById("result");
const scoreText = document.getElementById("score");

let questions = [];
let index = 0;
let score = 0;
let locked = false;

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    const section = data[subject];
    if(!section) {
        title.innerText = "No questions available for this subject.";
        nextBtn.style.display = "none";
        return;
    }
    title.innerText = section.title;
    questions = section.questions;
    loadQuestion();
  });

function loadQuestion() {
  locked = false;
  optionsDiv.innerHTML = "";
  questionDiv.innerText = questions[index].question;

  questions[index].options.forEach(opt => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => checkAnswer(div, opt);
    optionsDiv.appendChild(div);
  });
}

function checkAnswer(el, answer) {
  if (locked) return;
  locked = true;

  const correct = questions[index].answer;

  document.querySelectorAll(".option").forEach(o => {
    if (o.innerText === correct) o.classList.add("correct");
    if (o.innerText === answer && answer !== correct) o.classList.add("wrong");
  });

  if (answer === correct) score++;
}

nextBtn.onclick = () => {
  index++;
  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  document.querySelector(".card").style.display = "none";
  nextBtn.style.display = "none";
  resultBox.classList.remove("hidden");
  scoreText.innerText = `Your Score: ${score} / ${questions.length}`;
}
