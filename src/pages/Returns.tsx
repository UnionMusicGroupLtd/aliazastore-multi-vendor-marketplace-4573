import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

const Returns = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Return Policy
          </h1>
          <p className="text-gray-400 text-center text-lg">
            Last updated: January 2026 | UK Compliant
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Overview Section */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Package className="w-6 h-6 mr-3 text-red-500" />
              Our Return Promise
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              At ifudda, we want you to be completely satisfied with your purchase. 
              If you're not happy for any reason, we offer a straightforward returns policy 
              that complies with UK consumer rights regulations.
            </p>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
              <p className="text-white font-semibold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                30-Day Return Window for most items
              </p>
            </div>
          </div>

          {/* Return Eligibility */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
              Return Eligibility
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Unopened Items</h3>
                  <p className="text-gray-400 text-sm">
                    Products in original packaging, sealed and unused can be returned within 30 days
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Defective Products</h3>
                  <p className="text-gray-400 text-sm">
                    Items with manufacturing defects can be returned for replacement or refund
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Wrong Item Sent</h3>
                  <p className="text-gray-400 text-sm">
                    If we send the wrong product, we'll cover return shipping and send the correct item
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <XCircle className="w-6 h-6 mr-3 text-red-500" />
              Non-Returnable Items
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <XCircle className="w-5 h-5 mr-3 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Intimate Products</h3>
                  <p className="text-gray-400 text-sm">
                    For hygiene reasons, items that have been used or cannot be hygienically sealed cannot be returned
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <XCircle className="w-5 h-5 mr-3 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Sale Items</h3>
                  <p className="text-gray-400 text-sm">
                    Items purchased on final sale cannot be returned unless defective
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-yellow-500" />
              How to Return
            </h2>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Contact Us</h3>
                  <p className="text-gray-400 text-sm">
                    Use our <Link to="/contact" className="text-red-400 hover:text-red-300">contact form</Link> to initiate a return within 30 days of delivery
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Receive Return Label</h3>
                  <p className="text-gray-400 text-sm">
                    We'll email you a prepaid return label (UK returns are free)
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Package & Ship</h3>
                  <p className="text-gray-400 text-sm">
                    Pack the item securely in original packaging if possible, attach the label, and ship
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Refund Processed</h3>
                  <p className="text-gray-400 text-sm">
                    Once received, refunds are processed within 5-7 business days to original payment method
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <AlertCircle className="w-6 h-6 mr-3 text-blue-500" />
              Refund Information
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Refund Method:</strong> Refunds are issued to the original payment method used for purchase.
              </p>
              <p>
                <strong className="text-white">Processing Time:</strong> 5-7 business days after we receive your return.
              </p>
              <p>
                <strong className="text-white">Shipping Costs:</strong> Original shipping costs are non-refundable unless the item is defective.
              </p>
              <p>
                <strong className="text-white">Partial Refunds:</strong> May apply if the item shows signs of use or is missing parts.
              </p>
            </div>
          </div>

          {/* Consumer Rights */}
          <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl p-8 border border-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-3 text-blue-400" />
              Your UK Consumer Rights
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              This returns policy does not affect your statutory rights. Under UK Consumer Rights Act 2015, 
              you have the right to return goods within 30 days for a full refund if they're faulty or not as described.
            </p>
            <p className="text-gray-300 leading-relaxed">
              For additional support or questions about our returns policy, please use our 
              <Link to="/contact" className="text-blue-400 hover:text-blue-300 mx-1">contact form</Link> 
              to get in touch with our customer service team.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need Help with a Return?
            </h2>
            <p className="text-white/80 mb-6">
              Our customer service team is here to assist you with any return questions
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Contact Support
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
