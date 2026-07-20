import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, Clock, Package, Store, 
  MapPin, Calendar, Info, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-white" />
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
          <span className="text-slate-600">Shipping Information</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Shipping Information</h1>
          <p className="text-xl text-slate-600">
            Each store owner sets their own delivery time period and shipping options
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-900 mb-2">
                  Store-Specific Shipping Times
                </h2>
                <p className="text-orange-800">
                  <strong>Important:</strong> Each shop owner on AliazaStore sets their own delivery time period 
                  based on their location, processing capacity, and shipping methods. This means delivery times 
                  vary between different stores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Shipping Works */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Package className="w-6 h-6 mr-2" />
              How Shipping Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Order Processing</h3>
                <p className="text-slate-600">
                  Each store owner sets their own processing time (usually 1-3 business days) to prepare your order 
                  for shipping.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Shipping Time</h3>
                <p className="text-slate-600">
                  The store owner specifies their estimated delivery time based on their chosen shipping method and 
                  your location.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Delivery</h3>
                <p className="text-slate-600">
                  Your order is delivered according to the store owner's specified timeline and chosen delivery partner.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Time Examples */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Typical Delivery Time Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Store className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-slate-900">Local Sellers</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">Stores within your city/region</p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-700">1-3 days</Badge>
                  <span className="text-xs text-slate-500">Standard delivery</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Store className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Domestic Sellers</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">Stores within your country</p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-700">3-7 days</Badge>
                  <span className="text-xs text-slate-500">Ground shipping</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Store className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-slate-900">International Sellers</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">Stores from other countries</p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-100 text-purple-700">7-21 days</Badge>
                  <span className="text-xs text-slate-500">International shipping</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Store className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-slate-900">Express Options</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">When available from seller</p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-orange-100 text-orange-700">1-2 days</Badge>
                  <span className="text-xs text-slate-500">Express delivery</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check Store's Shipping Policy */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              How to Check Store's Shipping Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Visit the Store Page</h3>
                <p className="text-slate-600">
                  Go to the store's profile page by clicking on the store name from any product page.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Check Shipping Information</h3>
                <p className="text-slate-600">
                  Look for the "Shipping & Delivery" section on the store page to see their specific delivery times.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Review During Checkout</h3>
                <p className="text-slate-600">
                  Before completing your purchase, the estimated delivery time will be displayed based on the store's settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Factors Affecting Delivery */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Factors Affecting Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Order Processing Time</h3>
                  <p className="text-sm text-slate-600">Each store sets their own preparation time</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Distance</h3>
                  <p className="text-sm text-slate-600">Shipping distance between store and customer</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Shipping Method</h3>
                  <p className="text-sm text-slate-600">Standard, express, or economy shipping options</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Product Availability</h3>
                  <p className="text-sm text-slate-600">Stock status and product preparation needs</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Courier Service</h3>
                  <p className="text-sm text-slate-600">Delivery partner's service speed and reliability</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Local Conditions</h3>
                  <p className="text-sm text-slate-600">Weather, holidays, and local circumstances</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Track Your Order */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl">Track Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Once your order is shipped, you can track its delivery progress through:
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Order Confirmation Email</h3>
                  <p className="text-sm text-slate-600">Contains tracking number and delivery estimate</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Your Account Dashboard</h3>
                  <p className="text-sm text-slate-600">Real-time tracking in order history</p>
                </div>
              </div>
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
                  Store-Specific Policies
                </h2>
                <p className="text-yellow-800">
                  Please note that <strong>delivery times are set by individual store owners</strong> and may vary 
                  significantly between stores. Always check the specific shipping information provided by each store 
                  before making a purchase. If you have questions about a particular store's shipping policy, 
                  contact them directly through the store's messaging system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Links */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Related Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/returns" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Return Policy</h3>
                <p className="text-sm text-slate-600">5-day return policy information</p>
              </Link>
              <Link to="/contact" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Contact Support</h3>
                <p className="text-sm text-slate-600">Get help with shipping issues</p>
              </Link>
              <Link to="/help" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Help Center</h3>
                <p className="text-sm text-slate-600">Browse all help topics</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shipping;