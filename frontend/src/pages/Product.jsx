import React from 'react'
import list from '../listfiles/list.json'
import { Link } from 'react-router-dom'
import CardElements from '../components/CardElements'
const Product = () => {
    return (

        <div className='max-w-screen-2xl container md:px-20 px-4 '>
            <div className='mt-20 justify-center items-center text-center '>

                <h1 className='text-4xl font-semibold md:text-4xl'>
                    We're delighted to have you{" "} <span className='text-orange-500'>Here! :)</span>                </h1>
                <p className='mt-10'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam recusandae inventore at, magni facilis voluptate aliquid architecto corrupti ducimus modi est aperiam quod optio maiores ex vel? Nobis, aspernatur. Asperiores?</p>
                <Link to="/">
                    <button className='bg-green-700  text-white  rounded cursor-pointer px-5 py-1 text-lg mt-5 hover:bg-green-900'>Back</button>
                </Link>
            </div>
            <div className='mt-10 grid grid-cols-1 md:grid-cols-4'>
                {
                    list.map((item) => {
                        return <CardElements key={item.id} item={item} />
                    })
                }

            </div>
        </div>

    )

}

export default Product
