import React, { useMemo } from 'react';
import CardsComponent from '../../Components/CardsComponent';
import "../../ThemeCSS/sea-shell.css";
import { useLocation } from 'react-router-dom';
import InvalidMatchBoard from '../../Components/InvalidMatchBoard';

const CardImages = [
    { src: "/CardImages/sea-shell/sea-shell-1.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-2.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-3.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-4.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-5.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-6.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-7.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-8.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-9.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-10.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-11.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-12.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-13.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-14.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-15.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-16.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-17.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-18.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-19.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-20.webp", matched: false },
    { src: "/CardImages/sea-shell/sea-shell-21.webp", matched: false },
  ];
  

const coverImage = "/CardImages/sea-shell/cover.webp";

// Utility to shuffle array
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SeaShell = () => {
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
    <CardsComponent ArrayOfCardsImgs={ArrayOfCardsImgs} cover={coverImage} themeName="sea-shell" boardSize={boardSize} />
  );
};

export default SeaShell;
