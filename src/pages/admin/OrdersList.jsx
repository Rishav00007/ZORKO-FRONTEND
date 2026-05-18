import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  placed: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    const { data } = await api.get('/admin/orders');
    setOrders(data.orders);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, orderStatus) => {
    await api.put(`/admin/orders/${orderId}/status`, { orderStatus });
    toast.success('Status updated');
    fetchOrders();
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(prev => ({ ...prev, orderStatus }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="space-y-3">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-4 cursor-pointer hover:shadow-sm transition"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-primary">{order.orderNumber}</p>
                <p className="text-sm text-gray-600">{order.customerName} • {order.customerPhone}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.orderStatus]}`}>
                  {order.orderStatus.replace(/_/g,' ')}
                </span>
                <p className="font-bold mt-1">₹{order.totalAmount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold text-lg">{selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 text-xl">&times;</button>
            </div>

            <p className="text-sm font-medium">👤 {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
            <p className="text-sm text-gray-600 mt-1">📍 {selectedOrder.deliveryAddress?.fullAddress}</p>
            {selectedOrder.deliveryAddress?.landmark && <p className="text-xs text-gray-500">Landmark: {selectedOrder.deliveryAddress.landmark}</p>}

            <div className="mt-3 border-t pt-3">
              <p className="font-semibold text-sm mb-2">Items:</p>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="text-sm flex justify-between py-0.5">
                  <span>{item.name} {item.variant ? `(${item.variant.name})` : ''} × {item.quantity}</span>
                  <span>₹{item.itemTotal}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total</span><span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {selectedOrder.paymentScreenshot && (
              <div className="mt-3">
                <p className="text-sm font-semibold mb-1">Payment Screenshot:</p>
                <a href={selectedOrder.paymentScreenshot} target="_blank" rel="noreferrer">
                  <img src={selectedOrder.paymentScreenshot} className="w-full rounded-lg border" alt="Payment" />
                </a>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Update Status:</p>
              <div className="grid grid-cols-2 gap-2">
                {['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedOrder._id, s)}
                    className={`text-xs py-1.5 px-2 rounded-lg border font-medium ${selectedOrder.orderStatus === s ? 'border-primary bg-orange-50 text-primary' : 'border-gray-200'}`}
                  >
                    {s.replace(/_/g,' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;