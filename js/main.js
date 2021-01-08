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

let gamePlay = false; // Used to determine functions from clicks on the board squares (i.e. game play or welcome screen or reset board function)
let gameType = 'pvp'; // Used to distinguish logic beween Player vs Player and Player vs c0mput3r game modes
let currentPlayer = player1; // Determines current player, used for messages predominantly
let oponentPlayer = player2;
let availableOptions = []; // Array for generating available options for computer selection
let compChoice; // Variable to represent c0mput3r choice
let clickCount = 0; // Count clicks to determine which player is able to select an available square

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

let gameStatusSingleArray = ['', '', '', '', '', '', '', '', '']; // used only for draw condition on 391. Will refactor to use gameStatus

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


///////////////////////////////// FUNCTIONS ////////////////////////////////////

//////////////////////// RETRIEVE FROM LOCAL STORAGE ///////////////////////////

// Retrieve the object from storage alongside function to update existing object
let retrievedObjectPlayer1 = JSON.parse(localStorage.getItem('player1'));
let retrievedObjectPlayer2 = JSON.parse(localStorage.getItem('player2'));

const updateScoresFromLocalStorage = function () {

  if (retrievedObjectPlayer1 !== null) { // only update information if there is anything stored in Local Storage

    if(retrievedObjectPlayer1.score >= player1.score || retrievedObjectPlayer2.score >= player2.score || player1.symbol !== retrievedObjectPlayer1.symbol || player2.symbol !== retrievedObjectPlayer1.symbol) {

      player1 = retrievedObjectPlayer1; // Update player objects in DOM with one present in Local Storage
      player2 = retrievedObjectPlayer2;

      $('#p1-score').text(player1.score); // Update player scores on scoreboard
      $('#p2-score').text(player2.score);

      $('#p1-name-sb').text(`${player1.name}`); // Update player names on scoreboard
      $('#p2-name-sb').text(`${player2.name}`);

      $('#p1-symbol-sb').text(`${player1.symbol}`); // Update player symbols on start if previously set
      $('#p2-symbol-sb').text(`${player2.symbol}`);

    }

  }

};

updateScoresFromLocalStorage(); // run this function on page load


//////////////////////// WELCOME SEQUENCE FUNCTIONS ////////////////////////////

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

// Landing, welcome screen with name allocation
$(`#4`).find('.content').addClass('content-title').html(`<p>Loading...</p>`);
$('#message-board').text(`Thinking... Pondering...`);

let welcome = true;

// Set delay for welcome sequence to occur for deliberate UX purpose
function welcomeScene() {

  setTimeout(function(){
    welcomeSec();
  }, 1100);

};

welcomeScene();

// Welcome sequence function - Show
const welcomeSec = function () {

  invertSquares();

  for (let i = 0; i < 9; i++) {
    $(`#${i}`).find('.content').addClass('content-win');
  }

  $('#0, #8').find('.content').addClass('welcome-xox').text('O');
  $('#2, #6').find('.content').addClass('welcome-xox').text('X');
  $('#4').addClass('square-title').find('.content').addClass('content-title').html(`Welcome to <span style="font-style: italic; font-weight: 700;">Tic-Tac-Toe!</span>`); // change middle title square to blue
  $('#p1-info, #p2-info, #start-game').attr('style', 'display: block;'); // show player names forms and start button
  $('#p1-info, #p2-info, #start-game, #game-select-section').attr('style', 'display: block;'); // show player names forms and start button
  $('#message-board').text(`Pick a name & symbol to get started!`); // welcome message at bottom of page

};

// Welcome sequence function - Hide
const hideWelcomeSec = function () {

  $('#0, #8').find('.content').removeClass('welcome-xox').text('O');
  $('#2, #6').find('.content').removeClass('welcome-xox').text('X');
  $('#4').removeClass('square-title').find('.content').removeClass('content-title'); // Remove title styling
  $(`#p1-info, #p2-info, #start-game, #game-select-section`).attr('style', 'display: none;'); // Hide player names forms and start button
  $('#reset').attr('style', 'display: block;');

};

////////////////////////// GAME TYPE DETERMINATION /////////////////////////////

// Game type selection function with computer settings updated if chosen
const restoreSettingsComputer = function () {

  player2.name = 'c0mput3r';
  player2.symbol = '👾';
  $('#p2-name-sb').text(`${player2.name}`);
  $('#p2-symbol-sb').text(`${player2.symbol}`);
  $('#p2-name-title').text(`You're versing the c0mput3r`);
  $('#p2-info').find('input').attr('style', 'display: none;');
  $('#p2-symbol-title').addClass('symbol-title').text(`👾`);
  $('#p2-info').find('select').attr('style', 'display: none;');
  resetScores();

};

