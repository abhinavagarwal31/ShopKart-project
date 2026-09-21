import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function PublicRoute({children}) {
    const {customer, loader} = useAuth()
    if(loader){
        return <p>JUST A MIN GETTING SOMEONE TO ASSIST YOU...</p>
    }
    if(customer){
        return <Navigate to={'/home'}/>
    }
    return children
}

export default PublicRoute