import React from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSettings } from '../context/SettingsProvider'
import API_URL from '../config'

const Contact = () => {
    const { contactInfo } = useSettings()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`${API_URL}/settings/contact`, data)
            if (res.data.success) {
                toast.success("Message sent! We'll get back to you soon.")
                reset()
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send message.")
        }
    }

    return (
        <>
            <Navbar />
            <div className='min-h-screen pt-24 pb-12 px-4 sm:px-8'>
                <div className='max-w-2xl mx-auto'>
                    <h1 className='text-3xl sm:text-4xl font-bold mb-2 text-center'>Contact Us</h1>
                    <p className='text-center text-gray-500 mb-8'>Got a question or feedback? We'd love to hear from you.</p>

                    <div className='bg-base-100 shadow-lg rounded-2xl p-6 sm:p-10'>
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                            <div>
                                <label className='text-sm font-semibold text-gray-500'>Full Name</label>
                                <input type="text" {...register("name", { required: true })}
                                    className='w-full border border-base-300 rounded-lg px-4 py-2 mt-1 outline-none focus:border-green-500 bg-base-100'
                                    placeholder='Enter your name' />
                                {errors.name && <span className='text-red-500 text-sm'>This field is required</span>}
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-500'>Email</label>
                                <input type="email" {...register("email", { required: true })}
                                    className='w-full border border-base-300 rounded-lg px-4 py-2 mt-1 outline-none focus:border-green-500 bg-base-100'
                                    placeholder='Enter your email' />
                                {errors.email && <span className='text-red-500 text-sm'>This field is required</span>}
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-500'>Message</label>
                                <textarea {...register("message", { required: true })} rows={5}
                                    className='w-full border border-base-300 rounded-lg px-4 py-2 mt-1 outline-none focus:border-green-500 resize-none bg-base-100'
                                    placeholder='Write your message here...' />
                                {errors.message && <span className='text-red-500 text-sm'>This field is required</span>}
                            </div>

                            <button type='submit'
                                className='bg-green-700 text-white py-3 rounded-full font-bold text-lg hover:bg-green-800 cursor-pointer transition-colors'>
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info — dynamic from admin settings */}
                    <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
                        <div className='bg-base-100 rounded-xl p-5 shadow-sm'>
                            <p className='font-bold mb-1'>Email</p>
                            <p className='text-gray-500 text-sm'>{contactInfo?.email}</p>
                        </div>
                        <div className='bg-base-100 rounded-xl p-5 shadow-sm'>
                            <p className='font-bold mb-1'>Phone</p>
                            <p className='text-gray-500 text-sm'>{contactInfo?.phone}</p>
                        </div>
                        <div className='bg-base-100 rounded-xl p-5 shadow-sm'>
                            <p className='font-bold mb-1'>Location</p>
                            <p className='text-gray-500 text-sm'>{contactInfo?.location}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Contact
