import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"

const Contact = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => console.log(data)

    return (
        <>
            <div className='flex h-screen justify-center items-center'>
                <form className=' [&>div>h1]:text-lg w-150 p-2' onSubmit={handleSubmit(onSubmit)} action="">
                <h1 className='text-4xl font-bold  ' >Contact us</h1>
                    {/* name  */}
                    <div className='mt-2'>
                        <h1>Name</h1>
                        <input type="text" {...register("name", { required: true })} className='border outline-none py-1 pl-1 w-full' placeholder='Enter your name'  />
                    {errors.name && <span className='text-red-600'>This field is required</span>}
                    </div>

                    {/* email */}
                    <div className='mt-2'>

                        <h1>Email</h1>
                        <input type="text" {...register("email", { required: true })} className='border py-1 pl-1 w-full outline-none' placeholder='Enter email'  />
                  {errors.email && <span className='text-red-600'>This field is required</span>}
                    </div>
                    {/* message  */}
                    <div className='mt-2'>
                        <h1>Message</h1>
                        <input type="text" {...register("message", { required: true })} className='border outline-none pb-30 py-1 pl-1 w-full' placeholder='Type your Message'  />
                    {errors.message && <span className='text-red-600'>This field is required</span>}
                 
                     </div>
                    <button type='submit' className='border border-none bg-blue-500 text-white cursor-pointer hover:bg-blue-900 px-3 py-2 font-bold  my-5 rounded rounded-lg'>Submit</button>

                </form>

            </div>
        </>

    )
}

export default Contact
