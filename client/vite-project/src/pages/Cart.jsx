import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function CartPage() {
  // Initial cart state based on the task description
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Mechanical Keyboard',
      price: 2999,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=300',
    },
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = id => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 shadow-sm items-center"
                >
                  {/* Product Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-lg border border-gray-100 bg-gray-50 flex-shrink-0" 
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">₹{item.price.toLocaleString('en-IN')}</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="inline-flex items-center border border-gray-300 rounded-md bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l-md transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r-md transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="mt-3 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Order Summary
              </h2>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="font-medium text-gray-900">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4 pt-4 flex justify-between font-bold text-base text-gray-900">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition shadow-sm">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}