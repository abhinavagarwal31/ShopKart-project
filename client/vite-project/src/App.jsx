import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Wishlist from "./pages/Wishlist"
import Cart from "./pages/Cart"

function App() {

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element = {<PublicRoute><Register/></PublicRoute>}/>
            <Route path="/login" element = {<PublicRoute><Login/></PublicRoute>}/>

            <Route path="/home" element = {<ProtectedRoute><Home/></ProtectedRoute>}/>
            <Route path="/products" element = {<ProtectedRoute><Products/></ProtectedRoute>}/>
            <Route path="/products/:id" element = {<ProductDetails/>}/>
            <Route path="/wishlist" element = {<ProtectedRoute><Wishlist/></ProtectedRoute>}/>
            <Route path="/cart" element = {<ProtectedRoute><Cart/></ProtectedRoute>}/>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
