import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-gray-800">Order Placed!</h1>
      <p className="text-gray-500 mt-2">Thank you! We've received your order and will start preparing it soon.</p>
      
      {order && (
        <div className="bg-white rounded-xl border p-4 mt-6 text-left">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="font-bold text-primary text-lg">{order.orderNumber}</p>
          <p className="text-sm text-gray-500 mt-2">Total Paid</p>
          <p className="font-bold">₹{order.totalAmount}</p>
          <p className="text-sm text-gray-500 mt-2">Status</p>
          <p className="font-medium capitalize">{order.orderStatus}</p>
        </div>
      )}

      <div className="mt-6 space-y-2">
        <Link to="/" className="block btn-primary py-3">Back to Menu</Link>
        <Link to="/my-orders" className="block text-sm text-gray-500 underline">View My Orders</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;