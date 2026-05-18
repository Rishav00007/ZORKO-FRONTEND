// import { useState } from 'react';
// import { useCart } from '../context/CartContext';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import toast from 'react-hot-toast';

// const DELIVERY_CHARGE = 40;

// const Checkout = () => {
//   const { cart, subtotal, clearCart } = useCart();
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1); // 1=details+address, 2=payment
//   const [customer, setCustomer] = useState({ name: '', phone: '' });
//   const [address, setAddress] = useState({ fullAddress: '', landmark: '', pincode: '' });
//   const [screenshot, setScreenshot] = useState(null);
//   const [screenshotPreview, setScreenshotPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const totalAmount = subtotal + DELIVERY_CHARGE;

//   const handleScreenshotChange = (e) => {
//     const file = e.target.files[0];
//     if (file) { setScreenshot(file); setScreenshotPreview(URL.createObjectURL(file)); }
//   };

//   const handleStep1 = () => {
//     if (!customer.name.trim()) return toast.error('Please enter your name');
//     if (!customer.phone.trim() || customer.phone.length < 10) return toast.error('Please enter a valid phone number');
//     if (!address.fullAddress.trim()) return toast.error('Please enter your delivery address');
//     setStep(2);
//   };

//   const handleSubmit = async () => {
//     if (!screenshot) return toast.error('Please upload payment screenshot');
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('customerName', customer.name);
//       formData.append('customerPhone', customer.phone);
//       formData.append('deliveryAddress', JSON.stringify(address));
//       formData.append('items', JSON.stringify(cart.items));
//       formData.append('subtotal', subtotal);
//       formData.append('deliveryCharge', DELIVERY_CHARGE);
//       formData.append('totalAmount', totalAmount);
//       formData.append('paymentScreenshot', screenshot);

//       const { data } = await api.post('/orders', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       clearCart();
//       toast.success('Order placed! 🎉');
//       navigate(`/order-success/${data._id}`);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cart.items.length === 0) { navigate('/'); return null; }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//       {/* Order Summary — always visible */}
//       <div className="bg-white rounded-xl border p-4 mb-4">
//         <h2 className="font-semibold mb-3">Order Summary</h2>
//         {cart.items.map((item) => (
//           <div key={item.cartKey} className="flex justify-between text-sm py-1 border-b last:border-0">
//             <span>{item.name} {item.variant ? `(${item.variant.name})` : ''} × {item.quantity}</span>
//             <span className="font-medium">₹{item.itemTotal}</span>
//           </div>
//         ))}
//         <div className="mt-3 space-y-1 text-sm">
//           <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
//           <div className="flex justify-between text-gray-600"><span>Delivery</span><span>₹{DELIVERY_CHARGE}</span></div>
//           <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Total</span><span>₹{totalAmount}</span></div>
//         </div>
//       </div>

//       {/* Step 1 — Name, Phone, Address */}
//       {step === 1 && (
//         <div className="bg-white rounded-xl border p-4 mb-4 space-y-4">
//           <h2 className="font-semibold">👤 Your Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div>
//               <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
//               <input
//                 type="text"
//                 placeholder="Your name"
//                 value={customer.name}
//                 onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
//                 className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-500 mb-1 block">Phone Number *</label>
//               <input
//                 type="tel"
//                 placeholder="10-digit mobile number"
//                 value={customer.phone}
//                 maxLength={10}
//                 onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
//                 className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
//               />
//             </div>
//           </div>

//           <h2 className="font-semibold pt-1">📍 Delivery Address</h2>
//           <textarea
//             placeholder="House/Flat No, Street, Area, City"
//             value={address.fullAddress}
//             onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
//             className="w-full border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:border-primary"
//           />
//           <input
//             type="text"
//             placeholder="Landmark (optional)"
//             value={address.landmark}
//             onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
//             className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
//           />
//           <input
//             type="text"
//             placeholder="Pincode"
//             value={address.pincode}
//             maxLength={6}
//             onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
//             className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
//           />

//           <button onClick={handleStep1} className="w-full btn-primary py-3">
//             Continue to Payment →
//           </button>
//         </div>
//       )}

//       {/* Step 2 — Payment */}
//       {step === 2 && (
//         <div className="bg-white rounded-xl border p-4 mb-4">
//           <h2 className="font-semibold mb-1">💳 Payment</h2>
//           <p className="text-sm text-gray-500 mb-4">Scan the QR and pay <span className="font-bold text-gray-800">₹{totalAmount}</span></p>

//           <div className="flex justify-center mb-4">
//             <div className="border-4 border-primary rounded-xl p-2">
//               <img src="/payment-qr.png" alt="UPI QR" className="w-52 h-52 object-contain" />
//             </div>
//           </div>

//           <p className="text-center text-sm text-gray-500 mb-4">
//             After paying, upload your payment screenshot below
//           </p>

//           <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-primary transition">
//             {screenshotPreview ? (
//               <img src={screenshotPreview} className="max-h-44 object-contain rounded" alt="preview" />
//             ) : (
//               <>
//                 <span className="text-4xl mb-2">📸</span>
//                 <span className="text-sm text-gray-500">Tap to upload payment screenshot</span>
//                 <span className="text-xs text-gray-400 mt-1">JPG or PNG</span>
//               </>
//             )}
//             <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
//           </label>

