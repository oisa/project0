// MAIN FUNCTIONS

///////////////////////////// GLOBAL VARIABLES /////////////////////////////////

let player1 = {
  name: 'Player 1',
  symbol: '❌',
  score: 0
}

let player2 = {
  name: 'Player 2',
  symbol: '⭕️',
  score: 0
}

let gamePlay = false;
let gameType = 'pvp';
let currentPlayer = player1;
let oponentPlayer = player2;
let availableOptions = []; // array for generating available options for computer selection
let compChoice;

let gameStatus = [
  ['', 0],
  ['', 1],
  ['', 2],
  ['', 3],
  ['', 4],
  ['', 5],
  ['', 6],
  ['', 7],
  ['', 8]
];

let gameStatusSingleArray = ['', '', '', '', '', '', '', '', '']; // draw condition on line 228 in game validation still using it as the new one isn't working with that method. Need to refactor.

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

///////////////////////////////// FUNCTIONS ////////////////////////////////////

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

// Welcome sequence function - SHOW
const welcomeSec = function () {

  invertSquares();

  for (let i = 0; i < 9; i++) {
    $(`#${i}`).find('.content').addClass('content-win');
  }

  $('#0, #2, #8').find('.content').addClass('welcome-xox').text('O');
  $('#1, #6').find('.content').addClass('welcome-xox').text('X');
  $('#4').addClass('square-title').find('.content').addClass('content-title').html(`Welcome to <span style="font-style: italic; font-weight: 700;">Tic-Tac-Toe!</span>`); // change middle title square to blue
  $('#p1-name, #p2-name, #start-game').attr('style', 'display: block;'); // show player names forms and start button
  $('#message-board').text(`Giddy up! Pick a name & symbol to get started!`); // welcome message at bottom of page

};

// Welcome sequence function - HIDE
const hideWelcomeSec = function () {

  $('#0, #2, #8').find('.content').removeClass('welcome-xox').text('O');
  $('#1, #6').find('.content').removeClass('welcome-xox').text('X');
  $('#4').removeClass('square-title').find('.content').removeClass('content-title'); // remove title styling
  $(`#p1-name, #p2-name, #start-game`).attr('style', 'display: none;'); // hide player names forms and start button
  $('#reset').attr('style', 'display: block;');

};

// Game type selection function with computer settings updated if chosen
$('.score-select').change(function() {

  gameType = $('.score-select').find('option:selected').data('value');

  if (gameType === 'pvc') {
    player2.name = 'c0put3r';
    player2.symbol = '👾';
    $('#p2-name-sb').text(`${player2.name}`);
    $('#p2-symbol-sb').text(`${player2.symbol}`);
    $('#p2-name-title').text(`You're versing the c0put3r`);
    $('#p2-name').find('input').attr('style', 'display: none;');
    $('#p2-symbol-title').addClass('symbol-title').text(`👾`);
    $('#p2-name').find('select').attr('style', 'display: none;');
  }

  else if (gameType === 'pvp') {
    player2.name = 'Player 2';
    player2.symbol = '⭕️';
    $('#p2-name-sb').text(`${player2.name}`);
    $('#p2-symbol-sb').text(`${player2.symbol}`);
    $('#p2-name-title').text(`Player 2 name:`);
    $('#p2-name').find('input').val('c0put3r');
    $('#p2-name').find('input').attr('style', 'display: block;').val('');
    $('#p2-symbol-title').removeClass('symbol-title').text(`What's yo flava?`);
    $('#p2-name').find('select').attr('style', 'display: block;');
  };

});

// Determine player names and symbols

// Upon changing the options dynamically as user inputs each

// Player 1
$('#p1-symbol-select').change(function() {

  player1.symbol = $('#p1-symbol-select option:selected').text();
  $('#p1-symbol-sb').text(`${player1.symbol}`);

});

$('#p1-name').find('input').on('keyup', function () {

  player1.name = $('#p1-name').find('input').val();
  $('#p1-name-sb').text(`${player1.name}`);

});

