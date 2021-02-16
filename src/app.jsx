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
            playerName : '',
            isHost : false,
            cards : [],
            pile : [],
            currentTurn : false,
            currentTurnName : ''
        };
    }

    componentDidMount() {
        socket = socketHandler.getSocket();

        window.setTimeout(this.GetPlayerName.bind(this), 1000);

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

            if (turn.currentTurnID === this.state.playerID) {
                isThisTurn = true;
            }
            this.setState({
                pile : newPile,
                currentTurn : isThisTurn,
                currentTurnName : turn.currentTurnName
            });
        })
    }

    GetPlayerName() {
        var name = window.prompt("Enter your name: ");
        var id = Math.floor(Math.random() * Math.floor(999999999999));

        var player = {
            playerName : name,
            playerID : id
        }

        this.setState(player);
        socket.emit('joinGame', player);
    }

    StartGame() {
        socket.emit('startGame', 'startGame');
    }

    ResetGame() {
        socket.emit('resetGame', 'resetGame');
    }

    PlayCard(card) {
        // Don't allow player to place card if it's not their turn
        if (!this.state.currentTurn) {
            return;
        }

        // Check if card is valid (matches color or value)
        if (this.state.pile.length > 0) {
            let topCard = this.state.pile[0];
            if (card.value !== topCard.value && card.color !== topCard.color) {
                return;
            }
        }

        // Remove card from hand
        let tempCards = this.state.cards;
        let index = tempCards.indexOf(card);
        tempCards.splice(index, 1);
        this.setState({
            cards: tempCards
        });
        
        // Transmit turn object to server
        var turn = {
            card: card,
            player: this.state.playerID
        };
        socket.emit('playCard', turn);
    }

    DrawCard() {
        socket.emit('drawCard', { playerID : this.state.playerID});
    }

    RenderPile() {
        if (this.state.pile.length > 0) {
            return (
                <div id="pile">
                    <Card card={this.state.pile[0]}/>
                </div>
            )
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
                <StartButton isHost={this.state.isHost} StartGame={this.StartGame} ResetGame={this.ResetGame}/>
                <div>
                    It's {this.state.currentTurnName}'s turn!
                </div>
                <div id="pileContainer">
                    <Card PlayCard={this.DrawCard.bind(this)} />
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