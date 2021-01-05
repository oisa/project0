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
  let currentPlayerTurn = player1.name;

  $('#message-board').text(`It's your turn, ${player1.name}!`);

  const winningCombinations = [
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

  for (let i = 0; i < winningCombinations.length; i++) {
    const winCombinationSingle = winningCombinations[i];
    let a  = gameStatus[winCombinationSingle[0]];
    let b = gameStatus[winCombinationSingle[1]];
    let c = gameStatus[winCombinationSingle[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      weHaveAWinner = true;
      console.log(weHaveAWinner);
    }
  }

}

//////////////////////// FUNCTION IF SQUARE CLICKED ////////////////////////////

$('.square').on('click', function () {

  let squareId = Number(this.id);

// If the click is even, add an 'x' - Player 1
  if (clickCount % 2 === 0 && $(`#${squareId}`).find('.content').text() !== player1.symbol && $(`#${squareId}`).find('.content').text() !== player2.symbol) {
    $(`#${squareId}`).find('.content').text(player1.symbol);
    clickCount++;
    $('#message-board').text(`It's your turn, ${player2.name}!`);
    gameValidation();
  }

// If the click is even, add an 'o' - Player 2
  else if (clickCount % 2 !== 0 && $(`#${squareId}`).find('.content').text() !== player1.symbol && $(`#${squareId}`).find('.content').text() !== player2.symbol){
    $(`#${squareId}`).find('.content').text(player2.symbol);
    clickCount++;
    $('#message-board').text(`It's your turn, ${player1.name}!`);
    gameValidation();
  }

  console.log(clickCount);

});

/////////////////////////////// RESET GAME /////////////////////////////////////

$('#reset').on('click', function () {
  $(`.square`).find('.content').text('');
  $('#message-board').text(`It's your turn, ${player1.name}!`);
  clickCount = 0;
});

/////////////////////////// MISC STYLE FEATURES ////////////////////////////////

// Board tilt function
const tilt = $('.js-tilt').tilt()
tilt.on('change', function(e, transforms){});
