import { io } from "socket.io-client";
const socket = io();
var playerID;

const getSocket = () => {
    return socket;
}

const joinGame = () => {
    playerID = Math.floor(Math.random() * Math.floor(999999999999));
    socket.emit('joinGame', playerID);
    return playerID;
}

const leaveGame = () => {
    socket.emit('leaveGame', playerID);
}

export { getSocket, joinGame, leaveGame }