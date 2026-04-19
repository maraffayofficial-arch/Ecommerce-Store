import { useEffect, useState } from 'react'
import SpecialMenuCards from './SpecialMenuCards'
import axios from 'axios'

const SpecialMenu = () => {
    const [product, setProduct] = useState([])

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get("http://localhost:8000/product")
                setProduct(res.data.slice(0, 6))
            } catch (error) {
                console.log(error)
            }
        }
        getProduct()
    }, [])

    return (
        <section className='py-16 px-6 sm:px-12'>
            <div className='text-center max-w-2xl mx-auto mb-12'>
                <h1 className='font-extrabold text-4xl sm:text-5xl tracking-wide'>Special Menu</h1>
                <p className='mt-4 text-gray-500 text-lg'>
                    Some of our best-selling pickles across Pakistan — crafted with love and tradition.
                </p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto'>
                {product.map((item) => (
                    <SpecialMenuCards item={item} key={item._id} />
                ))}
            </div>
        </section>
    )
}

export default SpecialMenu
