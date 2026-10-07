import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../axiosCalls/axios';

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        const message =
          err.response?.status === 404
            ? 'We couldn\'t find the product you\'re looking for.'
            : 'Something went wrong while fetching the product details. Please try again later.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading product details...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center my-auto">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Load Product</h3>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Product Details Content */}
        {!loading && !error && product && (
          <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Large Product Image */}
            <div className="flex justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-md lg:max-w-lg h-auto rounded-xl shadow-sm object-cover border border-gray-200"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-4">
              <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
                {product.category}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="text-3xl font-black text-gray-900">
                ${product.price.toFixed(2)}
              </div>

              <div>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-2">
                {product.description}
              </p>

              <div className="pt-4">
                <button
                  disabled={product.stock === 0}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-md transition-all duration-200 ${
                    product.stock > 0
                      ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetails;