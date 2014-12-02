
;(function(){

  "use strict";

  /*
   * VARIABLES
   */
  var gameType,
      player1,
      player2;




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
        if(play(coords.x, coords.y) && gameType != 'human-human'){
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

    board.reset();

    gameType = $('#game-type').val();

    switch(gameType){
      case 'human-human':
        player1 = 'Human 1';
        player2 = 'Human 2';
        break;
      case 'human-ai':
        player1 = 'Human';
        player2 = 'AI';
        break;
      case 'ai-human':
        player1 = 'AI';
        player2 = 'Human';
        playAI();
        break;
    }
  }


  function getCoords(cell){
    var $el = $(cell);
    var x = parseInt($el.attr('cell-x'), 10)-1;
    var y = parseInt($el.attr('cell-y'), 10)-1;

    return {x:x,y:y};
  }


  function draw(){

    // the board
    $('#board .cell').each(function(index, el){
      var $el = $(el);
      var coords = getCoords($el);
      $el.attr('cell-type', (board.isPlayer1(coords.x, coords.y) ? 'cross' : (board.isPlayer2(coords.x, coords.y) ? 'circle' : '')));
    });

    // the names
    $('#player1 .name').html(player1);
    $('#player2 .name').html(player2);

    // the winner
    $('#player1 .status').empty();
    $('#player2 .status').empty();
    if(board.isGameOver()){
      $('#player'+(board.isWinner1() ? 1 : 2)+' .status').html('won');
    }

  }


  function play(x, y){
    if(board.play(x, y)){
      board.switchPlayer();
      return true;
    }
    return false;
  }




  /*
   * THE AI
   */
  function playAI(){

    if(board.isGameOver()) return;

    // implementing methods from: http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy

    // 1 - Win
    var move = getWinningMove();
    if(move){
      play(move.x, move.y);
      return;
    }

    // 2 - Block
    board.switchPlayer();
    var move = getWinningMove();
    board.switchPlayer();
    if(move){
      play(move.x, move.y);
      return;
    }

    // 3 - Fork
    var move = getForkMove();
    if(move){
      play(move.x, move.y);
      return;
    }

    // 4 - Blocking an opponent's fork
    board.switchPlayer();
    var move = getForkMove();
    board.switchPlayer();
    if(move){
      play(move.x, move.y);
      return;
    }

    // 5 - Center
    if(board.isEmpty(1, 1)) {play(1, 1); return;}
    
    // 6 - Opposite corner
    if(board.isEmpty(0, 0) && board.isOtherPlayer(2, 2)) {play(0, 0); return;}
    if(board.isEmpty(0, 2) && board.isOtherPlayer(2, 0)) {play(0, 2); return;}
    if(board.isEmpty(2, 0) && board.isOtherPlayer(0, 2)) {play(2, 0); return;}
    if(board.isEmpty(2, 2) && board.isOtherPlayer(0, 0)) {play(2, 2); return;}
    
    // 7 - Empty corner
    if(board.isEmpty(0, 0)) {play(0, 0); return;}
    if(board.isEmpty(0, 2)) {play(0, 2); return;}
    if(board.isEmpty(2, 0)) {play(2, 0); return;}
    if(board.isEmpty(2, 2)) {play(2, 2); return;}
    
    // 8 - Empty side
    if(board.isEmpty(1, 0)) {play(1, 0); return;}
    if(board.isEmpty(0, 1)) {play(0, 1); return;}
    if(board.isEmpty(1, 2)) {play(1, 2); return;}
    if(board.isEmpty(2, 1)) {play(2, 1); return;}

  }


  function getWinningMove(){
    for(var y=0;y<3;y++){
      for(var x=0;x<3;x++){
        if(board.play(x, y)){
          var w = board.isCurrentWinner();
          board.undo();
          if(w) {
            return {x:x,y:y};
          }
        }
      }
    }
    return false;
  }


  function getForkMove(){
    for(var y1=0;y1<3;y1++){
      for(var x1=0;x1<3;x1++){

        if(board.play(x1,y1)){

          var nbWins = 0;
          for(var y2=0;y2<3;y2++){
            for(var x2=0;x2<3;x2++){

              if(board.play(x2,y2)){

                if(board.isCurrentWinner()){
                  nbWins++;
                }
                board.undo();

              }
            }
          }

          board.undo();
          if(nbWins>1) {
            return {x:x1,y:y1};
          }
            
        }

      }
    }
    return false;
  }

})();

