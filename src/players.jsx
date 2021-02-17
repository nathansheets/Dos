import React from 'react';
import PlayerIcon from './playerIcon.jsx';

const PlayerList = ({players, currentTurn}) => {
    return (
        <div id="playerList">
            {players.map(x => <PlayerIcon playerName={x} currentTurn={currentTurn} />)}
        </div>
    );
}

export default PlayerList;