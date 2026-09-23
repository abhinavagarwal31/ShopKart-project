import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import { AuthProvider } from "./context/AuthContext"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import Products from "./pages/Products"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element = {<PublicRoute><Register/></PublicRoute>}/>
          <Route path="/login" element = {<PublicRoute><Login/></PublicRoute>}/>

          <Route path="/home" element = {<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path="/products" element = {<Products/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
