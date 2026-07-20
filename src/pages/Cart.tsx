import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, Trash2, Plus, Minus, 
  ArrowLeft, CreditCard, Truck, CheckCircle
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/context/CartContext";

interface CartItem {
  _row_id: number;
  product_id: number;
  name: string;
  price: number;
  original_price: number;
  quantity: number;
  image: string;
  store_name: string;
  rating: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount] = useState(0);

  const subtotal = getCartTotal();
  const totalSavings = cartItems.reduce((sum, item) => sum + ((item.original_price - item.price) * item.quantity), 0);
  const deliveryFee = subtotal > 1000 ? 0 : 50;
  const finalTotal = subtotal - discount + deliveryFee;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AliazaStore</span>
            </Link>
            
            <Link to="/dashboard/customer">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
          <p className="text-slate-600">{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-600 mb-6">Start shopping to add items to your cart</p>
              <Link to="/products">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item._row_id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <Link to={`/products/${item.product_id}`} className="font-semibold text-slate-900 hover:text-orange-600">
                              {item.name}
                            </Link>
                            <p className="text-sm text-slate-600">{item.store_name}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeFromCart(item._row_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {item.rating}
                            </Badge>
                            <span className="text-sm text-slate-500 line-through">
                              {formatPrice(item.original_price)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => updateQuantity(item._row_id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input 
                                type="number" 
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item._row_id, parseInt(e.target.value) || 1)}
                                className="w-20 text-center"
                                min="1"
                              />
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => updateQuantity(item._row_id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-semibold text-lg text-orange-600">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatPrice(item.price)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-green-600">
                    <span>You save</span>
                    <span className="font-semibold">-{formatPrice(totalSavings)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Delivery</span>
                    <div className="text-right">
                      {deliveryFee === 0 ? (
                        <Badge className="bg-green-100 text-green-700">FREE</Badge>
                      ) : (
                        <span className="font-semibold">{formatPrice(deliveryFee)}</span>
                      )}
                      <p className="text-xs text-slate-500">
                        {deliveryFee === 0 ? "Free delivery applied!" : "Free over ₱1,000"}
                      </p>
                    </div>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-orange-600">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <div className="text-center text-sm text-slate-600 space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Free delivery on orders over ₱1,000</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Secure payment guaranteed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">We Accept</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">GCash</Badge>
                    <Badge variant="outline" className="text-xs">Credit Card</Badge>
                    <Badge variant="outline" className="text-xs">Bank Transfer</Badge>
                    <Badge variant="outline" className="text-xs">PayPal</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;