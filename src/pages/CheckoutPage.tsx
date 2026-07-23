import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShoppingCart, CreditCard, CheckCircle, User, MapPin, Phone, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GCashPayment from "@/components/GCashPayment";
import { notifyNewOrder, notifyPaymentReceived } from "@/lib/notifications";
import { useCart } from "@/context/CartContext";
import auth from "@/lib/shared/kliv-auth.js";

const CheckoutPage = () => {
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'complete'>('details');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const { cartItems, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  // Customer details form state
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  // Calculate order totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;
  
  const orderId = `ORD-${Date.now()}`;

  const validateCustomerDetails = () => {
    const errors: Record<string, string> = {};
    
    if (!customerDetails.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!customerDetails.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!customerDetails.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^09\d{9}$/.test(customerDetails.mobile.replace(/\s/g, ''))) {
      errors.mobile = 'Please enter a valid mobile number (09XX XXX XXXX)';
    }
    
    if (!customerDetails.address.trim()) {
      errors.address = 'Street address is required';
    }
    
    if (!customerDetails.city.trim()) {
      errors.city = 'City/Municipality is required';
    }
    
    if (!customerDetails.province.trim()) {
      errors.province = 'Province is required';
    }
    
    if (!customerDetails.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateCustomerDetails()) {
      setCheckoutStep('payment');
    }
  };

  const handleBackToDetails = () => {
    setCheckoutStep('details');
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentComplete = async (transactionId: string) => {
    setSelectedPayment(transactionId);
    setLoading(true);
    
    try {
      // Send order notification with actual customer details
      await notifyNewOrder({
        orderId: orderId,
        customerName: customerDetails.fullName,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.mobile,
        totalAmount: `₱${total.toFixed(2)}`,
        shippingAddress: `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.province} ${customerDetails.postalCode}`,
        city: customerDetails.city,
        postalCode: customerDetails.postalCode,
        paymentMethod: "GCash",
        orderItems: cartItems.map(item => 
          `${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}`
        ).join("\n"),
        notes: customerDetails.notes
      });
      
      // Send payment notification with actual customer details
      await notifyPaymentReceived({
        paymentType: "Order Payment",
        amount: total.toFixed(2),
        transactionId: transactionId,
        paymentMethod: "GCash",
        customerName: customerDetails.fullName,
        customerEmail: customerDetails.email,
        orderId: orderId
      });
      
      // Clear the cart after successful payment
      clearCart();
      
      // Move to completion step
      setCheckoutStep('complete');
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <p className="text-slate-600 mb-6">Thank you for your purchase, {customerDetails.fullName}</p>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-slate-900 mb-4">Order Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Order ID:</span>
                  <span className="font-semibold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Customer:</span>
                  <span className="font-semibold">{customerDetails.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Email:</span>
                  <span className="font-semibold">{customerDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Mobile:</span>
                  <span className="font-semibold">{customerDetails.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Shipping Address:</span>
                  <span className="font-semibold text-right text-sm max-w-xs">
                    {customerDetails.address}, {customerDetails.city}<br />
                    {customerDetails.province} {customerDetails.postalCode}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Transaction ID:</span>
                    <span className="font-semibold">{selectedPayment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Payment Method:</span>
                    <span className="font-semibold">GCash</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Amount Paid:</span>
                    <span className="font-semibold text-green-600">₱{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-600">📧 Confirmation email sent to {customerDetails.email}</p>
              <p className="text-sm text-slate-600">📦 Estimated delivery: 3-5 business days</p>
              <p className="text-sm text-slate-600">📍 Shipping to {customerDetails.city}, {customerDetails.province}</p>
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

        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          {checkoutStep === 'details' ? 'Customer Details' : 'Checkout'}
        </h1>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${checkoutStep === 'details' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                checkoutStep === 'details' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {checkoutStep === 'complete' ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Details</span>
            </div>
            <div className="w-12 h-1 bg-slate-200 rounded">
              <div className={`h-full rounded transition-all ${checkoutStep === 'details' ? 'w-0' : 'w-full bg-green-600'}`}></div>
            </div>
            <div className={`flex items-center ${checkoutStep === 'payment' ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                checkoutStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-200'
              }`}>
                {checkoutStep === 'complete' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className="w-12 h-1 bg-slate-200 rounded">
              <div className={`h-full rounded transition-all ${checkoutStep === 'complete' ? 'w-full bg-green-600' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center ${checkoutStep === 'complete' ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                checkoutStep === 'complete' ? 'bg-green-600 text-white' : 'bg-slate-200'
              }`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="ml-2 font-medium">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Customer Details Form - Step 1 */}
          {checkoutStep === 'details' && (
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>We need your contact details for order confirmation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Juan Dela Cruz"
                      value={customerDetails.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={formErrors.fullName ? 'border-red-500' : ''}
                    />
                    {formErrors.fullName && <p className="text-sm text-red-500">{formErrors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@example.com"
                      value={customerDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                    <p className="text-xs text-slate-500">Order confirmation will be sent to this email</p>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="09XX XXX XXXX"
                      value={customerDetails.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className={formErrors.mobile ? 'border-red-500' : ''}
                    />
                    {formErrors.mobile && <p className="text-sm text-red-500">{formErrors.mobile}</p>}
                    <p className="text-xs text-slate-500">Format: 09XX XXX XXXX (11 digits)</p>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <CardTitle className="flex items-center mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="House number, street name, barangay"
                      value={customerDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={formErrors.address ? 'border-red-500' : ''}
                    />
                    {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}
                  </div>

                  {/* City and Province */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City/Municipality *</Label>
                      <Input
                        id="city"
                        placeholder="e.g., Manila"
                        value={customerDetails.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={formErrors.city ? 'border-red-500' : ''}
                      />
                      {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <Input
                        id="province"
                        placeholder="e.g., Metro Manila"
                        value={customerDetails.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        className={formErrors.province ? 'border-red-500' : ''}
                      />
                      {formErrors.province && <p className="text-sm text-red-500">{formErrors.province}</p>}
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      placeholder="e.g., 1000"
                      value={customerDetails.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={formErrors.postalCode ? 'border-red-500' : ''}
                    />
                    {formErrors.postalCode && <p className="text-sm text-red-500">{formErrors.postalCode}</p>}
                  </div>

                  {/* Delivery Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Landmark, special instructions, etc."
                      value={customerDetails.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                    <p className="text-xs text-slate-500">Any special instructions for delivery</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between mt-6">
                <Link to="/cart">
                  <Button variant="outline" className="px-8">
                    Back to Cart
                  </Button>
                </Link>
                <Button 
                  onClick={handleContinueToPayment}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8"
                >
                  Continue to Payment
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* Payment Section - Step 2 */}
          {checkoutStep === 'payment' && (
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Button variant="ghost" onClick={handleBackToDetails} className="pl-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Customer Details
                </Button>
              </div>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Select your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <GCashPayment 
                    amount={total}
                    orderId={orderId} 
                    onComplete={handlePaymentComplete}
                    disabled={loading}
                  />
                  {loading && (
                    <p className="text-center text-sm text-slate-600 mt-4">
                      Processing your order...
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Customer Details Summary */}
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Shipping To</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <User className="w-4 h-4 mt-1 mr-2 text-slate-600" />
                      <div>
                        <p className="font-medium">{customerDetails.fullName}</p>
                        <p className="text-sm text-slate-600">{customerDetails.email}</p>
                        <p className="text-sm text-slate-600">{customerDetails.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mt-1 mr-2 text-slate-600" />
                      <div className="text-sm text-slate-600">
                        <p>{customerDetails.address}</p>
                        <p>{customerDetails.city}, {customerDetails.province} {customerDetails.postalCode}</p>
                        {customerDetails.notes && <p className="mt-1 text-blue-600">Note: {customerDetails.notes}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Order Summary - Always Visible */}
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

                {shipping > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700">
                      🚚 Add ₱{(1000 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                🔒 Secure payment powered by GCash
              </AlertDescription>
            </Alert>

            <div className="mt-4 bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">📋 Delivery Information</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Standard delivery: 3-5 business days</li>
                <li>• Free shipping on orders over ₱1,000</li>
                <li>• You'll receive tracking updates via email</li>
                <li>• Secure payment processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;