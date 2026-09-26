import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Guard clause: Render error state if no product data is provided
  if (!product) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-sm w-full text-center flex flex-col items-center justify-center">
        <svg
          className="w-10 h-10 text-red-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-sm font-semibold text-gray-800">Product Unavailable</p>
        <p className="text-xs text-gray-500 mt-1">Failed to load product details.</p>
      </div>
    );
  }

  const { _id, name, image, category, price, stock } = product;

  const handleViewDetails = () => {
    if (_id) {
      navigate(`/products/${_id}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col justify-between max-w-sm w-full">
      {/* Product Image with Fallback */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden relative flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name || 'Product'}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Hide broken image link and show fallback
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Fallback Placeholder (shown if image missing or broken) */}
        <div className={`flex flex-col items-center justify-center text-gray-400 ${image ? 'hidden' : ''}`}>
          <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">No image available</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {category || 'General'}
          </span>

          {/* Product Name */}
          <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-1" title={name}>
            {name || 'Unnamed Product'}
          </h3>

          {/* Price */}
          <div className="mt-2 text-xl font-extrabold text-gray-900">
            {typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : 'N/A'}
          </div>

          {/* Stock Status */}
          <div className="mt-2 text-sm font-medium">
            {stock > 0 ? (
              <span className="text-emerald-600">
                {stock} {stock === 1 ? 'unit' : 'units'} left
              </span>
            ) : (
              <span className="text-rose-600">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleViewDetails}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-2.5 px-4 rounded-xl transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;