import React from 'react';
import Card from './card.jsx';
import StartButton from './startButton.jsx';
const socketHandler = require('./socketHandler.js');
var socket;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerID : 0,
            isHost : false
        }
    }

    componentDidMount() {
        socket = socketHandler.getSocket();
        var id = socketHandler.joinGame(socket);
        this.setState({
            playerID: id
        });
        socket.on('host', (x) => {
            console.log(x);
            this.setState({
                isHost : true
            });
        });
        socket.on('drawCard', (card) => {
            console.log(card);
        })
    }

    StartGame() {
        socket.emit('startGame', 'startGame');
    }

    render() {
        return (
            <div id="mainWindow">
                <StartButton isHost={this.state.isHost} StartGame={this.StartGame}/>
            </div>
        )
    }
}

window.addEventListener('beforeunload', (event) => {
    socketHandler.leaveGame();
})

export default App;