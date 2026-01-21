import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Product from './Product'
import list from "../listfiles/list.json"

const Products = () => {
console.log("Products component rendered");

  console.log(list)
  // list.map((item,index)=>{return console.log(item)})
  return (
    <>
      <Navbar />
      <div className='min-h-screen '>
        <Product/>
      </div>
      <Footer />
    </>
  )
}

export default Products
