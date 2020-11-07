const answers = document.querySelectorAll(".answer");
const question = document.getElementById("question");
const category = document.getElementById("category");
const corrects = document.getElementById("corrects");
let arrayGQuestions = [];

async function callQuestions() {
    const url = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&encode=url3986"
    const response = await fetch(url);
    const result = await response.json();

    const questions = result.results;
    /* let arrayQuestions = []; */

    for (i of questions) {
        const decodedCategory = decodeURIComponent(i.category)
        const decodedCorrect = decodeURIComponent(i.correct_answer);
        const decodedQuestion = decodeURIComponent(i.question)
        let decodedIncs = []

        for (ix of i.incorrect_answers) {
            const decodedInc = decodeURIComponent(ix);
            decodedIncs.push(decodedInc);
        }

        arrayGQuestions.push([decodedCategory, decodedQuestion, decodedCorrect, decodedIncs])
        
    }
    return arrayGQuestions;
}

/* window.addEventListener("load", callQuestions()) */

if (location.href.includes("index")) {

}


function getQuestions() {
    location.href = "./quizz.html"
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
    console.log(arrayGQuestions)
    const arrayQuestions = await callQuestions();

    const arrayAnswers = [...arrayQuestions[0][3], arrayQuestions[0][2]];
    /* arrayAnswers.sort(() => 0.5 - Math.random()) */
    shuffleArray(arrayAnswers)
 
    category.innerText = arrayQuestions[0][0]

    question.innerText = arrayQuestions[0][1]

    for (i in arrayAnswers) {
        answers[i].innerText = arrayAnswers[i];
    }
    
}

if (location.href.includes("quizz")) {
    window.addEventListener("load", putQuestions)

}

/* arrayAnswers.sort(() => 0.5 - Math.random()) */
let acertou = 0

answers.forEach(e => {
    e.addEventListener("click", async event => {
        console.log(arrayGQuestions)
        for (i in arrayGQuestions) {
            if (i < 9 && question.innerText == arrayGQuestions[i][1]) {
                var currentIndex = Number(i) + 1;
                
            } else if (question.innerText == arrayGQuestions[9][1]) {
                location.href = "./results.html"
            }

            if (event.target.innerText == arrayGQuestions[i][2]) {
                acertou++
                console.log(acertou)
            }
        }

        /* answers.forEach( e => {
            e.innerText = ""
        }) */

        const arrayAnswers = [...arrayGQuestions[currentIndex][3], arrayGQuestions[currentIndex][2]];
        shuffleArray(arrayAnswers)
    
        category.innerText = arrayGQuestions[currentIndex][0]

        question.innerText = arrayGQuestions[currentIndex][1]

        for (i in arrayAnswers) {
            answers[i].innerText = arrayAnswers[i];
        }

        sessionStorage.setItem("corretas", acertou)
    })


})


function getResults() {
    const acertou2 = sessionStorage.getItem("corretas")
    corrects.innerText = `Você acertou ${acertou2} questões`
}

if (location.href.includes("results")) {
    window.addEventListener("load", getResults())

}