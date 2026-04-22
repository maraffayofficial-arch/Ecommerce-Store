import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return toast.error('Please enter your email.')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/user/forgot-password', { email })
      if (res.data.success) {
        toast.success('OTP sent! Check your email.')
        navigate(`/reset-password?email=${encodeURIComponent(email)}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen flex items-center justify-center px-4 pt-24 pb-12'>
        <div className='bg-base-100 shadow-lg rounded-2xl p-8 w-full max-w-md'>
          <h2 className='text-2xl font-bold mb-1'>Forgot Password</h2>
          <p className='text-sm text-gray-500 mb-6'>Enter your account email and we'll send you a 6-digit OTP.</p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Email Address</label>
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full border px-3 py-2 rounded-lg outline-none focus:border-green-500'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60 transition-colors'
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <p className='text-sm text-center mt-5 text-gray-500'>
            Remembered it?{' '}
            <Link to='/' className='text-green-700 font-semibold underline'>Back to Home</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ForgotPassword
