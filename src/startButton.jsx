import React from 'react';

const StartButton = ({ isHost, StartGame }) => {
    if (isHost) {
        return (
            <div>
                You are host!
                <button type="button" id="StartButton" onClick={StartGame}>Start Game</button>
            </div>
        )
    } else {
        return (
            <div>
                You are not host.
            </div>
        )
    }
}

export default StartButton;