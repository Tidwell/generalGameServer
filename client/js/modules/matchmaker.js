/*
Module for matchmaking
A new instance of this object is created when the module is loaded
All DOM event bindings inside this object will be bound
*/

function matchmaker() {
  //to avoid this confusion
  var auth = this;
  
  /*
  *Called when a new game has begun
  *@arg     args           the arguments the server sent with the message
  *             .players   the players in the game
  */
  this.gameStart = function() {
    $('#matchmaker').fadeOut(function() {
      modules.gameaction.gameShow();
    });
  }
  this.endGame = function(winLoss) {
    $('#gamestate').fadeOut(function() {
      $('#matchmaker button').show();
      $('#matchmaker .loading').hide();
      $('#matchmaker h3').hide();
      $('#matchmaker .'+winLoss).show();
      $('#matchmaker').fadeIn();
    });
  }
  
  
  $('#matchmaker button').click(function() {
    $(this).hide();
    socket.send({type: 'joinGame'});
    $('#matchmaker .loading').fadeIn();
  });
}

modules.matchmaker = new matchmaker