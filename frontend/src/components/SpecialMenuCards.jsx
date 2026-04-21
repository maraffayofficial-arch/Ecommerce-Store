import React from 'react'
import { FaStar } from "react-icons/fa"
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartProvider'

const SpecialMenuCards = ({ item }) => {
    const { addToCart } = useCart()

    return (
        <div className='flex flex-col rounded-2xl shadow-lg overflow-hidden bg-base-100 hover:shadow-xl transition-shadow duration-300'>
            <div className='bg-orange-500 flex items-center justify-center p-6 h-52'>
                <img
                    src={item.images?.[0]}
                    alt={item.title}
                    className='h-40 w-40 object-cover rounded-full border-4 border-white shadow-md' />
            </div>
            <div className='p-6 text-center flex flex-col gap-2 flex-1'>
                <h2 className='font-bold text-2xl'>{item.title}</h2>
                <p className='flex justify-center gap-1 text-yellow-500'>
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    <span className='text-gray-400 text-sm ml-1'>(120)</span>
                </p>
                <p className='text-gray-500 text-sm line-clamp-3'>{item.discription}</p>
                <p className='text-green-700 font-bold text-xl mt-1'>Rs. {item.price}</p>
                <div className='flex gap-3 justify-center mt-3'>
                    <button
                        onClick={() => addToCart(item._id, 1, item)}
                        className='bg-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 cursor-pointer text-sm'
                    >
                        Add to Cart
                    </button>
                    <Link to={`/product/${item._id}`}>
                        <button className='border-2 border-green-700 text-green-700 px-5 py-2 rounded-full font-semibold hover:bg-green-50 text-sm'>
                            View
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SpecialMenuCards
