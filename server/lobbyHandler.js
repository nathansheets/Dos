var players = [];
var playerNames = [];

const addPlayer = (player, socket) => {
    players.push(player.playerID);
    playerNames.push(player.playerName);

    console.log(players, playerNames);
    if (players.length === 1) {
        socket.emit('host', 'You are host!');
    }
}

const removePlayer = (id) => {
    var index = players.indexOf(id);
    if (index !== -1) {
        players.splice(index, 1);
    }
}

module.exports = {
    players : players,
    playerNames : playerNames,
    addPlayer : addPlayer,
    removePlayer : removePlayer
}