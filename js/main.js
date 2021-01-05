// MAIN FUNCTIONS

///////////////////////////// GLOBAL VARIABLES /////////////////////////////////

let player1 = {
  name: 'Player 1',
  symbol: 'x',
  score: 0
}

let player2 = {
  name: 'Player 2',
  symbol: 'o',
  score: 0
}

let gameStatus = ['', '', '', '', '', '', '', '', ''];
let gameStatusId = ['', '', '', '', '', '', '', '', ''];
let gamePlay = false;
let currentPlayer = player1;
let oponentPlayer = player2;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let clickCount = 0;

// Invert squares function

const invertSquares = function () {

  for (let i = 0; i < 9; i++) {
    setTimeout(function() {
      $(`#${i}`).addClass('square-invert');
      $(`#${i}`).find('.content').addClass('content-invert');
      $('.board').addClass('board-invert');
    }, 25 * i);
  }

};

// Welcome sequence function - add

const welcomeSec = function () {

  invertSquares();
  for (let i = 0; i < 9; i++) {
    $(`#${i}`).find('.content').addClass('content-win');
  }

  $('#4').addClass('title').find('.content').addClass('title'); // change middle title square to blue
  $(`#4`).find('.content').html(`Welcome to <span style="font-style: italic; font-weight: 700;">Tic-Tac-Toe!</span>`);
  $('#message-board').text(`Giddy up! Pick a name to get started!`); // welcome message at bottom of page
  $(`#p1-name`).attr('style', 'display: block;'); // add in player 1 name form
  $(`#p2-name`).attr('style', 'display: block;'); // add in player 2 name form
  $(`#start-game`).attr('style', 'display: block;'); // add in player 2 name form

};

// Welcome sequence function - remove

const hideWelcomeSec = function () {

  $('#4').removeClass('title').find('.content').removeClass('title'); // remove title styling
  $(`#p1-name`).attr('style', 'display: none;'); // add in player 1 name form
  $(`#p2-name`).attr('style', 'display: none;'); // add in player 2 name form
  $(`#start-game`).attr('style', 'display: none;'); // add in player 2 name form

};

// Winner's square styling + message

let winnerSq1;
let winnerSq2;
let winnerSq3;

const winningSq = function (first, second, third) {
  $(`#${first}`).find('.content').addClass('content-invert content-win').html(`<span style="font-style: italic;">${winningMsg()}!</span>`);
  $(`#${second}`).find('.content').addClass('content-invert content-win').text(`${currentPlayer.name}, you won! 🥳`);
  $(`#${third}`).find('.content').addClass('content-invert content-win').text(`A point 4 u. Pls reset by clicking the board.`);
}

// Draw mode - invert squares to maroon function

const invertSquaresDraw = function () {

  for (let i = 0; i < 9; i++) {
    setTimeout(function() {
      $(`#${i}`).addClass('square-invert-alt');
      $(`#4`).find('.content').addClass('content-win').text(`Dangit. It's a draw. Click to play again. 🧐`);
    }, 25 * i);
  }
};

// Reset squares function

const resetSquares = function () {
  for (let i = 0; i < 9; i++) {
    setTimeout(function() {
      $(`#${i}`).removeClass('square-invert square-invert-alt');
      $(`#${i}`).find('.content').removeClass('content-win content-invert content-invert-alt');
      $('.board').removeClass('board-invert');
    }, 25 * i);
  }
};


//////////////////////////// WELCOME SEQUENCE //////////////////////////////////

// Landing, welcome screen with name allocation
$(`#4`).find('.content').addClass('content-win').text(`Loading...`);
$('#message-board').text(`Thinking... Pondering...`);

let welcome = true;

function welcomeScene() {

  setTimeout(function(){

    welcomeSec();

  }, 2300);

};

welcomeScene();

// Start game button function
$('#start-game').on('click', function () {

  player1.name = $('#p1-name').find('input').val(); // update player1 name to user input
  player2.name = $('#p2-name').find('input').val(); // update player2 name to user input

  $('#p1-name').text(`${player1.name}: `);
  $('#p2-name').text(`${player2.name}: `);

  welcome = false;
  nextPlayerTurn(currentPlayer); // initialises first message to indicate which player starts
  hideWelcomeSec();
  resetGame();

});

