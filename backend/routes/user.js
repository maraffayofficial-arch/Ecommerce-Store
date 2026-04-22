import express from 'express'
import { userLogin, userSignup, forgotPassword, resetPassword, changePassword, verifyAdminOtp } from '../controller/user.js'
import { verifyToken } from '../middleware/auth.js'
const userRouter=express.Router()

userRouter.post("/signup", userSignup)
userRouter.post("/login", userLogin)
userRouter.post("/verify-admin-otp", verifyAdminOtp)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password", resetPassword)
userRouter.put("/change-password", verifyToken, changePassword)

export default userRouter

