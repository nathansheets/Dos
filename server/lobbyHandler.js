var players = [];

const addPlayer = (id) => {
    players.push(id);
    console.log(players);
    if (players.length === 1) {
        return true;
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
    addPlayer : addPlayer,
    removePlayer : removePlayer
}