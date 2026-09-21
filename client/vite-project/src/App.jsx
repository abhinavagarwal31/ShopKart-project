import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import { AuthProvider } from "./context/AuthContext"
import Home from "./pages/Home"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element = {<Register/>}/>
          <Route path="/login" element = {<Login/>}/>
          <Route path="/home" element = {<Home/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
