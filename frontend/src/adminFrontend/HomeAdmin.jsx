import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaTrash, FaEdit, FaSignOutAlt } from 'react-icons/fa'

const emptyForm = { title: '', discription: '', price: '', weight: '', category: 'achar', image: '' }

const HomeAdmin = () => {
  const [authUser] = useAuth()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [tab, setTab] = useState('products')
  const [loading, setLoading] = useState(false)

  const authHeader = { headers: { Authorization: `Bearer ${authUser?.token}` } }

  useEffect(() => {
    if (!authUser || authUser.role !== 'admin') {
      toast.error("Admin access only")
      navigate('/')
      return
    }
    fetchProducts()
    fetchOrders()
  }, [authUser])

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/product")
      setProducts(res.data)
    } catch { toast.error("Failed to load products") }
  }

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/order/all", authHeader)
      setOrders(res.data)
    } catch { }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/product/${editId}`, form, authHeader)
        toast.success("Product updated!")
        setEditId(null)
      } else {
        await axios.post("http://localhost:8000/product", form, authHeader)
        toast.success("Product added!")
      }
      setForm(emptyForm)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product")
    } finally { setLoading(false) }
  }

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      discription: product.discription,
      price: product.price,
      weight: product.weight,
      category: product.category,
      image: product.image
    })
    setEditId(product._id)
    setTab('products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return
    try {
      await axios.delete(`http://localhost:8000/product/${id}`, authHeader)
      toast.success("Product deleted")
      fetchProducts()
    } catch { toast.error("Failed to delete") }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/order/${id}/status`, { status }, authHeader)
      toast.success("Order status updated")
      fetchOrders()
    } catch { toast.error("Failed to update status") }
  }

  const removeOrder = async (id) => {
    if (!confirm("Remove this order permanently?")) return
    try {
      await axios.delete(`http://localhost:8000/order/${id}/admin`, authHeader)
      setOrders(prev => prev.filter(o => o._id !== id))
      toast.success("Order removed")
    } catch { toast.error("Failed to remove order") }
  }

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr)
    const date = d.toLocaleDateString('en-PK', { dateStyle: 'medium' })
    const time = d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })
    return `${date} at ${time}`
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-500',
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Admin Header */}
      <div className='bg-green-700 text-white px-6 py-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Urban Pickle — Admin Panel</h1>
        <button onClick={() => navigate('/')} className='flex items-center gap-2 bg-white text-green-700 px-4 py-1 rounded-full font-semibold hover:bg-gray-100'>
          <FaSignOutAlt /> Back to Site
        </button>
      </div>

      {/* Tabs */}
      <div className='flex border-b bg-white px-6'>
        <button onClick={() => setTab('products')}
          className={`py-3 px-6 font-semibold border-b-2 transition-all ${tab === 'products' ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500'}`}>
          Products
        </button>
        <button onClick={() => setTab('orders')}
          className={`py-3 px-6 font-semibold border-b-2 transition-all ${tab === 'orders' ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500'}`}>
          Orders ({orders.length})
        </button>
      </div>

      <div className='max-w-6xl mx-auto px-4 py-8'>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <>
            {/* Add/Edit Form */}
            <div className='bg-white shadow-md rounded-xl p-6 mb-8'>
              <h2 className='text-xl font-bold mb-4 text-green-700'>{editId ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-semibold text-gray-600'>Product Title</label>
                  <input name="title" value={form.title} onChange={handleChange} required
                    placeholder='e.g. Aam ka Achar'
                    className='w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:border-green-500' />
                </div>
                <div>
                  <label className='text-sm font-semibold text-gray-600'>Price (Rs.)</label>
                  <input name="price" value={form.price} onChange={handleChange} required type="number"
                    placeholder='e.g. 350'
                    className='w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:border-green-500' />
                </div>
                <div>
                  <label className='text-sm font-semibold text-gray-600'>Weight</label>
                  <input name="weight" value={form.weight} onChange={handleChange} required
                    placeholder='e.g. 500g'
                    className='w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:border-green-500' />
                </div>
                <div>
                  <label className='text-sm font-semibold text-gray-600'>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className='w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:border-green-500 bg-white'>
                    <option value="achar">Achar</option>
                    <option value="chatni">Chatni</option>
                    <option value="sweet">Sweet</option>
                    <option value="sauce">Sauce</option>
                  </select>
                </div>
                <div className='md:col-span-2'>
                  <label className='text-sm font-semibold text-gray-600'>Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} required
                    placeholder='https://...'
                    className='w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:border-green-500' />
                </div>
                <div className='md:col-span-2'>
                  <label className='text-sm font-semibold text-gray-600'>Description</label>
                  <textarea name="discription" value={form.discription} onChange={handleChange} required rows={3}
                    placeholder='Describe the product...'
                    className='w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:border-green-500 resize-none' />
                </div>
                <div className='md:col-span-2 flex gap-3'>
                  <button type='submit' disabled={loading}
                    className='bg-green-700 text-white px-8 py-2 rounded-full font-semibold hover:bg-green-800 disabled:opacity-60'>
                    {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
                  </button>
                  {editId && (
                    <button type='button' onClick={() => { setEditId(null); setForm(emptyForm) }}
                      className='border border-gray-400 text-gray-600 px-8 py-2 rounded-full font-semibold hover:bg-gray-100'>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products List */}
            <h2 className='text-xl font-bold mb-4'>All Products ({products.length})</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {products.map(p => (
                <div key={p._id} className='bg-white shadow-md rounded-xl overflow-hidden'>
                  <img src={p.image} alt={p.title} className='w-full h-48 object-cover' />
                  <div className='p-4'>
                    <h3 className='font-bold text-lg'>{p.title}</h3>
                    <p className='text-green-700 font-semibold'>Rs. {p.price}</p>
                    <p className='text-sm text-gray-500 capitalize'>{p.category} · {p.weight}</p>
                    <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{p.discription}</p>
                    <div className='flex gap-3 mt-3'>
                      <button onClick={() => handleEdit(p)}
                        className='flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200'>
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)}
                        className='flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200'>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <>
            <h2 className='text-xl font-bold mb-4'>All Customer Orders</h2>
            {orders.length === 0 && <p className='text-gray-500'>No orders yet.</p>}
            <div className='space-y-4'>
              {orders.map(order => (
                <div key={order._id} className='bg-white shadow-md rounded-xl p-5'>
                  <div className='flex flex-wrap justify-between items-start gap-3 mb-3'>
                    <div>
                      <p className='font-semibold text-gray-800'>{order.userId?.name} — {order.userId?.email}</p>
                      <p className='text-sm text-gray-500'>{formatDateTime(order.createdAt)}</p>
                      <p className='text-sm text-gray-600'>{order.address.fullName}, {order.address.street}, {order.address.city} | {order.address.phone}</p>
                    </div>
                    <div className='flex items-center gap-3 flex-wrap'>
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold capitalize ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className='border rounded-lg px-2 py-1 text-sm bg-white outline-none'>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => removeOrder(order._id)}
                        className='flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200'>
                        <FaTrash size={12} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    {order.items.map((item, i) => (
                      <div key={i} className='flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2'>
                        <img src={item.image} alt={item.title} className='w-10 h-10 object-cover rounded' />
                        <span className='text-sm font-medium'>{item.title} × {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <p className='text-right font-bold text-green-700 mt-3'>Rs. {order.totalAmount}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HomeAdmin
