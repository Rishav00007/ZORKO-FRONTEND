// import { createContext, useContext, useReducer } from 'react';

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_ITEM': {
//       // Check if exact same item+variant+addons exists
//       const existing = state.items.findIndex(
//         (i) => i.cartKey === action.payload.cartKey
//       );
//       if (existing >= 0) {
//         const updated = [...state.items];
//         updated[existing].quantity += 1;
//         updated[existing].itemTotal = 
//           updated[existing].quantity * updated[existing].unitPrice;
//         return { ...state, items: updated };
//       }
//       return { ...state, items: [...state.items, action.payload] };
//     }
//     case 'REMOVE_ITEM':
//       return { ...state, items: state.items.filter((i) => i.cartKey !== action.payload) };
//     case 'UPDATE_QTY': {
//       const updated = state.items.map((i) =>
//         i.cartKey === action.payload.cartKey
//           ? { ...i, quantity: action.payload.qty, itemTotal: action.payload.qty * i.unitPrice }
//           : i
//       );
//       return { ...state, items: updated.filter((i) => i.quantity > 0) };
//     }
//     case 'CLEAR_CART':
//       return { items: [] };
//     default:
//       return state;
//   }
// };

// export const CartProvider = ({ children }) => {
//   const [cart, dispatch] = useReducer(cartReducer, { items: [] });

//   const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
//   const removeItem = (cartKey) => dispatch({ type: 'REMOVE_ITEM', payload: cartKey });
//   const updateQty = (cartKey, qty) => dispatch({ type: 'UPDATE_QTY', payload: { cartKey, qty } });
//   const clearCart = () => dispatch({ type: 'CLEAR_CART' });

//   const subtotal = cart.items.reduce((sum, i) => sum + i.itemTotal, 0);
//   const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

//   return (
//     <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, subtotal, itemCount }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);


import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (i) => i.cartKey === action.payload.cartKey
      );
      if (existingIndex >= 0) {
        // ✅ FIX: Use .map() to create brand new objects, never mutate directly
        const updated = state.items.map((item, index) => {
          if (index === existingIndex) {
            const newQty = item.quantity + 1;
            return { ...item, quantity: newQty, itemTotal: newQty * item.unitPrice };
          }
          return item;
        });
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.cartKey !== action.payload),
      };

    case 'UPDATE_QTY': {
      const updated = state.items
        .map((item) => {
          if (item.cartKey === action.payload.cartKey) {
            const newQty = action.payload.qty;
            return { ...item, quantity: newQty, itemTotal: newQty * item.unitPrice };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      return { ...state, items: updated };
    }

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (cartKey) => dispatch({ type: 'REMOVE_ITEM', payload: cartKey });
  const updateQty = (cartKey, qty) => dispatch({ type: 'UPDATE_QTY', payload: { cartKey, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const subtotal = cart.items.reduce((sum, i) => sum + i.itemTotal, 0);
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
