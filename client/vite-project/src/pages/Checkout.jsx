import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { axiosInstance } from '../axiosCalls/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const razorpayScriptUrl = 'https://checkout.razorpay.com/v1/checkout.js'

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = razorpayScriptUrl
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'))
    document.body.appendChild(script)
  })

export default function Checkout() {
  const navigate = useNavigate()
  const { customer } = useAuth()
  const { cart, fetchCart } = useCart()
  const [formData, setFormData] = useState({
    fullName: customer?.fullName || '',
    phone: customer?.phone || '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const validateField = (name, value) => {
    const trimmedValue = value.trim()

    switch (name) {
      case 'fullName':
        if (!trimmedValue) return 'Full name is required.'
        if (trimmedValue.length < 2) return 'Full name must be at least 2 characters.'
        return ''
      case 'phone':
        if (!trimmedValue) return 'Phone number is required.'
        if (!/^\d{10}$/.test(trimmedValue)) return 'Phone number must be a valid 10-digit number.'
        return ''
      case 'addressLine1':
        if (!trimmedValue) return 'Address is required.'
        if (trimmedValue.length < 10) return 'Address must be at least 10 characters long.'
        return ''
      case 'city':
        if (!trimmedValue) return 'City is required.'
        if (trimmedValue.length < 2) return 'City name is too short.'
        return ''
      case 'state':
        if (!trimmedValue) return 'State is required.'
        if (trimmedValue.length < 2) return 'State name is too short.'
        return ''
      case 'pincode':
        if (!trimmedValue) return 'Pincode is required.'
        if (!/^\d{6}$/.test(trimmedValue)) return 'Pincode must be a valid 6-digit number.'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    const sanitizedValue = ['phone', 'pincode'].includes(name)
      ? value.replace(/\D/g, '')
      : value

    setFormData((current) => ({ ...current, [name]: sanitizedValue }))
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, sanitizedValue),
    }))
    setRequestError('')
  }

  const validateForm = () => {
    const nextErrors = {}
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value)
      if (error) nextErrors[name] = error
    })
    return nextErrors
  }

  const handlePaymentSuccess = async (payment, shopKartOrderId) => {
    try {
      const response = await axiosInstance.post('/orders/verify-payment', {
        shopKartOrderId,
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
      })
      await fetchCart()
      navigate('/order-confirmation', {
        state: { order: response.data.order },
        replace: true,
      })
    } catch (error) {
      setRequestError(
        error.response?.data?.message || 'Payment verification failed. Please contact support.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm()
    setErrors(nextErrors)
    setRequestError('')

    if (Object.keys(nextErrors).length > 0 || cart.length === 0) {
      if (cart.length === 0) setRequestError('Your cart is empty.')
      return
    }

    setIsProcessing(true)

    try {
      await loadRazorpayScript()
      const response = await axiosInstance.post('/orders/create-payment-order', {
        shippingAddress: formData,
      })
      const order = response.data

      if (!order.key || !order.razorpayOrderId || !order.shopKartOrderId) {
        throw new Error('The server returned an incomplete payment order.')
      }

      const razorpay = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'ShopKart',
        description: 'ShopKart order payment',
        order_id: order.razorpayOrderId,
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
          email: customer?.email || '',
        },
        theme: {
          color: '#4f46e5',
        },
        handler: (payment) => handlePaymentSuccess(payment, order.shopKartOrderId),
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      })

      razorpay.on('payment.failed', (paymentError) => {
        setRequestError(
          paymentError.error?.description || 'Payment failed. Please try again.'
        )
        setIsProcessing(false)
      })
      razorpay.open()
    } catch (error) {
      setRequestError(
        error.response?.data?.message || error.message || 'Unable to start payment.'
      )
      setIsProcessing(false)
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="max-w-xl mx-auto p-6 font-mono border border-gray-300 rounded-lg shadow-sm bg-white my-8">
        <h1 className="text-xl font-bold pb-4 border-b border-gray-300">Checkout</h1>

        {requestError && (
          <p className="mt-4 p-3 rounded bg-red-50 text-red-600 text-sm" role="alert">
            {requestError}
          </p>
        )}

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="py-4 border-b border-gray-300">
            <h2 className="font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-3">
              {[
                ['fullName', 'Full Name', 'text'],
                ['phone', 'Phone', 'tel'],
                ['addressLine1', 'Address', 'text'],
                ['city', 'City', 'text'],
                ['state', 'State', 'text'],
                ['pincode', 'Pincode', 'text'],
              ].map(([name, label, type]) => (
                <div className="flex items-start justify-between gap-4" key={name}>
                  <label className="text-sm pt-2" htmlFor={name}>{label}</label>
                  <div className="w-64">
                    <input
                      id={name}
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className={`border px-2 py-1 w-full rounded ${
                        errors[name] ? 'border-red-500' : 'border-gray-400'
                      }`}
                      aria-invalid={Boolean(errors[name])}
                      inputMode={['phone', 'pincode'].includes(name) ? 'numeric' : undefined}
                    />
                    {errors[name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-4 space-y-3">
            <h2 className="font-semibold">Order Summary</h2>
            {cart.map((item) => (
              <div className="flex justify-between text-sm" key={item.product._id}>
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-3">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay securely with Razorpay'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
