import React from 'react';
import { Carousel } from 'react-bootstrap'
import { Fade } from 'react-slideshow-image';

const fadeImages = [
  '/images/01_ataulfohouse_apaloosa.jpg',
  '/images/26_ataulfohouse_apaloosa.jpg',
  '/images/26_ataulfohouse_apaloosa.jpg',
];


const Slideshow = () => {
  return (
    <React.Fragment>
      <Carousel>
        <Carousel.Item>
          <img style = {{height: '600px'}}
            className="d-block w-100"
            src={fadeImages[0]}
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
        <img style = {{height: '600px'}}
            className="d-block w-100"
            src={fadeImages[1]}
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
        <img style = {{height: '650px'}}
            className="d-block w-100"
            src={fadeImages[2]}
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>;
    </React.Fragment>
  )

}

export default Slideshow;