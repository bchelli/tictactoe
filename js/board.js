
;(function(module){

  "use strict";

  /*
   * CONSTANTS
   */
  var CELL_EMPTY    = 0;
  var CELL_PLAYER1  = 1;
  var CELL_PLAYER2  = 2;



  /*
   * CONSTANTS
   */
  var _board,
      _currentPlayer,
      _stack;



  /*
   * Module exported (Singleton)
   */
  module.board = {
    reset:                reset,

    switchPlayer:         switchPlayer,

    play:                 play,
    undo:                 undo,

    isPlayer1:            isPlayer1,
    // isPlayer2:            isPlayer2,
    // currentPlayer:        currentPlayer,
    // otherPlayer:          otherPlayer,

    // isCellEmpty:          isCellEmpty,
    isCellPlayer1:        isCellPlayer1,
    isCellPlayer2:        isCellPlayer2,
    // isCellCurrentPlayer:  isCellCurrentPlayer,
    isCellOtherPlayer:    isCellOtherPlayer,

    isGameOver:           isGameOver,
    // getWinner:            getWinner,
    isWinner1:            isWinner1,
    // isWinner2:            isWinner2,
    // isOtherWinner:        isOtherWinner,
    isCurrentWinner:      isCurrentWinner
  };




  /*
   * Methods
   */
  function reset(){
    _board = [
      [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
      [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
      [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY]
    ];

    _stack = [];

    _currentPlayer = CELL_PLAYER1;
  }
  function undo(){
    if(_stack.length>0){
      var move = _stack.pop();
      _set(move.x, move.y, CELL_EMPTY);
    }
  }
  function switchPlayer(){
    _currentPlayer = otherPlayer();
  }
  function play(x, y){
    if(isGameOver()) return false;
    if(isCellEmpty(x, y)){
      _set(x, y, currentPlayer());
      _stack.push({x:x,y:y,player:currentPlayer()});
      return true;
    }
    return false;
  }
  function getWinner(){
    for(var i=0;i<3;i++){
      // check lines
      if(_board[i][0] != CELL_EMPTY && _board[i][0] == _board[i][1] && _board[i][0] == _board[i][2]){
        return _board[i][0];
      }
      // check cols
      if(_board[0][i] != CELL_EMPTY && _board[0][i] == _board[1][i] && _board[0][i] == _board[2][i]){
        return _board[0][i];
      }
    }
    // check diag 1
    if(_board[0][0] != CELL_EMPTY && _board[0][0] == _board[1][1] && _board[0][0] == _board[2][2]){
      return _board[0][0];
    }
    // check diag 2
    if(_board[0][2] != CELL_EMPTY && _board[0][2] == _board[1][1] && _board[0][2] == _board[2][0]){
      return _board[0][2];
    }
    return CELL_EMPTY;
  }
  function isGameOver(){
    return getWinner() !== CELL_EMPTY;
  }
  function isPlayer1(){
    return currentPlayer() === CELL_PLAYER1;
  }
  // function isPlayer2(){
  //   return _currentPlayer === CELL_PLAYER1;
  // }
  function otherPlayer(){
    return isPlayer1() ? CELL_PLAYER2 : CELL_PLAYER1;
  }
  function currentPlayer(){
    return _currentPlayer;
  }
  function isWinner1(){
    return getWinner() === CELL_PLAYER1;
  }
  // function isWinner2(){
  //   return getWinner() === CELL_PLAYER2;
  // }
  // function isOtherWinner(){
  //   return getWinner() === otherPlayer();
  // }
  function isCurrentWinner(){
    return getWinner() === currentPlayer();
  }



  /*
   * Board Accessor
   */
  function _set(x, y, player){
    _board[y][x] = player;
  }
  function _get(x, y){
    return _board[y][x];
  }
  function isCellEmpty(x, y){
    return _get(x, y) == CELL_EMPTY;
  }
  function isCellPlayer1(x, y){
    return _get(x, y) == CELL_PLAYER1;
  }
  function isCellPlayer2(x, y){
    return _get(x, y) == CELL_PLAYER2;
  }
  // function isCellCurrentPlayer(x, y){
  //   return _get(x, y) == currentPlayer();
  // }
  function isCellOtherPlayer(x, y){
    return _get(x, y) == otherPlayer();
  }

})(window);
