import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  placed: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_ICONS = {
  placed: '📋',
  confirmed: '✅',
  preparing: '👨‍🍳',
  out_for_delivery: '🛵',
  delivered: '🎉',
  cancelled: '❌',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-5">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🛒</p>
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm mt-1">Browse our menu and place your first order!</p>
          <Link to="/" className="inline-block mt-4 btn-primary px-6 py-2">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelected(order)}
              className="bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-primary">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} •{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.orderStatus]}`}>
                    {STATUS_ICONS[order.orderStatus]} {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <p className="font-bold text-gray-800 mt-1">₹{order.totalAmount}</p>
                </div>
              </div>

              {/* Item preview */}
              <div className="mt-2 text-sm text-gray-500 truncate">
                {order.items?.map(i => i.name).join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-bold text-lg">{selected.orderNumber}</h2>
                <p className="text-xs text-gray-400">
                  {new Date(selected.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 text-2xl leading-none">
                &times;
              </button>
            </div>

            {/* Status */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${STATUS_COLORS[selected.orderStatus]}`}>
              {STATUS_ICONS[selected.orderStatus]} {selected.orderStatus.replace(/_/g, ' ')}
            </div>

            {/* Items */}
            <div className="border rounded-xl overflow-hidden mb-4">
              {selected.items?.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 text-sm ${i !== 0 ? 'border-t' : ''}`}>
                  {item.image && (
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt={item.name} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    {item.variant?.name && (
                      <p className="text-xs text-gray-400">{item.variant.name}</p>
                    )}
                    {item.addOns?.length > 0 && (
                      <p className="text-xs text-gray-400 truncate">
                        + {item.addOns.map(a => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-500">×{item.quantity}</p>
                    <p className="font-semibold">₹{item.itemTotal}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{selected.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>₹{selected.deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-1.5">
                <span>Total Paid</span>
                <span className="text-primary">₹{selected.totalAmount}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p className="font-semibold mb-1">📍 Delivery Address</p>
              <p className="text-gray-600">{selected.deliveryAddress?.fullAddress}</p>
              {selected.deliveryAddress?.landmark && (
                <p className="text-gray-500 text-xs mt-0.5">
                  Landmark: {selected.deliveryAddress.landmark}
                </p>
              )}
              {selected.deliveryAddress?.pincode && (
                <p className="text-gray-500 text-xs">
                  Pincode: {selected.deliveryAddress.pincode}
                </p>
              )}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-4 border border-gray-300 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;