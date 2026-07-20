import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, Clock, Store, Package, 
  AlertCircle, CheckCircle, XCircle, Info
} from "lucide-react";
import { Link } from "react-router-dom";

const Returns = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6 text-white" />
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
          <span className="text-slate-600">Return Policy</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Return Policy</h1>
          <p className="text-xl text-slate-600">
            5-day return policy with direct shop returns
          </p>
        </div>

        {/* Main Policy Statement */}
        <Card className="mb-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-900 mb-3">
                  5-Day Return Policy
                </h2>
                <p className="text-green-800 text-lg">
                  You have <strong className="text-green-900">5 days</strong> from the date of delivery to return 
                  items directly to the shop for a full refund or exchange.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Returns Work */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Package className="w-6 h-6 mr-2" />
              How Returns Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Initiate Return Within 5 Days</h3>
                <p className="text-slate-600">
                  Start the return process within 5 days of receiving your order. Contact the shop directly 
                  through their store messaging system.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Get Shop Approval</h3>
                <p className="text-slate-600">
                  The shop owner will review your return request and provide approval within 24-48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Return Item to Shop</h3>
                <p className="text-slate-600">
                  Ship the item back to the shop's address using your preferred courier. Keep the tracking number 
                  for reference.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Receive Refund or Exchange</h3>
                <p className="text-slate-600">
                  Once the shop receives and inspects the returned item, they'll process your refund or exchange 
                  within 3-5 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Can Be Returned */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">What Can Be Returned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Defective Products</h3>
                  <p className="text-sm text-slate-600">Items with manufacturing defects or damage</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Wrong Items</h3>
                  <p className="text-sm text-slate-600">Products different from what was ordered</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Damaged in Transit</h3>
                  <p className="text-sm text-slate-600">Items damaged during shipping process</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Not as Described</h3>
                  <p className="text-sm text-slate-600">Significant differences from product description</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Cannot Be Returned */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">What Cannot Be Returned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Personal Care Items</h3>
                  <p className="text-sm text-slate-600">Used cosmetics, hygiene products, or personal items</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Custom Products</h3>
                  <p className="text-sm text-slate-600">Personalized or custom-made items</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Perishable Goods</h3>
                  <p className="text-sm text-slate-600">Food items, flowers, or other perishable products</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Digital Products</h3>
                  <p className="text-sm text-slate-600">Downloaded software, music, or digital content</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">After 5 Days</h3>
                  <p className="text-sm text-slate-600">Items returned beyond the 5-day window</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Conditions */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Info className="w-6 h-6 mr-2" />
              Return Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Original Condition</h3>
                </div>
                <p className="text-sm text-slate-600">Item must be unused, unworn, and in original packaging</p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold text-slate-900">Time Limit</h3>
                </div>
                <p className="text-sm text-slate-600">Return initiated within 5 days of delivery</p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Store className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-slate-900">Shop Approval</h3>
                </div>
                <p className="text-sm text-slate-600">Return approved by the shop owner</p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <h3 className="font-semibold text-slate-900">Proof of Purchase</h3>
                </div>
                <p className="text-sm text-slate-600">Valid order number or receipt provided</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Direct Shop Return Process */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Store className="w-6 h-6 mr-2" />
              Direct Shop Return Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Why Direct to Shop?</h3>
              <p className="text-sm text-slate-600 mb-3">
                Returns are handled directly with shops to ensure faster processing and better communication.
              </p>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Faster refund processing</li>
                <li>• Direct communication with seller</li>
                <li>• Better resolution of issues</li>
                <li>• Clear return requirements</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Contact Shop Through Store Page</h3>
                  <p className="text-sm text-slate-600">
                    Use the store's messaging system to initiate return request
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Shop Provides Return Address</h3>
                  <p className="text-sm text-slate-600">
                    Shop owner gives you their specific return shipping address
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Ship Item Back</h3>
                  <p className="text-sm text-slate-600">
                    Return the item using your preferred courier with tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Shop Processes Refund</h3>
                  <p className="text-sm text-slate-600">
                    Shop issues refund or exchange after receiving returned item
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl">Refund Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Refund Method</h3>
                <p className="text-sm text-slate-600">
                  Original payment method used for purchase
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Processing Time</h3>
                <p className="text-sm text-slate-600">
                  3-5 business days after shop receives return
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Shipping Costs</h3>
                <p className="text-sm text-slate-600">
                  Return shipping covered for defective items
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Refund Amount</h3>
                <p className="text-sm text-slate-600">
                  Full product price, excluding original shipping
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-bold text-yellow-900 mb-2">
                  Important Return Policy Notice
                </h2>
                <p className="text-yellow-800">
                  <strong>5-day time limit:</strong> Returns must be initiated within 5 days of delivery. 
                  <strong>Direct shop returns:</strong> All returns go directly to the shop, not AliazaStore platform. 
                  <strong>Shop approval required:</strong> Each shop sets their own return approval process. 
                  <strong>Condition requirements:</strong> Items must be in original, unused condition.
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
              <Link to="/shipping" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Shipping Information</h3>
                <p className="text-sm text-slate-600">Store-specific delivery times</p>
              </Link>
              <Link to="/contact" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Contact Support</h3>
                <p className="text-sm text-slate-600">Get help with return issues</p>
              </Link>
              <Link to="/help" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Help Center</h3>
                <p className="text-sm text-slate-600">Browse all help topics</p>
              </Link>
              <Link to="/help" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Order Tracking</h3>
                <p className="text-sm text-slate-600">Track your order status</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Returns;