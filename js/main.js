

;(function(){

  "use strict";

  /*
   * CONSTANTS
   */
  var CELL_EMPTY    = 0;
  var CELL_PLAYER1  = 1;
  var CELL_PLAYER2  = 2;

  var PLAYED_OK                 = 3;
  var PLAYED_NOK_GAME_OVER      = 4;
  var PLAYED_NOK_CELL_NOT_EMPTY = 5;

  var CELL_MAPPING = {};
  CELL_MAPPING[CELL_EMPTY]   = '';
  CELL_MAPPING[CELL_PLAYER1] = 'cross';
  CELL_MAPPING[CELL_PLAYER2] = 'circle';




  /*
   * VARIABLES
   */
  var board;
  var winner;




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
        if(PLAYED_OK == play(action.cell, CELL_PLAYER1)){
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
    winner = CELL_EMPTY;
    if($('#player-starting').val()=='ai'){
      playAI();
    }
  }


  function getCoords(cell){
    var $el = $(cell);
    var x = parseInt($el.attr('cell-x'), 10)-1;
    var y = parseInt($el.attr('cell-y'), 10)-1;

    return {x:x,y:y};
  }


  function play(cell, player){

    if(isGameOver()) return PLAYED_NOK_GAME_OVER;

    var coords = getCoords(cell);

    if(board[coords.y][coords.x] == CELL_EMPTY){
      board[coords.y][coords.x] = player;
      checkWinner();
      return PLAYED_OK;
    }

    return PLAYED_NOK_CELL_NOT_EMPTY;
  }


  function draw(){

    // the board
    $('#board .cell').each(function(index, el){
      var $el = $(el);
      var coords = getCoords($el);

      $el.attr('cell-type',CELL_MAPPING[board[coords.y][coords.x]]);
    });

    // the winner
    if(isGameOver()){
      $('#winner').removeClass('hidden').find('.cell').attr('cell-type', CELL_MAPPING[winner]);
    } else {
      $('#winner').addClass('hidden');
    }

  }


  function playAI(){
    // dummy AI
    var needToPlay = true;
    $('#board .cell').each(function(index, el){
      if(needToPlay && PLAYED_OK == play(el, CELL_PLAYER2)){
        needToPlay = false;
      }
    });
  }


  function isGameOver(){
    return winner!=CELL_EMPTY;
  }


  function checkWinner(){

    for(var i=0;i<3;i++){
      // check lines
      if(board[i][0] != CELL_EMPTY && board[i][0] == board[i][1] && board[i][0] == board[i][2]){
        winner = board[i][0];
        return true;
      }

      // check cols
      if(board[0][i] != CELL_EMPTY && board[0][i] == board[1][i] && board[0][i] == board[2][i]){
        winner = board[0][i];
        return true;
      }
    }

    // check diag 1
    if(board[0][0] != CELL_EMPTY && board[0][0] == board[1][1] && board[0][0] == board[2][2]){
      winner = board[0][0];
      return true;
    }
    // check diag 2
    if(board[0][2] != CELL_EMPTY && board[0][2] == board[1][1] && board[0][2] == board[2][0]){
      winner = board[0][2];
      return true;
    }

    return false;
  }


})();

