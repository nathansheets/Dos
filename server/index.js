const express = require('express');
const bp = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const PORT = 3000;

const app = express();
const socket = require('socket.io');

app.use(cors());
app.use(compression());
app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../dist')));

const lobby = require('./lobbyHandler.js');
const deck = require('./deck.js');
const gameManager = require('./gameManager.js');

const io = socket(app.listen(PORT, () => {
    console.log(`DOOT DOOT, we\'re listening on port ${PORT}`);
}))

io.on('connection', (socket) => {
    console.log('Connected');
    socket.on('disconnect', (id) => {
        console.log('Disconnected');
    });

    socket.on('leaveGame', (id) => {
        lobby.removePlayer(id);
    });

    socket.on('joinGame', (id) => {
        var isHost = lobby.addPlayer(id);
        if (isHost) {
            socket.emit('host', 'You are host!');
        }
    });

    socket.on('startGame', (x) => {
        gameManager.StartGame(io.sockets);
        console.log('Starting game.');
        deck.ShuffleDeck(io.sockets);
    })

    socket.on('playCard', (turn) => {
        gameManager.PlayCard(turn, io.sockets);
    })
})