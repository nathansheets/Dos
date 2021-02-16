const players = require('./lobbyHandler.js').players;
var deck = require('./deck.js');

var gameStarted = false;
var currentTurnIndex = 0;
var isClockwise = 1;

StartGame = (sockets) => {
    console.log('Starting game.');
    gameStarted = true;
    //deck.ShuffleDeck(sockets);
}

PlayCard = (turn, socket) => {
    deck.PlayCard(turn, socket);

    if (turn.card.value === 'reverse') {
        isClockwise = isClockwise === 1 ? -1 : 1;
        TurnIncrementer(1);
    } else if (turn.card.value === 'skip') {
        TurnIncrementer(2);
    } else {
        TurnIncrementer(1);
    }
    turn.currentTurn = players[currentTurnIndex];
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

module.exports = {
    StartGame : StartGame,
    PlayCard : PlayCard
}