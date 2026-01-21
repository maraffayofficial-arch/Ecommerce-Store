import React from 'react'
import { Link } from 'react-router-dom'

import { useForm } from "react-hook-form"
const Login = ({children}) => {

  const {
    register,
    handleSubmit,
     formState: { errors },
  } = useForm()

  const onSubmit = (data) => console.log(data)

 

  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <a className="btn text-white font-bold bg-transparent border-none text-lg" onClick={() => document.getElementById('my_modal_3').showModal()}> {children || "login"}</a>
      
      <dialog id="my_modal_3" className="modal">
       
        <div className="modal-box text-left">
        
          <form method='dialog' >
            <button className="btn btn-sm btn-circle btn-ghost absolute text-black right-2 top-2">✕</button>
            {/* if there is a button in form, it will close the modal */}
      </form >
        
<form onSubmit={handleSubmit(onSubmit)}>

          <h3 className="font-bold text-black text-xl">Login</h3>

          {/* email  */}
          <div className='text-black mt-3'>
            <h3 className="text-lg">Email</h3>
            <input {...register("email", { required: true })} type="text" placeholder='Enter your email' className='border pl-2 pr-30 rounded outline-none md:pr-60 py-1 ' />
          {errors.email && <span className='text-red-600'>This field is required</span>}

          </div>

          {/*passrord */}
          <div className='text-black mt-3'>
            <h3 className="text-lg">Password</h3>
            <input {...register("password", { required: true })} type="text" placeholder='Enter password' className='border pl-2 rounded pr-30 outline-none  py-1 md:pr-60 ' />
            {errors.password && <span className='text-red-600'>This field is required</span>}

          </div>

          {/* login button  */}
          <div className=' justify-between flex  mt-8'>
            <button className='text-white cursor-pointer rounded bg-orange-600 px-4 py-1 hover:bg-orange-700 '>Login</button>
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

