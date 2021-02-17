import React from 'react';
import Card from './card.jsx';
import HandHandler from './handHandler.jsx';
import StartButton from './startButton.jsx';
import PlayerList from './players.jsx';
import { io } from "socket.io-client";
const socket = io();

var waitingForColor = false;
var playerID;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerName : '',
            isHost : false,
            cards : [],
            pile : [],
            currentTurn : false,
            currentTurnName : '',
            players : [],
            winner : ''
        };
    }

    componentDidMount() {
        window.setTimeout(this.GetPlayerName.bind(this), 100);

        socket.on('host', (x) => {
            console.log(x);
            this.setState({
                isHost : true,
                currentTurn: true
            });
        });

        socket.on('drawCard', (card) => {
            card.playerName ? console.log(`${card.playerName} drew a card!`) : null;
            if (card.player === this.playerID) {
                let newCards = this.state.cards;
                newCards.push(card.card);
                this.setState({
                    cards: newCards
                });
            } 
            if (!this.state.players.includes(card.playerName)) {
                console.log(card);
                let tempPlayers = this.state.players;
                console.log(tempPlayers);
                tempPlayers.push(card.playerName);
                this.setState({
                    players : tempPlayers
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
        });

        socket.on('chooseColor', (playerID, colorToChange) => {
            if (playerID === this.state.playerID) {
                var colors = ['green', 'blue', 'yellow', 'red'];
                var color;
                while(!colors.includes(color)) {
                    color = window.prompt('Choose a color (green/blue/yellow/red): ');
                    color = color.toLowerCase();
                }

                socket.emit('chooseColor', color);
            }
            if (colorToChange) {
                waitingForColor = false;
                var tempPile = this.state.pile;
                tempPile[0].color = colorToChange;
                this.setState({
                    pile : tempPile
                });
            } else {
                waitingForColor = true;
            }
        });

        socket.on('ping', () => {
            if (!this.state.isHost) {
                socket.emit('joinGame', {
                    playerName: this.state.playerName,
                    playerID : this.playerID
                });
            }
        });

        socket.on('gameOver', (playerName) => {
            this.setState({
                winner: playerName
            });
        });
    }

    GetPlayerName() {
        var name = window.prompt("Enter your name: ");
        this.playerID = Math.floor(Math.random() * Math.floor(999999999999));

        var player = {
            playerName : name,
            playerID : this.playerID
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
        if (!this.state.currentTurn || waitingForColor) {
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

        if (this.state.cards.length === 0) {
            socket.emit('win', {
                playerID : this.playerID,
                playerName : this.state.playerName
            });
        }
        
        // Transmit turn object to server
        var turn = {
            card: card,
            player: this.playerID
        };
        socket.emit('playCard', turn);
    }

    DrawCard() {
        socket.emit('drawCard', { playerID : this.playerID});
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
        if (this.state.winner !== '') {
            return (
                <div>
                    {this.state.winner} wins!
                </div>
            )
        }
        if (this.state.currentTurnName) {
            return (
            <div>
                It's {this.state.currentTurnName}'s turn!
            </div>
            );
        } else {
            return (
            <div>
                Waiting for host to start.
            </div>
            );
        }
    }

    render() {
        return (
            <div id="mainWindow">
                <StartButton isHost={this.state.isHost} StartGame={this.StartGame} ResetGame={this.ResetGame}/>
                <div id="turnIndicator">
                    {this.RenderTurnIndicator()}
                </div>
                <div id="playerList">
                    <PlayerList players={this.state.players} currentTurn={this.state.currentTurnName}/>
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
    socket.emit('leaveGame', this.playerID);
})

export default App;