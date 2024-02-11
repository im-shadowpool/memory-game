import { useEffect, useState } from 'react';
import SingleCard from './SingleCard';
import './App.css';

import img1 from './img (1).jpg'
import img2 from './img (2).jpg'
import img3 from './img (3).jpg'
import img4 from './img (4).jpg'
import img5 from './img (5).jpg'
import img6 from './img (6).jpg'

const ArrayOfCardsImgs = [
  { "src": img1, matched: false },
  { "src": img2, matched: false },
  { "src": img3, matched: false },
  { "src": img4, matched: false },
  { "src": img5, matched: false },
  { "src": img6, matched: false }
]
// Math.random() - 0.5. This function generates random numbers between 0 and 1 and then subtracts 0.5 from them
function App() {

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const shuffleCards = () => {
    const shuffledCards = [...ArrayOfCardsImgs, ...ArrayOfCardsImgs]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))
    // console.log(shuffledCards);
    setCards(shuffledCards);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
  }

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }

  useEffect(() => {
    if (choiceOne !== null && choiceTwo !== null) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }
            } else {
              return card;
            }
          })
        })
        resetChoices();
      } else {
        setTimeout(() => resetChoices(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  const resetChoices = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
    setTurns((prevTurns) => prevTurns + 1);
  }

useEffect(() =>{
  shuffleCards();
}, [])

  return (
    <div className='App'>
      <h1>Memory Game</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map(card => (
          // <div className="card" key={card.id}>
          //   <div>
          //     <img className='front' src={card.src} alt="card front" />
          //     <img className='back' src="/img/cover.png" alt="card front" />
          //   </div>
          // </div>
          <SingleCard
            card={card}
            key={card.id}
            handleChoice={handleChoice}
            flipped={choiceOne === card || choiceTwo === card || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  )
}

export default App;
