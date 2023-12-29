import React from 'react';
import './SingleCard.css';

export default function SingleCard(props) {

    const handleClick = () =>{
      !props.disabled && props.handleChoice(props.card)  
    }

    return (
        <div className='card'>
            <div className={props.flipped ? "flipped" : ""}>
                <img className='front' src={props.card.src} alt="card front" />
                <img className='back' src="/img/cover.png" alt="card back" onClick={handleClick} />
            </div>
        </div>
    )

}