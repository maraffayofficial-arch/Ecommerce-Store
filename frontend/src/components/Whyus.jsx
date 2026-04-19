import React from 'react'
import { MdVerified } from 'react-icons/md'
import { FaTruck } from 'react-icons/fa'
import { GiBowlOfRice } from 'react-icons/gi'

const features = [
  {
    icon: <GiBowlOfRice className='text-orange-500 text-6xl mx-auto mb-4' />,
    title: 'Serve Healthy Food',
    desc: 'We serve all healthy, preservative-free products. Order anything you like, tension free.'
  },
  {
    icon: <MdVerified className='text-orange-500 text-6xl mx-auto mb-4' />,
    title: 'Best Quality',
    desc: 'Our product quality is the best there is. Every batch is hand-prepared with care.'
  },
  {
    icon: <FaTruck className='text-orange-500 text-6xl mx-auto mb-4' />,
    title: 'Fast Delivery',
    desc: 'Delivery available all over Pakistan. Free delivery on orders above Rs. 5000.'
  }
]

const Whyus = () => {
  return (
    <section className='py-16 px-6 sm:px-12'>
      <div className='text-center max-w-2xl mx-auto mb-12'>
        <h1 className='font-extrabold text-4xl sm:text-5xl tracking-wide'>Why Choose Us?</h1>
        <p className='mt-4 text-gray-500 text-lg'>
          We use fresh, hand-picked ingredients and traditional recipes to deliver authentic flavours.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto'>
        {features.map((f, i) => (
          <div key={i} className='bg-base-200 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow'>
            {f.icon}
            <h2 className='font-bold text-2xl mb-3'>{f.title}</h2>
            <p className='text-gray-500 text-base'>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Whyus
