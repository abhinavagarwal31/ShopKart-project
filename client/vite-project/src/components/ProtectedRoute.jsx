import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {
    const {customer, loader} = useAuth()
    if(loader){
        return <p>HACKING YOU IN...</p>
    }
    if(!customer){
        return <Navigate to={'/login'}/>
    }
    return children
}

export default ProtectedRoute