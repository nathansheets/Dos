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

const gameManager = require('./gameManager.js');

const io = socket(app.listen(PORT, () => {
    console.log(`DOOT DOOT, we\'re listening on port ${PORT}`);
}));

io.on('connection', (socket) => {
    console.log('Connected');
    socket.on('disconnect', (id) => {
        console.log('Disconnected');
        gameManager.PingPlayers(io.sockets);
    });

    socket.on('leaveGame', (id) => {
        gameManager.RemovePlayer(id);
    });

    socket.on('joinGame', (player) => {
        gameManager.AddPlayer(player, socket);
    });

    socket.on('startGame', () => {
        gameManager.StartGame(io.sockets);
    });

    socket.on('resetGame', () => {
        gameManager.ResetGame();
    });

    socket.on('playCard', (turn) => {
        gameManager.PlayCard(turn, io.sockets);
    });

    socket.on('drawCard', (player) => {
        gameManager.DrawOneCard(player.playerID, io.sockets);
    });

    socket.on('chooseColor', (color) => {
        gameManager.ChooseColor(color, io.sockets);
    });

    socket.on('win', (player) => {
        gameManager.Win(player, io.sockets);
    });
});

app.get('/', (req, res) => {
    console.log('Request received.');
    req.end();
})