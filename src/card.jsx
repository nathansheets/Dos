import React from 'react';

const Card = ({card, PlayCard}) => {
    function ClickHandler() {
        if (PlayCard) {
            PlayCard(card);
        }
    }

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
}

export default Card;