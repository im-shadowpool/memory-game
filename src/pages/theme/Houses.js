import React, { useMemo } from 'react';
import CardsComponent from '../../Components/CardsComponent';
import "../../ThemeCSS/houses.css";
import { useLocation } from 'react-router-dom';
import InvalidMatchBoard from '../../Components/InvalidMatchBoard';

const CardImages = [
    { src: "/CardImages/houses/houses-1.webp", matched: false },
    { src: "/CardImages/houses/houses-2.webp", matched: false },
    { src: "/CardImages/houses/houses-3.webp", matched: false },
    { src: "/CardImages/houses/houses-4.webp", matched: false },
    { src: "/CardImages/houses/houses-5.webp", matched: false },
    { src: "/CardImages/houses/houses-6.webp", matched: false },
    { src: "/CardImages/houses/houses-7.webp", matched: false },
    { src: "/CardImages/houses/houses-8.webp", matched: false },
    { src: "/CardImages/houses/houses-9.webp", matched: false },
    { src: "/CardImages/houses/houses-10.webp", matched: false },
    { src: "/CardImages/houses/houses-11.webp", matched: false },
    { src: "/CardImages/houses/houses-12.webp", matched: false },
    { src: "/CardImages/houses/houses-13.webp", matched: false },
    { src: "/CardImages/houses/houses-14.webp", matched: false },
    { src: "/CardImages/houses/houses-15.webp", matched: false },
    { src: "/CardImages/houses/houses-16.webp", matched: false },
    { src: "/CardImages/houses/houses-17.webp", matched: false },
    { src: "/CardImages/houses/houses-18.webp", matched: false },
    { src: "/CardImages/houses/houses-19.webp", matched: false },
    { src: "/CardImages/houses/houses-20.webp", matched: false },
    { src: "/CardImages/houses/houses-21.webp", matched: false },
    { src: "/CardImages/houses/houses-22.webp", matched: false },
  ];
  

const coverImage = "/CardImages/houses/cover.webp";

// Utility to shuffle array
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Houses = () => {
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
      <InvalidMatchBoard themeName="houses" message={`The board size ${boardSize} is invalid. Please select a smaller board size.`} />
    );
  }

  return (
    <CardsComponent ArrayOfCardsImgs={ArrayOfCardsImgs} cover={coverImage} themeName="houses" boardSize={boardSize} />
  );
};

export default Houses;
