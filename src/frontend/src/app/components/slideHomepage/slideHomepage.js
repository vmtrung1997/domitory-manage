import React from 'react';
import { Fade } from 'react-slideshow-image';

const fadeImages = [
  '/images/01_ataulfohouse_apaloosa.jpg',
  '/images/26_ataulfohouse_apaloosa.jpg',
  '/images/26_ataulfohouse_apaloosa.jpg',
];


const fadeProperties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true
}

const Slideshow = () => {
  return (
    <Fade {...fadeProperties}>

      {fadeImages.map(img => {
        console.log(img);
        return (
          <React.Fragment>
            <div className="each-fade">
              <div className="image-container">
                <img style = {{height: "600px", width: "100%"}} src={img} />
              </div>
            </div>
          </React.Fragment>
        )
      })}


    </Fade>
  )
}

export default Slideshow;