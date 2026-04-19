import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Product from './Product'

const Products = () => {
  return (
    <>
      <Navbar />
      <div className='min-h-screen pt-24 pb-12'>
        <Product />
      </div>
      <Footer />
    </>
  )
}

export default Products
