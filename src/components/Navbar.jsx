import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import CartSidebar from './CartSidebar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">🍴 ZORKO (BARHI)</Link>
        

        <div className="flex items-center gap-4">
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-primary">
                Admin Panel
              </Link>
              <button onClick={() => { logout(); }} className="p-2 text-gray-500 hover:text-red-500">
                <FiLogOut size={20} />
              </button>
            </>
          )}

          <button onClick={() => setCartOpen(true)} className="relative p-2 bg-primary text-white rounded-full">
            <FiShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;