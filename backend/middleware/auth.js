import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ success: false, message: "No token provided" })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ success: false, message: "Invalid token" })
    }
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access only" })
        }
        next()
    })
}
