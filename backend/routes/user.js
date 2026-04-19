import express from 'express'
import { userLogin, userSignup } from '../controller/user.js'
const userRouter=express.Router()

userRouter.post("/signup",userSignup)
userRouter.post("/login",userLogin)

export default userRouter

