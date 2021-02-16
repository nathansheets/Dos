const players = require('./lobbyHandler.js').players;
var deck = require('./deck.js');

var gameStarted = false;
var currentTurnIndex = 0;

StartGame = (sockets) => {
    console.log('Starting game.');
    gameStarted = true;
    //deck.ShuffleDeck(sockets);
}

PlayCard = (turn, socket) => {
    currentTurnIndex = players.indexOf(turn.player);

    deck.PlayCard(turn, socket);
}

module.exports = {
    StartGame : StartGame,
    PlayCard : PlayCard
}