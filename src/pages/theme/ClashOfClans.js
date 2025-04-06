import React from 'react'
import CardsComponent from '../../Components/CardsComponent';

const ArrayOfCardsImgs = [
    { src: "/CardImages/coc/baloon.jpg", matched: false },
    { src: "/CardImages/coc/barberian.jpg", matched: false },
    { src: "/CardImages/coc/builder.jpg", matched: false },
    { src: "/CardImages/coc/giant.jpg", matched: false },
    { src: "/CardImages/coc/healer.jpg", matched: false },
    { src: "/CardImages/coc/witch.jpg", matched: false }
  ];

const coverImage = "/CardImages/coc/cover.jpg";

const ClashOfClans = () => {
  return (
    <CardsComponent ArrayOfCardsImgs={ArrayOfCardsImgs} cover={coverImage} />
  )
}

export default ClashOfClans