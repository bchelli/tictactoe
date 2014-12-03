
;(function(module){
  
  "use strict";

  /*
   * VARIABLES
   */
  var gameType,
      allowHumanClick,
      player1,
      player2,
      play1,
      play2,
      activePlayer;



  /*
   * START THE GAME
   */
  $(function(){
    // attach event listeners
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

    // start a new game
    actionLoop({kind:'new-game'});
  });




  /*
   * PROGRAM LOOP
   */
  function actionLoop(action){
    var result;

    // execute the action
    action = action || {};
    action.kind = action.kind || 'nope';
    switch(action.kind){

      case 'new-game':
        newGame();
        break;

      case 'play':
        result = play(action.coords.x, action.coords.y);
        break;

      default:
        break;

    }

    // refresh the board
    drawTheBoard();

    return result;
  }





  /*
   * ACTIONS
   */
  function newGame(){

    // reset the board
    board.reset();

    // init state
    gameType = $('#game-type').val();
    allowHumanClick = true;
    activePlayer = '';

    // init players
    var playerType = gameType.split('-');
    play1   = playerType[0] == 'human' ? humanPlays('player1') : AIPlays;
    play2   = playerType[1] == 'human' ? humanPlays('player2') : AIPlays;
    player1 = playerType[0] == 'human' ? 'Human' : 'AI';
    player2 = playerType[1] == 'human' ? 'Human' : 'AI';

    // player1 start the game
    play1();

  }


  function play(x, y){
    if(board.play(x, y)){
      board.switchActivePlayer(play1, play2);
      return true;
    }
    return false;
  }





  /*
   * BOARD RENDERER
   */
  function drawTheBoard(){

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
    $('#player1,#player2').removeClass('active').removeClass('winner');
    $('#board').attr('winning-line', '');
    if(board.isGameOver()){
      $('#board').attr('winning-line', board.getWinner()[1]);
      if(board.isWinner1()){
        $('#player1').addClass('winner').find('.status').html('won');
      } else if(board.isWinner2()){
        $('#player2').addClass('winner').find('.status').html('won');
      } else {
        $('#board').attr('winning-line', 'tie');
      }
    } else if(activePlayer){
      $('#'+activePlayer).addClass('active').find('.status').html('thinking...');
    }

  }






  /*
   * HELPERS
   */
  // wait for a click
  function humanPlays(player){
    return function(){
      activePlayer = player;
    }
  };

  // auto-play
  function AIPlays(){
    activePlayer = '';
    allowHumanClick=false;
    ai.play(function(x,y){
      var r = actionLoop({
        kind:'play',
        coords:{x:x,y:y}
      });
      allowHumanClick=true;
      return r;
    })();
  };

  // extract coords from a cell
  function getCoords(cell){
    var $el = $(cell);
    var x = parseInt($el.attr('cell-x'), 10)-1;
    var y = parseInt($el.attr('cell-y'), 10)-1;

    return {x:x,y:y};
  }


})(window);
