import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Shield, Truck, CheckCircle } from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [removedMessage, setRemovedMessage] = useState<string | null>(null);
  const previousCartItems = useRef<number>(0);
  
  console.log('🛒 CART SYSTEM DEBUG - Version 2.0 - ', new Date().toISOString());
  console.log('🛒 Cart Items:', cartItems.length);
  console.log('🛒 Cart Functions Available:', { removeFromCart: typeof removeFromCart, updateQuantity: typeof updateQuantity });

  const subtotal = getCartTotal();
  const deliveryFee = 0; // Free UK delivery
  const finalTotal = subtotal + deliveryFee;

  // Detect auto-removal due to quantity reaching 0
  useEffect(() => {
    if (previousCartItems.current > 0 && cartItems.length < previousCartItems.current) {
      // Items were removed (likely due to quantity reaching 0)
      const removedCount = previousCartItems.current - cartItems.length;
      if (removedCount === 1) {
        setRemovedMessage("Item removed from cart due to quantity reaching 0");
        setTimeout(() => setRemovedMessage(null), 3000);
      }
    }
    previousCartItems.current = cartItems.length;
  }, [cartItems.length]);

  const handleRemoveItem = (product_id: number, name: string) => {
    removeFromCart(product_id);
    setRemovedMessage(`"${name}" removed from cart`);
    setTimeout(() => setRemovedMessage(null), 3000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Your cart is empty</h1>
          <p className="text-gray-400 mb-6">Start shopping to add items to your cart</p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <span className="text-2xl font-bold text-white">ifudda</span>
            </Link>
            
            <Link to="/products" className="text-gray-300 hover:text-white">
              ← Back to Shopping
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Success Message */}
        {removedMessage && (
          <div className="mb-6 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{removedMessage}</span>
          </div>
        )}
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-400">{cartItems.length} items in your cart</p>
          </div>
          
          {/* EMERGENCY CLEAR CART BUTTON */}
          <button
            onClick={() => {
              if (confirm('⚠️ EMERGENCY: Clear all items from cart? This cannot be undone!')) {
                localStorage.removeItem('aliazastore_cart');
                window.location.reload();
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product_id} className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
                <div className="flex gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-400">Premium Quality</p>
                      </div>
                      <button
                        onClick={() => {
                          if (item.product_id) {
                            handleRemoveItem(item.product_id, item.name);
                          }
                        }}
                        className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold">£{item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg">
                          <button 
                            onClick={() => {
                              if (item.product_id) {
                                updateQuantity(item.product_id, item.quantity - 1);
                              }
                            }}
                            className={`p-2 transition-all ${
                              item.quantity === 1 
                                ? 'text-red-500 hover:bg-red-500/20 rounded-lg' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                            title={item.quantity === 1 ? "Click to remove item" : "Decrease quantity"}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="text-center">
                            <span className="text-white font-semibold w-8">{item.quantity}</span>
                            {item.quantity === 1 && (
                              <span className="block text-xs text-red-400">Remove</span>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              if (item.product_id) {
                                updateQuantity(item.product_id, item.quantity + 1);
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-white text-lg">
                            £{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-bold text-white">£{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-semibold text-center hover:from-red-700 hover:to-pink-700 transition-all"
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                Proceed to Checkout
              </Link>

              <div className="mt-4 space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Discreet billing as "IFD"</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Plain packaging - free UK delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;