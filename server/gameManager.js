var players = require('./lobbyHandler.js').players;
var playerNames = require('./lobbyHandler.js').playerNames;
var deck = require('./deck.js');

var gameStarted = false;
var currentTurnIndex = 0;
var isClockwise = 1;

StartGame = (sockets) => {
    console.log('Starting game.');
    gameStarted = true;
    deck.ShuffleDeck(sockets);
}

PlayCard = (turn, socket) => {
    deck.PlayCard(turn);

    if (turn.card.value === 'reverse') {
        isClockwise = isClockwise === 1 ? -1 : 1;
        TurnIncrementer(1);
    } else if (turn.card.value === 'skip') {
        TurnIncrementer(2);
    } else {
        TurnIncrementer(1);
    }
    turn.currentTurnID = players[currentTurnIndex];
    turn.currentTurnName = playerNames[currentTurnIndex];
    socket.emit('placeCard', turn);
}

TurnIncrementer = (num) => {
    currentTurnIndex += num * isClockwise;
    if (currentTurnIndex >= players.length) {
        currentTurnIndex -= players.length;
    } else if (currentTurnIndex < 0) {
        currentTurnIndex += players.length;
    }
    return currentTurnIndex;
}

ResetGame = () => {
    console.log('Resetting game.');
    players = [];
}

module.exports = {
    StartGame : StartGame,
    PlayCard : PlayCard,
    ResetGame : ResetGame
}