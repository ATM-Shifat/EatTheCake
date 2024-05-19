var origBoard;
var huPlayer = "H";
var aiPlayer = "AI";
var cNumber = 0;
var cell = 0;

// var t = Math.floor(Math.random() * 1);
//var t = 1;

const cakeSize = 20;
startGame(1); 


function generate(n, N){
    var array = [];
    while(array.length < n){
      var p = Math.floor(Math.random() * N) + 1;
      if(!array.includes(p)){
        array.push(p);
      }
    }

    return array;
}

function placeCakes(n, N){

  const cakes = generate(n, N);

  var index = [];
  var array = new Array(25).fill(0);
  var i = 0;
  while(index.length < n){
    const ind = Math.floor(Math.random() * array.length);

    if(!(index.includes(ind))){
      index.push(ind);
    }
 
  }

  for(var i = 0; i < n;i++){
    array[index[i]] = cakes[i];
    
  }
  return array;

}


function startGame(n) {
  cNumber = 0;
  document.getElementById(50).innerHTML = "<h1>Default selection: " + cNumber + "</h1>";
  cell = n;
  document.querySelector(".endgame").style.display = "none";

  for(var i = 0; i < 25; i++){
    document.getElementById(i).innerText = "";
  }
  origBoard = placeCakes(n, cakeSize);

  for(var i = 0; i < 25; i++){
    if(origBoard[i] !== 0){
      document.getElementById(i).innerHTML = "<img class='cake'src='/cake.svg' alt=''> <br>" + origBoard[i];
      document.getElementById(i).addEventListener("click", turnClick, false);
    }
  }

}

function cakeNumber(n){
  cNumber = n;
  document.getElementById(50).innerHTML = "<h1>You Chose " + cNumber + "</h1>";
}

function delay(delayTime) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delayTime);
  });
}




function turnClick(square) {

  if(cNumber !== 0){
    turn(square.target.id, huPlayer);

    const ch = checkWin();
  
    const delayInMs = 2000;
  
    delay(delayInMs).then(() => {
      if(ch.value !== 1)  findBestMove(square.target.id, origBoard, aiPlayer);
    });
  
    cNumber = 0;
  }
  
}

function turn(squareId, player) {


  if(origBoard[squareId] >= cNumber){
    origBoard[squareId] -= cNumber;
    if(origBoard[squareId] <= 0){
      origBoard[squareId] = player;
      document.getElementById(squareId).innerHTML = player;
      document.getElementById(squareId).removeEventListener("click", turnClick, false);
    }
    else 
      document.getElementById(squareId).innerHTML = "<img class='cake'src='/cake.svg' alt=''> <br>" + origBoard[squareId];
  }

  let g = checkWin();

  

}

function checkWin() {
  var x = origBoard.filter((s) => typeof s !== "number");

  if(x.length == cell){
    gameOver(x);
    return  {value: 1, ar: x};
  }
  else 
   return  {value: 0, ar: x};
  
}

function gameOver(ar) {
  for (var i = 0; i < origBoard.length; i++) {
    document.getElementById(i).removeEventListener("click", turnClick, false);
  }

  var human = 0;
  var ai = 0;

  for(var i = 0; i < ar.length; i++){
    if(ar[i] === "H")
      human += 1;
    else 
      ai += 1;
  }


  declareWinner(human > ai ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".text").innerText = who;
}


function minimax(numberOfCakes, isMaximizingPlayer) {
  if(numberOfCakes === 1)
    return isMaximizingPlayer ? -1 : 1;
  if (numberOfCakes <= 3) {
    return isMaximizingPlayer ? 1 : -1;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;

    for (let i = 1; i <= 3; i++) {
      const currentScore = minimax(numberOfCakes - i, false);
      bestScore = Math.max(bestScore, currentScore);
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 1; i <= 3; i++) {
      const currentScore = minimax(numberOfCakes - i, true);
      bestScore = Math.min(bestScore, currentScore);
    }

    return bestScore;
  }
}


function findBestMove(squareId, origBoard, player) {
  numberOfCakes = origBoard[squareId];

  let bestScore = -Infinity;
  let bestMove;

  for (let i = 1; i <= 3; i++) {
    const currentScore = minimax(numberOfCakes - i,  false);
    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestMove = i;
    }
  }
  
  cNumber =  origBoard[squareId] <= 3 ? origBoard[squareId] : bestMove;
  
  document.getElementById(50).innerHTML = "<h1>Ai Chose " + cNumber + "</h1>";

  turn(squareId,player)
}
 