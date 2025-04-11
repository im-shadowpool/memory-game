import React from 'react'
import CardsComponent from '../../Components/CardsComponent';
import "../../ThemeCSS/snow.css"

const ArrayOfCardsImgs = [
    { src: "/CardImages/snow/bag.webp", matched: false },
    { src: "/CardImages/snow/cake.webp", matched: false },
    { src: "/CardImages/snow/hat.webp", matched: false },
    { src: "/CardImages/snow/man.webp", matched: false },
    { src: "/CardImages/snow/penguin.webp", matched: false },
    { src: "/CardImages/snow/tree.webp", matched: false }
];

const coverImage = "/CardImages/snow/cover.webp";

const Snow = () => {

  return (
    <CardsComponent ArrayOfCardsImgs={ArrayOfCardsImgs} cover={coverImage} themeName="snow" />
  )
}

export default Snow