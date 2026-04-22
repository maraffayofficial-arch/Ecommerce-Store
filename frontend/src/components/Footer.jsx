import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSettings } from '../context/SettingsProvider'

const Footer = () => {
  const { contactInfo } = useSettings()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async () => {
    if (!email.trim()) return toast.error("Please enter your email.")
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/subscribe", { email })
      if (res.data.success) {
        toast.success(res.data.message)
        setSubscribed(true)
        setEmail('')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed.")
    } finally {
      setLoading(false)
    }
  }

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
            <li>{contactInfo?.email}</li>
            <li>{contactInfo?.phone}</li>
            <li>{contactInfo?.location}</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className='col-span-2 sm:col-span-1'>
          <h3 className='font-bold text-lg mb-4'>Newsletter</h3>
          <p className='text-sm text-gray-500 mb-3'>Get updates on new products and deals.</p>
          {subscribed ? (
            <p className='text-green-700 font-semibold text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3'>
              🎉 You're subscribed! Check your inbox for a welcome email.
            </p>
          ) : (
            <div className='flex flex-col sm:flex-row gap-2'>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                className='flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-green-500 text-sm bg-base-100'
                placeholder='Enter your email'
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className='bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-full text-sm cursor-pointer transition-colors'
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='border-t border-base-300 text-center py-4 text-sm text-gray-400'>
        © {new Date().getFullYear()} Urban Pickle. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
