import React from 'react';

const Card = ({card, PlayCard}) => {
    const style = {
        transform: 'rotate(-60deg)', 
        fontSize: '40pt', 
        marginTop: '20%',
        marginBottom: '25%',
        textAlign: 'center',
        height: '70px'
    }
    function ClickHandler() {
        if (PlayCard) {
            PlayCard(card);
        }
    }

    function IsRotated(value) {
        if (value.length > 2) {
            return style;
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
                    <div className="middle" style={IsRotated(card.value)}>
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
                    <div className="middle" style={style}>
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