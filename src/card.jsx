import React from 'react';

const Card = ({card, PlayCard}) => {
    function ClickHandler() {
        if (PlayCard) {
            PlayCard(card);
        }
    }

    if (card) {
        return (
            <div className="card" onClick={ClickHandler}>
                <div className="cardFace" style={{backgroundColor:card.color}}>
                    <div className="innerCircle">.</div>
                    <div className="topLeft">
                        {card.value}
                    </div>
                    <div className="middle">
                        {card.value}
                    </div>
                    <div className="bottomRight">
                        {card.value}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="card" id="deck" onClick={ClickHandler}>
                <div className="cardFace" style={{backgroundColor:'black'}}>
                    <div className="innerCircle">.</div>
                    <div className="topLeft">
                        Dos
                    </div>
                    <div className="middle">
                        Dos
                    </div>
                    <div className="bottomRight">
                        Dos
                    </div>
                </div>
            </div>
        )
    }
}

export default Card;