import React from 'react'
import Login from './Login'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"

const Signup = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => console.log(data)


    return (
        <div className='flex h-screen justify-center items-center'>
            <div className=" p-5 shadow-[0_0_10px_black]">

                <div method="dialog" className="  relative text-left ">
                    <form onSubmit={handleSubmit(onSubmit)} >
                        {/* if there is a button in form, it will close the modal */}
                        <Link to="/" className="btn btn-sm btn-circle btn-ghost absolute text-black   right-2 top-2">✕</Link>
                        <h3 className="font-bold text-black text-xl">Signup</h3>

                        {/* name  */}
                        <div className='flex flex-col  text-black mt-3'>
                            <h3 className="text-lg">Username</h3>
                            <input {...register("name", { required: true })} type="text" placeholder='Enter your fullname' className='border pl-2 pr-30 rounded outline-none  py-1 ' />
                            {errors.name && <span className='text-red-600'>This field is required</span>}

                        </div>
                        {/* email  */}
                        <div className='flex flex-col  text-black mt-3'>
                            <h3 className="text-lg">Email</h3>
                            <input {...register("email", { required: true })} type="text" placeholder='Enter your email' className='border pl-2 pr-30 rounded outline-none   py-1 ' />
                            {errors.email && <span className='text-red-600'>This field is required</span>}

                        </div>

                        {/*passrord */}
                        <div className='flex flex-col text-black mt-3'>
                            <h3 className="text-lg">Password</h3>
                            <input {...register("password", { required: true })} type="text" placeholder='Enter password' className='border pl-2 rounded pr-30 outline-none  py-1 ' />
                            {errors.password && <span className='text-red-600'>This field is required</span>}

                        </div>

                        {/* login button  */}
                        <div className=' justify-between  flex  mt-8'>
                            <button className='text-white cursor-pointer rounded bg-orange-600 px-4 py-1 hover:bg-orange-700 '>Signup</button>
                            <p className="text-black">
                                Already registered?
                                <button
                                    className="text-blue-500  underline"
                                    onClick={() => document.getElementById("my_modal_3").showModal()}
                                >
                                    <Login><p className='text-blue-500 underline'>Login</p></Login>
                                </button>

                            </p>


                        </div>

                    </form >
                </div>
            </div>


        </div>
    )
}

export default Signup
