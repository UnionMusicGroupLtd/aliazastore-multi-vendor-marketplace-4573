import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, Truck, MapPin, Clock, CheckCircle, 
  AlertCircle, Store, ShoppingBag, Phone, Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderTracking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                AliazaStore
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/help" className="text-slate-700 hover:text-orange-600">
                Back to Help
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/help" className="text-orange-600 hover:text-orange-700">
            Help Center
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Order Tracking</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Tracking</h1>
          <p className="text-xl text-slate-600">
            Learn how to track your orders and stay updated on delivery progress
          </p>
        </div>

        {/* How to Track Orders */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Package className="w-6 h-6 mr-2" />
              How to Track Your Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Check Your Email</h3>
                <p className="text-slate-600">
                  Look for your order confirmation email with tracking number and delivery estimate
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Visit Your Dashboard</h3>
                <p className="text-slate-600">
                  Log into your account and view real-time tracking in your order history
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Use Tracking Number</h3>
                <p className="text-slate-600">
                  Enter tracking number on courier's website for detailed delivery updates
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Contact Store</h3>
                <p className="text-slate-600">
                  Message the store directly through their store page for shipping updates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Stages */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Order Status Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Order Placed</h3>
                  <p className="text-sm text-slate-600">Order confirmed and payment processed</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">Processing</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Preparing for Shipment</h3>
                  <p className="text-sm text-slate-600">Store is preparing your order (1-3 business days)</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Processing</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Shipped</h3>
                  <p className="text-sm text-slate-600">Order is on the way to your location</p>
                </div>
                <Badge className="bg-purple-100 text-purple-700">In Transit</Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Delivered</h3>
                  <p className="text-sm text-slate-600">Order has been delivered to your address</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Information Display */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl">What Tracking Information Shows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Order Date & Time</h3>
                </div>
                <p className="text-sm text-slate-600">When your order was placed</p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Store className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold text-slate-900">Store Information</h3>
                </div>
                <p className="text-sm text-slate-600">Shop name and contact details</p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-slate-900">Tracking Number</h3>
                </div>
                <p className="text-sm text-slate-600">Unique identifier for shipment tracking</p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <h3 className="font-semibold text-slate-900">Delivery Address</h3>
                </div>
                <p className="text-sm text-slate-600">Shipping destination details</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Updates */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Types of Delivery Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Order Confirmed</h3>
                  <p className="text-sm text-slate-600">Payment received and order being processed</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Shipped Notification</h3>
                  <p className="text-sm text-slate-600">Order picked up by courier with tracking number</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">In Transit Updates</h3>
                  <p className="text-sm text-slate-600">Package location changes during delivery journey</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Out for Delivery</h3>
                  <p className="text-sm text-slate-600">Package is at local facility and will be delivered today</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Delivered Confirmation</h3>
                  <p className="text-sm text-slate-600">Package delivered with delivery time and location</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store-Specific Tracking */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Store className="w-6 h-6 mr-2" />
              Store-Specific Tracking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700">
              Since each shop owner manages their own shipping, tracking information may vary by store:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Check Store Page</h3>
                  <p className="text-sm text-slate-600">
                    Visit the store's profile page for their shipping policies and tracking procedures
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Message the Store</h3>
                  <p className="text-sm text-slate-600">
                    Use store's messaging system for tracking updates and delivery questions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Courier Tracking</h3>
                  <p className="text-sm text-slate-600">
                    Some stores provide direct links to courier tracking pages for detailed updates
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Troubleshooting */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Tracking Issues? Here's Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">No Tracking Updates</h3>
                    <p className="text-sm text-red-700">
                      If you haven't received tracking updates within the store's specified processing time, 
                      contact the store directly through their messaging system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Tracking Not Working</h3>
                    <p className="text-sm text-yellow-700">
                      Sometimes tracking numbers take 24-48 hours to become active in courier systems. 
                      If tracking still doesn't work after this time, contact the store for assistance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Delivery Delayed</h3>
                    <p className="text-sm text-blue-700">
                      Delivery delays can occur due to weather, holidays, or courier issues. 
                      Contact the store for updated delivery estimates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl">Need Additional Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/contact" className="p-4 bg-white rounded-lg hover:border-orange-300 transition-colors border">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-slate-900">Contact Support</h3>
                </div>
                <p className="text-sm text-slate-600">Get help with tracking issues</p>
              </Link>

              <Link to="/shipping" className="p-4 bg-white rounded-lg hover:border-orange-300 transition-colors border">
                <div className="flex items-center space-x-3 mb-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Shipping Information</h3>
                </div>
                <p className="text-sm text-slate-600">Store-specific delivery times</p>
              </Link>

              <Link to="/returns" className="p-4 bg-white rounded-lg hover:border-orange-300 transition-colors border">
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-slate-900">Return Policy</h3>
                </div>
                <p className="text-sm text-slate-600">5-day return policy information</p>
              </Link>

              <Link to="/help" className="p-4 bg-white rounded-lg hover:border-orange-300 transition-colors border">
                <div className="flex items-center space-x-3 mb-2">
                  <Store className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-slate-900">Help Center</h3>
                </div>
                <p className="text-sm text-slate-600">Browse all help topics</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-bold text-yellow-900 mb-2">
                  Store-Specific Tracking
                </h2>
                <p className="text-yellow-800">
                  <strong>Remember:</strong> Each store owner manages their own shipping and tracking. 
                  For the most accurate tracking information, always check with the specific store where you made your purchase. 
                  Store delivery times and tracking procedures may vary significantly between sellers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;