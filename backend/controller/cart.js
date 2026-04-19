import cartModel from "../model/cart.js"

const getCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ userId: req.user._id }).populate("items.productId")
        res.status(200).json(cart || { items: [] })
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error })
    }
}

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body
        let cart = await cartModel.findOne({ userId: req.user._id })

        if (!cart) {
            cart = new cartModel({ userId: req.user._id, items: [{ productId, quantity }] })
        } else {
            const existing = cart.items.find(i => i.productId.toString() === productId)
            if (existing) {
                existing.quantity += quantity
            } else {
                cart.items.push({ productId, quantity })
            }
        }

        await cart.save()
        await cart.populate("items.productId")
        res.status(200).json({ success: true, cart })
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error })
    }
}

const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        const item = cart.items.find(i => i.productId.toString() === productId)
        if (!item) return res.status(404).json({ message: "Item not in cart" })

        if (quantity <= 0) {
            cart.items = cart.items.filter(i => i.productId.toString() !== productId)
        } else {
            item.quantity = quantity
        }

        await cart.save()
        await cart.populate("items.productId")
        res.status(200).json({ success: true, cart })
    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params
        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        cart.items = cart.items.filter(i => i.productId.toString() !== productId)
        await cart.save()
        await cart.populate("items.productId")
        res.status(200).json({ success: true, cart })
    } catch (error) {
        res.status(500).json({ message: "Error removing from cart", error })
    }
}

const clearCart = async (req, res) => {
    try {
        await cartModel.findOneAndUpdate({ userId: req.user._id }, { items: [] })
        res.status(200).json({ success: true, message: "Cart cleared" })
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error })
    }
}

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart }
