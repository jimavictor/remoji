const emojis = [...document.querySelectorAll(".emoji")];
const imageOverlays = [...document.querySelectorAll(".overlay")];
const minuteSide = document.querySelector("#minutes");
const header = document.querySelector("#header");
const secondSide = document.querySelector("#seconds");
const main = document.querySelector("#main");
const scoreCard = document.querySelector(".score-card");
const totalMoves = document.querySelector(".total-moves");
const totalMinutes = document.querySelector("#total-minutes");
const totalSeconds = document.querySelector("#total-seconds");
const menuContainer = document.querySelector(".menu-container");
const menu = document.querySelector(".menu");
const nightMode = document.querySelector(".night-mode");
const brightness = document.querySelector(".brightness");
const startButton = document.querySelector("#start");
const moveCount = document.querySelector("#move-count");
let cardsMatched = 0;
let darkMode = localStorage.getItem("darkMode");
let seconds = 0;

let moves = 0;

const item = [
  "&#128513;",
  "&#128514;",
  "&#128519;",
  "&#128523;",
  "&#128580;",
  "&#128526;",
  "&#128522;",
  "&#128540;",
];

let arrayOfRandomIndices = generateSetOfRandomNumbers();
let matchBox = [];
let index = 0;
let startTimer;

if (darkMode == "true") {
  addDarkMode();
}

window.onload = function () {
  generateSetOfRandomNumbers();
  shuffleCards();
  moves = 0;
  moveCount.innerText = moves;
};

brightness.addEventListener("click", () => {
  removeDarkMode();
});

nightMode.addEventListener("click", () => {
  addDarkMode();
});

startButton.addEventListener("click", () => {
  menuContainer.style.display = "none ";
  imageOverlays.forEach((element) => {
    element.style.pointerEvents = "auto";
    element.style.cursor = "pointer";
  });
  main.style.opacity = "1";
  startTimer = setInterval(runtime, 1000);
});

imageOverlays.forEach((overlay) => {
  overlay.addEventListener("click", verifyMatchHandler);
});

function generateSetOfRandomNumbers() {
  let randNumbers = new Set();
  while (randNumbers.size != 16) {
    randNumbers.add(Math.floor(Math.random() * 16));
  }
  return [...randNumbers];
}

function shuffleCards() {
  for (let i = 0; i < item.length; i++) {
    for (let j = 0; j < 2; j++) {
      emojis[arrayOfRandomIndices[index]].innerHTML = item[i];
      index += 1;
    }
  }
}

function runtime() {
  seconds++;
  let secondsValue = seconds % 60;
  let minutesValue = parseInt(seconds / 60);

  // update the seconds count
  if (secondsValue.toString().length == 1) {
    secondSide.innerText = "0" + secondsValue.toString();
  } else {
    secondSide.innerText = secondsValue.toString();
  }

  // update the minutes count
  if (minutesValue.toString().length == 1) {
    minuteSide.innerText = "0" + minutesValue.toString();
  } else {
    minuteSide.innerText = minutesValue.toString();
  }
}

function verifyMatch(overlay) {
  // reveal the card
  overlay.classList.add("clicked");
  // disable click
  overlay.removeEventListener("click", verifyMatchHandler);
  matchBox.push(overlay);

  if (matchBox.length == 2) {
    // update the moves
    moves = moves + 1;
    moveCount.innerText = moves.toString();

    // compare the two emojis
    let emojiOne = matchBox[0].previousElementSibling.innerText;
    let emojiTwo = matchBox[1].previousElementSibling.innerText;

    if (emojiOne == emojiTwo) {
      matchBox.length = 0;
      cardsMatched++;

      // check if all cards have been revealed
      if (cardsMatched == 8) {
        endGame();
      }
    } else {
      imageOverlays.forEach((item) => {
        item.style.pointerEvents = "none";
      });

      setTimeout(() => {
        matchBox.forEach((item) => {
          item.classList.remove("clicked");
        });

        matchBox.forEach((element) => {
          element.addEventListener("click", verifyMatchHandler);
        });

        matchBox.length = 0;

        imageOverlays.forEach((item) => {
          item.style.pointerEvents = "auto";
        });
      }, 500);
    }
  }
}

function addDarkMode() {
  darkMode = localStorage.setItem("darkMode", "true");
  header.classList.add("darkmode");
  main.classList.add("darkmode");
  scoreCard.classList.add("darkmode");
  nightMode.style.display = "none";
  brightness.style.display = "inline";
  menu.classList.add("darkmode");
  document.getElementsByTagName("body")[0].style.backgroundColor = "#202c37";
}

function removeDarkMode() {
  darkMode = localStorage.setItem("darkMode", "false");
  brightness.style.display = "none";
  nightMode.style.display = "inline";
  header.classList.remove("darkmode");
  main.classList.remove("darkmode");
  scoreCard.classList.remove("darkmode");
  document.getElementsByTagName("body")[0].style.backgroundColor = "white";
  menu.classList.remove("darkmode");
}

function verifyMatchHandler(event) {
  verifyMatch(event.target);
}

function endGame() {
  clearInterval(startTimer);
  main.style.display = "none";
  totalMoves.innerText = moves;
  totalMinutes.innerText = minuteSide.innerText;
  totalSeconds.innerText = secondSide.innerText;
  imageOverlays.forEach((element) => {
    element.style.pointerEvents = "none";
    element.style.cursor = "auto";
  });
  scoreCard.style.display = "block";
  scoreCard.style.opacity = "1";
  main.style.opacity = "0";
  menuContainer.style.display = "none";
}
