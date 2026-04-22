import mongoose from "mongoose";


const userShema=mongoose.Schema({
    name:{type:String, required: true,
    },
    email:{type:String, required: true ,unique:true
    },
    password:{type:String, required: true,
    },
    role:{type:String, enum:["user","admin"], default:"user"
    },
    resetOtp: { type: String, default: null },
    resetOtpExpiry: { type: Date, default: null },
})

const userModel=mongoose.model("user_Collection",userShema)

export default userModel

