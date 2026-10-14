/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { axiosInstance } from "../axiosCalls/axios"

const CartContext = createContext(null)

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback

export const CartProvider = ({ children }) => {
    const { customer, loader: authLoading } = useAuth()
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchCart = useCallback(async () => {
        if (!customer) {
            setCart([])
            setError("")
            setLoading(false)
            return []
        }

        try {
            setLoading(true)
            setError("")
            const response = await axiosInstance.get("/cart")
            const nextCart = response.data.cart || []
            setCart(nextCart)
            return nextCart
        } catch (requestError) {
            const message = getErrorMessage(
                requestError,
                "Unable to load cart."
            )
            setError(message)
            setCart([])
            throw requestError
        } finally {
            setLoading(false)
        }
    }, [customer])

    useEffect(() => {
        if (!authLoading) {
            // Cart state is synchronized with the authenticated customer.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchCart().catch(() => {})
        }
    }, [authLoading, fetchCart])

    const addToCart = async (productId) => {
        try {
            setError("")
            await axiosInstance.post(`/cart/${productId}`)
            return await fetchCart()
        } catch (requestError) {
            setError(getErrorMessage(requestError, "Unable to add item to cart."))
            throw requestError
        }
    }

    const updateCartItem = async (productId, quantity) => {
        try {
            setError("")
            await axiosInstance.patch(`/cart/${productId}`, { quantity })
            return await fetchCart()
        } catch (requestError) {
            setError(
                getErrorMessage(requestError, "Unable to update cart item.")
            )
            throw requestError
        }
    }

    const removeFromCart = async (productId) => {
        try {
            setError("")
            await axiosInstance.delete(`/cart/${productId}`)
            return await fetchCart()
        } catch (requestError) {
            setError(
                getErrorMessage(requestError, "Unable to remove item from cart.")
            )
            throw requestError
        }
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                fetchCart,
                addToCart,
                updateCartItem,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
