import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  HelpCircle, MessageCircle, Search, ChevronRight,
  ShoppingBag, Package, User, Shield, AlertCircle, Send
} from "lucide-react";

const Help = () => {
  const categories = [
    {
      icon: ShoppingBag,
      title: "Buying & Orders",
      description: "Track orders, returns, refunds, and delivery issues",
      topics: [
        "Track my order",
        "Return or refund request",
        "Payment failed",
        "Wrong item received",
        "Delivery delay",
        "Cancel order"
      ]
    },
    {
      icon: User,
      title: "Account Management",
      description: "Login, registration, profile, and account settings",
      topics: [
        "Login issues",
        "Password reset",
        "Update profile",
        "Close account",
        "Email verification",
        "Account security"
      ]
    },
    {
      icon: Package,
      title: "Product Information",
      description: "Product details, specifications, and availability",
      topics: [
        "Product information",
        "Stock availability",
        "Product quality",
        "Age verification",
        "Discreet packaging",
        "Product safety"
      ]
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Privacy, security, and policy information",
      topics: [
        "Privacy policy",
        "Data protection",
        "Secure payments",
        "Age verification",
        "Safety tips",
        "Report concerns"
      ]
    }
  ];

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const popularTopics = [
    { icon: Package, title: "How to track my order", category: "Buying & Orders", slug: "track-my-order" },
    { icon: Package, title: "Return or refund request", category: "Buying & Orders", slug: "return-or-refund-request" },
    { icon: Shield, title: "Privacy & data protection", category: "Trust & Safety", slug: "privacy-policy" },
    { icon: User, title: "Password reset help", category: "Account Management", slug: "password-reset" },
    { icon: ShoppingBag, title: "Product information", category: "Product Information", slug: "product-information" },
    { icon: Shield, title: "Age verification process", category: "Trust & Safety", slug: "age-verification" }
  ];

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate form submission
      console.log("Contact form submitted:", contactForm);
      
      // Show success message
      alert(`Thank you for your message! We'll get back to you at ${contactForm.email} within 24 hours.`);
      
      // Reset form
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general"
      });
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error submitting your message. Please try again.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.title.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term) ||
        category.topics.some(topic => topic.toLowerCase().includes(term))
      );
      setFilteredCategories(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">ifudda</span>
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

      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-red-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-50" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-white/90 mb-8">
            How can we help you today? Search our knowledge base or contact our support team.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search for help topics, FAQs, and solutions..."
              className="pl-12 h-12 text-lg bg-white"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Topics</h2>
            <p className="text-xl text-slate-600">Quick answers to common questions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTopics.map((topic, index) => (
              <Link key={index} to={`/help/topic/${topic.slug}`} className="group">
                <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <topic.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{topic.title}</h3>
                        <Badge className="bg-slate-100 text-slate-600 text-xs">{topic.category}</Badge>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-xl text-slate-600">Find help specific to your needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.icon === ShoppingBag ? "from-red-500 to-pink-600" : category.icon === User ? "from-blue-500 to-blue-600" : category.icon === Package ? "from-green-500 to-green-600" : category.icon === Shield ? "from-purple-500 to-purple-600" : "from-orange-500 to-orange-600"} rounded-xl flex items-center justify-center mb-4`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <Link 
                        key={topicIndex} 
                        to={`/help/topic/${topic.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between text-sm text-slate-700 hover:text-orange-600 transition-colors"
                      >
                        <span>{topic}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No topics found matching "{searchTerm}"</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredCategories(categories);
                  }}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-slate-600">Contact our support team through your preferred channel</p>
          </div>
          <div className="grid md:grid-cols-1 gap-8">
            {/* Live Chat */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-center">Live Chat</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 mb-2">Chat with our support team in real-time</p>
                <p className="text-sm text-slate-500 mb-4">Available 24/7</p>
                <a 
                  href="https://tawk.to/chat/61f5d540b9e4e21181bc91ce/1fqk4i1k2" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Start Chat
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Send className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-xl text-slate-600">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmitContact} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      value={contactForm.category}
                      onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="orders">Orders & Delivery</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="account">Account Issues</option>
                      <option value="technical">Technical Support</option>
                      <option value="report">Report Issue</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide as much detail as possible about your inquiry..."
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Response Time</p>
                      <p className="text-blue-700">
                        We typically respond to all inquiries within 24 hours during business days. 
                        For urgent matters, please use our live chat or contact form.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                  size="lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">ifudda</span>
          </div>
          <p className="text-slate-400 mb-4">
            We're here to help 24/7. Your satisfaction is our priority.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</Link>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 ifudda. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Help;