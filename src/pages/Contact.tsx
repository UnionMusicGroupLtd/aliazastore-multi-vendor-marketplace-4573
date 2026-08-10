import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, MessageCircle, 
  Clock, ShoppingBag
} from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                ifudda
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/help" className="text-red-600 hover:text-red-700">
            <Button variant="ghost" size="sm">Help Center</Button>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Contact Us</span>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">Contact Us</h1>
        <p className="text-xl text-slate-600 mb-8">
          Get in touch with our support team for assistance
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Live Chat */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Live Chat</h3>
                    <p className="text-slate-600">Chat with our support team in real-time</p>
                    <p className="text-sm text-slate-500">Available 24/7</p>
                    <a 
                      href="https://tawk.to/chat/61f5d540b9e4e21181bc91ce/1fqk4i1k2" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Start Chat
                    </a>
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Email Support</h3>
                    <p className="text-slate-600">Send us a detailed message</p>
                    <p className="text-sm font-medium text-purple-600">info@unionmusicgroup.co.uk</p>
                    <p className="text-sm text-slate-500">Response within 24 hours</p>
                    <a 
                      href="mailto:info@unionmusicgroup.co.uk" 
                      className="inline-flex items-center justify-center w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Send Email
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">General Inquiries</span>
                  <Badge className="bg-green-100 text-green-700">24 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Order Issues</span>
                  <Badge className="bg-blue-100 text-blue-700">12 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Payment Problems</span>
                  <Badge className="bg-orange-100 text-orange-700">6 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Technical Support</span>
                  <Badge className="bg-purple-100 text-purple-700">2 hours</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/help" className="p-4 border rounded-lg hover:border-red-300 transition-colors">
                  <h3 className="font-semibold text-slate-900 mb-1">Order Tracking</h3>
                  <p className="text-sm text-slate-600">Learn how to track your orders</p>
                </Link>
                <Link to="/returns" className="p-4 border rounded-lg hover:border-red-300 transition-colors">
                  <h3 className="font-semibold text-slate-900 mb-1">Return Policy</h3>
                  <p className="text-sm text-slate-600">2-5 day return policy information</p>
                </Link>
                <Link to="/help" className="p-4 border rounded-lg hover:border-red-300 transition-colors">
                  <h3 className="font-semibold text-slate-900 mb-1">Shipping Information</h3>
                  <p className="text-sm text-slate-600">UK delivery times and options</p>
                </Link>
                <Link to="/help" className="p-4 border rounded-lg hover:border-red-300 transition-colors">
                  <h3 className="font-semibold text-slate-900 mb-1">Payment Methods</h3>
                  <p className="text-sm text-slate-600">Available payment options</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;