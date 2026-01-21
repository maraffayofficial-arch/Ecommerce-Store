
import express from 'express'
const app=express()
app.get('/',()=>{
    console.log('Get got executed')
})



// https://github.com/maraffayofficial-arch/Ecommerce-store.git
app.listen(9000,()=>{
    console.log('Connect to port 9000')
})




