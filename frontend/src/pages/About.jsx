import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { MdVerified } from 'react-icons/md'
import { FaTruck, FaHeart, FaLeaf } from 'react-icons/fa'
import { GiBowlOfRice } from 'react-icons/gi'
import { Link } from 'react-router-dom'

const values = [
  { icon: <FaLeaf className='text-green-600 text-4xl' />, title: 'Natural Ingredients', desc: 'No preservatives, no artificial colours. Just real spices, fresh vegetables, and pure mustard oil.' },
  { icon: <FaHeart className='text-red-500 text-4xl' />, title: 'Made with Love', desc: 'Every jar is hand-prepared using recipes passed down through generations in Multan, Pakistan.' },
  { icon: <MdVerified className='text-orange-500 text-4xl' />, title: 'Quality Assured', desc: 'Each batch is taste-tested to ensure it meets our high standards before it reaches your table.' },
  { icon: <FaTruck className='text-blue-500 text-4xl' />, title: 'Delivered Fresh', desc: 'We pack and ship every order fresh so the flavours reach you at their absolute best.' },
]

const About = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className='pt-28 pb-16 px-6 sm:px-12 bg-gradient-to-br from-green-50 to-orange-50'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl sm:text-6xl font-extrabold mb-6'>
            The Story of <span className='text-green-700'>Urban</span>{' '}
            <span className='text-orange-500'>Pickle</span>
          </h1>
          <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            We started with one simple belief — the best achaar comes from real recipes, real spices, and real care.
            No shortcuts. No factories. Just the authentic taste of Pakistan.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className='py-16 px-6 sm:px-12 max-w-5xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-3xl sm:text-4xl font-bold mb-5'>How It All Started</h2>
            <p className='text-gray-600 text-base leading-relaxed mb-4'>
              Urban Pickle was born in the heart of Multan — a city famous across Pakistan for its bold flavours and rich culinary heritage.
              Our family has been making achaar for over two decades, using recipes that our grandmother perfected in her kitchen.
            </p>
            <p className='text-gray-600 text-base leading-relaxed mb-4'>
              What started as jars gifted to neighbours and relatives soon turned into a passion. Friends kept asking for more.
              So we decided to share these flavours with the whole country — and now, with you.
            </p>
            <p className='text-gray-600 text-base leading-relaxed'>
              Every jar of Urban Pickle is still made by hand, in small batches, with the same ingredients and the same love.
              We never compromise on quality, because we know you can taste the difference.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-orange-500 rounded-2xl h-40 flex items-center justify-center shadow-lg'>
              <div className='text-center text-white'>
                <p className='text-4xl font-extrabold'>18+</p>
                <p className='text-sm font-medium'>Products</p>
              </div>
            </div>
            <div className='bg-green-700 rounded-2xl h-40 flex items-center justify-center shadow-lg'>
              <div className='text-center text-white'>
                <p className='text-4xl font-extrabold'>2K+</p>
                <p className='text-sm font-medium'>Happy Customers</p>
              </div>
            </div>
            <div className='bg-green-700 rounded-2xl h-40 flex items-center justify-center shadow-lg'>
              <div className='text-center text-white'>
                <p className='text-4xl font-extrabold'>100%</p>
                <p className='text-sm font-medium'>Natural</p>
              </div>
            </div>
            <div className='bg-orange-500 rounded-2xl h-40 flex items-center justify-center shadow-lg'>
              <div className='text-center text-white'>
                <p className='text-4xl font-extrabold'>20+</p>
                <p className='text-sm font-medium'>Years Recipe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className='py-16 px-6 sm:px-12 bg-base-200'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl sm:text-4xl font-bold'>What We Stand For</h2>
            <p className='text-gray-500 mt-3 text-lg'>The principles that guide every jar we make.</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {values.map((v, i) => (
              <div key={i} className='bg-base-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex justify-center mb-4'>{v.icon}</div>
                <h3 className='font-bold text-lg mb-2'>{v.title}</h3>
                <p className='text-gray-500 text-sm'>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-16 px-6 text-center bg-green-700 text-white'>
        <h2 className='text-3xl sm:text-4xl font-extrabold mb-4'>Ready to taste the difference?</h2>
        <p className='text-green-100 text-lg mb-8 max-w-xl mx-auto'>
          Browse our collection of handcrafted achaar, chatni, and sauces — delivered fresh to your door.
        </p>
        <Link to="/products">
          <button className='bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-3 rounded-full text-lg cursor-pointer transition-colors'>
            Shop Now
          </button>
        </Link>
      </section>

      <Footer />
    </>
  )
}

export default About
