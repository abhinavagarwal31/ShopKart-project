import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";


const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [customer, setCustomerState] = useState(null)
    const [wishlist, setWishlist] = useState([])
    const [wishlistLoading, setWishlistLoading] = useState(true)
    const [wishlistError, setWishlistError] = useState('')
    const [wishlistRetry, setWishlistRetry] = useState(0)
    const [loader, setLoader] = useState(true)

    const setCustomer = (nextCustomer) => {
        setCustomerState(nextCustomer)
        if (!nextCustomer) {
            setWishlist([])
        }
    }
    
    useEffect(()=>{
        const getCustomer = async () => {
            try {
                const response = await axiosInstance.get('/customers/me')
                setCustomer(response.data)
            } catch {
                setCustomer(null)
            } finally{
                setLoader(false)
            }
        }
        getCustomer()
    },[])

    useEffect(() => {
        if (loader) {
            return
        }

        const getWishlist = async () => {
            if (!customer) {
                setWishlist([])
                setWishlistError('')
                setWishlistLoading(false)
                return
            }

            try {
                setWishlistLoading(true)
                setWishlistError('')
                const response = await axiosInstance.get('/wishlist')
                setWishlist(response.data.wishlist || [])
            } catch (error) {
                setWishlistError(
                    error.response?.data?.message || 'Unable to load wishlist.'
                )
                setWishlist([])
            } finally {
                setWishlistLoading(false)
            }
        }

        getWishlist()
    }, [customer, loader, wishlistRetry])

    const retryWishlist = () => {
        setWishlistRetry((retryCount) => retryCount + 1)
    }

    return(
        <AuthContext.Provider value={{
            customer,
            setCustomer,
            loader,
            wishlist,
            setWishlist,
            wishlistLoading,
            wishlistError,
            retryWishlist
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> useContext(AuthContext)