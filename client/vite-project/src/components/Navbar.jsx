import { axiosInstance } from "../axiosCalls/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar(){

  const navigate = useNavigate()

    const{setCustomer} = useAuth()

    const handleLogout = async ()=>{
        await axiosInstance.post('/customers/logout')
        setCustomer(null)
    }
    
  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center"
          onClick={()=>{navigate('/home')}}>
            <span className="text-2xl font-bold text-indigo-600 tracking-tight cursor-pointer">
              Shop<span className="text-orange-500">Kart</span>
            </span>
          </div>

          {/* Navigation Links & Action */}
          <div className="flex items-center space-x-6">
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition duration-150 ease-in-out shadow-sm focus:outline-none"
              onClick={()=>navigate('/products')}
              >
              Explore Products
            </button>
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition duration-150 ease-in-out shadow-sm focus:outline-none"
              onClick={handleLogout}
              >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;