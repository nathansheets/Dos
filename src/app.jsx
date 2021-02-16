import React from 'react';
import Card from './card.jsx';
import HandHandler from './handHandler.jsx';
import StartButton from './startButton.jsx';
const socketHandler = require('./socketHandler.js');
var socket;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerID : 0,
            isHost : false,
            cards : [],
            pile : [],
            currentTurn : false
        };
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
                isHost : true,
                currentTurn: true
            });
        });

        socket.on('drawCard', (card) => {
            if (card.player === this.state.playerID) {
                let newCards = this.state.cards;
                newCards.push(card.card);
                this.setState({
                    cards: newCards
                });
            }
        });

        socket.on('placeCard', (turn) => {
            let newPile = this.state.pile;
            newPile.unshift(turn.card);

            let isThisTurn = false;

            if (turn.currentTurn === this.state.playerID) {
                isThisTurn = true;
            }
            this.setState({
                pile : newPile,
                currentTurn : isThisTurn
            });
        })
    }

    StartGame() {
        socket.emit('startGame', 'startGame');
    }

    PlayCard(card) {
        if (!this.state.currentTurn) {
            return;
        }
        let tempCards = this.state.cards;
        let index = tempCards.indexOf(card);
        tempCards.splice(index, 1);
        this.setState({
            cards: tempCards
        });

        var turn = {
            card: card,
            player: this.state.playerID
        };
        socket.emit('playCard', turn);
    }

    RenderPile() {
        if (this.state.pile.length > 0) {
            return <Card card={this.state.pile[0]}/>
        }
    }

    RenderTurnIndicator() {
        if (this.state.currentTurn) {
            return <div>It's your turn!</div>
        }
    }

    render() {
        return (
            <div id="mainWindow">
                <StartButton isHost={this.state.isHost} StartGame={this.StartGame}/>
                {this.RenderTurnIndicator()}
                <div id="pileContainer">
                    {this.RenderPile()}
                </div>
                <div id="handContainer">
                    <HandHandler cards={this.state.cards} PlayCard={this.PlayCard.bind(this)}/>
                </div>
            </div>
        )
    }
}

window.addEventListener('beforeunload', (event) => {
    socketHandler.leaveGame();
})

export default App;