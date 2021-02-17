import React from 'react';

const StartButton = ({ isHost, StartGame, ResetGame }) => {
    if (isHost) {
        return (
            <div>
                You are host!
                <button type="button" id="StartButton" onClick={StartGame}>Start Game</button>
                <button type="button" id="ResetButton" onClick={ResetGame}>Reset Game</button>
            </div>
        )
    } else {
        return (
            <div>
                
            </div>
        )
    }
}

export default StartButton;