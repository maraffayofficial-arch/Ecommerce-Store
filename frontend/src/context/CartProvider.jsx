import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthProvider'
import toast from 'react-hot-toast'

export const CartContext = createContext()

const GUEST_KEY = "guestCart"
const loadGuest = () => { try { return JSON.parse(localStorage.getItem(GUEST_KEY) || "[]") } catch { return [] } }

export default function CartProvider({ children }) {
    const [authUser] = useAuth()
    const [cart, setCart] = useState({ items: [] })
    const [guestItems, setGuestItems] = useState(loadGuest)
    const [loading, setLoading] = useState(false)

    const authHeader = () => ({ headers: { Authorization: `Bearer ${authUser?.token}` } })

    const fetchCart = async () => {
        if (!authUser?.token) return setCart({ items: [] })
        try {
            const res = await axios.get("http://localhost:8000/cart", authHeader())
            setCart(res.data)
        } catch { setCart({ items: [] }) }
    }

    useEffect(() => { fetchCart() }, [authUser])
    useEffect(() => { localStorage.setItem(GUEST_KEY, JSON.stringify(guestItems)) }, [guestItems])

    // productData required for guest (CardElements/ProductDetail pass the full item object)
    const addToCart = async (productId, quantity = 1, productData = null) => {
        if (!authUser) {
            if (!productData) { toast.error("Please login to add to cart"); return }
            setGuestItems(prev => {
                const exists = prev.find(i => i.productId._id === productId)
                if (exists) return prev.map(i => i.productId._id === productId ? { ...i, quantity: i.quantity + quantity } : i)
                return [...prev, {
                    productId: { _id: productData._id, title: productData.title, price: productData.price, images: productData.images, weight: productData.weight },
                    quantity
                }]
            })
            toast.success("Added to cart!")
            return
        }
        setLoading(true)
        try {
            const res = await axios.post("http://localhost:8000/cart/add", { productId, quantity }, authHeader())
            setCart(res.data.cart)
            toast.success("Added to cart!")
        } catch { toast.error("Failed to add to cart") }
        finally { setLoading(false) }
    }

    const updateItem = async (productId, quantity) => {
        if (!authUser) {
            if (quantity < 1) setGuestItems(prev => prev.filter(i => i.productId._id !== productId))
            else setGuestItems(prev => prev.map(i => i.productId._id === productId ? { ...i, quantity } : i))
            return
        }
        setLoading(true)
        try {
            const res = await axios.put("http://localhost:8000/cart/update", { productId, quantity }, authHeader())
            setCart(res.data.cart)
        } catch { toast.error("Failed to update cart") }
        finally { setLoading(false) }
    }

    const removeItem = async (productId) => {
        if (!authUser) {
            setGuestItems(prev => prev.filter(i => i.productId._id !== productId))
            toast.success("Item removed")
            return
        }
        setLoading(true)
        try {
            const res = await axios.delete(`http://localhost:8000/cart/remove/${productId}`, authHeader())
            setCart(res.data.cart)
            toast.success("Item removed")
        } catch { toast.error("Failed to remove item") }
        finally { setLoading(false) }
    }

    const clearCart = async () => {
        if (!authUser) { setGuestItems([]); localStorage.removeItem(GUEST_KEY); return }
        try { await axios.delete("http://localhost:8000/cart/clear", authHeader()); setCart({ items: [] }) } catch { }
    }

    const activeItems = authUser ? (cart?.items || []) : guestItems
    const cartCount = activeItems.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <CartContext.Provider value={{ cart: { items: activeItems }, guestItems, cartCount, addToCart, updateItem, removeItem, clearCart, loading, fetchCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
