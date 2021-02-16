import { io } from "socket.io-client";
const socket = io();
var playerID;

const getSocket = () => {
    return socket;
}

const leaveGame = () => {
    socket.emit('leaveGame', playerID);
}

export { getSocket, leaveGame }