import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, Send, MessageCircle, 
  Clock, ShoppingBag, CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          <Link to="/help" className="text-orange-600 hover:text-orange-700">
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
          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => handleChange(e as any)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Issues</option>
                    <option value="payment">Payment Problems</option>
                    <option value="account">Account Help</option>
                    <option value="seller">Seller Support</option>
                    <option value="technical">Technical Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Describe your issue or question in detail..."
                    rows={6}
                    className="w-full"
                  />
                </div>

                {submitted ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Message sent successfully!</span>
                  </div>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Live Chat</h3>
                    <p className="text-slate-600">Available 24/7</p>
                    <p className="text-sm text-slate-500">Average wait: 5 minutes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email Support</h3>
                    <p className="text-slate-600">Use our contact form</p>
                    <p className="text-sm text-slate-500">Response within 24 hours</p>
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
        </div>

        {/* Additional Help */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/help" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Order Tracking</h3>
                <p className="text-sm text-slate-600">Learn how to track your orders</p>
              </Link>
              <Link to="/help" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Return Policy</h3>
                <p className="text-sm text-slate-600">5-day return policy information</p>
              </Link>
              <Link to="/help" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Shipping Information</h3>
                <p className="text-sm text-slate-600">Store-specific delivery times</p>
              </Link>
              <Link to="/help" className="p-4 border rounded-lg hover:border-orange-300 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-1">Payment Methods</h3>
                <p className="text-sm text-slate-600">Available payment options</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;