//           <div className="flex gap-2 mt-4">
//             <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 rounded-lg py-3 text-sm font-medium hover:bg-gray-50">
//               ← Back
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={loading || !screenshot}
//               className="flex-1 btn-primary py-3 disabled:opacity-60"
//             >
//               {loading ? 'Placing Order...' : 'Place Order 🎉'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Checkout;





import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const DELIVERY_CHARGE = 0;

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [address, setAddress] = useState({ fullAddress: '', landmark: ''});
  const [paymentMethod, setPaymentMethod] = useState('online'); // ✅ NEW
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalAmount = subtotal + DELIVERY_CHARGE;

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) { setScreenshot(file); setScreenshotPreview(URL.createObjectURL(file)); }
  };

  const handleStep1 = () => {
    if (!customer.name.trim()) return toast.error('Please enter your name');
    if (!customer.phone.trim() || customer.phone.length < 10) return toast.error('Please enter a valid phone number');
    if (!address.fullAddress.trim()) return toast.error('Please enter your delivery address');
    setStep(2);
  };

  const handleSubmit = async () => {
    // ✅ Only require screenshot for online payment
    if (paymentMethod === 'online' && !screenshot) {
      return toast.error('Please upload payment screenshot');
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('customerName', customer.name);
      formData.append('customerPhone', customer.phone);
      formData.append('deliveryAddress', JSON.stringify(address));
      formData.append('items', JSON.stringify(cart.items));
      formData.append('subtotal', subtotal);
      formData.append('deliveryCharge', DELIVERY_CHARGE);
      formData.append('totalAmount', totalAmount);
      formData.append('paymentMethod', paymentMethod); // ✅ NEW
      if (paymentMethod === 'online' && screenshot) {
        formData.append('paymentScreenshot', screenshot);
      }

      const { data } = await api.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearCart();
      toast.success('Order placed! 🎉');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) { navigate('/'); return null; }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-xl border p-4 mb-4">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.cartKey} className="flex justify-between text-sm py-1 border-b last:border-0">
            <span>{item.name} {item.variant ? `(${item.variant.name})` : ''} × {item.quantity}</span>
            <span className="font-medium">₹{item.itemTotal}</span>
          </div>
        ))}
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between text-gray-600"><span>Delivery</span><span>₹{DELIVERY_CHARGE}</span></div>
          <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Total</span><span>₹{totalAmount}</span></div>
        </div>
      </div>

      {/* Step 1 — Details + Address */}
      {step === 1 && (
        <div className="bg-white rounded-xl border p-4 mb-4 space-y-4">
          <h2 className="font-semibold">👤 Your Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
              <input
                type="text"
                placeholder="Your name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phone Number *</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={customer.phone}
                maxLength={10}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <h2 className="font-semibold pt-1">📍 Delivery Address</h2>
          <textarea
            placeholder="House/Flat No, Street, Area, City"
            value={address.fullAddress}
            onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
            className="w-full border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Landmark (optional)"
            value={address.landmark}
            onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
          />
          {/* <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            maxLength={6}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
          /> */}
          <button onClick={handleStep1} className="w-full btn-primary py-3">
            Continue to Payment →
          </button>
        </div>
      )}

      {/* Step 2 — Payment */}
      {step === 2 && (
        <div className="bg-white rounded-xl border p-4 mb-4">
          <h2 className="font-semibold mb-4">💳 Choose Payment Method</h2>

          {/* ✅ Payment Method Toggle */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => setPaymentMethod('online')}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition ${
                paymentMethod === 'online'
                  ? 'border-primary bg-purple-50 text-primary'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">📱</span>
              <span className="font-semibold text-sm">Pay Online</span>
              <span className="text-xs text-center opacity-70">UPI / QR Code</span>
            </button>
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition ${
                paymentMethod === 'cod'
                  ? 'border-primary bg-purple-50 text-primary'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">💵</span>
              <span className="font-semibold text-sm">Cash on Delivery</span>
              <span className="text-xs text-center opacity-70">Pay when delivered</span>
            </button>
          </div>

          {/* Online Payment Section */}
          {paymentMethod === 'online' && (
            <div>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Scan the QR and pay <span className="font-bold text-gray-800">₹{totalAmount}</span>
              </p>
              <div className="flex justify-center mb-4">
                <div className="border-4 border-primary rounded-xl p-2">
                  <img src="/payment-qr.png" alt="UPI QR" className="w-52 h-52 object-contain" />
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                After paying, upload your payment screenshot below
              </p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-primary transition">
                {screenshotPreview ? (
                  <img src={screenshotPreview} className="max-h-44 object-contain rounded" alt="preview" />
                ) : (
                  <>
                    <span className="text-4xl mb-2">📸</span>
                    <span className="text-sm text-gray-500">Tap to upload payment screenshot</span>
                    <span className="text-xs text-gray-400 mt-1">JPG or PNG</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
              </label>
            </div>
          )}

          {/* COD Section */}
          {paymentMethod === 'cod' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-3xl mb-2">🏠</p>
              <p className="font-semibold text-green-800">Cash on Delivery Selected</p>
              <p className="text-sm text-green-700 mt-1">
                You'll pay <span className="font-bold">₹{totalAmount}</span> when your order arrives at your door.
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 rounded-lg py-3 text-sm font-medium hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || (paymentMethod === 'online' && !screenshot)}
              className="flex-1 btn-primary py-3 disabled:opacity-60"
            >
              {loading ? 'Placing Order...' : paymentMethod === 'cod' ? 'Place Order 🏠' : 'Place Order 🎉'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;