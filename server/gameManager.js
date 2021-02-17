var deck = require('./deck.js');

var gameStarted = false;
var currentTurnIndex = 0;
var isClockwise = 1;
var players = [];
var playerNames = [];
var lastCard;

StartGame = (sockets) => {
    console.log('Starting game.');
    gameStarted = true;
    deck.ShuffleDeck(sockets, players);
}

PlayCard = (turn, socket) => {
    // Increment turn
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

    // Handle action cards
    switch (turn.card.value) {
        case '+2' :
            //Trigger next player to draw 2
            for (let i = 0; i < 2; i++) {
                DrawOneCard(players[currentTurnIndex], socket);
            }
        break;

        case 'wild' :
            // Allow player to pick next color
            console.log('wild');
            lastCard = turn.card;
            TurnIncrementer(-1);
            socket.emit('chooseColor', players[currentTurnIndex]);
            TurnIncrementer(1);
        break;

        case '+4' :
            // Allow player to pick next color
            lastCard = turn.card;
            TurnIncrementer(-1);
            socket.emit('chooseColor', players[currentTurnIndex]);
            TurnIncrementer(1);

            // Trigger next player to draw 4
            for (let i = 0; i < 4; i++) {
                DrawOneCard(players[currentTurnIndex], socket);
            }
    }
}

DrawOneCard = (playerID, socket) => {
    if (players[currentTurnIndex] === playerID) {
        let card = deck.DrawCard();
        socket.emit('drawCard', {
            card : card,
            player : playerID,
            playerName : playerNames[currentTurnIndex]
        });
    }
}

ChooseColor = (color, socket) => {
    socket.emit('chooseColor', '', color);
}

TurnIncrementer = (num) => {
    players.length > 1 ? currentTurnIndex += num * isClockwise : null;
    if (currentTurnIndex >= players.length) {
        currentTurnIndex -= players.length;
    } else if (currentTurnIndex < 0) {
        currentTurnIndex += players.length;
    }
    return currentTurnIndex;
}

ResetGame = () => {
    console.log('Resetting game.');
    gameStarted = false;
    players = [];
}

AddPlayer = (player, socket) => {
    if (!gameStarted) {
        players.push(player.playerID);
        playerNames.push(player.playerName);

        console.log(players, playerNames);
        if (players.length === 1) {
            socket.emit('host', 'You are host!');
        }
    }
}

RemovePlayer = (id) => {
    var index = players.indexOf(id);
    if (index !== -1) {
        players.splice(index, 1);
    }
}

module.exports = {
    StartGame : StartGame,
    PlayCard : PlayCard,
    ResetGame : ResetGame,
    DrawOneCard : DrawOneCard,
    AddPlayer : AddPlayer,
    RemovePlayer : RemovePlayer,
    players : players,
    ChooseColor : ChooseColor
}