import React from 'react'
import CardsComponent from '../../Components/CardsComponent';
import "../../ThemeCSS/forest.css"

const ArrayOfCardsImgs = [
    { src: "/CardImages/forest/bear.webp", matched: false },
    { src: "/CardImages/forest/elephant.webp", matched: false },
    { src: "/CardImages/forest/giraffe.webp", matched: false },
    { src: "/CardImages/forest/lion.webp", matched: false },
    { src: "/CardImages/forest/peacock.webp", matched: false },
    { src: "/CardImages/forest/tiger.webp", matched: false }
];

const coverImage = "/CardImages/forest/cover.webp";

const WildForest = () => {

  return (
    <CardsComponent ArrayOfCardsImgs={ArrayOfCardsImgs} cover={coverImage} themeName="forest" />
  )
}

export default WildForest;