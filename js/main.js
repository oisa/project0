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
  let gamePlay = true;
  let currentPlayer = player1;
  let oponentPlayer = player2;

// Messages
  const winningMessages = ['Cowabunga', 'Whoopee', 'Huzzah', 'w00t', 'Gnarly dude', 'Gee-whizz', 'Goshwow', 'Wicked'];
  let randomNum = () => Math.round(Math.random() * 10);

  const drawMessage = () => $('#message-board').text(`Would you look at that. It's a draw!`);
  const nextPlayerTurn = (player) => $('#message-board').text(`It's your turn, ${player.name}!`);
  const winMessage = function () {
    $('#message-board').text(`${winningMessages[randomNum()]}! You won this round ${currentPlayer.name}!`);



  };

  nextPlayerTurn(currentPlayer);

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

///////////////////////////// GAME VALIDATION //////////////////////////////////

const gameValidation = function () {

  let weHaveAWinner = false;

  for (let i = 0; i < winningCombos.length; i++) {
    const winSequence = winningCombos[i];
    let a = [gameStatus[winSequence[0]], gameStatusId[winSequence[0]]];
    let b = [gameStatus[winSequence[1]], gameStatusId[winSequence[1]]];
    let c = [gameStatus[winSequence[2]], gameStatusId[winSequence[2]]];

    console.log(`${a}, ${b}, ${c}\nBREAK`);

    if (a[0] === '' || b[0] === '' || c[0] === '') {
      continue;
    }

    if (clickCount === 9 && a[0] !== b[0] && b[0] !== c[0]) {
      drawMessage();
      gamePlay = false;
      break
    }

    if (a[0] === b[0] && b[0] === c[0]) {
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

  $('#p1-score').text(player1.score);
  $('#p2-score').text(player2.score);
}

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

  else if (gamePlay === false) {
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
};

// Reset button click
$('#reset').on('click', function () {
  resetGame();
});

/////////////////////////// MISC STYLE FEATURES ////////////////////////////////

// Board tilt function
const tilt = $('.js-tilt').tilt()
tilt.on('change', function(e, transforms){});
