import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartProvider'
import { useAuth } from '../context/AuthProvider'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import axios from 'axios'

const FREE_THRESHOLD = 10000

const Cart = () => {
  const { cart, updateItem, removeItem, loading } = useCart()
  const [shippingSettings, setShippingSettings] = useState({ shippingFee: 199, freeShipping: false })

  useEffect(() => {
    axios.get("http://localhost:8000/settings/shipping")
      .then(r => setShippingSettings(r.data)).catch(() => {})
  }, [])
  const [authUser] = useAuth()
  const navigate = useNavigate()

  const items = cart?.items || []
  const subtotal = items.reduce((sum, i) => sum + i.productId.price * i.quantity, 0)
  const shippingFee = (shippingSettings.freeShipping || subtotal >= FREE_THRESHOLD) ? 0 : shippingSettings.shippingFee
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className='min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-500'>Your cart is empty</h1>
          <p className='text-gray-400 mt-2'>Add some delicious pickles to get started!</p>
          <Link to="/products">
            <button className='mt-6 bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800'>
              Shop Now
            </button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen pt-24 pb-12 px-4 sm:px-8 max-w-4xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-6 text-center'>Your Cart</h1>

        {/* Guest register nudge */}
        {!authUser && (
          <div className='mb-5 bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
            <p className='text-sm text-orange-800'>
              <span className='font-semibold'>Have an account?</span> Sign in to save your cart and track orders.
            </p>
            <button onClick={() => document.getElementById("my_modal_3").showModal()}
              className='text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-full shrink-0'>
              Sign In / Register
            </button>
          </div>
        )}

        <div className='space-y-4'>
          {items.map((item) => {
            const product = item.productId
            return (
              <div key={product._id} className='flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-base-100 shadow-md rounded-xl p-4'>
                <img src={product.images?.[0]} alt={product.title} className='w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg' />
                <div className='flex-1'>
                  <h2 className='font-bold text-lg'>{product.title}</h2>
                  <p className='text-green-700 font-semibold'>Rs. {product.price}</p>
                  <p className='text-sm text-gray-400'>{product.weight}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button onClick={() => updateItem(product._id, item.quantity - 1)} disabled={loading}
                    className='w-8 h-8 rounded-full bg-base-200 hover:bg-base-300 font-bold flex items-center justify-center'>−</button>
                  <span className='font-semibold w-6 text-center'>{item.quantity}</span>
                  <button onClick={() => updateItem(product._id, item.quantity + 1)} disabled={loading}
                    className='w-8 h-8 rounded-full bg-base-200 hover:bg-base-300 font-bold flex items-center justify-center'>+</button>
                </div>
                <p className='font-bold text-right min-w-[80px]'>Rs. {product.price * item.quantity}</p>
                <button onClick={() => removeItem(product._id)} className='text-red-500 hover:text-red-700'>
                  <FaTrash />
                </button>
              </div>
            )
          })}
        </div>

        <div className='mt-8 bg-base-100 shadow-md rounded-xl p-6'>
          <div className='flex justify-between text-base text-gray-600 mb-2'>
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <div className='flex justify-between text-base text-gray-600 mb-3 pb-3 border-b border-base-200'>
            <span>Shipping</span>
            {shippingFee === 0
              ? <span className='text-green-600 font-semibold'>Free 🎉</span>
              : <span>Rs. {shippingFee}</span>}
          </div>
          {subtotal > 0 && subtotal < FREE_THRESHOLD && !shippingSettings.freeShipping && (
            <p className='text-xs text-gray-400 mb-3'>
              Add <span className='font-semibold text-green-700'>Rs. {FREE_THRESHOLD - subtotal}</span> more to get free shipping!
            </p>
          )}
          <div className='flex justify-between text-xl font-bold mb-5'>
            <span>Total</span>
            <span className='text-green-700'>Rs. {total}</span>
          </div>
          <button onClick={() => navigate('/checkout')}
            className='w-full bg-orange-500 text-white py-3 rounded-full text-lg font-bold hover:bg-orange-600 cursor-pointer'>
            Proceed to Checkout
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Cart
