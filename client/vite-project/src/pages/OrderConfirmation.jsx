import { CheckCircle, Package, ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Unavailable'

export default function OrderConfirmation() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const order = state?.order

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order details unavailable</h1>
          <p className="mt-3 text-gray-600">
            This confirmation page can only be opened after a successful payment.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg"
          >
            Continue Shopping
          </button>
        </main>
      </div>
    )
  }

  const orderId = order._id || order.id
  const shippingAddress = order.shippingAddress

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Order Placed Successfully
            </h1>
            <p className="mt-2 text-gray-500">
              Your payment was verified and your order is being processed.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 text-sm bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="mt-1 font-mono font-semibold text-gray-900 break-all">{orderId}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment ID</p>
              <p className="mt-1 font-mono font-semibold text-gray-900 break-all">
                {order.razorpayPaymentId || 'Unavailable'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Placed on</p>
              <p className="mt-1 font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                {order.status || 'PLACED'}
              </span>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-bold text-gray-900">Items</h2>
            <div className="mt-3 divide-y divide-gray-100 border-y border-gray-100">
              {order.items?.map((item) => (
                <div key={`${item.product}-${item.name}`} className="flex items-center gap-3 py-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-lg object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatAmount(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatAmount(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatAmount(order.totalAmount)}</span>
            </div>
          </section>

          {shippingAddress && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
              <address className="mt-3 not-italic text-sm leading-6 text-gray-600">
                <strong className="text-gray-900">{shippingAddress.fullName}</strong>
                <br />
                {shippingAddress.addressLine1}, {shippingAddress.city}
                <br />
                {shippingAddress.state} - {shippingAddress.pincode}
                <br />
                Phone: {shippingAddress.phone}
              </address>
            </section>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium py-3 px-4 rounded-xl"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
