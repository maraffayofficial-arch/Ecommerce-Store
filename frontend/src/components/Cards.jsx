import React from 'react'
import  Slick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import list from '../listfiles/list.json'
import CardElements from './CardElements';
const Cards = () => {
const cardItem=list.filter((data)=>{ return data.weight==="1kg"})
//   console.log(cardItem);
const Slider = Slick.default || Slick;

 var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };


 return (
  <>
    <div className='bg-white pl-20 pt-10 pb-5 text-black'>

      <h1 className='font-bold mb-4 text-4xl'>
        Deals/Sales
      </h1>
      <p className='text-lg text-black'>All of Our latest deals and Sales are displayed here</p>
    
    
      </div>
  <div className="slider-container" >
      <Slider {...settings}>
      {cardItem.map((item)=>{
       return <CardElements item={item} key={item.id} />
       })}
    
      </Slider>
    </div>

  </>
  )
}

export default Cards
