

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
        var coords = getCoords(action.cell);
        if(PLAYED_OK == play(coords, CELL_PLAYER1)){
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


  function play(coords, player){

    if(isGameOver()) return PLAYED_NOK_GAME_OVER;

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


  function isGameOver(){
    return winner!=CELL_EMPTY;
  }


  function getWinner(){

    for(var i=0;i<3;i++){
      // check lines
      if(board[i][0] != CELL_EMPTY && board[i][0] == board[i][1] && board[i][0] == board[i][2]){
        return board[i][0];
      }

      // check cols
      if(board[0][i] != CELL_EMPTY && board[0][i] == board[1][i] && board[0][i] == board[2][i]){
        return board[0][i];
      }
    }

    // check diag 1
    if(board[0][0] != CELL_EMPTY && board[0][0] == board[1][1] && board[0][0] == board[2][2]){
      return board[0][0];
    }
    // check diag 2
    if(board[0][2] != CELL_EMPTY && board[0][2] == board[1][1] && board[0][2] == board[2][0]){
      return board[0][2];
    }

    return CELL_EMPTY;

  }


  function checkWinner(){
    winner = getWinner();
    return !isGameOver();
  }


  function getWinningMove(player){
    for(var y=0;y<3;y++){
      for(var x=0;x<3;x++){
        if(board[y][x] == CELL_EMPTY){
          board[y][x] = player;
          var w = getWinner();
          board[y][x] = CELL_EMPTY;
          if(player == w) {
            return {x:x,y:y};
          }
        }
      }
    }
    return false;
  }


  function getForkMove(player){
    for(var y1=0;y1<3;y1++){
      for(var x1=0;x1<3;x1++){

        if(board[y1][x1] == CELL_EMPTY){
          board[y1][x1] = player;

          var nbWins = 0;
          for(var y2=0;y2<3;y2++){
            for(var x2=0;x2<3;x2++){
              if(board[y2][x2] == CELL_EMPTY){
                board[y2][x2] = player;
                if(player==getWinner()){
                  nbWins++;
                }
                board[y2][x2] = CELL_EMPTY;
              }
            }
          }

          board[y1][x1] = CELL_EMPTY;
          if(nbWins>1) {
            return {x:x1,y:y1};
          }
        }

      }
    }
    return false;
  }





  /*
   * THE AI
   */
  function playAI(){

    if(isGameOver()) return;

    // implementing methods from: http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy

    // 1 - Win
    var move = getWinningMove(CELL_PLAYER2);
    if(move){
      play(move, CELL_PLAYER2);
      return;
    }

    // 2 - Block
    var move = getWinningMove(CELL_PLAYER1);
    if(move){
      play(move, CELL_PLAYER2);
      return;
    }

    // 3 - Fork
    var move = getForkMove(CELL_PLAYER2);
    if(move){
      play(move, CELL_PLAYER2);
      return;
    }

    // 4 - Blocking an opponent's fork
    var move = getForkMove(CELL_PLAYER1);
    if(move){
      play(move, CELL_PLAYER2);
      return;
    }

    // 5 - Center
    if(board[1][1] == CELL_EMPTY) {play({x:1,y:1}, CELL_PLAYER2); return;}
    
    // 6 - Opposite corner
    if(board[0][0] == CELL_EMPTY && board[2][2] == CELL_PLAYER1) {play({x:0,y:0}, CELL_PLAYER2); return;}
    if(board[0][2] == CELL_EMPTY && board[2][0] == CELL_PLAYER1) {play({x:2,y:0}, CELL_PLAYER2); return;}
    if(board[2][0] == CELL_EMPTY && board[0][2] == CELL_PLAYER1) {play({x:0,y:2}, CELL_PLAYER2); return;}
    if(board[2][2] == CELL_EMPTY && board[0][0] == CELL_PLAYER1) {play({x:2,y:2}, CELL_PLAYER2); return;}
    
    // 7 - Empty corner
    if(board[0][0] == CELL_EMPTY) {play({x:0,y:0}, CELL_PLAYER2); return;}
    if(board[0][2] == CELL_EMPTY) {play({x:2,y:0}, CELL_PLAYER2); return;}
    if(board[2][0] == CELL_EMPTY) {play({x:0,y:2}, CELL_PLAYER2); return;}
    if(board[2][2] == CELL_EMPTY) {play({x:2,y:2}, CELL_PLAYER2); return;}
    
    // 8 - Empty side
    if(board[0][1] == CELL_EMPTY) {play({x:1,y:0}, CELL_PLAYER2); return;}
    if(board[1][0] == CELL_EMPTY) {play({x:0,y:1}, CELL_PLAYER2); return;}
    if(board[2][1] == CELL_EMPTY) {play({x:1,y:2}, CELL_PLAYER2); return;}
    if(board[1][2] == CELL_EMPTY) {play({x:2,y:1}, CELL_PLAYER2); return;}

  }



})();

