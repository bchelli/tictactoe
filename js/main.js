

;(function(){

  "use strict";

  var CELL_EMPTY    = 0;
  var CELL_PLAYER1  = 1;
  var CELL_PLAYER2  = 2;

  var cellTypesMapping = {};
  cellTypesMapping[CELL_EMPTY]   = '';
  cellTypesMapping[CELL_PLAYER1] = 'cross';
  cellTypesMapping[CELL_PLAYER2] = 'circle';

  var board;
  var gameOver = true;




  /*
   * INIT
   */
  actionLoop({kind:'new-game'});




  /*
   * EVENTS
   */
  $('#board').on('click', '.cell', function(ev){
    actionLoop({
      kind:'play',
      cell:ev.target
    });
  });
  $('#new-game').on('click', function(ev){
    actionLoop({kind:'new-game'});
  });



  /*
   * PROGRAM LOOP
   */
  function actionLoop(action){
    action = action || {};
    action.kind = action.kind || 'nope';
    switch(action.kind){

      case 'new-game':
        initBoard();
        break;

      case 'play':
        if(play(action.cell, CELL_PLAYER1)){
          playAI();
        }
        break;

      case 'nope':
      default:
        break;
    }
    draw();
  }



  /*
   * HELPERS
   */
  function initBoard(){
    board = [
      [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
      [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
      [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY]
    ];
    gameOver = false;
  }
  function play(cell, player){
    if(gameOver) return;
    var $el = $(cell);
    var x = parseInt($el.attr('cell-x'), 10)-1;
    var y = parseInt($el.attr('cell-y'), 10)-1;
    if(board[y][x] == CELL_EMPTY){
      board[y][x] = player;
      return true;
    }
    return false;
  }
  function draw(){
    $('#board .cell').each(function(index, el){
      var $el = $(el);
      var x = parseInt($el.attr('cell-x'), 10)-1;
      var y = parseInt($el.attr('cell-y'), 10)-1;
      $el.attr('cell-type',cellTypesMapping[board[y][x]]);
    });
  }
  function playAI(){
    var needToPlay = true;
    $('#board .cell').each(function(index, el){
      if(needToPlay && play(el, CELL_PLAYER2)){
        needToPlay = false;
      }
    });
  }


})();

