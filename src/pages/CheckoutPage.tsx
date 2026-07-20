import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ShoppingCart, CreditCard, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GCashPayment from "@/components/GCashPayment";
import { notifyNewOrder, notifyPaymentReceived } from "@/lib/notifications";
import { useCart } from "@/context/CartContext";

const CheckoutPage = () => {
  const [checkoutStep, setCheckoutStep] = useState<'payment' | 'complete'>('payment');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const { cartItems, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  // Calculate order totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;
  
  const orderId = `ORD-${Date.now()}`;

  const handlePaymentComplete = async (transactionId: string) => {
    setSelectedPayment(transactionId);
    
    // Send order notification
    await notifyNewOrder({
      orderId: orderId,
      customerName: "Customer", // This would come from user data in a real app
      customerEmail: "customer@example.com", // This would come from user data
      customerPhone: "+63 912 345 6789", // This would come from user data
      totalAmount: `₱${total.toFixed(2)}`,
      shippingAddress: "Philippines", // This would come from user data
      city: "Manila", // This would come from user data
      postalCode: "1000", // This would come from user data
      paymentMethod: "GCash",
      orderItems: cartItems.map(item => 
        `${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}`
      ).join("\n")
    });
    
    // Send payment notification
    await notifyPaymentReceived({
      paymentType: "Order Payment",
      amount: total.toFixed(2),
      transactionId: transactionId,
      paymentMethod: "GCash",
      customerName: "Customer", // This would come from user data
      customerEmail: "customer@example.com", // This would come from user data
      orderId: orderId
    });
    
    // Clear the cart after successful payment
    clearCart();
    
    // Move to completion step
    setCheckoutStep('complete');
  };

  if (checkoutStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed! 🎉</h1>
            <p className="text-slate-600 mb-6">Thank you for your purchase</p>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-slate-600">Order ID</p>
                  <p className="font-semibold">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Transaction ID</p>
                  <p className="font-semibold">{selectedPayment}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Payment Method</p>
                  <p className="font-semibold">GCash</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Amount Paid</p>
                  <p className="font-semibold text-green-600">₱{total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-600">📧 Confirmation email sent to your email</p>
              <p className="text-sm text-slate-600">📦 Estimated delivery: 3-5 business days</p>
            </div>

            <div className="mt-8 flex gap-3 justify-center">
              <Link to="/products">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/dashboard/customer">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  View Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, redirect to products
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
          <p className="text-slate-600 mb-6">Add some items to your cart before checkout</p>
          <Link to="/products">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/cart" className="flex items-center text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
          <Badge className="bg-blue-100 text-blue-700">
            Order ID: {orderId}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._row_id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₱${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">₱{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                🔒 Secure payment powered by GCash
              </AlertDescription>
            </Alert>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <GCashPayment 
                  amount={total}
                  orderId={orderId} 
                  onComplete={handlePaymentComplete}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;