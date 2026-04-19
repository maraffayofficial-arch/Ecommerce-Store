import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthProvider'
import toast from 'react-hot-toast'

export const CartContext = createContext()

export default function CartProvider({ children }) {
    const [authUser] = useAuth()
    const [cart, setCart] = useState({ items: [] })
    const [loading, setLoading] = useState(false)

    const authHeader = () => ({
        headers: { Authorization: `Bearer ${authUser?.token}` }
    })

    const fetchCart = async () => {
        if (!authUser?.token) return setCart({ items: [] })
        try {
            const res = await axios.get("http://localhost:8000/cart", authHeader())
            setCart(res.data)
        } catch {
            setCart({ items: [] })
        }
    }

    useEffect(() => { fetchCart() }, [authUser])

    const addToCart = async (productId, quantity = 1) => {
        if (!authUser) { toast.error("Please login to add items to cart"); return }
        setLoading(true)
        try {
            const res = await axios.post("http://localhost:8000/cart/add", { productId, quantity }, authHeader())
            setCart(res.data.cart)
            toast.success("Added to cart!")
        } catch {
            toast.error("Failed to add to cart")
        } finally { setLoading(false) }
    }

    const updateItem = async (productId, quantity) => {
        setLoading(true)
        try {
            const res = await axios.put("http://localhost:8000/cart/update", { productId, quantity }, authHeader())
            setCart(res.data.cart)
        } catch {
            toast.error("Failed to update cart")
        } finally { setLoading(false) }
    }

    const removeItem = async (productId) => {
        setLoading(true)
        try {
            const res = await axios.delete(`http://localhost:8000/cart/remove/${productId}`, authHeader())
            setCart(res.data.cart)
            toast.success("Item removed")
        } catch {
            toast.error("Failed to remove item")
        } finally { setLoading(false) }
    }

    const clearCart = async () => {
        try {
            await axios.delete("http://localhost:8000/cart/clear", authHeader())
            setCart({ items: [] })
        } catch { }
    }

    const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

    return (
        <CartContext.Provider value={{ cart, cartCount, addToCart, updateItem, removeItem, clearCart, loading, fetchCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
