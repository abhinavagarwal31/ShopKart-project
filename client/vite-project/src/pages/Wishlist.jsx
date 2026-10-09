import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

function Wishlist() {
  const navigate = useNavigate();
  const {
    wishlist: wishlistItems,
    wishlistLoading: loading,
    wishlistError: error,
    retryWishlist
  } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Wishlist</h1>
          {!loading && !error && (
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'product' : 'products'} saved
            </p>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading your wishlist...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md mx-auto text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Something went wrong.</h2>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button
              type="button"
              onClick={retryWishlist}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && wishlistItems.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">❤️</div>
            <h2 className="text-xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-600">Start saving products you love.</p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Browse Products
            </button>
          </div>
        )}

        {!loading && !error && wishlistItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {wishlistItems.map((product) => (
                <div key={product._id} className="w-full max-w-sm">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Wishlist;
