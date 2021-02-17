import React from 'react';

const PlayerIcon = ({playerName, currentTurn}) => {
    function renderTurnIcon () {
        if (playerName === currentTurn) {
            return (
                <img id="arrowIcon" src="https://fecuiicons.s3.amazonaws.com/arrow.png"></img>
            )
        } else {
            return (
                <div>
                    
                </div>
            )
        }
    }
    return (
        <div className="playerIcon">
            {renderTurnIcon()}
            {playerName}
        </div>
    )
}

export default PlayerIcon;