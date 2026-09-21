import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../axiosCalls/axios";


const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [customer, setCustomer] = useState(null)
    
    useEffect(()=>{
        const getCustomer = async () => {
            try {
                const response = await axiosInstance.get('/customers/me')
                setCustomer(response.data)
            } catch (error) {
                setCustomer(null)
            }
        }
        getCustomer()
    },[])

    return(
        <AuthContext.Provider value={{customer, setCustomer}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> useContext(AuthContext)