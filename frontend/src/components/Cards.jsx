// import React, { useState, useEffect } from 'react'
// import Slick from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
// import CardElements from './CardElements'
// import axios from 'axios'
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// const PrevArrow = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-green-700 hover:text-white transition-colors -ml-3'
//   >
//     <FaChevronLeft size={14} />
//   </button>
// )

// const NextArrow = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-green-700 hover:text-white transition-colors -mr-3'
//   >
//     <FaChevronRight size={14} />
//   </button>
// )

// const sliderSettings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 4,
//   slidesToScroll: 1,
//   swipeToSlide: true,
//   prevArrow: <PrevArrow />,
//   nextArrow: <NextArrow />,
//   responsive: [
//     { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 1 } },
//     { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
//     { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } },
//     { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } },
//   ]
// }

// const Cards = () => {
//   const [product, setProduct] = useState([])
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     const getProduct = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/product")
//         setProduct(res.data)
//       } catch (error) {
//         console.log("Error getting products: " + error)
//       }
//     }
//     getProduct()
//   }, [])

//   const Slider = Slick.default || Slick
//   const reversed = [...product].reverse()

//   return (
//     <section className='py-12 px-2 sm:px-10 overflow-hidden'>
//       <div className='text-center max-w-2xl mx-auto mb-10'>
//         <h1 className='font-extrabold text-4xl sm:text-5xl mb-3'>Latest Offers</h1>
//         <p className='text-gray-500 text-lg'>Once a month we have a sale — these are our highest discounted products right now.</p>
//       </div>

//       {/* Carousel 1 */}
//       {mounted && product.length > 0 && (
//         <div className='relative mx-1 sm:mx-4'>
//           <Slider key={`c1-${product.length}`} {...sliderSettings}>
//             {product.map((item) => (
//               <CardElements item={item} key={item._id} />
//             ))}
//           </Slider>
//         </div>
//       )}

//       {/* Carousel 2 */}
//       {mounted && product.length > 0 && (
//         <div className='relative mx-1 sm:mx-4 mt-10'>
//           <Slider key={`c2-${product.length}`} {...sliderSettings}>
//             {reversed.map((item) => (
//               <CardElements item={item} key={item._id + '_2'} />
//             ))}
//           </Slider>
//         </div>
//       )}
//     </section>
//   )
// }

// export default Cards





import React, { useState, useEffect, useRef } from 'react'
import CardElements from './CardElements'
import axios from 'axios'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import API_URL from '../config'

const Carousel = ({ items, id }) => {
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [items])

  const scroll = (direction) => {
    const el = trackRef.current
    if (!el) return
    // Scroll by one card width + gap
    const card = el.querySelector('.carousel-card')
    const scrollAmount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className="relative group">
      {/* Left Arrow — hidden on mobile */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center hover:bg-green-700 hover:text-white transition-colors -ml-4 opacity-0 group-hover:opacity-100 duration-200"
          aria-label="Scroll left"
        >
          <FaChevronLeft size={14} />
        </button>
      )}

      {/* Scrollable Track */}
      <div
        ref={trackRef}
        id={id}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`#${id}::-webkit-scrollbar { display: none; }`}</style>
        {items.map((item) => (
          <div
            key={item._id}
            className="carousel-card snap-start shrink-0 h-full
              w-[85%]
              min-[480px]:w-[46%]
              md:w-[31%]
              lg:w-[23.5%]"
          >
            <CardElements item={item} />
          </div>
        ))}
      </div>

      {/* Right Arrow — hidden on mobile */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center hover:bg-green-700 hover:text-white transition-colors -mr-4 opacity-0 group-hover:opacity-100 duration-200"
          aria-label="Scroll right"
        >
          <FaChevronRight size={14} />
        </button>
      )}

      {/* Scroll Indicator Dots (mobile only) */}
      <div className="flex sm:hidden justify-center gap-1.5 mt-2">
        {items.slice(0, Math.min(items.length, 8)).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        ))}
      </div>
    </div>
  )
}

const Cards = () => {
  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/product`)
        setProduct(res.data)
      } catch (error) {
        console.log("Error getting products: " + error)
      } finally {
        setLoading(false)
      }
    }
    getProduct()
  }, [])

  const reversed = [...product].reverse()
  const mid = Math.floor(product.length / 2)
  const middleFirst = [...product.slice(mid), ...product.slice(0, mid)]

  return (
    <>
      {/* Latest Offers heading — standalone */}
      <section className="py-12 px-2 sm:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-extrabold text-4xl sm:text-5xl mb-3">Latest Offers</h1>
          <p className="text-gray-500 text-lg">
            Once a month we have a sale — these are our highest discounted products right now.
          </p>
        </div>
      </section>

      {/* Independent Carousels */}
      {loading ? (
        <div className="flex gap-4 px-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shrink-0 w-[85%] min-[480px]:w-[46%] md:w-[31%] lg:w-[23.5%]">
              <div className="bg-base-200 animate-pulse rounded-lg h-[420px]" />
            </div>
          ))}
        </div>
      ) : product.length > 0 ? (
        <>
          <div className="px-4 sm:px-14 pt-3">
            <Carousel items={reversed} id="carousel-1" />
          </div>

          <div className="px-4 sm:px-14 mt-20 pt-3">
            <Carousel items={middleFirst} id="carousel-2" />
          </div>

          <div className="px-4 sm:px-14 mt-20 pt-3 pb-12">
            <Carousel items={product} id="carousel-3" />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 py-10">No products found.</p>
      )}
    </>
  )
}

export default Cards