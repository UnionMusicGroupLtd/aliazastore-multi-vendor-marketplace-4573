import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Lock, Truck, Shield } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();

  const handlePlaceOrder = () => {
    alert('Order placed successfully! In production, this would process payment and create an order.');
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
          <Link to="/products" className="text-red-500 underline">
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-700">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-bold">£{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div>
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Order Total</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>£{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-2">
                  <span>Total</span>
                  <span>£{getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
              >
                Place Order
              </button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-400 text-sm">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Secure SSL payment</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Discreet delivery</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Age verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;