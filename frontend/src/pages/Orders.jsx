import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthProvider'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-500',
}

const formatDateTime = (dateStr) => {
  const d = new Date(dateStr)
  const date = d.toLocaleDateString('en-PK', { dateStyle: 'medium' })
  const time = d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${date} at ${time}`
}

const Orders = () => {
  const [authUser] = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [removing, setRemoving] = useState(null)

  const authHeader = { headers: { Authorization: `Bearer ${authUser?.token}` } }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/order/my-orders", authHeader)
        setOrders(res.data)
      } catch (err) {
        console.log(err)
      } finally { setLoading(false) }
    }
    if (authUser?.token) fetchOrders()

    // Clear order notification when user views this page
    localStorage.removeItem("hasNewOrder")
    window.dispatchEvent(new Event("orderNotifUpdate"))
  }, [authUser])

  const handleCancel = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return
    setCancelling(orderId)
    try {
      await axios.put(`http://localhost:8000/order/${orderId}/cancel`, {}, authHeader)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o))
      toast.success("Order cancelled successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order")
    } finally { setCancelling(null) }
  }

  const handleRemove = async (orderId) => {
    if (!confirm("Remove this order from your history?")) return
    setRemoving(orderId)
    try {
      await axios.delete(`http://localhost:8000/order/${orderId}`, authHeader)
      setOrders(prev => prev.filter(o => o._id !== orderId))
      toast.success("Order removed")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove order")
    } finally { setRemoving(null) }
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen pt-24 pb-12 px-4 sm:px-8 max-w-4xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-2 text-center'>My Orders</h1>
        <p className='text-center text-sm text-gray-400 mb-8 italic'>
          Orders can only be cancelled while their status is <span className='text-yellow-600 font-semibold'>Pending</span>.
        </p>

        {loading && (
          <div className='flex justify-center mt-20'>
            <span className='loading loading-spinner loading-lg text-green-700'></span>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className='text-center mt-20'>
            <p className='text-xl text-gray-400'>You haven't placed any orders yet.</p>
            <Link to="/products">
              <button className='mt-6 bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800'>
                Start Shopping
              </button>
            </Link>
          </div>
        )}

        <div className='space-y-6'>
          {orders.map(order => (
            <div key={order._id} className='bg-base-100 shadow-md rounded-xl p-5'>

              {/* Order Header */}
              <div className='flex flex-col sm:flex-row justify-between items-start gap-3 mb-4'>
                <div className='text-sm text-gray-500 space-y-1'>
                  <p>Order: <span className='font-mono text-xs'>{order._id}</span></p>
                  <p>Placed: <span className='font-medium text-gray-600'>{formatDateTime(order.createdAt)}</span></p>
                  <p>Deliver to: {order.address.fullName}, {order.address.street}, {order.address.city}</p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize shrink-0 ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className='space-y-2'>
                {order.items.map((item, idx) => (
                  <div key={idx} className='flex items-center gap-3 border-b border-base-200 pb-2'>
                    <img src={item.image} alt={item.title} className='w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg shrink-0' />
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-sm truncate'>{item.title}</p>
                      <p className='text-xs text-gray-400'>Qty: {item.quantity}</p>
                    </div>
                    <p className='font-bold text-green-700 text-sm shrink-0'>Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className='flex flex-col sm:flex-row justify-between items-center mt-4 gap-3'>
                <p className='text-lg font-bold'>Total: <span className='text-green-700'>Rs. {order.totalAmount}</span></p>

                <div className='flex gap-3 flex-wrap justify-end'>
                  {order.status === 'pending' && (
                    <button onClick={() => handleCancel(order._id)} disabled={cancelling === order._id}
                      className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold cursor-pointer disabled:opacity-60 transition-colors'>
                      {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}

                  {order.status === 'cancelled' && (
                    <p className='text-sm text-red-400 italic self-center'>This order was cancelled.</p>
                  )}

                  {(order.status === 'delivered' || order.status === 'cancelled') && (
                    <button onClick={() => handleRemove(order._id)} disabled={removing === order._id}
                      className='border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-300 px-5 py-2 rounded-full text-sm font-semibold cursor-pointer disabled:opacity-60 transition-colors'>
                      {removing === order._id ? "Removing..." : "Remove"}
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Orders
