import React, { useState } from 'react';

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    switch (name) {
      case 'fullName':
        if (!trimmedValue) return 'Full name is required.';
        if (trimmedValue.length < 2) return 'Full name must be at least 2 characters.';
        return '';

      case 'phone':
        if (!trimmedValue) return 'Phone number is required.';
        if (!/^\d{10}$/.test(trimmedValue)) return 'Phone number must be a valid 10-digit number.';
        return '';

      case 'address':
        if (!trimmedValue) return 'Address is required.';
        if (trimmedValue.length < 10) return 'Address must be at least 10 characters long.';
        return '';

      case 'city':
        if (!trimmedValue) return 'City is required.';
        if (trimmedValue.length < 2) return 'City name is too short.';
        return '';

      case 'state':
        if (!trimmedValue) return 'State is required.';
        if (trimmedValue.length < 2) return 'State name is too short.';
        return '';

      case 'pincode':
        if (!trimmedValue) return 'Pincode is required.';
        if (!/^\d{6}$/.test(trimmedValue)) return 'Pincode must be a valid 6-digit number.';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = ['phone', 'pincode'].includes(name) ? value.replace(/\D/g, '') : value;

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, sanitizedValue) }));
  };

  const validateForm = (data) => {
    const newErrors = {};
    Object.entries(data).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) newErrors[name] = error;
    });
    return newErrors;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    alert('Order placed successfully!');
  };

  return (
    <div className="max-w-xl mx-auto p-6 font-mono border border-gray-300 rounded-lg shadow-sm bg-white my-8">
      <h1 className="text-xl font-bold pb-4 border-b border-gray-300">Checkout</h1>

      <form onSubmit={handlePlaceOrder} noValidate>
        {/* Shipping Details */}
        <div className="py-4 border-b border-gray-300">
          <h2 className="font-semibold mb-4">Shipping Details</h2>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <label className="text-sm pt-2">Full Name</label>
              <div className="w-64">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`border px-2 py-1 w-full rounded ${errors.fullName ? 'border-red-500' : 'border-gray-400'}`}
                  aria-invalid={Boolean(errors.fullName)}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <label className="text-sm pt-2">Phone</label>
              <div className="w-64">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`border px-2 py-1 w-full rounded ${errors.phone ? 'border-red-500' : 'border-gray-400'}`}
                  aria-invalid={Boolean(errors.phone)}
                  inputMode="numeric"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <label className="text-sm pt-2">Address</label>
              <div className="w-64">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`border px-2 py-1 w-full rounded ${errors.address ? 'border-red-500' : 'border-gray-400'}`}
                  aria-invalid={Boolean(errors.address)}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <label className="text-sm pt-2">City</label>
              <div className="w-64">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`border px-2 py-1 w-full rounded ${errors.city ? 'border-red-500' : 'border-gray-400'}`}
                  aria-invalid={Boolean(errors.city)}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <label className="text-sm pt-2">State</label>
              <div className="w-64">
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`border px-2 py-1 w-full rounded ${errors.state ? 'border-red-500' : 'border-gray-400'}`}
                  aria-invalid={Boolean(errors.state)}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <label className="text-sm pt-2">Pincode</label>
              <div className="w-64">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`border px-2 py-1 w-full rounded ${errors.pincode ? 'border-red-500' : 'border-gray-400'}`}
                  aria-invalid={Boolean(errors.pincode)}
                  inputMode="numeric"
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="py-4 space-y-3">
          <h2 className="font-semibold">Order Summary</h2>

          <div className="flex justify-between text-sm">
            <span>Keyboard × 2</span>
            <span>₹5,998</span>
          </div>

          <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
            <span>Mouse × 1</span>
            <span>₹1,499</span>
          </div>

          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>₹7,497</span>
          </div>

          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition"
            >
              [ Place Order ]
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}