import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaTrash, FaEdit, FaSignOutAlt, FaCloudUploadAlt, FaTimes, FaFileExcel } from 'react-icons/fa'
import * as XLSX from 'xlsx'

const emptyForm = { title: '', discription: '', price: '', weight: '', category: 'achar' }

const HomeAdmin = () => {
  const [authUser] = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef()

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [unseenCount, setUnseenCount] = useState(0)
  const [selectedOrders, setSelectedOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [tab, setTab] = useState('products')
  const [loading, setLoading] = useState(false)

  // Image state
  const [selectedFiles, setSelectedFiles] = useState([])   // File objects for new upload
  const [previews, setPreviews] = useState([])              // Preview URLs (blob or existing)
  const [existingImages, setExistingImages] = useState([]) // Cloudinary URLs when editing

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
      const fetched = res.data
      setOrders(fetched)
      const seen = JSON.parse(localStorage.getItem("seenAdminOrderIds") || "[]")
      const unseen = fetched.filter(o => !seen.includes(o._id))
      setUnseenCount(unseen.length)
    } catch { }
  }

  const handleOrdersTab = () => {
    setTab('orders')
    const allIds = orders.map(o => o._id)
    localStorage.setItem("seenAdminOrderIds", JSON.stringify(allIds))
    setUnseenCount(0)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const total = selectedFiles.length + files.length
    if (total > 4) { toast.error("Maximum 4 images allowed"); return }
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setSelectedFiles(prev => [...prev, ...files])
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removePreview = (index) => {
    // If editing, index may point to existing or new
    const existingCount = existingImages.length
    if (index < existingCount) {
      setExistingImages(prev => prev.filter((_, i) => i !== index))
      setPreviews(prev => prev.filter((_, i) => i !== index))
    } else {
      const newIdx = index - existingCount
      setSelectedFiles(prev => prev.filter((_, i) => i !== newIdx))
      setPreviews(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (previews.length === 0) { toast.error("Please upload at least 1 image"); return }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", form.title)
      formData.append("discription", form.discription)
      formData.append("price", form.price)
      formData.append("weight", form.weight)
      formData.append("category", form.category)
      selectedFiles.forEach(f => formData.append("images", f))

      const multipartHeader = {
        headers: { Authorization: `Bearer ${authUser?.token}`, "Content-Type": "multipart/form-data" }
      }

      if (editId) {
        await axios.put(`http://localhost:8000/product/${editId}`, formData, multipartHeader)
        toast.success("Product updated!")
        setEditId(null)
      } else {
        await axios.post("http://localhost:8000/product", formData, multipartHeader)
        toast.success("Product added!")
      }

      setForm(emptyForm)
      setSelectedFiles([])
      setPreviews([])
      setExistingImages([])
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
    })
    setEditId(product._id)
    setExistingImages(product.images || [])
    setPreviews(product.images || [])
    setSelectedFiles([])
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

  const cancelEdit = () => {
    setEditId(null)
    setForm(emptyForm)
    setSelectedFiles([])
    setPreviews([])
    setExistingImages([])
  }

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr)
    const date = d.toLocaleDateString('en-PK', { dateStyle: 'medium' })
    const time = d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })
    return `${date} at ${time}`
  }

  const toggleSelectOrder = (id) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    setSelectedOrders(prev => prev.length === orders.length ? [] : orders.map(o => o._id))
  }

  const exportToExcel = () => {
    const targets = orders.filter(o => selectedOrders.includes(o._id))
    if (targets.length === 0) { toast.error("Select at least one order to export"); return }

    const rows = targets.map(order => {
      const d = new Date(order.createdAt)
      const date = d.toLocaleDateString('en-PK', { dateStyle: 'medium' })
      const time = d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })
      const products = order.items.map(i => i.title).join(' + ')
      return {
        'Order ID': order._id,
        'Customer Name': order.guestOrder ? 'Guest' : (order.userId?.name || ''),
        'Customer Email': order.guestOrder ? '' : (order.userId?.email || ''),
        'Phone': order.address.phone,
        'City': order.address.city,
        'Recipient Name': order.address.fullName,
        'Date': date,
        'Time': time,
        'Status': order.status,
        'Payment Method': order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery',
        'Transaction ID': order.transactionId || '',
        'Products': products,
        'Qty': 1,
        'Total (Rs.)': order.totalAmount,
      }
    })

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Orders')

    const colWidths = { 'Order ID': 28, 'Customer Name': 18, 'Customer Email': 26, 'Phone': 14, 'City': 14, 'Recipient Name': 18, 'Date': 14, 'Time': 10, 'Status': 12, 'Payment Method': 18, 'Transaction ID': 22, 'Products': 40, 'Qty': 8, 'Total (Rs.)': 14 }
    ws['!cols'] = Object.keys(colWidths).map(k => ({ wch: colWidths[k] }))

    XLSX.writeFile(wb, `urban-pickle-orders-${new Date().toISOString().slice(0, 10)}.xlsx`)
    toast.success(`Exported ${targets.length} order(s)`)
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
        <button onClick={handleOrdersTab}
          className={`py-3 px-6 font-semibold border-b-2 transition-all flex items-center gap-2 ${tab === 'orders' ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500'}`}>
          Orders
          {unseenCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unseenCount}
            </span>
          )}
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
                  <label className='text-sm font-semibold text-gray-600'>Weight / Volume</label>
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
                    <option value="spices">Spices</option>
                  </select>
                </div>

                <div className='md:col-span-2'>
                  <label className='text-sm font-semibold text-gray-600'>Description</label>
                  <textarea name="discription" value={form.discription} onChange={handleChange} required rows={3}
                    placeholder='Describe the product...'
                    className='w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:border-green-500 resize-none' />
                </div>

                {/* Image Upload */}
                <div className='md:col-span-2'>
                  <label className='text-sm font-semibold text-gray-600'>
                    Product Images <span className='text-gray-400 font-normal'>(up to 4 — 800×800px, max 5MB each)</span>
                  </label>

                  {/* Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className='mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors'>
                    <FaCloudUploadAlt className='text-5xl text-gray-300 mx-auto mb-2' />
                    <p className='text-gray-500 font-medium'>Click to upload or drag & drop</p>
                    <p className='text-gray-400 text-sm mt-1'>JPG, PNG, WebP — max 5MB per image</p>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple
                      onChange={handleFileChange} className='hidden' />
                  </div>

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div className='flex gap-3 flex-wrap mt-4'>
                      {previews.map((src, i) => (
                        <div key={i} className='relative group'>
                          <img src={src} alt={`preview ${i + 1}`}
                            className='w-24 h-24 object-cover rounded-xl border-2 border-gray-200' />
                          <button type='button' onClick={() => removePreview(i)}
                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                            <FaTimes size={10} />
                          </button>
                          {i === 0 && (
                            <span className='absolute bottom-1 left-1 bg-green-600 text-white text-xs px-1 rounded'>Main</span>
                          )}
                        </div>
                      ))}
                      {previews.length < 4 && (
                        <button type='button' onClick={() => fileInputRef.current.click()}
                          className='w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500 transition-colors text-3xl'>
                          +
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className='md:col-span-2 flex gap-3'>
                  <button type='submit' disabled={loading}
                    className='bg-green-700 text-white px-8 py-2 rounded-full font-semibold hover:bg-green-800 disabled:opacity-60 cursor-pointer'>
                    {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
                  </button>
                  {editId && (
                    <button type='button' onClick={cancelEdit}
                      className='border border-gray-400 text-gray-600 px-8 py-2 rounded-full font-semibold hover:bg-gray-100 cursor-pointer'>
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
                  {/* Image strip */}
                  <div className='relative'>
                    <img src={p.images?.[0]} alt={p.title} className='w-full h-48 object-cover' />
                    {p.images?.length > 1 && (
                      <span className='absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full'>
                        +{p.images.length - 1} more
                      </span>
                    )}
                  </div>
                  <div className='p-4'>
                    <h3 className='font-bold text-lg'>{p.title}</h3>
                    <p className='text-green-700 font-semibold'>Rs. {p.price}</p>
                    <p className='text-sm text-gray-500 capitalize'>{p.category} · {p.weight}</p>
                    <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{p.discription}</p>
                    <div className='flex gap-3 mt-3'>
                      <button onClick={() => handleEdit(p)}
                        className='flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 cursor-pointer'>
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)}
                        className='flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200 cursor-pointer'>
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
            <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
              <div className='flex items-center gap-3'>
                <h2 className='text-xl font-bold'>All Customer Orders</h2>
                {selectedOrders.length > 0 && (
                  <span className='text-sm text-gray-500'>({selectedOrders.length} selected)</span>
                )}
              </div>
              <div className='flex items-center gap-3 flex-wrap'>
                {orders.length > 0 && (
                  <label className='flex items-center gap-2 text-sm font-semibold text-gray-600 cursor-pointer select-none'>
                    <input type='checkbox'
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={toggleSelectAll}
                      className='w-4 h-4 accent-green-700' />
                    Select All
                  </label>
                )}
                <button onClick={exportToExcel}
                  className='flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-800 cursor-pointer transition-colors'>
                  <FaFileExcel /> Export to Excel
                </button>
              </div>
            </div>

            {orders.length === 0 && <p className='text-gray-500'>No orders yet.</p>}
            <div className='space-y-4'>
              {orders.map(order => (
                <div key={order._id}
                  className={`bg-white shadow-md rounded-xl p-5 border-2 transition-colors ${selectedOrders.includes(order._id) ? 'border-green-500' : 'border-transparent'}`}>
                  <div className='flex flex-wrap justify-between items-start gap-3 mb-3'>
                    <div className='flex items-start gap-3'>
                      {/* Checkbox */}
                      <input type='checkbox'
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => toggleSelectOrder(order._id)}
                        className='mt-1 w-4 h-4 accent-green-700 shrink-0 cursor-pointer' />
                      <div>
                        <p className='font-semibold text-gray-800'>
                          {order.guestOrder ? <span className='text-gray-400 italic'>Guest Order</span> : `${order.userId?.name} — ${order.userId?.email}`}
                        </p>
                        <p className='text-sm text-gray-500'>{formatDateTime(order.createdAt)}</p>
                        <p className='text-sm text-gray-600'>{order.address.fullName}, {order.address.street}, {order.address.city} | {order.address.phone}</p>
                        <div className='flex items-center gap-2 mt-1 flex-wrap'>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${order.paymentMethod === 'bank_transfer' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                          </span>
                          {order.transactionId && (
                            <span className='text-xs text-gray-500'>TXN: <span className='font-mono font-semibold text-gray-700'>{order.transactionId}</span></span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 flex-wrap'>
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold capitalize ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                        className='border rounded-lg px-2 py-1 text-sm bg-white outline-none'>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => removeOrder(order._id)}
                        className='flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200 cursor-pointer'>
                        <FaTrash size={12} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-3 ml-7'>
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
