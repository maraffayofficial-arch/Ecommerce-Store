import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartProvider'
import { useAuth } from '../context/AuthProvider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const { cart, fetchCart } = useCart()
  const [authUser] = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '', city: '', street: '' })

  const items = cart?.items || []
  const total = items.reduce((sum, i) => sum + i.productId.price * i.quantity, 0)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleOrder = async (e) => {
    e.preventDefault()
    if (items.length === 0) return toast.error("Your cart is empty!")
    setLoading(true)
    try {
      await axios.post("http://localhost:8000/order/place", { address: form }, {
        headers: { Authorization: `Bearer ${authUser?.token}` }
      })
      toast.success("Order placed successfully!")
      localStorage.setItem("hasNewOrder", "true")
      window.dispatchEvent(new Event("orderNotifUpdate"))
      await fetchCart()
      setTimeout(() => navigate('/orders'), 1500)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order")
    } finally { setLoading(false) }
  }

  const inputClass = 'w-full border border-base-300 rounded-lg px-4 py-2 mt-1 outline-none focus:border-green-500 bg-base-100'

  return (
    <>
      <Navbar />
      <div className='min-h-screen pt-24 pb-12 px-4 sm:px-8 max-w-4xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-8 text-center'>Checkout</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>

          {/* Order Summary */}
          <div className='bg-base-100 shadow-md rounded-xl p-6'>
            <h2 className='text-xl font-bold mb-4 text-green-700'>Order Summary</h2>
            {items.length === 0 && <p className='text-gray-400'>Your cart is empty.</p>}
            {items.map(i => (
              <div key={i.productId._id} className='flex justify-between items-center py-2 border-b border-base-200'>
                <div>
                  <p className='font-semibold text-sm'>{i.productId.title}</p>
                  <p className='text-xs text-gray-400'>Qty: {i.quantity}</p>
                </div>
                <p className='font-bold text-sm'>Rs. {i.productId.price * i.quantity}</p>
              </div>
            ))}
            <div className='flex justify-between mt-4 text-xl font-bold'>
              <span>Total</span>
              <span className='text-green-700'>Rs. {total}</span>
            </div>
            <div className='mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm text-yellow-800'>
              Payment on Delivery — Cash only
            </div>
          </div>

          {/* Address Form */}
          <form onSubmit={handleOrder} className='bg-base-100 shadow-md rounded-xl p-6 flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-green-700'>Delivery Details</h2>

            <div>
              <label className='text-sm font-semibold text-gray-500'>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required
                placeholder='e.g. Ahmed Khan' className={inputClass} />
            </div>
            <div>
              <label className='text-sm font-semibold text-gray-500'>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} required
                placeholder='e.g. 0300-1234567' className={inputClass} />
            </div>
            <div>
              <label className='text-sm font-semibold text-gray-500'>City</label>
              <input name="city" value={form.city} onChange={handleChange} required
                placeholder='e.g. Lahore' className={inputClass} />
            </div>
            <div>
              <label className='text-sm font-semibold text-gray-500'>Street Address</label>
              <input name="street" value={form.street} onChange={handleChange} required
                placeholder='e.g. House #5, Street 3, DHA Phase 6' className={inputClass} />
            </div>

            <button type='submit' disabled={loading}
              className='mt-2 bg-orange-500 text-white py-3 rounded-full font-bold text-lg hover:bg-orange-600 cursor-pointer disabled:opacity-60 transition-colors'>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout
