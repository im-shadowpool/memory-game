import React, {useMemo} from 'react'
import CardsComponent from '../../Components/CardsComponent';
import { useLocation } from 'react-router-dom';
import InvalidMatchBoard from '../../Components/InvalidMatchBoard';
import "../../ThemeCSS/snow.css"

const CardImages = [
    { src: "/CardImages/snow/bag.webp", matched: false },
    { src: "/CardImages/snow/cake.webp", matched: false },
    { src: "/CardImages/snow/hat.webp", matched: false },
    { src: "/CardImages/snow/man.webp", matched: false },
    { src: "/CardImages/snow/penguin.webp", matched: false },
    { src: "/CardImages/snow/tree.webp", matched: false },
    { src: "/CardImages/coc/baloon.jpg", matched: false },
    { src: "/CardImages/coc/barberian.jpg", matched: false },
    { src: "/CardImages/coc/builder.jpg", matched: false },
    { src: "/CardImages/coc/giant.jpg", matched: false },
    { src: "/CardImages/coc/healer.jpg", matched: false },
    { src: "/CardImages/coc/witch.jpg", matched: false },
];

const coverImage = "/CardImages/snow/cover.webp";

// Utility to shuffle array
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Snow = () => {
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
    <CardsComponent ArrayOfCardsImgs={ArrayOfCardsImgs} cover={coverImage} themeName="snow" boardSize={boardSize} />
  );
};

export default Snow;
