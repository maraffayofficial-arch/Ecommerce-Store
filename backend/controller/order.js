import orderModel from "../model/order.js"
import cartModel from "../model/cart.js"
import settingsModel from "../model/settings.js"

const FREE_SHIPPING_THRESHOLD = 10000

const calcShipping = async (subtotal) => {
    let s = await settingsModel.findOne()
    if (!s) s = { shippingFee: 199, freeShipping: false }
    if (s.freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD) return 0
    return s.shippingFee
}

const placeOrder = async (req, res) => {
    try {
        const { address, paymentMethod, transactionId, newsletterOptIn } = req.body
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

        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        const shippingFee = await calcShipping(subtotal)
        const totalAmount = subtotal + shippingFee

        const order = new orderModel({ userId: req.user._id, items, totalAmount, address, paymentMethod: paymentMethod || "cod", transactionId: transactionId || "", newsletterOptIn: !!newsletterOptIn })
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

const placeGuestOrder = async (req, res) => {
    try {
        const { items: rawItems, address, paymentMethod, transactionId, newsletterOptIn } = req.body
        if (!rawItems || rawItems.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" })
        }
        const subtotal = rawItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        const shippingFee = await calcShipping(subtotal)
        const totalAmount = subtotal + shippingFee
        const order = new orderModel({
            userId: null,
            guestOrder: true,
            items: rawItems,
            totalAmount,
            address,
            paymentMethod: paymentMethod || "cod",
            transactionId: transactionId || "",
            newsletterOptIn: !!newsletterOptIn,
        })
        await order.save()
        res.status(201).json({ success: true, message: "Order placed successfully!", order })
    } catch (error) {
        res.status(500).json({ message: "Error placing guest order", error })
    }
}

export { placeOrder, placeGuestOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder, removeOrder, adminRemoveOrder }
