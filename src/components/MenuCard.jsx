import { useState } from 'react';
import { useCart } from '../context/CartContext';
import AddOnModal from './AddOnModal';
import toast from 'react-hot-toast';

const MenuCard = ({ item, categoryImage }) => {
  const [showModal, setShowModal] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = () => {
    if (item.variants?.length > 0 || item.addOns?.length > 0) {
      setShowModal(true);
    } else {
      const cartItem = {
        cartKey: item._id,
        menuItem: item._id,
        name: item.name,
        image: item.image,
        variant: null,
        addOns: [],
        quantity: 1,
        unitPrice: item.basePrice,
        itemTotal: item.basePrice,
      };
      addItem(cartItem);
      toast.success(`${item.name} added to cart!`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden">
        <div className="relative">
          <img
            src={item.image || categoryImage || '/placeholder-food.jpg'}
            alt={item.name}
            className="w-full h-44 object-cover"
          />
          {item.isFeatured && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded">
              ⭐ Featured
            </span>
          )}
          <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-bold ${item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          {item.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
          )}
          <div className="flex gap-1 mt-1 flex-wrap">
            {item.tags?.map((tag) => (
              <span key={tag} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-lg text-gray-900">₹{item.basePrice}</span>
            <button
              onClick={handleQuickAdd}
              disabled={!item.isAvailable}
              className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {item.isAvailable ? '+ Add' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddOnModal item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default MenuCard;