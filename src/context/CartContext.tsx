import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  _row_id: number;
  product_id?: number;  // Optional for compatibility
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
  removeFromCart: (_row_id: number) => void;
  updateQuantity: (_row_id: number, quantity: number) => void;
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
        const parsedCart = JSON.parse(savedCart);
        console.log('📦 Loaded cart from localStorage:', parsedCart);
        
        // Check if cart items have valid _row_id, if not, clear the cart
        const hasValidIds = parsedCart.every((item: any) => item._row_id && typeof item._row_id === 'number');
        
        if (!hasValidIds) {
          console.log('⚠️ Cart has invalid IDs, clearing old data...');
          localStorage.removeItem('aliazastore_cart');
          setCartItems([]);
        } else {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('aliazastore_cart');
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aliazastore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    // Use _row_id as the unique identifier - this matches the products table
    const cartItem = { ...item, id: item._row_id };
    console.log('➕ ADD TO CART - Item _row_id:', item._row_id, 'Product:', item.name);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i._row_id === item._row_id);
      if (existingItem) {
        console.log('📦 Updating existing item quantity');
        // Only update the matching item - don't touch other items' IDs
        return prevItems.map(i =>
          i._row_id === item._row_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      console.log('✨ Adding new item to cart');
      return [...prevItems, cartItem];
    });
  };

  const removeFromCart = (_row_id: number) => {
    console.log('🗑️ REMOVE CART ITEM CALLED - _row_id:', _row_id);
    console.log('🗑️ Current cart items before removal:', cartItems.map(i => ({ _row_id: i._row_id, name: i.name })));
    
    if (!_row_id) {
      console.error('❌ removeFromCart called with invalid _row_id:', _row_id);
      return;
    }
    
    setCartItems(prevItems => {
      const filtered = prevItems.filter(item => item._row_id === _row_id);
      console.log('✅ Filtered items after removal:', filtered.map(i => ({ _row_id: i._row_id, name: i.name })));
      console.log('✅ Removed item with _row_id:', _row_id, 'Remaining items:', filtered.length);
      return filtered;
    });
  };

  const updateQuantity = (_row_id: number, quantity: number) => {
    console.log('📦 UPDATE QUANTITY CALLED - _row_id:', _row_id, 'New Quantity:', quantity);
    console.log('📦 Current cart before update:', cartItems.map(i => ({ _row_id: i._row_id, name: i.name, quantity: i.quantity })));
    
    if (!_row_id) {
      console.error('❌ updateQuantity called with invalid _row_id:', _row_id);
      return;
    }
    
    if (quantity < 1) {
      console.log('🗑️ Quantity less than 1, removing item:', _row_id);
      setCartItems(prevItems => {
        const filtered = prevItems.filter(item => item._row_id === _row_id);
        console.log('✅ Item auto-removed due to quantity 0. Remaining items:', filtered.length);
        return filtered;
      });
      return;
    }
    
    setCartItems(prevItems => {
      const updated = prevItems.map(item =>
        item._row_id === _row_id ? { ...item, quantity } : item
      );
      console.log('✅ Updated cart items:', updated.map(i => ({ _row_id: i._row_id, name: i.name, quantity: i.quantity })));
      return updated;
    });
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
