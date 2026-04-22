import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaTrash, FaEdit, FaSignOutAlt, FaCloudUploadAlt, FaTimes, FaFileExcel } from 'react-icons/fa'
import * as XLSX from 'xlsx'

const emptyForm = { title: '', discription: '', price: '', weight: '', category: 'achar', discount: 0 }

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
  const [shipping, setShipping] = useState({ shippingFee: 199, freeShipping: false, globalSale: 0 })
  const [shippingLoading, setShippingLoading] = useState(false)
  const [specialMenu, setSpecialMenu] = useState([])
  const [specialMenuLoading, setSpecialMenuLoading] = useState(false)
  const [specialMenuSearch, setSpecialMenuSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [saleBanner, setSaleBanner] = useState({ enabled: false, title: '', subtitle: '', bgColor: 'green', imageUrl: '' })
  const [saleBannerLoading, setSaleBannerLoading] = useState(false)
  const [bannerImgLoading, setBannerImgLoading] = useState(false)
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', location: '' })
  const [contactInfoLoading, setContactInfoLoading] = useState(false)

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
    fetchShipping()
    fetchSpecialMenu()
  }, [authUser])

  const fetchShipping = async () => {
    try {
      const res = await axios.get("http://localhost:8000/settings/shipping")
      setShipping(res.data)
      if (res.data.saleBanner) setSaleBanner({ enabled: false, title: '', subtitle: '', bgColor: 'green', imageUrl: '', ...res.data.saleBanner })
      if (res.data.contactInfo) setContactInfo({ email: '', phone: '', location: '', ...res.data.contactInfo })
    } catch { }
  }

  const saveContactInfo = async () => {
    setContactInfoLoading(true)
    try {
      await axios.put("http://localhost:8000/settings/shipping", { contactInfo }, authHeader)
      toast.success("Contact info saved!")
    } catch { toast.error("Failed to save contact info") }
    finally { setContactInfoLoading(false) }
  }

  const saveSaleBanner = async () => {
    setSaleBannerLoading(true)
    try {
      await axios.put("http://localhost:8000/settings/shipping", { saleBanner }, authHeader)
      toast.success("Sale Banner saved!")
    } catch { toast.error("Failed to save Sale Banner") }
    finally { setSaleBannerLoading(false) }
  }

  const uploadBannerImg = async (file) => {
    if (!file) return
    setBannerImgLoading(true)
    try {
      const fd = new FormData()
      fd.append("image", file)
      const res = await axios.post("http://localhost:8000/settings/banner-image", fd, {
        headers: { Authorization: `Bearer ${authUser?.token}`, "Content-Type": "multipart/form-data" }
      })
      setSaleBanner(s => ({ ...s, imageUrl: res.data.imageUrl }))
      toast.success("Banner image uploaded!")
    } catch { toast.error("Failed to upload image") }
    finally { setBannerImgLoading(false) }
  }

  const fetchSpecialMenu = async () => {
    try {
      const res = await axios.get("http://localhost:8000/settings/special-menu")
      setSpecialMenu(res.data.map(p => p._id))
    } catch { }
  }

  const toggleSpecialMenu = (id) => {
    setSpecialMenu(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 6) { toast.error("Maximum 6 products allowed in Special Menu"); return prev }
      return [...prev, id]
    })
  }

  const saveSpecialMenu = async () => {
    setSpecialMenuLoading(true)
    try {
      await axios.put("http://localhost:8000/settings/special-menu", { productIds: specialMenu }, authHeader)
      toast.success("Special Menu saved!")
    } catch { toast.error("Failed to save Special Menu") }
    finally { setSpecialMenuLoading(false) }
  }

  const saveShipping = async () => {
    setShippingLoading(true)
    try {
      await axios.put("http://localhost:8000/settings/shipping", shipping, authHeader)
      toast.success("Shipping settings saved!")
    } catch { toast.error("Failed to save settings") }
    finally { setShippingLoading(false) }
  }

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
      formData.append("discount", form.discount || 0)
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
      discount: product.discount || 0,
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
        'Alt. Phone': order.address.altPhone || '',
        'City': order.address.city,
        'Recipient Name': order.address.fullName,
        'Date': date,
        'Time': time,
        'Status': order.status,
        'Payment Method': order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'jazzcash' ? 'JazzCash' : order.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer',
        'Transaction ID': order.transactionId || '',
        'Products': products,
        'Qty': 1,
        'Total (Rs.)': order.paymentMethod === 'cod' ? order.totalAmount : 0,
      }
    })

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Orders')

    const colWidths = { 'Order ID': 28, 'Customer Name': 18, 'Customer Email': 26, 'Phone': 14, 'Alt. Phone': 14, 'City': 14, 'Recipient Name': 18, 'Date': 14, 'Time': 10, 'Status': 12, 'Payment Method': 18, 'Transaction ID': 22, 'Products': 40, 'Qty': 8, 'Total (Rs.)': 14 }
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
      <div className='bg-green-700 text-white px-4 sm:px-6 py-4 flex justify-between items-center gap-3'>
        <h1 className='text-lg sm:text-2xl font-bold truncate'>Urban Pickle — Admin Panel</h1>
        <button onClick={() => navigate('/')} className='flex items-center gap-2 bg-white text-green-700 px-3 sm:px-4 py-1 rounded-full font-semibold hover:bg-gray-100 shrink-0 text-sm sm:text-base'>
          <FaSignOutAlt /> <span className='hidden sm:inline'>Back to Site</span><span className='sm:hidden'>Exit</span>
        </button>
      </div>

      {/* Tabs */}
      <div className='flex border-b bg-white px-2 sm:px-6 overflow-x-auto'>
        <button onClick={() => setTab('products')}
          className={`py-3 px-4 sm:px-6 font-semibold border-b-2 transition-all whitespace-nowrap ${tab === 'products' ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500'}`}>
          Products
        </button>
        <button onClick={handleOrdersTab}
          className={`py-3 px-4 sm:px-6 font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${tab === 'orders' ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500'}`}>
          Orders
          {unseenCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unseenCount}
            </span>
          )}
        </button>
        <button onClick={() => setTab('settings')}
          className={`py-3 px-4 sm:px-6 font-semibold border-b-2 transition-all whitespace-nowrap ${tab === 'settings' ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500'}`}>
          Settings
        </button>
      </div>

      <div className='max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8'>

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
                  <label className='text-sm font-semibold text-gray-600'>
                    Discount (%) <span className='font-normal text-gray-400'>— 0 = no sale shown</span>
                  </label>
                  <div className='relative mt-1'>
                    <input name="discount" value={form.discount} onChange={handleChange} type="number"
                      min="0" max="100" placeholder='e.g. 20'
                      className='w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500 pr-8' />
                    <span className='absolute right-3 top-2.5 text-gray-400 font-semibold'>%</span>
                  </div>
                  {Number(form.discount) > 0 && Number(form.price) > 0 && (
                    <p className='text-xs text-green-700 mt-1 font-medium'>
                      Sale price: Rs. {Math.round(form.price - (form.price * form.discount / 100))}
                      <span className='text-gray-400 ml-1'>(was Rs. {form.price})</span>
                    </p>
                  )}
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
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
              <h2 className='text-xl font-bold'>
                {productSearch ? `Results (${products.filter(p => p.title.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase())).length})` : `Latest Products (showing ${Math.min(10, products.length)} of ${products.length})`}
              </h2>
              <div className='relative w-full sm:w-64'>
                <input
                  type='text'
                  placeholder='Search by name or category...'
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className='w-full border border-gray-200 rounded-full px-4 py-2 pr-8 outline-none focus:border-green-500 text-sm'
                />
                {productSearch && (
                  <button onClick={() => setProductSearch('')}
                    className='absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-lg leading-none'>×</button>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {(productSearch
                ? products.filter(p =>
                    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.category.toLowerCase().includes(productSearch.toLowerCase())
                  )
                : products.slice(0, 10)
              ).map(p => (
                <div key={p._id} className='bg-white shadow-md rounded-xl overflow-hidden'>
                  {/* Image strip */}
                  <div className='relative'>
                    <img src={p.images?.[0]} alt={p.title} className='w-full h-48 object-cover' />
                    {p.discount > 0 && (
                      <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                        {p.discount}% OFF
                      </span>
                    )}
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
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5'>
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
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3'>
                    <div className='flex items-start gap-3 min-w-0'>
                      {/* Checkbox */}
                      <input type='checkbox'
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => toggleSelectOrder(order._id)}
                        className='mt-1 w-4 h-4 accent-green-700 shrink-0 cursor-pointer' />
                      <div className='min-w-0'>
                        <p className='font-semibold text-gray-800 break-words'>
                          {order.guestOrder ? <span className='text-gray-400 italic'>Guest Order</span> : `${order.userId?.name} — ${order.userId?.email}`}
                        </p>
                        <p className='text-sm text-gray-500'>{formatDateTime(order.createdAt)}</p>
                        <p className='text-sm text-gray-600 break-words'>{order.address.fullName}, {order.address.street}, {order.address.city} | {order.address.phone}{order.address.altPhone ? ` / ${order.address.altPhone}` : ''}</p>
                        <div className='flex items-center gap-2 mt-1 flex-wrap'>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize
                            ${order.paymentMethod === 'cod' ? 'bg-yellow-100 text-yellow-700' :
                              order.paymentMethod === 'jazzcash' ? 'bg-orange-100 text-orange-700' :
                              order.paymentMethod === 'easypaisa' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-blue-100 text-blue-700'}`}>
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                             order.paymentMethod === 'jazzcash' ? 'JazzCash' :
                             order.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer'}
                          </span>
                          {order.transactionId && (
                            <span className='text-xs text-gray-500 break-all'>TXN: <span className='font-mono font-semibold text-gray-700'>{order.transactionId}</span></span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0'>
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
                  <div className='text-right mt-3'>
                    <p className='font-bold text-green-700'>Order Total: Rs. {order.totalAmount}</p>
                    {order.paymentMethod !== 'cod' && (
                      <p className='text-sm text-gray-500 mt-0.5'>
                        Amount to Collect: <span className='font-semibold text-red-500'>Rs. 0</span>
                        <span className='ml-1 text-xs text-green-600'>(Prepaid)</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div className='max-w-4xl'>
            <h2 className='text-xl font-bold mb-6'>Shipping Settings</h2>

            <div className='bg-white shadow-md rounded-xl p-6 flex flex-col gap-6'>

              {/* Free shipping toggle */}
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-semibold text-gray-800'>Make Delivery Free</p>
                  <p className='text-sm text-gray-400'>Override — all orders get free shipping regardless of amount</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' checked={shipping.freeShipping}
                    onChange={e => {
                      const checked = e.target.checked
                      if (checked && !window.confirm("Are you sure? This will remove shipping fees for ALL orders.")) return
                      setShipping(s => ({ ...s, freeShipping: checked }))
                    }}
                    className='sr-only peer' />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              {/* Shipping fee input */}
              <div className={shipping.freeShipping ? 'opacity-40 pointer-events-none' : ''}>
                <label className='text-sm font-semibold text-gray-600'>Shipping Fee (Rs.)</label>
                <input
                  type='number' min='0'
                  value={shipping.shippingFee}
                  onChange={e => setShipping(s => ({ ...s, shippingFee: e.target.value }))}
                  className='w-full border rounded-lg px-4 py-2 mt-1 outline-none focus:border-green-500 text-lg font-bold'
                />
              </div>

              {/* Auto free shipping note */}
              <div className='bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800'>
                <span className='font-semibold'>Auto Free Shipping:</span> Orders with a subtotal of <span className='font-bold'>Rs. 10,000 or more</span> always get free shipping automatically — regardless of the settings above.
              </div>

              {/* Global Sale */}
              <div className='border-t border-gray-100 pt-4'>
                <h3 className='font-bold text-gray-800 mb-3'>Global Sale</h3>
                <div>
                  <label className='text-sm font-semibold text-gray-600'>
                    Sale Percentage (%) <span className='font-normal text-gray-400'>— 0 = no global sale</span>
                  </label>
                  <div className='relative mt-1'>
                    <input
                      type='number' min='0' max='100'
                      value={shipping.globalSale ?? 0}
                      onChange={e => setShipping(s => ({ ...s, globalSale: e.target.value }))}
                      className='w-full border rounded-lg px-4 py-2 outline-none focus:border-orange-500 text-lg font-bold pr-8'
                    />
                    <span className='absolute right-3 top-2.5 text-gray-400 font-semibold'>%</span>
                  </div>
                  {Number(shipping.globalSale) > 0 ? (
                    <p className='text-xs text-orange-600 mt-1 font-medium'>
                      All products will show <span className='font-bold'>{shipping.globalSale}% OFF</span> — overrides individual product discounts.
                    </p>
                  ) : (
                    <p className='text-xs text-gray-400 mt-1'>Set to 0 to disable global sale and use per-product discounts.</p>
                  )}
                </div>
              </div>

              <button onClick={saveShipping} disabled={shippingLoading}
                className='bg-green-700 text-white px-8 py-2 rounded-full font-semibold hover:bg-green-800 disabled:opacity-60 cursor-pointer w-fit'>
                {shippingLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

            {/* Special Menu Picker */}
            <div className='bg-white shadow-md rounded-xl p-6 mt-8'>
              <div className='flex items-center justify-between mb-2'>
                <div>
                  <h2 className='text-xl font-bold text-gray-800'>Special Menu</h2>
                  <p className='text-sm text-gray-400 mt-0.5'>Select up to 6 products to feature on the homepage.</p>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${specialMenu.length === 6 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                  {specialMenu.length} / 6 selected
                </span>
              </div>

              <div className='relative mt-4 mb-3'>
                <input
                  type='text'
                  placeholder='Search products by name or category...'
                  value={specialMenuSearch}
                  onChange={e => setSpecialMenuSearch(e.target.value)}
                  className='w-full border border-gray-200 rounded-full px-5 py-2.5 pr-10 outline-none focus:border-green-500 text-sm'
                />
                {specialMenuSearch && (
                  <button onClick={() => setSpecialMenuSearch('')}
                    className='absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-lg leading-none'>×</button>
                )}
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                {products.filter(p =>
                  p.title.toLowerCase().includes(specialMenuSearch.toLowerCase()) ||
                  p.category.toLowerCase().includes(specialMenuSearch.toLowerCase())
                ).map(p => {
                  const selected = specialMenu.includes(p._id)
                  return (
                    <div key={p._id}
                      onClick={() => toggleSpecialMenu(p._id)}
                      className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${selected ? 'border-green-600 shadow-md' : 'border-gray-200 hover:border-green-300 opacity-70 hover:opacity-100'}`}>
                      <img src={p.images?.[0]} alt={p.title} className='w-full h-28 object-cover' />
                      {selected && (
                        <div className='absolute top-2 right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center'>
                          <svg className='w-3.5 h-3.5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                          </svg>
                        </div>
                      )}
                      {selected && (
                        <div className='absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full'>
                          #{specialMenu.indexOf(p._id) + 1}
                        </div>
                      )}
                      <div className='p-2 bg-white'>
                        <p className='text-xs font-semibold text-gray-800 truncate'>{p.title}</p>
                        <p className='text-xs text-gray-400 capitalize'>{p.category}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {products.length === 0 && (
                <p className='text-gray-400 text-sm mt-4'>No products found. Add some products first.</p>
              )}
              {products.length > 0 && specialMenuSearch && products.filter(p =>
                p.title.toLowerCase().includes(specialMenuSearch.toLowerCase()) ||
                p.category.toLowerCase().includes(specialMenuSearch.toLowerCase())
              ).length === 0 && (
                <p className='text-gray-400 text-sm mt-2'>No products match "{specialMenuSearch}".</p>
              )}

              <button onClick={saveSpecialMenu} disabled={specialMenuLoading}
                className='mt-5 bg-orange-500 text-white px-8 py-2 rounded-full font-semibold hover:bg-orange-600 disabled:opacity-60 cursor-pointer'>
                {specialMenuLoading ? 'Saving...' : 'Save Special Menu'}
              </button>
            </div>

            {/* Sale Banner */}
            <div className='bg-white shadow-md rounded-xl p-6 mt-8'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h2 className='text-xl font-bold text-gray-800'>Sale Banner</h2>
                  <p className='text-sm text-gray-400 mt-0.5'>Show a sale poster on the homepage and a strip on all pages.</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' checked={saleBanner.enabled}
                    onChange={e => setSaleBanner(s => ({ ...s, enabled: e.target.checked }))}
                    className='sr-only peer' />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              <div className='flex flex-col gap-4'>
                <div>
                  <label className='text-sm font-semibold text-gray-600'>Banner Title *</label>
                  <input
                    type='text'
                    placeholder='e.g. 🎉 Eid Sale — Up to 50% OFF!'
                    value={saleBanner.title}
                    onChange={e => setSaleBanner(s => ({ ...s, title: e.target.value }))}
                    className='w-full border rounded-lg px-4 py-2 mt-1 outline-none focus:border-orange-400 text-sm'
                  />
                </div>

                <div>
                  <label className='text-sm font-semibold text-gray-600'>Subtitle <span className='font-normal text-gray-400'>(optional)</span></label>
                  <input
                    type='text'
                    placeholder='e.g. Limited time offer. Free shipping above Rs. 2000.'
                    value={saleBanner.subtitle}
                    onChange={e => setSaleBanner(s => ({ ...s, subtitle: e.target.value }))}
                    className='w-full border rounded-lg px-4 py-2 mt-1 outline-none focus:border-orange-400 text-sm'
                  />
                </div>

                <div>
                  <label className='text-sm font-semibold text-gray-600 block mb-2'>Banner Color</label>
                  <div className='flex gap-3 flex-wrap'>
                    {[
                      { value: 'green',  bg: 'bg-green-600',  label: 'Green' },
                      { value: 'orange', bg: 'bg-orange-500', label: 'Orange' },
                      { value: 'red',    bg: 'bg-red-600',    label: 'Red' },
                      { value: 'purple', bg: 'bg-purple-600', label: 'Purple' },
                      { value: 'blue',   bg: 'bg-blue-600',   label: 'Blue' },
                      { value: 'gold',   bg: 'bg-yellow-400', label: 'Gold' },
                    ].map(c => (
                      <button key={c.value} type='button'
                        onClick={() => setSaleBanner(s => ({ ...s, bgColor: c.value }))}
                        className={`w-8 h-8 rounded-full ${c.bg} transition-transform ${saleBanner.bgColor === c.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Background Image Upload */}
                <div className='border border-dashed border-gray-300 rounded-xl p-4'>
                  <p className='text-sm font-semibold text-gray-600 mb-1'>Background Image <span className='font-normal text-gray-400'>(optional)</span></p>
                  <p className='text-xs text-gray-400 mb-3'>Recommended size: <span className='font-semibold text-gray-600'>1920 × 1080 px</span> — full screen landscape, JPG/PNG/WebP, max 10 MB. The image will be darkened automatically so text stays readable.</p>
                  <div className='flex flex-col sm:flex-row gap-3 items-start'>
                    <label className={`flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${bannerImgLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                      <FaCloudUploadAlt />
                      {bannerImgLoading ? 'Uploading...' : 'Upload Image'}
                      <input type='file' accept='image/*' className='hidden'
                        onChange={e => uploadBannerImg(e.target.files[0])} />
                    </label>
                    {saleBanner.imageUrl && (
                      <button type='button' onClick={() => setSaleBanner(s => ({ ...s, imageUrl: '' }))}
                        className='text-xs text-red-500 hover:text-red-700 font-semibold underline self-center'>
                        Remove Image
                      </button>
                    )}
                  </div>
                  {saleBanner.imageUrl && (
                    <div className='mt-3 relative rounded-lg overflow-hidden h-24'>
                      <img src={saleBanner.imageUrl} alt='banner preview' className='w-full h-full object-cover' />
                      <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                        <span className='text-white text-xs font-semibold'>Preview</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Preview */}
                {saleBanner.title && (
                  <div className={`rounded-xl overflow-hidden text-center py-4 px-4 text-white text-sm font-semibold ${{
                    green: 'bg-green-600', orange: 'bg-orange-500', red: 'bg-red-600',
                    purple: 'bg-purple-600', blue: 'bg-blue-600', gold: 'bg-yellow-400 text-yellow-900'
                  }[saleBanner.bgColor] || 'bg-green-600'}`}>
                    <p className='font-bold'>{saleBanner.title}</p>
                    {saleBanner.subtitle && <p className='text-xs opacity-80 mt-0.5'>{saleBanner.subtitle}</p>}
                  </div>
                )}

                <button onClick={saveSaleBanner} disabled={saleBannerLoading}
                  className='bg-orange-500 text-white px-8 py-2 rounded-full font-semibold hover:bg-orange-600 disabled:opacity-60 cursor-pointer w-fit'>
                  {saleBannerLoading ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className='bg-white shadow-md rounded-xl p-6 mt-8'>
              <div className='mb-5'>
                <h2 className='text-xl font-bold text-gray-800'>Contact Information</h2>
                <p className='text-sm text-gray-400 mt-0.5'>These details appear on the Contact page and Footer across the site.</p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4'>
                {[
                  { label: 'Email', key: 'email', placeholder: 'e.g. urbanpickle@gmail.com', type: 'email' },
                  { label: 'Phone', key: 'phone', placeholder: 'e.g. +92 323-5073652', type: 'text' },
                  { label: 'Location', key: 'location', placeholder: 'e.g. 26000, Multan, Pakistan', type: 'text' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className='text-sm font-semibold text-gray-500 block mb-1'>{label}</label>
                    <p className='text-xs text-gray-400 mb-1'>Current: <span className='font-medium text-gray-600'>{contactInfo[key] || '—'}</span></p>
                    <input
                      type={type}
                      value={contactInfo[key]}
                      onChange={e => setContactInfo(c => ({ ...c, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className='w-full border rounded-lg px-4 py-2 outline-none focus:border-green-500 text-sm'
                    />
                  </div>
                ))}
              </div>

              <button onClick={saveContactInfo} disabled={contactInfoLoading}
                className='bg-green-700 text-white px-8 py-2 rounded-full font-semibold hover:bg-green-800 disabled:opacity-60 cursor-pointer w-fit'>
                {contactInfoLoading ? 'Saving...' : 'Save Contact Info'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default HomeAdmin
