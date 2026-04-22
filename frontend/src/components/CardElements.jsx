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

        <figure className='relative'>
          <img src={item.images?.[0]} className="w-full h-60 object-cover" alt={item.title} />
          {item.discount > 0 && (
            <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
              {item.discount}% OFF
            </span>
          )}
        </figure>

        <div className="card-body">
          <h2 className="card-title text-lg">{item.title}</h2>
          <div className='flex gap-2 flex-wrap'>
            <span className='bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full capitalize'>{item.category}</span>
            <span className='bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full'>{item.weight}</span>
          </div>
          <p className='flex gap-1 text-yellow-500 text-sm'>
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </p>
          <p className='text-sm text-gray-600 line-clamp-2'>{item.discription}</p>
          {item.discount > 0 ? (
            <div className='flex items-center gap-2'>
              <p className='font-bold text-green-700 text-lg'>Rs. {Math.round(item.price - (item.price * item.discount / 100))}</p>
              <p className='text-sm text-gray-400 line-through'>Rs. {item.price}</p>
            </div>
          ) : (
            <p className='font-bold text-green-700 text-lg'>Rs. {item.price}</p>
          )}

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
