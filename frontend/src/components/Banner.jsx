import React from 'react'
import bannerImage from "../assets/acahr_front_img.png"

const Banner = () => {
    return (
        <div className='flex flex-col-reverse sm:flex-row items-center w-full pt-20 pb-10 px-6 sm:px-12 lg:px-24 gap-8 min-h-[90vh]'>

            {/* Text Side */}
            <div className='flex-1 text-center sm:text-left'>
                <h1 className='text-4xl sm:text-5xl lg:text-7xl text-black font-bold mb-6 leading-tight'>
                    Authentic Pakistani Achaar{' '}
                    <span className='text-orange-500'>Delivered Fresh!</span>
                </h1>
                <p className='text-base sm:text-lg text-gray-600 max-w-lg mx-auto sm:mx-0'>
                    Handcrafted achaar made with traditional recipes, bold spices, and the finest local ingredients. Bringing the real taste of Pakistan to your table.
                </p>

                <div className='mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto sm:mx-0'>
                    <input
                        type="email"
                        placeholder='Enter your email for updates'
                        className='flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-green-500'
                    />
                    <button className='bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full cursor-pointer transition-colors'>
                        Subscribe
                    </button>
                </div>

                <div className='mt-8 flex gap-4 justify-center sm:justify-start'>
                    <a href="/products">
                        <button className='bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-full text-lg cursor-pointer transition-colors'>
                            Shop Now
                        </button>
                    </a>
                    <a href="/about">
                        <button className='border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold px-8 py-3 rounded-full text-lg cursor-pointer transition-colors'>
                            Our Story
                        </button>
                    </a>
                </div>
            </div>

            {/* Image Side */}
            <div className='flex-1 flex justify-center items-center'>
                <img
                    src={bannerImage}
                    alt="Pakistani Achaar"
                    className='w-64 sm:w-80 lg:w-[420px] object-contain drop-shadow-2xl'
                />
            </div>
        </div>
    )
}

export default Banner
