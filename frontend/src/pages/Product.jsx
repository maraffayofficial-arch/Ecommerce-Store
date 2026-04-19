import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CardElements from '../components/CardElements'
import axios from 'axios'

const categories = [
  { label: 'All', value: '' },
  { label: 'Achar', value: 'achar' },
  { label: 'Chatni', value: 'chatni' },
  { label: 'Sauce', value: 'sauce' },
  { label: 'Sweet', value: 'sweet' },
  { label: 'Spices', value: 'spices' },
]

const Product = () => {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const searchQuery = searchParams.get('q') || ''
  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/product")
        setAllProducts(res.data)
      } catch (error) {
        console.log(error)
      } finally { setLoading(false) }
    }
    getProducts()
  }, [])

  const filtered = allProducts.filter(p => {
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.discription.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesCategory = activeCategory ? p.category === activeCategory : true
    return matchesSearch && matchesCategory
  })

  const setCategory = (val) => {
    const params = {}
    if (val) params.category = val
    if (searchQuery) params.q = searchQuery
    setSearchParams(params)
  }

  const clearFilters = () => setSearchParams({})

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-8 pt-4'>

      {/* Header */}
      <div className='text-center mb-8'>
        <h1 className='text-3xl sm:text-4xl font-bold'>
          {searchQuery
            ? <>Results for "<span className='text-orange-500'>{searchQuery}</span>"</>
            : activeCategory
              ? <span className='capitalize text-orange-500'>{activeCategory}</span>
              : 'All Products'}
        </h1>
        <p className='text-gray-400 mt-2'>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Category Filter Pills */}
      <div className='flex flex-wrap gap-2 justify-center mb-8'>
        {categories.map(c => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all cursor-pointer
              ${activeCategory === c.value
                ? 'bg-green-700 text-white border-green-700'
                : 'border-gray-300 hover:border-green-700 hover:text-green-700'}`}
          >
            {c.label}
          </button>
        ))}
        {(searchQuery || activeCategory) && (
          <button onClick={clearFilters}
            className='px-4 py-1.5 rounded-full text-sm font-semibold border border-red-300 text-red-500 hover:bg-red-50 cursor-pointer'>
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className='flex justify-center py-20'>
          <span className='loading loading-spinner loading-lg text-green-700'></span>
        </div>
      )}

      {/* No Results */}
      {!loading && filtered.length === 0 && (
        <div className='text-center py-20'>
          <p className='text-xl text-gray-400'>No products found.</p>
          <button onClick={clearFilters} className='mt-4 text-green-700 underline font-semibold'>
            View all products
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filtered.map(item => (
          <CardElements item={item} key={item._id} />
        ))}
      </div>

      <div className='text-center mt-10'>
        <Link to="/">
          <button className='bg-green-700 text-white rounded-full px-8 py-2 text-lg hover:bg-green-900 cursor-pointer'>
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Product
