import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
import Cards from '../components/cards'
import SpecialMenu from '../components/SpecialMenu'
import Whyus from '../components/Whyus'
const Home = () => {
  return (
    <>
    <Navbar />
    <Banner/>
    <Cards/>
    <Whyus/>
    <SpecialMenu/>

    <Footer/>
    </>
  )
}

export default Home
