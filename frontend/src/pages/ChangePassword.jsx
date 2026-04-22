import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthProvider'

const ChangePassword = () => {
  const [authUser] = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirm) return toast.error('Passwords do not match.')
    if (newPassword.length < 6) return toast.error('New password must be at least 6 characters.')
    setLoading(true)
    try {
      const res = await axios.put(
        'http://localhost:8000/user/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${authUser.token}` } }
      )
      if (res.data.success) {
        toast.success('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirm('')
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
          <h2 className='text-2xl font-bold mb-1'>Change Password</h2>
          <p className='text-sm text-gray-500 mb-6'>Update your account password below.</p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Current Password</label>
              <input
                type='password'
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder='Your current password'
                className='w-full border px-3 py-2 rounded-lg outline-none focus:border-green-500'
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
                placeholder='Repeat new password'
                className='w-full border px-3 py-2 rounded-lg outline-none focus:border-green-500'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60 transition-colors'
            >
              {loading ? 'Saving...' : 'Change Password'}
            </button>
          </form>

          <p className='text-sm text-center mt-5 text-gray-500'>
            <Link to='/' className='text-green-700 font-semibold underline'>Back to Home</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ChangePassword
