import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, ChevronDown, ChevronUp, Loader2, Package, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { axiosInstance } from '../axiosCalls/axios'

const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Date unavailable'

const getStatusClasses = (status) => {
  if (status === 'PLACED' || status === 'CONFIRMED') {
    return 'bg-emerald-100 text-emerald-800'
  }
  if (status === 'SHIPPED' || status === 'DELIVERED') {
    return 'bg-blue-100 text-blue-800'
  }
  return 'bg-amber-100 text-amber-800'
}

export default function MyOrdersPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get('/orders')
      setOrders(response.data.orders || [])
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to load your orders.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch orders when the authenticated page mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders()
  }, [fetchOrders])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-3 text-sm font-medium text-gray-500">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
            <h1 className="mt-5 text-xl font-bold text-gray-900">Unable to load orders</h1>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={fetchOrders}
              className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your order history and payment status.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">No orders found</h2>
            <p className="mt-2 text-sm text-gray-500">You have not placed any orders yet.</p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
            >
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const orderId = order._id || order.id
            const isExpanded = expandedOrderId === orderId

            return (
              <article
                key={orderId}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">Order #{orderId}</h2>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}
                  >
                    {order.status || 'PENDING'}
                  </span>
                </div>

                <div className="mt-5 divide-y divide-gray-100 border-y border-gray-100">
                  {(order.items || []).map((item, index) => (
                    <div key={`${item.product || item.name}-${index}`} className="flex justify-between py-3 text-sm">
                      <span className="text-gray-700">
                        {item.name} <span className="text-gray-500">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatAmount(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-medium text-gray-500">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatAmount(order.totalAmount)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedOrderId(isExpanded ? null : orderId)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? 'Hide Details' : 'View Details'}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-900">Items:</span>{' '}
                      {(order.items || []).reduce((count, item) => count + item.quantity, 0)}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium text-gray-900">Payment status:</span>{' '}
                      {order.paymentStatus || 'Available after payment verification'}
                    </p>
                  </div>
                )}
              </article>
            )
          })
        )}
      </main>
    </div>
  )
}
