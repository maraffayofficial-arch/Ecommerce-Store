import React from 'react'

const CardElements = ({item}) => {
 
 console.log(item.image)



    return (
    <>
    <div className='text-black flex py-3 '>
        <div className="card bg-white w-110 h-120 mx-3 hover:scale-105 duration-300 shadow-[0_0_10px_black]">
  <figure>
    <img
      src={item.image}   className="w-full h-88 object-cover"   alt="Image" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{item.title}</h2>
    <p>{item.discription}</p>
    <div className="card-actions [&>button]:rounded-full [&>button]:text-black [&>button]:bg-white [&>button]:hover:bg-orange-500 [&>button]:border-orange-500 justify-between">
      <button className="btn btn-primary">${item.price}</button>
      <button className="btn btn-primary">Buy now</button>
    </div>
  </div>
</div>
    </div>
    </>
  )
}

export default CardElements
