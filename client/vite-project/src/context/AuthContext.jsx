import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";


const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [customer, setCustomerState] = useState(null)
    const [wishlist, setWishlist] = useState([])
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
        if (!customer) {
            return
        }

        const getWishlist = async () => {
            try {
                const response = await axiosInstance.get('/wishlist')
                setWishlist(response.data.wishlist || [])
            } catch {
                setWishlist([])
            }
        }

        getWishlist()
    }, [customer])

    return(
        <AuthContext.Provider value={{ customer, setCustomer, loader, wishlist, setWishlist }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> useContext(AuthContext)