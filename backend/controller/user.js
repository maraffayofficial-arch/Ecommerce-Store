import userModel from "../model/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

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
        res.status(500).json({ message: "Error in userLogin Controller", error })
    }
}

export { userSignup, userLogin }
