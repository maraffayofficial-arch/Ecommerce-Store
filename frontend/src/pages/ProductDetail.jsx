import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartProvider'
import { FaStar } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import CardElements from '../components/CardElements'

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setQty(1)
      setActiveImg(0)
      try {
        const [productRes, allRes] = await Promise.all([
          axios.get(`http://localhost:8000/product/${id}`),
          axios.get("http://localhost:8000/product")
        ])
        setProduct(productRes.data)
        const others = allRes.data.filter(p => p._id !== id && p.category === productRes.data.category)
        setRelated(others.slice(0, 4))
      } catch {
        toast.error("Product not found")
        navigate('/products')
      } finally { setLoading(false) }
    }
    fetchProduct()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (loading) return (
    <>
      <Navbar />
      <div className='min-h-screen flex items-center justify-center pt-20'>
        <span className="loading loading-spinner loading-lg text-green-700"></span>
      </div>
    </>
  )

  if (!product) return null

  const images = product.images || []

  return (
    <>
      <Navbar />
      <div className='min-h-screen pt-24 pb-12 px-4 sm:px-8 max-w-6xl mx-auto'>

        {/* Product Detail Card */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-100 shadow-lg rounded-2xl p-6 sm:p-10'>

          {/* Image Gallery */}
          <div className='flex flex-col gap-3'>
            <div className='rounded-xl overflow-hidden bg-base-200 relative'>
              <img
                src={images[activeImg]}
                alt={product.title}
                className='w-full h-80 sm:h-96 object-cover'
              />
              {product.discount > 0 && (
                <span className='absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full'>
                  {product.discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className='flex gap-2 flex-wrap'>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-green-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <img src={img} alt={`view ${i + 1}`} className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className='flex flex-col justify-center gap-4'>
            <h1 className='text-2xl sm:text-3xl font-bold'>{product.title}</h1>

            <p className='flex gap-1 text-yellow-500 text-lg items-center'>
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              <span className='text-gray-400 text-sm ml-2'>(50+ reviews)</span>
            </p>

            {product.discount > 0 ? (
              <div className='flex items-center gap-3 flex-wrap'>
                <p className='text-green-700 text-3xl font-bold'>
                  Rs. {Math.round(product.price - (product.price * product.discount / 100))}
                </p>
                <p className='text-gray-400 text-xl line-through'>Rs. {product.price}</p>
                <span className='bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full'>{product.discount}% OFF</span>
              </div>
            ) : (
              <p className='text-green-700 text-3xl font-bold'>Rs. {product.price}</p>
            )}

            <div className='flex gap-3 flex-wrap'>
              <span className='bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold capitalize'>{product.category}</span>
              <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>{product.weight}</span>
            </div>

            <p className='text-gray-500 text-base leading-relaxed'>{product.discription}</p>

            <div className='flex items-center gap-3 mt-1'>
              <span className='font-semibold text-sm text-gray-500'>Quantity:</span>
              <div className='flex items-center border border-base-300 rounded-full overflow-hidden'>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className='px-4 py-2 bg-base-200 hover:bg-base-300 font-bold'>−</button>
                <span className='px-5 font-semibold'>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className='px-4 py-2 bg-base-200 hover:bg-base-300 font-bold'>+</button>
              </div>
            </div>

            <div className='flex flex-wrap gap-4 mt-2'>
              <button onClick={() => addToCart(product._id, qty, product)}
                className='bg-orange-500 text-white px-8 py-3 rounded-full font-bold text-base hover:bg-orange-600 cursor-pointer transition-colors'>
                Add to Cart
              </button>
              <button onClick={() => navigate('/products')}
                className='border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-bold text-base hover:bg-green-50 cursor-pointer transition-colors'>
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className='mt-14'>
            <h2 className='text-2xl font-bold mb-6'>
              You might also like <span className='text-orange-500 capitalize'>({product.category})</span>
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {related.map(item => (
                <CardElements item={item} key={item._id} />
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  )
}

export default ProductDetail
