import React from 'react'
import { FaStar } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'

const CardElements = ({ item }) => {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleBuyNow = (e) => {
    e.stopPropagation()
    addToCart(item._id, 1, item)
    navigate('/checkout')
  }

  return (
    <div className='text-black flex justify-center items-center h-full px-3 py-3'>
      <div className="card bg-white w-full max-w-[440px] h-auto hover:scale-105 duration-300 shadow-[0_0_10px_black] cursor-pointer"
        onClick={() => navigate(`/product/${item._id}`)}>

        <figure>
          <img src={item.images?.[0]} className="w-full h-60 object-cover" alt={item.title} />
        </figure>

        <div className="card-body">
          <h2 className="card-title text-lg">{item.title}</h2>
          <p className='flex gap-1 text-yellow-500 text-sm'>
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </p>
          <p className='text-sm text-gray-600 line-clamp-2'>{item.discription}</p>
          <p className='font-bold text-green-700 text-lg'>Rs. {item.price}</p>

          <div className="card-actions justify-between mt-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => addToCart(item._id, 1, item)}
              className="btn btn-sm bg-orange-500 text-white border-none hover:bg-orange-600 rounded-full px-4"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="btn btn-sm bg-green-700 text-white border-none hover:bg-green-800 rounded-full px-4"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardElements
