import { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const AddOnModal = ({ item, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants?.[0] || null
  );
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const { addItem } = useCart();

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === addOn.name)
        ? prev.filter((a) => a.name !== addOn.name)
        : [...prev, addOn]
    );
  };

  const totalPrice = (selectedVariant?.price || item.basePrice) +
    selectedAddOns.reduce((s, a) => s + a.price, 0);

  const handleAdd = () => {
    const cartKey = `${item._id}-${selectedVariant?.name || 'default'}-${selectedAddOns.map(a => a.name).join(',')}`;
    const cartItem = {
      cartKey,
      menuItem: item._id,
      name: item.name,
      image: item.image,
      variant: selectedVariant,
      addOns: selectedAddOns,
      quantity: 1,
      unitPrice: totalPrice,
      itemTotal: totalPrice,
    };
    addItem(cartItem);
    toast.success(`${item.name} added!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p className="text-sm text-gray-500">Customize your order</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">&times;</button>
        </div>

        {/* Variants */}
        {item.variants?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Choose Size</h3>
            <div className="flex gap-2 flex-wrap">
              {item.variants.map((v) => (
                <button
                  key={v.name}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1.5 rounded-full border text-sm font-medium transition ${
                    selectedVariant?.name === v.name
                      ? 'border-primary bg-orange-50 text-primary'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {v.name} (+₹{v.price})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {item.addOns?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Add-ons (Optional)</h3>
            <div className="space-y-2">
              {item.addOns.filter(a => a.isAvailable).map((a) => (
                <label
                  key={a.name}
                  className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!selectedAddOns.find((s) => s.name === a.name)}
                      onChange={() => toggleAddOn(a)}
                      className="accent-primary"
                    />
                    <span className="text-sm">{a.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">+₹{a.price}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="font-bold text-lg">Total: ₹{totalPrice}</span>
          <button onClick={handleAdd} className="btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default AddOnModal;