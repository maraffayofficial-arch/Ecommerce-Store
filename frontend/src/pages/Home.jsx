import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
import Cards from '../components/cards'
import SpecialMenu from '../components/SpecialMenu'
import Whyus from '../components/Whyus'
import SaleBannerPoster from '../components/SaleBannerPoster'
const Home = () => {
  return (
    <>
    <Navbar />
    <SaleBannerPoster />
    <Banner/>
    <Cards/>
    <Whyus/>
    <SpecialMenu/>
    <Footer/>
    </>
  )
}

export default Home
