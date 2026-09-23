import React from 'react';

const ProductCard = ({ product }) => {


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col justify-between max-w-sm w-full">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 text-xl font-extrabold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          {/* Stock Status */}
          <div className="mt-2 text-sm font-medium">
            {product.stock > 0 ? (
              <span className="text-emerald-600">
                {product.stock} {product.stock === 1 ? 'unit' : 'units'} left
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition duration-150 ease-in-out shadow-sm focus:outline-none"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;