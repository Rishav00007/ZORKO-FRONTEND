import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiX } from 'react-icons/fi';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeItem, updateQty, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-all ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Your Cart 🛒</h2>
          <button onClick={onClose}><FiX size={22} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🛒</p>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.cartKey} className="flex gap-3 p-2 border rounded-lg">
                <img src={item.image || '/placeholder-food.jpg'} className="w-14 h-14 rounded-lg object-cover" alt={item.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                  {item.addOns?.length > 0 && (
                    <p className="text-xs text-gray-400 truncate">+{item.addOns.map(a => a.name).join(', ')}</p>
                  )}
                  <p className="text-primary font-bold text-sm">₹{item.itemTotal}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.cartKey, item.quantity - 1)}
                      className="px-2 py-0.5 hover:bg-gray-100 text-sm"
                    >−</button>
                    <span className="px-2 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.cartKey, item.quantity + 1)}
                      className="px-2 py-0.5 hover:bg-gray-100 text-sm"
                    >+</button>
                  </div>
                  <button onClick={() => removeItem(item.cartKey)} className="text-red-400 hover:text-red-600">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {/* ✅ Dynamic delivery charge */}
            {subtotal < 200 ? (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery Charge</span>
                <span>₹50</span>
              </div>
            ) : (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Delivery Charge</span>
                <span>🎉 FREE</span>
              </div>
            )}

            {/* ✅ Free delivery nudge */}
            {subtotal < 200 && (
              <p className="text-xs text-center text-purple-600 bg-purple-50 rounded-lg py-1.5 px-2">
                Add ₹{200 - subtotal} more for FREE delivery!
              </p>
            )}

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{subtotal + (subtotal < 200 ? 50 : 0)}</span>
            </div>
            <button onClick={handleCheckout} className="w-full btn-primary py-3 text-base">
              Proceed to Checkout →
            </button>
            <button onClick={clearCart} className="w-full text-sm text-gray-400 hover:text-red-500">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;