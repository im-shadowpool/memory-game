import React, { useMemo } from 'react'
import CardsComponent from '../../Components/CardsComponent';
import "../../ThemeCSS/forest.css"
import { useLocation } from 'react-router-dom';
import InvalidMatchBoard from '../../Components/InvalidMatchBoard';

const CardImages = [
    { src: "/CardImages/forest/bear.webp", matched: false },
    { src: "/CardImages/forest/elephant.webp", matched: false },
    { src: "/CardImages/forest/giraffe.webp", matched: false },
    { src: "/CardImages/forest/lion.webp", matched: false },
    { src: "/CardImages/forest/peacock.webp", matched: false },
    { src: "/CardImages/forest/tiger.webp", matched: false },
    { src: "/CardImages/coc/baloon.jpg", matched: false },
    { src: "/CardImages/coc/barberian.jpg", matched: false },
    { src: "/CardImages/coc/builder.jpg", matched: false },
    { src: "/CardImages/coc/giant.jpg", matched: false },
    { src: "/CardImages/coc/healer.jpg", matched: false },
    { src: "/CardImages/coc/witch.jpg", matched: false },
];

const coverImage = "/CardImages/forest/cover.webp";


// Utility to shuffle array
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const WildForest = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const boardSize = searchParams.get("board") || "3x4";

  // useMemo to generate the card array once
  const ArrayOfCardsImgs = useMemo(() => {
    const [rows, cols] = boardSize.split("x").map(Number);
    const totalCards = rows * cols;

    const pairCount = (totalCards / 2).toFixed(0);
    if (pairCount > CardImages.length) {
      return [];
    }

    const selectedImages = shuffleArray(CardImages).slice(0, pairCount);
    console.log("Selected Images:", selectedImages);
    return selectedImages
  }, [boardSize]);

  if(ArrayOfCardsImgs.length === 0) {
    return (
      <InvalidMatchBoard message={`The board size ${boardSize} is invalid. Please select a smaller board size.`} />
    );
  }

  return (
    <CardsComponent ArrayOfCardsImgs={ArrayOfCardsImgs} cover={coverImage} themeName="forest" boardSize={boardSize} />
  );
};

export default WildForest;
