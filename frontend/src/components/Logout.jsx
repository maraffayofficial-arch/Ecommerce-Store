import React from 'react'
import { useAuth } from '../context/AuthProvider'
import toast from 'react-hot-toast'

export default function Logout() {
    const [authUser, setAuthUser] = useAuth()
    const handleLogout = () => {
        try {
            setAuthUser({
                ...authUser,
                user: null
            })
            toast.success("Loged out")
            setTimeout(() => {
                localStorage.removeItem("user")
                window.location.reload()
        },2000)
        } catch (error) {
            console.log(error)
            toast.error("Error loging out!")
setTimeout(() => {
        },2000)
        }
    }
    return (
        <div >
            <button className='bg-red-500 text-md text-white font-bold mr-7 cursor-pointer hover:bg-red-600 rounded py-2 px-5 '
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    )
}
