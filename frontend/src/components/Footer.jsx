import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-base-200 mt-10 border-t border-base-300'>
      <div className='max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8'>

        {/* Brand */}
        <div className='col-span-2 sm:col-span-2 lg:col-span-1'>
          <h2 className='text-2xl font-bold text-green-700 mb-2'>Urban <span className='text-orange-500'>Pickle</span></h2>
          <p className='text-sm text-gray-500 max-w-xs'>
            Authentic Pakistani achaar and chatni, handcrafted with traditional recipes and the finest local spices.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className='font-bold text-lg mb-4'>Menu</h3>
          <ul className='space-y-2 text-gray-500'>
            <li><Link to="/" className='hover:text-green-700 transition-colors'>Home</Link></li>
            <li><Link to="/products" className='hover:text-green-700 transition-colors'>Products</Link></li>
            <li><Link to="/about" className='hover:text-green-700 transition-colors'>About Us</Link></li>
            <li><Link to="/contact" className='hover:text-green-700 transition-colors'>Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className='font-bold text-lg mb-4'>Contact</h3>
          <ul className='space-y-2 text-gray-500 text-sm'>
            <li>urbanpickle@gmail.com</li>
            <li>+92 323-5073652</li>
            <li>26000, Multan, Pakistan</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className='col-span-2 sm:col-span-1'>
          <h3 className='font-bold text-lg mb-4'>Newsletter</h3>
          <p className='text-sm text-gray-500 mb-3'>Get updates on new products and deals.</p>
          <div className='flex flex-col sm:flex-row gap-2'>
            <input
              type="email"
              className='flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-green-500 text-sm bg-base-100'
              placeholder='Enter your email'
            />
            <button className='bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full text-sm cursor-pointer'>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className='border-t border-base-300 text-center py-4 text-sm text-gray-400'>
        © {new Date().getFullYear()} Urban Pickle. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
