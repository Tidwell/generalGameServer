/*
Provides basic functionality for gamestate
getPlayers
sendAllPlayers
sendToPlayers
gameOver
addPlayer
listen (in case the gamestate doesn't listen for anything)

*/
function Gamestate() {
  this.eventEmitter;
  this.maxPlayers;
  this.started = false;
  
  
  //returns the players in the game 
  this.getPlayers = function() {
    return this.players; 
  }
  
  //Sends a message to all players in a game
	//accepts an object and a socket
	//Sends the object to the clients via the socket
	this.sendAllPlayers = function(obj, socket) {
    this.players.forEach(function(player) {
			socket.clients[player.sessionId].send(obj);
		});
	}
  
  this.getPlayerBySessionId = function(sessionId) {
    var returnPlayer;
    this.players.forEach(function(player) {
      if (player.sessionId == sessionId) {
        returnPlayer = player;
      }
    });
    return returnPlayer;
  }
	
	//Sends a message to a single player in a game
	//accepts an object and the players sessionId, and a socket
	//Sends the object to the client via the socket
	this.sendPlayer = function(obj, player, socket) {
		if (typeof player != 'object') {
      player = this.getPlayerBySessionId(player);
    }
    socket.clients[player.sessionId].send(obj);
	}
  
  //sends a game over event to the players and sends out the event
  this.gameOver = function(obj) {
    obj.players = this.players;
    this.sendAllPlayers({type: 'gameOver', args: {winner: obj.winner}}, obj.socket);
    this.eventEmitter.emit('gameEnd', obj);
  }
  
   /*
  *Adds a player to the game.  If the game is full, begins the game
  *
  *@arg obj.
  *         client         client object
  *         socket         the socket object
  *         connectedUsers connectedUsers obj, keyed by sessionId
  */
  this.addPlayer = function(obj) {
    //add the player to the game
    this.players.push({sessionId: obj.client.sessionId});
    //if the game has 2 players in it
    if (this.players.length == this.maxPlayers) {
      this.startGame(obj)
    }
  }
   
  /*
  *Notified when a player in this game disconnects from the service
  *
  *@arg obj.
  *         client         client object
  *         socket         the socket object
  *         connectedUsers connectedUsers obj, keyed by sessionId
  */
  this.userDisconnect = function(obj) {
    var game = this;
    var i = 0;
    var toDelete = null;
    this.players.forEach(function(player) {
      if (player.sessionId != obj.client.sessionId) {
        game.sendPlayer({type: 'opponentDisconnect', args: {opponentDisconnect: obj.client.sessionId}}, player.sessionId, obj.socket);
      }
      if (player.sessionId == obj.client.sessionId) {
        toDelete = i;
      }
      i++;
    });
    this.players.remove(toDelete);
    this.checkGameEnd(obj);
  }
  
  /*
  *Required on all Gamestates, function to determine if the game has ended.  
  *Should either return a winning player object, the string 'tie' or the bool false
  *
  *@arg obj.
  *         client         client object
  *         socket         the socket object
  *         connectedUsers connectedUsers obj, keyed by sessionId
  */
  this.checkGameEnd = function(obj) {
    return false;
  }
}

exports.Gamestate = new Gamestate;