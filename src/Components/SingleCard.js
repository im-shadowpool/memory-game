import './SingleCard.css';

export default function SingleCard({ card, handleChoice, flipped, matched, disabled, cover, gameCompleted, animationDelay }) {

  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div 
      className={`card ${gameCompleted ? "game-over" : ""}`}
      style={gameCompleted ? { animationDelay } : {}}
    >
      <div className={flipped ? "flipped" : ""} id={matched ? "matched" : ""}>
        <img className='front' src={card.src} alt="card front" />
        <img className='back' src={cover} alt="card back" onClick={handleClick} />
      </div>
    </div>
  );
}
