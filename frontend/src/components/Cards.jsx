import React, { useState, useEffect } from 'react'
import Slick from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import CardElements from './CardElements'
import axios from 'axios'

const Cards = () => {
  const [product, setProduct] = useState([])

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get("http://localhost:8000/product")
        setProduct(res.data)
      } catch (error) {
        console.log("Error getting products: " + error)
      }
    }
    getProduct()
  }, [])

  const Slider = Slick.default || Slick

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ]
  }

  return (
    <section className='py-12 px-4 sm:px-8'>
      <div className='text-center max-w-2xl mx-auto mb-10'>
        <h1 className='font-extrabold text-4xl sm:text-5xl mb-3'>Latest Offers</h1>
        <p className='text-gray-500 text-lg'>Once a month we have a sale — these are our highest discounted products right now.</p>
      </div>
      <div className='overflow-x-hidden'>
        <Slider {...settings}>
          {product.map((item) => (
            <CardElements item={item} key={item._id} />
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default Cards