//////////////////////////////// MESSAGES //////////////////////////////////////

// Guidance message during game
const nextPlayerTurn = (player) => $('#message-board').text(`It's your turn, ${player.name}!`);

// Draw message
const drawMessage = () => $('#message-board').text(`It's a draw so no points this round 😭`);

// Winner's message
const winningMessages = ['You bloody beauty', 'Whoopee', 'Huzzah', 'w00t', 'Gnarly dude', 'Gee-whizz', 'Goshwow', 'Wicked', 'Ooft', 'Cowabunga'];

const winningMsg = function () {
  let randomIndex = Math.floor(Math.random() * winningMessages.length);
  return winningMessages[randomIndex];
}

const winMessage = function () {
  $('#message-board').text(`${winningMsg()}! You won this round ${currentPlayer.name}.`);
  winningSq(winnerSq1, winnerSq2, winnerSq3);
  invertSquares();
};

///////////////////////////// GAME VALIDATION //////////////////////////////////

const gameValidation = function () {

  let weHaveAWinner = false;
  let draw = !gameStatus.includes('');

  for (let i = 0; i < winningCombos.length; i++) {
    const winSequence = winningCombos[i];
    let a = [gameStatus[winSequence[0]], gameStatusId[winSequence[0]]];
    let b = [gameStatus[winSequence[1]], gameStatusId[winSequence[1]]];
    let c = [gameStatus[winSequence[2]], gameStatusId[winSequence[2]]];

    // console.log(`${a[0]}, ${b[0]}, ${c[0]}\nBREAK`);

    if (a[0] === '' || b[0] === '' || c[0] === '') {
      continue;
    }

    if (a[0] === b[0] && b[0] === c[0]) {
      winnerSq1 = a[1];
      winnerSq2 = b[1];
      winnerSq3 = c[1];
      weHaveAWinner = true;
      gamePlay = false;
      break
    }
  }

  if (weHaveAWinner === true) {
    winMessage();
    if (currentPlayer === player1){
      player1.score++
    }
    if (currentPlayer === player2){
      player2.score++
    }
  }

  else if (draw) {
    drawMessage();
    invertSquaresDraw();
    gamePlay = false;
    return;
  }

  $('#p1-score').text(player1.score);
  $('#p2-score').text(player2.score);
};

//////////////////////// FUNCTION IF SQUARE CLICKED ////////////////////////////

$('.square').on('click', function () {

  let squareId = Number(this.id);

// If the click is even, add an 'x' - Player 1
  if (gamePlay === true && clickCount % 2 === 0 && $(`#${squareId}`).find('.content').text() !== player1.symbol && $(`#${squareId}`).find('.content').text() !== player2.symbol) {

    $(`#${squareId}`).find('.content').text(player1.symbol);
    gameStatus[squareId] = player1.symbol;
    gameStatusId[squareId] = squareId;
    clickCount++;
    currentPlayer = player1;
    nextPlayerTurn(player2);
    gameValidation();
  }

// If the click is even, add an 'o' - Player 2
  else if (gamePlay === true && clickCount % 2 !== 0 && $(`#${squareId}`).find('.content').text() !== player1.symbol && $(`#${squareId}`).find('.content').text() !== player2.symbol) {

    $(`#${squareId}`).find('.content').text(player2.symbol);
    gameStatus[squareId] = player2.symbol;
    gameStatusId[squareId] = squareId;
    clickCount++;
    currentPlayer = player2;
    nextPlayerTurn(player1);
    gameValidation();
  }

  else if (gamePlay === false && welcome !== true) {
    resetGame();
  }

});

/////////////////////////////// RESET GAME /////////////////////////////////////

// General reset game function
  let resetGame = function () {
    gamePlay = true;
    $(`.square`).find('.content').text('');
    gameStatus = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = player1;
    nextPlayerTurn(player1);
    clickCount = 0;
    resetSquares();
  };

// Reset button click
  $('#reset').on('click', function () {
    resetGame();
  });

/////////////////////////// MISC STYLE FEATURES ////////////////////////////////

// Board tilt function
const tilt = $('.js-tilt').tilt()
tilt.on('change', function(e, transforms){});

// Entry sequence (tiles flicker to green then back to blue)
