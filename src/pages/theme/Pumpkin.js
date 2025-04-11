import React from 'react'
import CardsComponent from '../../Components/CardsComponent';
import "../../ThemeCSS/pumpkin.css"

const ArrayOfCardsImgs = [
    { src: "/CardImages/pumpkin/pumpkin.webp", matched: false },
    { src: "/CardImages/pumpkin/pumpkin1.webp", matched: false },
    { src: "/CardImages/pumpkin/pumpkin3.webp", matched: false },
    { src: "/CardImages/pumpkin/door.webp", matched: false },
    { src: "/CardImages/pumpkin/box.webp", matched: false },
    { src: "/CardImages/pumpkin/kettle.webp", matched: false }
  ];

const coverImage = "/CardImages/pumpkin/cover.webp";

const Pumpkin = () => {
  return (
    <CardsComponent ArrayOfCardsImgs={ArrayOfCardsImgs} cover={coverImage} themeName="pumpkin" />
  )
}

export default Pumpkin


