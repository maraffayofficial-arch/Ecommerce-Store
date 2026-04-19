import mongoose from "mongoose";

import dotenv from "dotenv"
dotenv.config()
const URI=process.env.DB_URI

// try {
    const db_connection=async()=>{
    
       const connection= await mongoose.connect(URI)
       console.log("Mongodb Connected")
    }
    
// } catch (error) {
//     console.log("Cant connect to database",error)
// }

export default db_connection