import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../axiosCalls/axios';

function Home() {
  const navigate = useNavigate();
  const { customer, wishlist } = useAuth();
  const [orderCount, setOrderCount] = useState(null);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const response = await axiosInstance.get('/orders');
        setOrderCount(response.data.count ?? response.data.orders?.length ?? 0);
      } catch {
        // The full orders page provides the detailed error and retry state.
        setOrderCount(null);
      }
    };

    // The dashboard only needs the count; the orders page owns the full list.
    fetchOrderCount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar at top */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-lg p-6 sm:p-10 mb-8 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {customer.fullName}!
          </h1>
          <p className="mt-2 text-indigo-100 text-base sm:text-lg">
            Manage your profile, view recent orders, and track active deliveries from your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                {customer.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{customer.fullName}</h2>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Verified Customer
                </span>
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <p className="text-gray-800 font-medium mt-1">{customer.fullName}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <p className="text-gray-800 font-medium mt-1">{customer.email}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Phone Number
                </label>
                <p className="text-gray-800 font-medium mt-1">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats / Dashboard Highlights */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <span className="text-sm font-semibold text-gray-500">Recent Orders</span>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">
                  {orderCount ?? '—'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="text-left text-sm font-medium text-indigo-600 hover:text-indigo-500 mt-4 block"
              >
                View order history &rarr;
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <span className="text-sm font-semibold text-gray-500">Wishlist Items</span>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{wishlist.length}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/wishlist')}
                className="text-left text-sm font-medium text-indigo-600 hover:text-indigo-500 mt-4 block"
              >
                View saved items &rarr;
              </button>
            </div>

            <div className="sm:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Account Overview</h3>
              <p className="text-sm text-gray-600">
                You can easily connect your dynamic authentication context and API data here later.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;