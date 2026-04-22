import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import API_URL from '../config'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirm) return toast.error('Passwords do not match.')
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/user/reset-password`, { email, otp, newPassword })
      if (res.data.success) {
        toast.success('Password reset! You can now log in.')
        navigate('/')
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
          <h2 className='text-2xl font-bold mb-1'>Reset Password</h2>
          <p className='text-sm text-gray-500 mb-6'>
            Enter the OTP sent to <span className='font-semibold text-green-700'>{email}</span> and choose a new password.
          </p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>OTP Code</label>
              <input
                type='text'
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder='6-digit code'
                className='w-full border px-3 py-2 rounded-lg outline-none focus:border-green-500 tracking-widest text-center text-xl font-bold'
                maxLength={6}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>New Password</label>
              <input
                type='password'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder='Min. 6 characters'
                className='w-full border px-3 py-2 rounded-lg outline-none focus:border-green-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Confirm New Password</label>
              <input
                type='password'
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder='Repeat password'
                className='w-full border px-3 py-2 rounded-lg outline-none focus:border-green-500'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60 transition-colors'
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className='text-sm text-center mt-5 text-gray-500'>
            Didn't get the OTP?{' '}
            <Link to='/forgot-password' className='text-orange-500 font-semibold underline'>Try again</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ResetPassword