// Player 2
$('#p2-symbol-select').change(function() {

  if (gameType === 'pvp') { // must be pvp to action anything
    player2.symbol = $('#p2-symbol-select option:selected').text();
    $('#p2-symbol-sb').text(`${player2.symbol}`);
  };

});

$('#p2-name').find('input').on('keyup', function () {

  if (gameType === 'pvp') { // must be pvp to action anything
    player2.name = $('#p2-name').find('input').val();
    $('#p2-name-sb').text(`${player2.name}`);
  };

});


// Upon clicking the start button
const updatePlayerInfo = function () {

  let p1Name = $('#p1-name').find('input').val();
  let p2Name = $('#p2-name').find('input').val();

  player1.symbol = $('#p1-symbol-select option:selected').text();

  if (p1Name === '') {
    player1.name = 'Player 1';
  }

  else {
    player1.name = p1Name; // update player1 name with user input
  }

  if (gameType === 'pvp') { // if player vs player mode selected

    if (p2Name === '') {
      player2.name = 'Player 2'; // if blank, make name 'Player 2'
    }

    else {
      player2.name = p2Name; // update player2 name with user input
    }

  }

};

// Start game button function
$('#start-game').on('click', function () {

  updatePlayerInfo();
  nextPlayerTurn(currentPlayer); // initialises first message to indicate which player starts
  hideWelcomeSec();
  welcome = false;

});

// Winner's square styling + message
let winnerSq1;
let winnerSq2;
let winnerSq3;

const winningSq = function (first, second, third) {

  $(`#${first}`).find('.content').addClass('content-invert content-win').html(`<span style="font-style: italic;">${randomise(winningMessages)}!</span>`);
  $(`#${second}`).find('.content').addClass('content-invert content-win').text(`${currentPlayer.name}, you won! 🥳`);
  $(`#${third}`).find('.content').addClass('content-invert content-win').text(`A point 4 u. Pls reset by clicking the board.`);

};

// Draw game mode - invert squares to maroon function
const invertSquaresDraw = function () {

  for (let i = 0; i < 9; i++) {
    setTimeout(function() {
      $(`#${i}`).addClass('square-invert-alt');
      $(`#4`).find('.content').addClass('content-win').text(`Dangit! It's a draw. Click to play again. 🧐`);
    }, 25 * i);
  }

};