const restoreSettingsPlayer = function () {

  player2.name = 'Player 2';
  player2.symbol = $('#p2-symbol-select option:selected').text();
  $('#p2-name-sb').text(`${player2.name}`);
  $('#p2-symbol-sb').text(`${player2.symbol}`);
  $('#p2-name-title').text(`Player 2 name:`);
  $('#p2-info').find('input').attr('style', 'display: inline-block;').val('');
  $('#p2-symbol-title').removeClass('symbol-title').text(`What's yo flava?`);
  $('#p2-info').find('select').attr('style', 'display: block;');
  resetScores();

};

// Change game type if selected via dropdown on welcome screen
$('#game-select-welcome').change(function () {

  gameType = $('#game-select-welcome').find('option:selected').data('value');
  $('#game-select-footer').val(`${gameType}`);

  if (gameType === 'pvc') {
    restoreSettingsComputer();
  }

  else if (gameType === 'pvp') {
    restoreSettingsPlayer();
  };

});

// Change game type if selected via dropdown in the footer
$('#game-select-footer').change(function () {

  gameType = $('#game-select-footer').find('option:selected').data('value');
  $('#game-select-welcome').val(`${gameType}`);

  if (gameType === 'pvc') {
    restoreSettingsComputer();
  }

  else if (gameType === 'pvp') {
    restoreSettingsPlayer();
  };

});


////////////////////// DETERMINE NAMES AND SYMBOLS /////////////////////////////

// Player 1 - dynamic name and symbol input print to scoreboard
$('#p1-info').find('input').on('keyup', function () { // Name

  player1.name = $('#p1-info').find('input').val();
  $('#p1-name-sb').text(`${player1.name}`);

});

$('#p1-symbol-select').change(function () { // Symbol

  player1.symbol = $('#p1-symbol-select option:selected').text();
  $('#p1-symbol-sb').text(`${player1.symbol}`);

});

// Player 2 - dynamic name and symbol input print to scoreboard
$('#p2-info').find('input').on('keyup', function () { // Name

  if (gameType === 'pvp') { // game mode must be pvp to action anything for Player 2
    player2.name = $('#p2-info').find('input').val();
    $('#p2-name-sb').text(`${player2.name}`);
  };

});

$('#p2-symbol-select').change(function () { // Symbol

  if (gameType === 'pvp') { // game mode must be pvp to action anything for Player 2
    player2.symbol = $('#p2-symbol-select option:selected').text();
    $('#p2-symbol-sb').text(`${player2.symbol}`);
  };

});

// Updating object for Player 1 name & symbol and condition if no name is entered
const updatePlayerInfo = function () {

  let p1Name = $('#p1-info').find('input').val();
  let p2Name = $('#p2-info').find('input').val();

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

  $(`#${first}`).find('.content').addClass('content-invert content-win').html(`<p class="win-symbol-place">${currentPlayer.symbol}</p><span style="font-style: italic;">${randomise(winningMessages)}!</span>`);

  $(`#${second}`).find('.content').addClass('content-invert content-win').html(`<p class="win-symbol-place">${currentPlayer.symbol}</p>${currentPlayer.name}, you won! 🥳`);

  $(`#${third}`).find('.content').addClass('content-invert content-win').html(`<p class="win-symbol-place">${currentPlayer.symbol}</p>1x point for you, ${currentPlayer.name}<div id="new-game-button">Play again!</div>`);

};

// Draw game mode - invert squares to maroon function
const invertSquaresDraw = function () {

  for (let i = 0; i < 9; i++) {
    setTimeout(function() {
      $(`#${i}`).addClass('square-invert-alt');
      $(`#4`).find('.content').addClass('content-win').html(`Dangit! 🧐 <div id="new-game-button">Play again!</div>`);
    }, 25 * i);
  }

};

// Randomise function
const randomise = function (array) {

  let randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];

};

// Determine available options after selection
const updateAvailableOptions = function () {

  availableOptions = [];

  for (let i = 0; i < gameStatus.length; i++) {
    if (gameStatus[i][0] === '') {
      availableOptions.push(gameStatus[i][1]);
    }
  };

};

// Reset scores function
const resetScores = function () {

// Update player objects with reset score values
  player1.score = 0; // Update player scores in object to zero
  player2.score = 0;

// Update scoreboard with reset values
  $('#p1-score').text(player1.score); // Update player scores on scoreboard
  $('#p2-score').text(player2.score);

// Update the object in Local Storage
  localStorage.setItem('player1', JSON.stringify(player1));
  localStorage.setItem('player2', JSON.stringify(player2));

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

// Update player scores on scoreboard
  $('#p1-score').text(player1.score);
  $('#p2-score').text(player2.score);

// Update the object in Local Storage
  localStorage.setItem('player1', JSON.stringify(player1));
  localStorage.setItem('player2', JSON.stringify(player2));
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
    resetScores();
  }, 450);

});


/////////////////////////// MISC STYLE FEATURES ////////////////////////////////

// Board tilt function
const tilt = $('.js-tilt').tilt()
tilt.on('change', function(e, transforms){});
