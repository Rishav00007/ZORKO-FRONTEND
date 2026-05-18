import { Link } from 'react-router-dom';

const AdminDashboard = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link to="/admin/menu" className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
        <p className="text-3xl mb-2">🍽️</p>
        <h2 className="font-bold text-lg">Manage Menu</h2>
        <p className="text-sm text-gray-500">Add, edit, remove menu items</p>
      </Link>
      <Link to="/admin/orders" className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
        <p className="text-3xl mb-2">📋</p>
        <h2 className="font-bold text-lg">View Orders</h2>
        <p className="text-sm text-gray-500">All incoming orders list</p>
      </Link>
    </div>
  </div>
);

export default AdminDashboard;