// Randomise function
const randomise = function (array) {
  let randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Determine available options after selection
const updateAvailableOptions = function () {

  availableOptions = [];

  for (let i = 0; i < gameStatus.length; i++) {
    if (gameStatus[i][0] === '') {
      availableOptions.push(gameStatus[i][1]);
    }
  };

};

// Reset squares function
const resetSquares = function () {
  for (let i = 0; i < 9; i++) {
    setTimeout(function() {
      $(`#${i}`).removeClass('square-title square-invert square-invert-alt');
      $(`#${i}`).find('.content').removeClass('content-title content-win content-invert content-invert-alt');
      $('.board').removeClass('board-invert');
    }, 25 * i);
  }
};


//////////////////////////// WELCOME SEQUENCE //////////////////////////////////

// Landing, welcome screen with name allocation
$(`#4`).find('.content').addClass('content-title').text(`Loading...`);
$('#message-board').text(`Thinking... Pondering...`);

let welcome = true;

function welcomeScene() {

  setTimeout(function(){

    welcomeSec();

  }, 1100);

};

welcomeScene();

///////////////////////////// GAME MESSAGES ////////////////////////////////////

// Guidance message during game
const nextPlayerTurn = (player) => $('#message-board').text(`It's your turn, ${player.name}!`);

// Draw message
const drawMessage = () => $('#message-board').text(`No points this round 😭`);

// Winner's message
const winningMessages = ['You bloody beauty', 'Whoopee', 'Huzzah', 'w00t', 'Gnarly dude', 'Gee-whizz', 'Goshwow', 'Wicked', 'Ooft', 'Cowabunga'];

const winMessage = function () {
  $('#message-board').text(`${randomise(winningMessages)}! You won this round ${currentPlayer.name}.`);
  winningSq(winnerSq1, winnerSq2, winnerSq3);
  invertSquares();
};

///////////////////////////// GAME VALIDATION //////////////////////////////////

const gameValidation = function () {

  let weHaveAWinner = false;
  let draw = !gameStatusSingleArray.includes('');

  for (let i = 0; i < winningCombos.length; i++) {
    const winSequence = winningCombos[i];
    let a = [gameStatus[winSequence[0]]];
    let b = [gameStatus[winSequence[1]]];
    let c = [gameStatus[winSequence[2]]];

    // console.log(`${a[0]}, ${b[0]}, ${c[0]}\nBREAK`);
    //
    // console.log(gameStatus);

    if (a[0][0] === '' || b[0][0] === '' || c[0][0] === '') {
      continue;
    }

    if (a[0][0] === b[0][0] && b[0][0] === c[0][0]) {
      winnerSq1 = a[0][1];
      winnerSq2 = b[0][1];
      winnerSq3 = c[0][1];
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
  let clickedSq = $(`#${squareId}`).find('.content');

// Player 1 - If the click is even, add an 'x' - Player 1
  if (gamePlay === true && clickCount % 2 === 0 && clickedSq.text() !== player1.symbol && clickedSq.text() !== player2.symbol) {

    clickedSq.html(player1.symbol);
    gameStatusSingleArray[squareId] = player1.symbol;
    gameStatus[squareId][0] = player1.symbol; // testing new array solution
    clickCount++;
    currentPlayer = player1;
    nextPlayerTurn(player2);
    updateAvailableOptions();
    gameValidation();

// Computer player - generate random result based off availableOptions
      if (gamePlay === true && clickCount % 2 !== 0 && gameType === 'pvc') {

        compChoice = randomise(availableOptions); // randomised selection for computer

        setTimeout(function(){

          $(`#${compChoice}`).find('.content').html(player2.symbol);
          gameStatusSingleArray[compChoice] = player2.symbol;
          gameStatus[compChoice][0] = player2.symbol;
          clickCount++;
          currentPlayer = player2;
          nextPlayerTurn(player1);
          updateAvailableOptions();
          gameValidation();

        }, 450);

      }

  }

// Player 2 - If the click is even, add an 'o'
  else if (gamePlay === true && clickCount % 2 !== 0 && clickedSq.text() !== player1.symbol && clickedSq.text() !== player2.symbol && gameType === 'pvp') {

    clickedSq.html(player2.symbol);
    gameStatusSingleArray[squareId] = player2.symbol;
    gameStatus[squareId][0] = player2.symbol;
    clickCount++;
    currentPlayer = player2;
    nextPlayerTurn(player1);
    updateAvailableOptions();
    gameValidation();

  }

  else if (gamePlay === false && welcome === false) {
    resetGame();
  }

});

/////////////////////////////// RESET GAME /////////////////////////////////////

// General reset game function
  let resetGame = function () {
    gamePlay = true;
    $(`.square`).find('.content').text('');
    gameStatusSingleArray = ['', '', '', '', '', '', '', '', ''];
    gameStatus = [
      ['', 0],
      ['', 1],
      ['', 2],
      ['', 3],
      ['', 4],
      ['', 5],
      ['', 6],
      ['', 7],
      ['', 8]
    ];
    currentPlayer = player1;
    nextPlayerTurn(player1);
    clickCount = 0;
    resetSquares();
  };

// Reset button click
  $('#reset').on('click', function () {
    invertSquares();

    setTimeout(function(){
      resetGame();
    }, 450);
  });

/////////////////////////// MISC STYLE FEATURES ////////////////////////////////

// Board tilt function
const tilt = $('.js-tilt').tilt()
tilt.on('change', function(e, transforms){});

// Entry sequence (tiles flicker to green then back to blue)
