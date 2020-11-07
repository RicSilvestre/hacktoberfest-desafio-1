const answers = document.querySelectorAll(".answer");
const question = document.getElementById("question");
const category = document.getElementById("category");
const corrects = document.getElementById("corrects");
const time = document.getElementById("time");
let arrayGQuestions = [];

// index

function getQuestions() {
  location.href = "./quiz.html";
}

// quiz

async function callQuestions() {
  const url =
    "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&encode=url3986";
  const response = await fetch(url);
  const result = await response.json();

  const questions = result.results;

  for (i of questions) {
    const decodedCategory = decodeURIComponent(i.category);
    const decodedCorrect = decodeURIComponent(i.correct_answer);
    const decodedQuestion = decodeURIComponent(i.question);
    let decodedIncs = [];

    for (ix of i.incorrect_answers) {
      const decodedInc = decodeURIComponent(ix);
      decodedIncs.push(decodedInc);
    }

    arrayGQuestions.push([
      decodedCategory,
      decodedQuestion,
      decodedCorrect,
      decodedIncs,
    ]);
  }
  return arrayGQuestions;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

async function putQuestions() {
  console.log(arrayGQuestions);
  const arrayQuestions = await callQuestions();

  const arrayAnswers = [...arrayQuestions[0][3], arrayQuestions[0][2]];
  shuffleArray(arrayAnswers);

  category.innerText = arrayQuestions[0][0];
  question.innerText = arrayQuestions[0][1];

  for (i in arrayAnswers) {
    answers[i].innerText = arrayAnswers[i];
  }

  const begin = Date.now();
  sessionStorage.setItem("begin", begin);
}

if (location.href.includes("quiz")) {
  window.addEventListener("load", putQuestions);
}

let acertou = 0;

answers.forEach((e) => {
  e.addEventListener("click", async (event) => {
    console.log(arrayGQuestions);
    for (i in arrayGQuestions) {
      if (i < 9 && question.innerText == arrayGQuestions[i][1]) {
        var currentIndex = Number(i) + 1;
      } else if (question.innerText == arrayGQuestions[9][1]) {
        const ending = Date.now();
        sessionStorage.setItem("ending", ending);
        location.href = "./results.html";
      }

      if (event.target.innerText == arrayGQuestions[i][2]) {
        acertou++;
        console.log(acertou);
      }
    }

    const arrayAnswers = [
      ...arrayGQuestions[currentIndex][3],
      arrayGQuestions[currentIndex][2],
    ];
    shuffleArray(arrayAnswers);

    category.innerText = arrayGQuestions[currentIndex][0];

    question.innerText = arrayGQuestions[currentIndex][1];

    for (i in arrayAnswers) {
      answers[i].innerText = arrayAnswers[i];
    }

    sessionStorage.setItem("corrects", acertou);
  });
});

// results

function getResults() {
  const ending = Number(sessionStorage.getItem("ending"));
  const beginning = Number(sessionStorage.getItem("begin"));
  const interval = (ending - beginning) / 1000;
  const correctAns = sessionStorage.getItem("corrects");
  console.log(ending);
  console.log(beginning);
  console.log(interval);

  time.innerText = `You concluded the quiz in ${interval} seconds`;
  corrects.innerText = `You got ${correctAns} right!`;
}

if (location.href.includes("results")) {
  window.addEventListener("load", getResults());
}
