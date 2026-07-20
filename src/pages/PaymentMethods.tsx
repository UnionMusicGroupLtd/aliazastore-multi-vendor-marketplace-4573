import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, Smartphone, QrCode, Wallet, 
  Banknote, Store, Shield, CheckCircle, AlertCircle, Info
} from "lucide-react";
import { Link } from "react-router-dom";

const PaymentMethods = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
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
          <span className="text-slate-600">Payment Methods</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Payment Methods</h1>
          <p className="text-xl text-slate-600">
            Available payment options and how to use them securely
          </p>
        </div>

        {/* Available Payment Methods */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Available Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* GCash */}
              <div className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">GCash</h3>
                    <Badge className="bg-green-100 text-green-700 text-xs">Popular</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Mobile wallet payments with instant processing
                </p>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>QR Code scanning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Direct bank transfer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>

              {/* Credit/Debit Cards */}
              <div className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Credit/Debit Cards</h3>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">Secure</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  All major credit and debit cards accepted
                </p>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Visa, MasterCard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Secure encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Fraud protection</span>
                  </div>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Bank Transfer</h3>
                    <Badge className="bg-orange-100 text-orange-700 text-xs">Traditional</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Direct bank to bank transfers
                </p>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>All major banks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Secure processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Transaction tracking</span>
                  </div>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Cash on Delivery</h3>
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">Limited</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Pay when you receive your order
                </p>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Pay upon delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>No advance payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Available from select stores</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Pay */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">How to Make a Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Choose Your Payment Method</h3>
                <p className="text-slate-600">
                  Select your preferred payment option during checkout process
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Enter Payment Details</h3>
                <p className="text-slate-600">
                  Provide your payment information securely through our encrypted system
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Confirm Payment</h3>
                <p className="text-slate-600">
                  Review your order details and complete the payment transaction
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Receive Confirmation</h3>
                <p className="text-slate-600">
                  Get instant payment confirmation and order receipt via email
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GCash Payment Details */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Smartphone className="w-6 h-6 mr-2" />
              GCash Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">How GCash Payment Works</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Store displays their GCash QR code during checkout</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Scan QR code using your GCash mobile app</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Enter the payment amount and confirm transaction</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Receive instant payment confirmation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Order is processed immediately after payment</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">GCash Payment Tips</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Ensure you have sufficient GCash wallet balance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Double-check the payment amount before confirming</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Save the payment confirmation for your records</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Contact store directly if payment issues occur</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Payment Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">SSL Encryption</h3>
                    <p className="text-sm text-green-700">
                      All transactions secured with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Fraud Protection</h3>
                    <p className="text-sm text-blue-700">
                      Advanced fraud detection and prevention systems
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-1">Data Protection</h3>
                    <p className="text-sm text-purple-700">
                      Your payment information is never stored on our servers
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-900 mb-1">Buyer Protection</h3>
                    <p className="text-sm text-orange-700">
                      Full refund if items don't arrive or don't match description
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Payment Settings */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Store className="w-6 h-6 mr-2" />
              Store-Specific Payment Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700">
              Individual store owners can choose which payment methods to accept. Available options may vary by store:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Check Store Page</h3>
                  <p className="text-sm text-slate-600">
                    Visit the store's profile to see which payment methods they accept
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Review During Checkout</h3>
                  <p className="text-sm text-slate-600">
                    Available payment methods are displayed before you complete your purchase
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Contact Store</h3>
                  <p className="text-sm text-slate-600">
                    Message the store if you need alternative payment arrangements
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Issues */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Common Payment Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Payment Declined</h3>
                    <p className="text-sm text-red-700">
                      Check your card details, ensure sufficient funds, or try an alternative payment method
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">Payment Pending</h3>
                    <p className="text-sm text-yellow-700">
                      Some payments take time to process. Check your email for confirmation and tracking updates
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Wrong Amount Charged</h3>
                    <p className="text-sm text-blue-700">
                      Contact the store immediately with your order details and payment confirmation for resolution
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Refund Status</h3>
                    <p className="text-sm text-green-700">
                      Refund processing time depends on your payment method (3-7 business days for cards, instant for some wallets)
                    </p>
                  </div>
                </div>
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
              <Link to="/contact" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Contact Support</h3>
                <p className="text-sm text-slate-600">Get help with payment issues</p>
              </Link>
              <Link to="/shipping" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Shipping Information</h3>
                <p className="text-sm text-slate-600">Store-specific delivery times</p>
              </Link>
              <Link to="/returns" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Return Policy</h3>
                <p className="text-sm text-slate-600">5-day return policy information</p>
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

export default PaymentMethods;