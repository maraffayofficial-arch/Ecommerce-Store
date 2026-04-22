import express from 'express'
import dotenv from "dotenv"
import db_connection from './db_connection.js'
import productrouter from './routes/product.js'
import cors from "cors"
import userRouter from './routes/user.js'
import cartRouter from './routes/cart.js'
import orderRouter from './routes/order.js'
import settingsRouter from './routes/settings.js'
import subscriberRouter from './routes/subscriber.js'

const app = express()

dotenv.config()
const PORT = process.env.PORT || 8000
db_connection()

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/product", productrouter)
app.use("/user", userRouter)
app.use("/cart", cartRouter)
app.use("/order", orderRouter)
app.use("/settings", settingsRouter)
app.use("/subscribe", subscriberRouter)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})
