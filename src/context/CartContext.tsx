import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  _row_id: number;
  product_id: number;
  id?: number; // Optional - will be auto-set by context
  name: string;
  price: number;
  original_price: number;
  quantity: number;
  image: string;
  store_name: string;
  rating: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (product_id: number) => void;
  updateQuantity: (product_id: number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('aliazastore_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('aliazastore_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aliazastore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    // Use product_id as the unique identifier - no id field manipulation needed
    const cartItem = { ...item, id: item._row_id };
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.product_id === item.product_id);
      if (existingItem) {
        // Only update the matching item - don't touch other items' IDs
        return prevItems.map(i =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevItems, cartItem];
    });
  };

  const removeFromCart = (product_id: number) => {
    console.log('🗑️ REMOVE CART ITEM CALLED - PRODUCT_ID:', product_id);
    if (!product_id) {
      console.error('❌ removeFromCart called with invalid product_id:', product_id);
      return;
    }
    setCartItems(prevItems => {
      const filtered = prevItems.filter(item => item.product_id === product_id);
      console.log('✅ Removed item with product_id:', product_id, 'Remaining items:', filtered.length);
      return filtered;
    });
  };

  const updateQuantity = (product_id: number, quantity: number) => {
    console.log('📦 UPDATE QUANTITY CALLED - PRODUCT_ID:', product_id, 'New Quantity:', quantity);
    if (!product_id) {
      console.error('❌ updateQuantity called with invalid product_id:', product_id);
      return;
    }
    if (quantity < 1) {
      console.log('🗑️ Quantity less than 1, removing item:', product_id);
      setCartItems(prevItems => {
        const filtered = prevItems.filter(item => item.product_id === product_id);
        console.log('✅ Item auto-removed due to quantity 0. Remaining items:', filtered.length);
        return filtered;
      });
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product_id === product_id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('aliazastore_cart');
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
