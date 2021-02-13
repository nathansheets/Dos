import React from 'react';

const Card = ({color, value}) => {
    return (
        <div className="card">
            <div className="cardFace" style={{backgroundColor:color}}>
                <div className="innerCircle">.</div>
                <div className="topLeft">
                    {value}
                </div>
                <div className="middle">
                    {value}
                </div>
                <div className="bottomRight">
                    {value}
                </div>
            </div>
        </div>
    )
}

export default Card;