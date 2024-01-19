// CardCarousel.js
import React from 'react';
import { Carousel } from 'react-bootstrap';

const CarouselComponent = ({ cardData }) => {
  return (
    <Carousel>
      {cardData.map((card, index) => (
        <Carousel.Item key={index}>
          <CardComponent {...card} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

const CardComponent = ({ title, description, imageSrc }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <img src={imageSrc} alt={title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
    <Carousel.Caption>
      <h3>{title}</h3>
      <p>{description}</p>
    </Carousel.Caption>
  </div>
);

export default CarouselComponent;