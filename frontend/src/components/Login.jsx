import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

const Login = ({ children, noTrigger }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [otpStep, setOtpStep] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/user/login", {
        email: data.email,
        password: data.password
      })
      if (res.data.requiresOtp) {
        setAdminEmail(res.data.email)
        setOtpStep(true)
        toast.success("OTP sent to admin email!")
        return
      }
      if (res.data.success) {
        toast.success("Login Successful")
        const userData = { ...res.data.user, token: res.data.token }
        localStorage.setItem("user", JSON.stringify(userData))
        setTimeout(() => {
          document.getElementById("my_modal_3").close()
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging in!")
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return toast.error("Enter the 6-digit OTP.")
    setOtpLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/user/verify-admin-otp", {
        email: adminEmail, otp
      })
      if (res.data.success) {
        toast.success("Admin verified!")
        const userData = { ...res.data.user, token: res.data.token }
        localStorage.setItem("user", JSON.stringify(userData))
        setTimeout(() => {
          document.getElementById("my_modal_3").close()
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.")
    } finally {
      setOtpLoading(false)
    }
  }

  const resetOtpStep = () => { setOtpStep(false); setOtp(''); setAdminEmail('') }

  return (
    <div>
      {!noTrigger && (
        <a className="btn text-white font-bold bg-transparent border-none text-lg"
          onClick={() => document.getElementById('my_modal_3').showModal()}>
          {children || "Login"}
        </a>
      )}

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box text-left">
          <form method='dialog'>
            <button className="btn btn-sm btn-circle btn-ghost absolute text-black right-2 top-2"
              onClick={resetOtpStep}>✕</button>
          </form>

          {otpStep ? (
            /* Admin OTP Step */
            <form onSubmit={handleOtpSubmit}>
              <h3 className="font-bold text-black text-xl mb-1">Admin Verification</h3>
              <p className="text-sm text-gray-500 mb-4">
                A 6-digit OTP was sent to <span className="font-semibold text-green-700">{adminEmail}</span>. Enter it below to continue.
              </p>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter OTP"
                className="w-full border px-3 py-2 rounded outline-none focus:border-green-500 tracking-widest text-center text-2xl font-bold"
                maxLength={6}
                autoFocus
              />
              <div className="flex items-center justify-between mt-6">
                <button type="button" onClick={resetOtpStep}
                  className="text-sm text-gray-400 hover:text-gray-600 underline">
                  Back
                </button>
                <button type="submit" disabled={otpLoading}
                  className="bg-green-700 text-white px-6 py-1.5 rounded hover:bg-green-800 disabled:opacity-60">
                  {otpLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>
          ) : (
            /* Normal Login Step */
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="font-bold text-black text-xl">Login</h3>

              <div className='text-black mt-3'>
                <h3 className="text-lg">Email</h3>
                <input {...register("email", { required: true })} type="email"
                  placeholder='Enter your email'
                  className='w-full border px-3 rounded outline-none py-2 focus:border-green-500' />
                {errors.email && <span className='text-red-600'>This field is required</span>}
              </div>

              <div className='text-black mt-3'>
                <h3 className="text-lg">Password</h3>
                <input {...register("password", { required: true })} type="password"
                  placeholder='Enter password'
                  className='w-full border px-3 rounded outline-none py-2 focus:border-green-500' />
                {errors.password && <span className='text-red-600'>This field is required</span>}
              </div>

              <div className='flex justify-end mt-1'>
                <Link to="/forgot-password" onClick={() => document.getElementById('my_modal_3').close()}
                  className='text-xs text-orange-500 hover:underline'>
                  Forgot password?
                </Link>
              </div>

              <div className='justify-between flex mt-6'>
                <button className='text-white cursor-pointer rounded bg-orange-600 px-4 py-1 hover:bg-orange-700'>Login</button>
                <p className='text-black'>Not registered?{" "}
                  <Link to="/signup" className='underline text-blue-500'>Signup</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  )
}

export default Login
