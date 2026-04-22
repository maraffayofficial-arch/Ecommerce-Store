import userModel from "../model/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendOtpEmail } from "../utils/mailer.js"

const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}

const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existing = await userModel.findOne({ email })
        if (existing) {
            return res.status(401).json({ success: false, message: "User Already Registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new userModel({ name, email, password: hashedPassword })
        await newUser.save()

        const token = generateToken(newUser)

        return res.status(201).json({
            success: true,
            message: "User created Successfully!!",
            token,
            user: { _id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }
        })
    } catch (error) {
        res.status(500).json({ message: "Error in userSignup Controller", error })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found! Please Register!" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" })
        }

        const token = generateToken(user)
        return res.status(200).json({
            success: true,
            message: "Logged in!",
            token,
            user: { _id: user._id, email: user.email, name: user.name, role: user.role }
        })
    } catch (error) {
        console.error("userLogin error:", error)
        res.status(500).json({ message: "Error in userLogin Controller", error: error.message })
    }
}

const verifyAdminOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await userModel.findOne({ email })

        if (!user || user.role !== 'admin')
            return res.status(404).json({ success: false, message: "Admin not found." })

        if (!user.resetOtp || user.resetOtp !== otp)
            return res.status(400).json({ success: false, message: "Invalid OTP." })

        if (user.resetOtpExpiry < new Date())
            return res.status(400).json({ success: false, message: "OTP expired. Please login again." })

        user.resetOtp = null
        user.resetOtpExpiry = null
        await user.save()

        const token = generateToken(user)
        return res.status(200).json({
            success: true,
            message: "Admin verified!",
            token,
            user: { _id: user._id, email: user.email, name: user.name, role: user.role }
        })
    } catch (error) {
        res.status(500).json({ message: "Error in verifyAdminOtp Controller", error })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email })
        if (!user) return res.status(404).json({ success: false, message: "No account found with this email." })

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        user.resetOtp = otp
        user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000)
        await user.save()

        await sendOtpEmail(email, otp)
        return res.status(200).json({ success: true, message: "OTP sent to your email." })
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        const user = await userModel.findOne({ email })
        if (!user) return res.status(404).json({ success: false, message: "User not found." })

        if (!user.resetOtp || user.resetOtp !== otp)
            return res.status(400).json({ success: false, message: "Invalid OTP." })

        if (user.resetOtpExpiry < new Date())
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." })

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetOtp = null
        user.resetOtpExpiry = null
        await user.save()

        return res.status(200).json({ success: true, message: "Password reset successfully." })
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error })
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const user = await userModel.findById(req.user._id)
        if (!user) return res.status(404).json({ success: false, message: "User not found." })

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) return res.status(401).json({ success: false, message: "Current password is incorrect." })

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        return res.status(200).json({ success: true, message: "Password changed successfully." })
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error })
    }
}

export { userSignup, userLogin, verifyAdminOtp, forgotPassword, resetPassword, changePassword }
