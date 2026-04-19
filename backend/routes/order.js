import express from "express"
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder, removeOrder, adminRemoveOrder } from "../controller/order.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

router.post("/place", verifyToken, placeOrder)
router.get("/my-orders", verifyToken, getUserOrders)
router.get("/all", verifyAdmin, getAllOrders)
router.put("/:id/status", verifyAdmin, updateOrderStatus)
router.put("/:id/cancel", verifyToken, cancelOrder)
router.delete("/:id", verifyToken, removeOrder)
router.delete("/:id/admin", verifyAdmin, adminRemoveOrder)

export default router
