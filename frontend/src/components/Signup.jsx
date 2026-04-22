import React from 'react'
import Login from './Login'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from "axios"
import toast from 'react-hot-toast'
import API_URL from '../config'

const Signup = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        const userInfo = { name: data.name, email: data.email, password: data.password }
        await axios.post(`${API_URL}/user/signup`, userInfo)
            .then((res) => {
                // console.log(res.data.newUser)
                if (res.data) {
                    const userData = { ...res.data.user, token: res.data.token }
                    localStorage.setItem("user", JSON.stringify(userData))
                 toast.success("Signup Successfull!")
                 setTimeout(()=>{
                        navigate("/")
                        window.location.reload()
                    },2000)
                } 
                // else {
                   
                // }
                // console.log("after if")
            })
            .catch((error) => {
                if (error.response) {

                    toast.error("Error! " + error.response.data.message)// accessing the response from backend as user already exists!
                } else {
                    toast.error("Error signing up!!" + error)
                }
            })


    }


    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-base-200'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8'>
                <div className='relative'>
                    <Link to="/" className='btn btn-sm btn-circle btn-ghost absolute right-0 top-0 text-black'>✕</Link>
                    <h3 className='font-bold text-black text-2xl mb-6'>Create Account</h3>

                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                        <div className='flex flex-col text-black'>
                            <label className='text-sm font-semibold mb-1'>Username</label>
                            <input {...register("name", { required: true })} type="text"
                                placeholder='Enter your full name'
                                className='w-full border px-3 py-2 rounded outline-none focus:border-green-500' />
                            {errors.name && <span className='text-red-600 text-sm mt-0.5'>This field is required</span>}
                        </div>

                        <div className='flex flex-col text-black'>
                            <label className='text-sm font-semibold mb-1'>Email</label>
                            <input {...register("email", { required: true })} type="email"
                                placeholder='Enter your email'
                                className='w-full border px-3 py-2 rounded outline-none focus:border-green-500' />
                            {errors.email && <span className='text-red-600 text-sm mt-0.5'>This field is required</span>}
                        </div>

                        <div className='flex flex-col text-black'>
                            <label className='text-sm font-semibold mb-1'>Password</label>
                            <input {...register("password", { required: true })} type="password"
                                placeholder='Enter password'
                                className='w-full border px-3 py-2 rounded outline-none focus:border-green-500' />
                            {errors.password && <span className='text-red-600 text-sm mt-0.5'>This field is required</span>}
                        </div>

                        <div className='flex items-center justify-between mt-2'>
                            <button className='bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded cursor-pointer'>
                                Signup
                            </button>
                            <p className='text-black text-sm'>
                                Already registered?{' '}
                                <button type='button'
                                    onClick={() => document.getElementById("my_modal_3").showModal()}
                                    className='text-blue-500 underline'>
                                    Login
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
