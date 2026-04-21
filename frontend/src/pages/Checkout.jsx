import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartProvider'
import { useAuth } from '../context/AuthProvider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FaMoneyBillWave, FaUniversity, FaMobileAlt } from 'react-icons/fa'

const SHIPPING_FEE = 200

// ── Update these with your real account details ───────────────────────────────
const PAYMENT_INFO = {
  bank_transfer: {
    label: 'Bank Transfer',
    fields: [
      { key: 'Bank', value: 'Meezan Bank' },
      { key: 'Account Title', value: 'Urban Pickle' },
      { key: 'Account No.', value: '0123-4567890-1' },
      { key: 'IBAN', value: 'PK00MEZN0001234567890123' },
    ],
    note: 'Transfer to our bank account, then paste your Transaction ID below.',
    txnLabel: 'Transaction / Reference ID',
    color: 'blue',
  },
  jazzcash: {
    label: 'JazzCash',
    fields: [
      { key: 'JazzCash Number', value: '0300-1234567' },
      { key: 'Account Name', value: 'Urban Pickle' },
    ],
    note: 'Send money via JazzCash app or *786#, then paste your Transaction ID below.',
    txnLabel: 'JazzCash Transaction ID',
    color: 'orange',
  },
  easypaisa: {
    label: 'EasyPaisa',
    fields: [
      { key: 'EasyPaisa Number', value: '0311-1234567' },
      { key: 'Account Name', value: 'Urban Pickle' },
    ],
    note: 'Send money via EasyPaisa app or *786#, then paste your Transaction ID below.',
    txnLabel: 'EasyPaisa Transaction ID',
    color: 'emerald',
  },
}
// ─────────────────────────────────────────────────────────────────────────────

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay in cash when your order arrives', icon: <FaMoneyBillWave size={20} />, available: true },
  { id: 'bank_transfer', label: 'Bank Transfer', sub: 'Transfer to our bank account', icon: <FaUniversity size={20} />, available: true },
  { id: 'jazzcash', label: 'JazzCash', sub: 'Send via JazzCash wallet', icon: <FaMobileAlt size={20} />, available: true },
  { id: 'easypaisa', label: 'EasyPaisa', sub: 'Send via EasyPaisa wallet', icon: <FaMobileAlt size={20} />, available: true },
]

