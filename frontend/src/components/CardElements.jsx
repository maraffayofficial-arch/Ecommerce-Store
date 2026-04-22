// import React from 'react'
// import { FaStar } from "react-icons/fa"
// import { useNavigate } from 'react-router-dom'
// import { useCart } from '../context/CartProvider'
// import { useSettings } from '../context/SettingsProvider'

// const CardElements = ({ item }) => {
//   const { addToCart } = useCart()
//   const navigate = useNavigate()
//   const { globalSale } = useSettings()
//   const discount = globalSale > 0 ? globalSale : (item.discount || 0)

//   const handleBuyNow = (e) => {
//     e.stopPropagation()
//     addToCart(item._id, 1, item)
//     navigate('/checkout')
//   }

//   return (
//     <div className='text-black px-2 py-3'>
//       <div className="card bg-white w-full h-auto hover:scale-105 duration-300 shadow-[0_0_10px_black] cursor-pointer overflow-hidden"
//         onClick={() => navigate(`/product/${item._id}`)}>

//         <figure className='relative'>
//           <img src={item.images?.[0]} className="w-full h-60 object-cover" alt={item.title} />
//           {discount > 0 && (
//             <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
//               {discount}% OFF
//             </span>
//           )}
//         </figure>

//         <div className="card-body p-3 sm:p-5">
//           <h2 className="card-title text-lg">{item.title}</h2>
//           <div className='flex gap-2 flex-wrap'>
//             <span className='bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full capitalize'>{item.category}</span>
//             <span className='bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full'>{item.weight}</span>
//           </div>
//           <p className='flex gap-1 text-yellow-500 text-sm'>
//             <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
//           </p>
//           <p className='text-sm text-gray-600 line-clamp-2'>{item.discription}</p>

//           <div className='mt-auto pt-3' onClick={e => e.stopPropagation()}>
//             <div className='flex justify-between items-end'>
//               <p className='font-bold text-green-700 text-lg'>
//                 Rs. {discount > 0 ? Math.round(item.price - (item.price * discount / 100)) : item.price}
//               </p>
//               {discount > 0 && (
//                 <p className='text-base text-gray-400 line-through text-right pr-[25px]'>Rs. {item.price}</p>
//               )}
//             </div>
//             <div className='flex justify-between gap-2 mt-1.5'>
//               <button
//                 onClick={() => addToCart(item._id, 1, item)}
//                 className="btn btn-xs sm:btn-sm bg-orange-500 text-white border-none hover:bg-orange-600 rounded-full px-2 sm:px-4 flex-1"
//               >
//                 Add to Cart
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 className="btn btn-xs sm:btn-sm bg-green-700 text-white border-none hover:bg-green-800 rounded-full px-2 sm:px-4 flex-1"
//               >
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CardElements



import React from 'react'
import { FaStar } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import { useSettings } from '../context/SettingsProvider'

const CardElements = ({ item }) => {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const { globalSale } = useSettings()
  const discount = globalSale > 0 ? globalSale : (item.discount || 0)
  const discountedPrice = Math.round(item.price - (item.price * discount / 100))

  const handleBuyNow = (e) => {
    e.stopPropagation()
    addToCart(item._id, 1, item)
    navigate('/checkout')
  }

  return (
    <div
      className="bg-white rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.15)] cursor-pointer overflow-hidden
        hover:shadow-[0_4px_25px_rgba(0,0,0,0.25)] hover:scale-[1.03] transition-all duration-300 h-full flex flex-col"
      onClick={() => navigate(`/product/${item._id}`)}
    >
      {/* Image */}
      <figure className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={item.images?.[0]}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            {discount}% OFF
          </span>
        )}
      </figure>

      {/* Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Title */}
        <h2 className="font-semibold text-base sm:text-lg text-gray-900 leading-tight line-clamp-1">
          {item.title}
        </h2>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mt-2">
          <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
            {item.category}
          </span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {item.weight}
          </span>
        </div>

        {/* Stars */}
        <div className="flex gap-0.5 text-yellow-500 text-sm mt-2">
          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mt-1.5 leading-snug">
          {item.discription}
        </p>

        {/* Price & Buttons — pushed to bottom */}
        <div className="mt-auto pt-3" onClick={(e) => e.stopPropagation()}>
          {/* Price Row */}
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-green-700 text-lg">
              Rs. {discount > 0 ? discountedPrice : item.price}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                Rs. {item.price}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => addToCart(item._id, 1, item)}
              className="flex-1 py-2 text-xs sm:text-sm font-semibold rounded-full
                bg-orange-500 text-white hover:bg-orange-600
                active:scale-95 transition-all duration-200"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-2 text-xs sm:text-sm font-semibold rounded-full
                bg-green-700 text-white hover:bg-green-800
                active:scale-95 transition-all duration-200"
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