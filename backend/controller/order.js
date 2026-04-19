import orderModel from "../model/order.js"
import cartModel from "../model/cart.js"

const placeOrder = async (req, res) => {
    try {
        const { address } = req.body
        const cart = await cartModel.findOne({ userId: req.user._id }).populate("items.productId")

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" })
        }

        const items = cart.items.map(i => ({
            productId: i.productId._id,
            title: i.productId.title,
            price: i.productId.price,
            image: i.productId.images?.[0] || "",
            quantity: i.quantity
        }))

        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

        const order = new orderModel({ userId: req.user._id, items, totalAmount, address })
        await order.save()

        // clear cart after order
        await cartModel.findOneAndUpdate({ userId: req.user._id }, { items: [] })

        res.status(201).json({ success: true, message: "Order placed successfully!", order })
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error })
    }
}

const getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.user._id }).sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().populate("userId", "name email").sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const order = await orderModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )
        if (!order) return res.status(404).json({ message: "Order not found" })
        res.status(200).json({ success: true, order })
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error })
    }
}

const removeOrder = async (req, res) => {
    try {
        const order = await orderModel.findOne({ _id: req.params.id, userId: req.user._id })
        if (!order) return res.status(404).json({ message: "Order not found" })
        if (order.status !== "delivered" && order.status !== "cancelled") {
            return res.status(400).json({ success: false, message: "Only delivered or cancelled orders can be removed" })
        }
        await orderModel.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true, message: "Order removed" })
    } catch (error) {
        res.status(500).json({ message: "Error removing order", error })
    }
}

const adminRemoveOrder = async (req, res) => {
    try {
        const order = await orderModel.findByIdAndDelete(req.params.id)
        if (!order) return res.status(404).json({ message: "Order not found" })
        res.status(200).json({ success: true, message: "Order removed" })
    } catch (error) {
        res.status(500).json({ message: "Error removing order", error })
    }
}

const cancelOrder = async (req, res) => {
    try {
        const order = await orderModel.findOne({ _id: req.params.id, userId: req.user._id })
        if (!order) return res.status(404).json({ message: "Order not found" })
        if (order.status !== "pending") {
            return res.status(400).json({ success: false, message: "Only pending orders can be cancelled" })
        }
        order.status = "cancelled"
        await order.save()
        res.status(200).json({ success: true, message: "Order cancelled", order })
    } catch (error) {
        res.status(500).json({ message: "Error cancelling order", error })
    }
}

export { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder, removeOrder, adminRemoveOrder }
