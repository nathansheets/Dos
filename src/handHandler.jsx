import React from 'react';
import Card from './card.jsx';

const HandHandler = ({cards, PlayCard}) => {
    function GetKey() {
        return Math.floor(Math.random() * Math.floor(999999999999));
    }
    return (
        <div id="hand">
            {cards.map(x => 
                <Card card={x} PlayCard={PlayCard} key={GetKey()}/>
            )}
        </div>
    )
}

export default HandHandler;