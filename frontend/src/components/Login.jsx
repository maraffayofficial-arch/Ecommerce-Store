import React from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

const Login = ({ children, noTrigger }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/user/login", {
        email: data.email,
        password: data.password
      })
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
      if (error.response) {
        toast.error("Error! " + error.response.data.message)
      } else {
        toast.error("Error logging in!")
      }
    }
  }

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
            <button className="btn btn-sm btn-circle btn-ghost absolute text-black right-2 top-2">✕</button>
          </form>

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

            <div className='justify-between flex mt-8'>
              <button className='text-white cursor-pointer rounded bg-orange-600 px-4 py-1 hover:bg-orange-700'>Login</button>
              <p className='text-black'>Not registered?{" "}
                <Link to="/signup" className='underline text-blue-500'>Signup</Link>
              </p>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}

export default Login