const Checkout = () => {
  const { cart, fetchCart, clearCart } = useCart()
  const [authUser] = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', city: '', postalCode: '', street: '',
  })
  const [transactionId, setTransactionId] = useState('')
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)

  const items = cart?.items || []
  const subtotal = items.reduce((sum, i) => sum + i.productId.price * i.quantity, 0)
  const total = subtotal + SHIPPING_FEE

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleOrder = async (e) => {
    e.preventDefault()
    if (items.length === 0) return toast.error("Your cart is empty!")
    const isPrepaid = ['bank_transfer', 'jazzcash', 'easypaisa'].includes(paymentMethod)
    if (isPrepaid && !transactionId.trim()) {
      return toast.error("Please enter your transaction ID after transferring.")
    }
    setLoading(true)
    try {
      if (authUser) {
        // Logged-in order — cart is DB-backed
        await axios.post("http://localhost:8000/order/place", {
          address: form,
          paymentMethod,
          transactionId: isPrepaid ? transactionId.trim() : '',
          newsletterOptIn,
        }, { headers: { Authorization: `Bearer ${authUser.token}` } })
        localStorage.setItem("hasNewOrder", "true")
        window.dispatchEvent(new Event("orderNotifUpdate"))
        await fetchCart()
        toast.success("Order placed successfully!")
        setTimeout(() => navigate('/orders'), 1500)
      } else {
        // Guest order — send items directly
        const guestItems = items.map(i => ({
          productId: i.productId._id,
          title: i.productId.title,
          price: i.productId.price,
          image: i.productId.images?.[0] || '',
          quantity: i.quantity,
        }))
        await axios.post("http://localhost:8000/order/place-guest", {
          items: guestItems,
          address: form,
          paymentMethod,
          transactionId: isPrepaid ? transactionId.trim() : '',
          newsletterOptIn,
        })
        await clearCart()
        toast.success("Order placed! Create an account to track it.")
        setTimeout(() => navigate('/'), 1500)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order")
    } finally { setLoading(false) }
  }

  const inputClass = 'w-full border border-base-300 rounded-lg px-4 py-2 mt-1 outline-none focus:border-green-500 bg-base-100 text-sm'
  const labelClass = 'text-sm font-semibold text-gray-500'

  return (
    <>
      <Navbar />
      <div className='min-h-screen pt-24 pb-12 px-4 sm:px-8 max-w-5xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-8 text-center'>Checkout</h1>

        {/* Guest register nudge */}
        {!authUser && (
          <div className='mb-6 bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
            <p className='text-sm text-orange-800'>
              <span className='font-semibold'>Already have an account?</span> Sign in to track your orders and get faster checkout.
            </p>
            <button onClick={() => document.getElementById("my_modal_3").showModal()}
              className='text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-full shrink-0'>
              Sign In / Register
            </button>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

          {/* ── Order Summary ─────────────────────────────────────────────── */}
          <div className='bg-base-100 shadow-md rounded-xl p-6 h-fit'>
            <h2 className='text-xl font-bold mb-4 text-green-700'>Order Summary</h2>
            {items.length === 0 && <p className='text-gray-400'>Your cart is empty.</p>}
            {items.map(i => (
              <div key={i.productId._id} className='flex justify-between items-center py-2 border-b border-base-200'>
                <div className='flex items-center gap-3'>
                  <img src={i.productId.images?.[0]} alt={i.productId.title}
                    className='w-10 h-10 rounded-lg object-cover' />
                  <div>
                    <p className='font-semibold text-sm'>{i.productId.title}</p>
                    <p className='text-xs text-gray-400'>Qty: {i.quantity}</p>
                  </div>
                </div>
                <p className='font-bold text-sm'>Rs. {i.productId.price * i.quantity}</p>
              </div>
            ))}
            <div className='mt-4 border-t border-base-200 pt-3 space-y-1'>
              <div className='flex justify-between text-sm text-gray-500'>
                <span>Subtotal</span><span>Rs. {subtotal}</span>
              </div>
              <div className='flex justify-between text-sm text-gray-500'>
                <span>Shipping</span><span>Rs. {SHIPPING_FEE}</span>
              </div>
              <div className='flex justify-between text-xl font-bold pt-2 border-t border-base-200'>
                <span>Total</span>
                <span className='text-green-700'>Rs. {total}</span>
              </div>
            </div>
          </div>

          {/* ── Delivery + Payment Form ───────────────────────────────────── */}
          <form onSubmit={handleOrder} className='bg-base-100 shadow-md rounded-xl p-6 flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-green-700'>Delivery Details</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className={labelClass}>Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required
                  placeholder='Ahmed Khan' className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required
                  placeholder='0300-1234567' className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email <span className='font-normal text-gray-400'>(optional)</span></label>
                <input name="email" value={form.email} onChange={handleChange} type="email"
                  placeholder='example@email.com' className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input name="city" value={form.city} onChange={handleChange} required
                  placeholder='Lahore' className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Postal Code <span className='font-normal text-gray-400'>(optional)</span></label>
                <input name="postalCode" value={form.postalCode} onChange={handleChange}
                  placeholder='54000' className={inputClass} />
              </div>
              <div className='sm:col-span-2'>
                <label className={labelClass}>Street Address *</label>
                <input name="street" value={form.street} onChange={handleChange} required
                  placeholder='House #5, Street 3, DHA Phase 6' className={inputClass} />
              </div>
            </div>

            {/* Newsletter */}
            <label className='flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600'>
              <input type='checkbox' checked={newsletterOptIn} onChange={e => setNewsletterOptIn(e.target.checked)}
                className='w-4 h-4 accent-green-700' />
              Email me with news and offers
            </label>

            {/* Payment Method */}
            <div>
              <h3 className='text-base font-bold text-gray-700 mb-2'>Payment Method</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {paymentMethods.map(pm => (
                  <button key={pm.id} type='button'
                    disabled={!pm.available}
                    onClick={() => pm.available && setPaymentMethod(pm.id)}
                    className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 text-left transition-all
                      ${!pm.available ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50' :
                        paymentMethod === pm.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-base-300 hover:border-green-400 bg-base-100'}`}>
                    <span className={`${paymentMethod === pm.id && pm.available ? 'text-green-700' : 'text-gray-400'}`}>
                      {pm.icon}
                    </span>
                    <div>
                      <p className={`font-semibold text-sm ${paymentMethod === pm.id && pm.available ? 'text-green-700' : 'text-gray-700'}`}>
                        {pm.label}
                      </p>
                      <p className='text-xs text-gray-400'>{pm.sub}</p>
                    </div>
                    {paymentMethod === pm.id && pm.available && (
                      <span className='ml-auto w-4 h-4 rounded-full bg-green-600 flex items-center justify-center'>
                        <svg className='w-2.5 h-2.5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Prepaid payment details (bank / jazzcash / easypaisa) */}
            {PAYMENT_INFO[paymentMethod] && (() => {
              const info = PAYMENT_INFO[paymentMethod]
              const borderColor = { blue: 'border-blue-200 bg-blue-50', orange: 'border-orange-200 bg-orange-50', emerald: 'border-emerald-200 bg-emerald-50' }[info.color]
              const textColor = { blue: 'text-blue-800', orange: 'text-orange-800', emerald: 'text-emerald-800' }[info.color]
              const inputBorder = { blue: 'border-blue-300 focus:border-blue-500', orange: 'border-orange-300 focus:border-orange-500', emerald: 'border-emerald-300 focus:border-emerald-500' }[info.color]
              return (
                <div className={`border rounded-xl p-4 flex flex-col gap-3 ${borderColor}`}>
                  <p className={`text-sm font-bold ${textColor}`}>{info.note}</p>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-1 text-sm'>
                    {info.fields.map(f => (
                      <React.Fragment key={f.key}>
                        <span className='text-gray-500'>{f.key}</span>
                        <span className='font-semibold font-mono'>{f.value}</span>
                      </React.Fragment>
                    ))}
                  </div>
                  <div>
                    <label className={`text-sm font-semibold ${textColor}`}>{info.txnLabel} *</label>
                    <input value={transactionId} onChange={e => setTransactionId(e.target.value)}
                      placeholder='Paste your transaction / reference ID here'
                      className={`w-full border rounded-lg px-4 py-2 mt-1 outline-none bg-white text-sm ${inputBorder}`} />
                  </div>
                  <p className={`text-xs ${textColor} opacity-70`}>Your order will be processed after payment is verified by our team.</p>
                </div>
              )
            })()}

            {/* COD note */}
            {paymentMethod === 'cod' && (
              <div className='bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm text-yellow-800'>
                Pay in cash when your order arrives at your doorstep.
              </div>
            )}

            <button type='submit' disabled={loading || items.length === 0}
              className='mt-1 bg-orange-500 text-white py-3 rounded-full font-bold text-lg hover:bg-orange-600 cursor-pointer disabled:opacity-60 transition-colors'>
              {loading ? "Placing Order..." : `Place Order — Rs. ${total}`}
            </button>
          </form>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout
