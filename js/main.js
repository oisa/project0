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
  let gamePlay = true;
  let currentPlayer = player1;
  let oponentPlayer = player2;

// Messages
  const drawMessage = () => $('#message-board').text(`It's a draw!`);
  const nextPlayerTurn = (player) => $('#message-board').text(`It's your turn, ${player.name}!`);
  const winMessage = () => $('#message-board').text(`Cowabunga, you won this round ${currentPlayer.name}!`);

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
    let a = gameStatus[winSequence[0]];
    let b = gameStatus[winSequence[1]];
    let c = gameStatus[winSequence[2]];

    if (a === '' || b === '' || c === '') {
      continue;
    }

    if (clickCount === 9 && a !== b && b !== c) {
      drawMessage();
      gamePlay = false;
      break
    }

    if (a === b && b === c) {
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
    clickCount++;
    currentPlayer = player1;
    nextPlayerTurn(player2);
    gameValidation();
  }

// If the click is even, add an 'o' - Player 2
  else if (gamePlay === true && clickCount % 2 !== 0 && $(`#${squareId}`).find('.content').text() !== player1.symbol && $(`#${squareId}`).find('.content').text() !== player2.symbol) {
    $(`#${squareId}`).find('.content').text(player2.symbol);
    gameStatus[squareId] = player2.symbol;
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
