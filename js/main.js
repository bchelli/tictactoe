
;(function(){

  "use strict";

  /*
   * VARIABLES
   */
  var gameType,
      allowHumanClick,
      player1,
      player2,
      play1,
      play2;




  /*
   * INIT
   */
  actionLoop({kind:'new-game'});




  /*
   * EVENTS
   */
  $('#board').on('click', '.cell', function(ev){
    if(allowHumanClick){
      actionLoop({
        kind:'play',
        coords:getCoords(ev.target)
      });
    }
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
        play(action.coords.x, action.coords.y);
        break;

      default:
        break;

    }
    draw();
  }




  /*
   * HELPERS
   */
  // wait for a click
  function humanPlays(){};
  // auto-play
  function AIPlays(){
    allowHumanClick=false;
    ai.play(function(x,y){
      var r = play(x,y);
      allowHumanClick=true;
      return r;
    })();
  };
  function initBoard(){

    board.reset();

    gameType = $('#game-type').val();
    allowHumanClick = true;

    var playerType = gameType.split('-');
    play1   = playerType[0] == 'human' ? humanPlays : AIPlays;
    play2   = playerType[1] == 'human' ? humanPlays : AIPlays;
    player1 = playerType[0] == 'human' ? 'Human' : 'AI';
    player2 = playerType[1] == 'human' ? 'Human' : 'AI';

    play1();

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
      $el.attr('cell-type', (board.isCellPlayer1(coords.x, coords.y) ? 'cross' : (board.isCellPlayer2(coords.x, coords.y) ? 'circle' : '')));
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
      board.switchPlayer(play1, play2);
      return true;
    }
    return false;
  }

})();

