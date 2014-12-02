
;(function(module){
  
  "use strict";

  /*
   * Module exported (Singleton)
   */
  module.ai = {
    play: playAI
  };


  function playAI(play){

    return function(){

      var move;

      if(board.isGameOver()) return;

      // implementing methods from: http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy

      // 1 - Win
      move = getWinningMove();
      if(move){
        play(move.x, move.y);
        return;
      }

      // 2 - Block
      board.switchPlayer();
      move = getWinningMove();
      board.switchPlayer();
      if(move){
        play(move.x, move.y);
        return;
      }

      // 3 - Fork
      move = getForkMove();
      if(move){
        play(move[0].x, move[0].y);
        return;
      }

      // 4 - Blocking an opponent's fork
      board.switchPlayer();
      move = getForkMove();
      board.switchPlayer();
      if(move){
        move = createAThreat(move);
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
    var points = [];
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
            points.push({x:x1,y:y1});
          }
            
        }

      }
    }
    return points.length>0 ? points : false;
  }


  function createAThreat(points){
    for(var y1=0;y1<3;y1++){
      for(var x1=0;x1<3;x1++){

        if(board.play(x1,y1)){

          var valid = true;

          for(var y2=0;y2<3;y2++){
            for(var x2=0;x2<3;x2++){

              if(board.play(x2,y2)){

                if(board.isCurrentWinner()){

                  for(var i=0; i<points.length; i++){
                    if(points[i].x==x2 && points[i].y==y2){
                      valid = false;
                    }
                  }

                }
                board.undo();

              }
            }
          }

          board.undo();
          if(valid) {
            return {x:x1,y:y1};
          }
            
        }

      }
    }
    return false;
  }

})(window);
