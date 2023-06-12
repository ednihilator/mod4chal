var timerEl = document.querySelector(".countdown");
var questionCard = document.querySelector(".question");
var quizBtn = document.querySelector("#button-start");
var scoreBtn = document.querySelector("#button-score");
var resetScoreBtn = document.querySelector("#button-reset-score");

var questionsContainer = document.querySelector("#questions-container");
var scoreContainer = document.querySelector("#score-container");
var initialForm = document.querySelector(".initials-form");
var initialBtn = document.querySelector("#button-initials");
var timerStop = false;

var initials = localStorage.getItem("info");
var infoInputArray = [];
var infoArray = [];
var gameOver = false;

// var scoreEntry = JSON.parse(localStorage.getItem("info"));

var questionIndex = 0;
var timeLeft = 75;
var score = 0;

//the question array contains all my questions and answers, and the correct answer as objects
var questionArray = [
  {
    question: "What is Javascript?",
    answers: [
      "A car manufacturer",
      "A programming language",
      "A donut vendor",
      "A travel company",
    ],
    correct: 1,
  },
  {
    question: "What word do you use to declare a variable in JS?",
    answers: ["Declare", "function", "var", "hello world"],
    correct: 2,
  },
  {
    question: "How do we compare two different values for data type and value?",
    answers: ["=", "==", "!=", "==="],
    correct: 3,
  },
  {
    question: "What do we call a data type made of at least one letter?",
    answers: ["string", "boolean", "integer", "object"],
    correct: 0,
  },
  {
    question: "Where do we declare our variables in a Javascript file?",
    answers: ["middle", "right before they're used", "top", "bottom"],
    correct: 2,
  },
  {
    question:
      "What kind of notation do we use to access an object's attributes and methods?",
    answers: [
      "data notation",
      "variable notation",
      "object notation",
      "dot notation",
    ],
    correct: 3,
  },
  {
    question: "What types of events can an event listener look for?",
    answers: [
      "clicks",
      "double clicks",
      "hover",
      "keyboard clicks",
      "all of the above",
      "options 1,2, and 4",
    ],
    correct: 5,
  },
];

timerEl.textContent = timeLeft;
//my timer function
function countdown() {
  var timeInterval = setInterval(function () {
    if (timerStop === false) {
      timeLeft--;
      timerEl.textContent = timeLeft;
    }

    if (timeLeft <= 0) {
      // Stops execution of action at set interval
      clearInterval(timeInterval);
    }
  }, 1000);
}
//this hides an element that's unneeded at the time
function hideElement(element) {
  element.style.display = "none";
}
//this shows an element that was hidden
function showElement(element) {
  element.style.display = "block";
}
//this function displays questions, and will display a new question if right/wrong and update your score
function displayQuestion() {
  hideElement(scoreContainer);
  console.log(questionCard);
  console.log("question index is " + questionIndex);
  //the next two lines show the current question, then removes it
  questionCard.textContent = questionArray[questionIndex].question;

  questionsContainer.innerHTML = "";
  //this for loop displays the next question, and adds answer buttons as children to the answers
  for (
    let index = 0;
    index < questionArray[questionIndex].answers.length;
    index++
  ) {
    var answer = questionArray[questionIndex].answers[index];
    //creates a list item for all the answer items
    var answerListItem = document.createElement("li");
    answerListItem.classList.add("answer");

    var answerButton = document.createElement("button");
    answerButton.classList.add("button-answer");
    answerButton.innerText = answer;
    answerButton.setAttribute("data-index", index);

    answerListItem.appendChild(answerButton);

    questionsContainer.appendChild(answerListItem);
    //this checks the button next to the answer
    answerButton.addEventListener("click", function (event) {
      var clickedAnswer = event.currentTarget.dataset.index;
      clickedAnswer = parseInt(clickedAnswer, 10);
      //this if statement compares users selected answer with the list of answers
      if (
        clickedAnswer === questionArray[questionIndex].correct &&
        questionIndex < questionArray.length - 1
      ) {
        //adds to your score and moves to next question
        questionIndex++;
        score++;
        console.log("score is " + score);
        displayQuestion();
        //this checks for the end conditions of the game via timer and question length
      } else if (
        clickedAnswer !== questionArray[questionIndex].correct &&
        questionIndex < questionArray.length - 1
      ) {
        //moves to next question while not adding to your score, and subtracting 5 seconds
        questionIndex++;
        displayQuestion();
        //console.log("false");
        timeLeft -= 5;
      } else if (
        (clickedAnswer !== questionArray[questionIndex].correct &&
          questionIndex === questionArray.length - 1) ||
        timeLeft <= 0
      ) {
        //moves to next question while not adding to your score, and subtracting 5 seconds

        quizOver();
      } else if (questionIndex === questionArray.length - 1 || timeLeft <= 0) {
        console.log("this is the end of the quiz");
        quizOver();
      }
    });
  }
}
//resets the score
function resetScore() {
  localStorage.clear();
  score = 0;
}
//this function removes the start quiz button after it starts
function removeBtn() {
  var elem = document.getElementById("button-start");
  elem.parentNode.removeChild(elem);
  // document.getElementById("button-start").disabled = true;
  return false;
}
//this function displays the scores, however needs more fine tuning
function viewScore() {
  //trying make all the score into a list item
  var scoreDisplay = document.createElement("div");
  var scoreListContainer = document.createElement("li");
  scoreListContainer.innerText = infoArray;
  scoreDisplay.appendChild(scoreListContainer);
  scoreDisplay.innerHTML = initials;
  //scoreDisplay.classList.add("score-style");
  scoreDisplay = document.getElementById("score-container");
  for (let index = 0; index < infoArray.length; index++) {
    scoreDisplay.textContent =
      infoArray[index][0] + " " + infoArray[index][1] + " out of 7";
  }
  console.log("score entry value is " + scoreDisplay);
  showElement(scoreContainer);
}
//this ends the quiz, stops the timer, and prompts you to enter your initials
function quizOver() {
  if (timeLeft <= 0 || questionIndex === questionArray.length) {
    gameOver = true;
  }
  timerStop = true;
  questionCard.textContent = "";
  questionsContainer.innerHTML =
    "Your score is " + score + ", please enter your initials";

  showElement(initialForm);
}
//this function starts displaying questions, the timer, and removes the start button
function startQuiz() {
  displayQuestion();
  countdown();
  removeBtn();
}

hideElement(initialForm);

//quizBtn starts the quiz
quizBtn.addEventListener("click", startQuiz);
//scoreBtn allosws the user to view scores
scoreBtn.addEventListener("click", viewScore);
//initialBtn allows the user to input their initials
initialBtn.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Submit button works for initials");
  //this takes the input from the initials form
  initials = document.querySelector("#inputInitials").value;
  //this takes that input and stores it with a score
  infoInputArray = [initials, score];
  //this updates my info array with info in local storage
  infoArray = JSON.parse(localStorage.getItem("info"));
  //this pushes that new score and initials into an array of many scores and initials
  infoArray.push(infoInputArray);
  //this is adding the new info into the local storage
  localStorage.setItem("info", JSON.stringify(infoArray));
});

// document.querySelector("form").addEventListener("submit", function (event) {
//   event.preventDefault();
//   console.log("Submit button works for initials");

//   initials = document.querySelector("#inputInitials").value;

//   localStorage.setItem("info", JSON.stringify([initials, score]));
//   console.log("My initials info is " + initials);
//   initials = JSON.parse(localStorage.getItem("info"));
// });
