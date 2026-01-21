import React from 'react'
// import bannerImage from "../assets/latest.png"
import bannerImage from "../assets/banner_11zon.jpg"
const Banner = () => {
    return (
       
    //    <div className='flex w-full mb-10'>
        
    //         <div className='w-1/2 ml-33 mt-40  '>
    //         <h1 className='text-4xl text-black font-bold mb-10'>Authentic Pakistani Pickles, Real Achaar <span className='text-orange-500'>Delivered Fresh!!</span>
    //         </h1> 
    //         <p className='text-xl  text-black'>Handcrafted achaar made with traditional recipes, bold spices, and the finest local ingredients. Bringing the real taste of Pakistan to your table.</p>
           
    //         <input type="Email" placeholder='Email' className='w-full  border rounded p-2 text-black border-black py-2 mt-10'/>
           
    //         <button className='bg-orange-500 mt-7 cursor-pointer hover:bg-orange-700 p-2 text-white rounded  font-bold'>Send Email</button>
    //            </div>

    //       <div className='w-1/3 ml-10 h-110 bg-cover mt-20 bg-center' style={{ backgroundImage: `url(${bannerImage})` }}>

    //     </div>
      
    //    </div>

       <div className='min-h-[90vh]  bg-center flex w-full bg-no-repeat bg-cover bg-center' style={{ backgroundImage: `url(${bannerImage})` }}
>
            <div className='w-1/2 ml-33 mt-40 '><h1 className='text-4xl text-black font-bold mb-10'>Authentic Pakistani Pickles, Real Achaar <span className='text-orange-500'>Delivered Fresh!!</span>
            </h1> <p className='text-xl  text-black'>Handcrafted achaar made with traditional recipes, bold spices, and the finest local ingredients. Bringing the real taste of Pakistan to your table.</p>
           
            <input type="Email" placeholder='Email' className='w-full  border rounded p-2 text-black border-black py-2 mt-10'/>
           
            <button className='bg-orange-500 mt-7 cursor-pointer hover:bg-orange-700 p-2 text-white rounded  font-bold'>Send Email</button>
            
            
            </div>

        

      
      
       </div>
       
    )
}

export default Banner
