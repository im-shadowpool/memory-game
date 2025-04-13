import { useEffect, useState, useCallback } from "react";
import SingleCard from "./SingleCard";
import { Link } from "react-router-dom";
import "./Cards.css";
import InvalidMatchBoard from "./InvalidMatchBoard";

const CardsComponent = ({ ArrayOfCardsImgs, cover, themeName, boardSize }) => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [misses, setMisses] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // New state to track if game has started

  // New state variables to trigger delayed effects
  const [blurActivated, setBlurActivated] = useState(false);
  const [footerActivated, setFooterActivated] = useState(false);

  const accuracy =
    turns === 0 ? 100 : Math.round(((turns - misses) / turns) * 100);

  const shuffleCards = useCallback(() => {
    const shuffledCards = [...ArrayOfCardsImgs, ...ArrayOfCardsImgs]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
    setMisses(0);
    setMatchedPairs(0);
    setSeenCards(new Set());
    setGameStartTime(null); // Reset start time
    setCurrentTime("00:00"); // Reset displayed time
    setGameCompleted(false);
    setGameStarted(false); // Reset game started flag
    // Reset delayed effects when a new game starts:
    setBlurActivated(false);
    setFooterActivated(false);
  }, [ArrayOfCardsImgs]);

  const handleChoice = (card) => {
    if (disabled || card === choiceOne || card.matched || gameCompleted) return;

    // Start the timer on first card selection if not already started
    if (!gameStarted) {
      setGameStarted(true);
      setGameStartTime(new Date());
    }

    if (choiceOne) {
      setChoiceTwo(card);
      // Count a miss if card was seen previously and does not match the first card
      if (seenCards.has(card.src) && card.src !== choiceOne.src) {
        setMisses((prev) => prev + 1);
      }
    } else {
      setChoiceOne(card);
    }
  };

  // Using a Set to store which card images have been seen
  const [seenCards, setSeenCards] = useState(new Set());

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
        resetChoices();
      } else {
        setSeenCards((prev) => {
          const newSet = new Set(prev);
          newSet.add(choiceOne.src);
          newSet.add(choiceTwo.src);
          return newSet;
        });
        setTimeout(resetChoices, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetChoices = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => prev + 1);
    setDisabled(false);
  };

  // Timer to update the current time
  useEffect(() => {
    let interval;
    if (gameStartTime && !gameCompleted && gameStarted) {
      // Only run if game has started and isn't completed
      interval = setInterval(() => {
        const now = new Date();
        const diff = new Date(now - gameStartTime);
        const minutes = diff.getUTCMinutes().toString().padStart(2, "0");
        const seconds = diff.getUTCSeconds().toString().padStart(2, "0");
        setCurrentTime(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStartTime, gameCompleted, gameStarted]);

  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  // Set gameCompleted to true when all pairs are matched
  useEffect(() => {
    if (matchedPairs > 0 && matchedPairs === ArrayOfCardsImgs.length) {
      setGameCompleted(true);

      setTimeout(() => {
        setBlurActivated(true);
      }, 1200);

      setTimeout(() => {
        setFooterActivated(true);
      }, 2000);
    }
  }, [matchedPairs, ArrayOfCardsImgs.length]);

  const [rows, cols] = boardSize.split("x").map(Number);

  const colwidth = (rows * cols) < 17 ? "60%" : "70%";

  if ((rows * cols) % 2 !== 0) {
    return (
      <InvalidMatchBoard
        message={"Matching games require an even number of cards."}
      />
    );
  }

  return (
    <div className="game-container">
      <div className="inner-container" style={{width: colwidth}}>
        <div
          className={`card-grid ${blurActivated ? "game-over-grid" : ""}`}
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {cards.map((card, index) => (
            <SingleCard
              card={card}
              key={card.id}
              handleChoice={handleChoice}
              flipped={choiceOne === card || choiceTwo === card || card.matched}
              matched={card.matched}
              disabled={disabled || gameCompleted}
              cover={cover}
              gameCompleted={gameCompleted}
              animationDelay={gameCompleted ? `${index * 0.1}s` : "0s"}
            />
          ))}
        </div>

        <div
          className={`game-footer ${footerActivated ? "game-over-footer" : ""}`}
        >
          <div className="score-board">
            <div className="score-div">
              <h3>{turns}</h3>
              <p>Turns</p>
            </div>
            <div className="score-div">
              <h3>{misses}</h3>
              <p>Misses</p>
            </div>
            <div className="score-div">
              <h3>{accuracy}%</h3>
              <p>Accuracy</p>
            </div>
            <div className="score-div">
              <h3 className="timer">{currentTime}</h3>
              <p>Time</p>
            </div>
          </div>
          <div className="game-footer-buttons">
            <button onClick={shuffleCards} className={`${themeName}-button`}>
              Reset Game
            </button>
            <Link to={`/theme/`}>
              <button className={`${themeName}-button`}>Change Theme</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsComponent;
