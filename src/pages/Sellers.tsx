import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, TrendingUp, DollarSign, Shield, Globe, 
  HeadphonesIcon, Zap, CheckCircle2, ArrowRight, ShoppingBag
} from "lucide-react";

const Sellers = () => {
  const benefits = [
    { 
      icon: Store, 
      title: "Easy Store Setup", 
      description: "Launch your professional store in minutes with our intuitive dashboard. No technical skills required.",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: TrendingUp, 
      title: "Powerful Analytics", 
      description: "Track sales, visitors, and performance in real-time with detailed reports and insights.",
      color: "from-green-500 to-green-600"
    },
    { 
      icon: DollarSign, 
      title: "Fast Payments", 
      description: "Get your earnings quickly with multiple withdrawal options. Weekly payouts available.",
      color: "from-purple-500 to-purple-600"
    },
    { 
      icon: Globe, 
      title: "Global Reach", 
      description: "Connect with millions of customers worldwide. Sell locally or internationally.",
      color: "from-orange-500 to-orange-600"
    },
    { 
      icon: Shield, 
      title: "Seller Protection", 
      description: "Protected transactions with seller guarantee and fraud prevention systems.",
      color: "from-red-500 to-red-600"
    },
    { 
      icon: Zap, 
      title: "Marketing Tools", 
      description: "Promote your products with built-in marketing features, discounts, and campaigns.",
      color: "from-yellow-500 to-yellow-600"
    },
  ];

  const steps = [
    { 
      number: "1", 
      title: "Create Account", 
      description: "Sign up as a seller in just 2 minutes" 
    },
    { 
      number: "2", 
      title: "Setup Store", 
      description: "Customize your store with your brand and logo" 
    },
    { 
      number: "3", 
      title: "Add Products", 
      description: "List your products with photos and descriptions" 
    },
    { 
      number: "4", 
      title: "Start Selling", 
      description: "Begin receiving orders and growing your business" 
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Sellers" },
    { value: "2M+", label: "Products Listed" },
    { value: "₱8B+", label: "Total Sales" },
    { value: "98%", label: "Seller Satisfaction" },
  ];

  const features = [
    "No commission fees - keep 100% of your sales",
    "Flat ₱200/month subscription fee",
    "Unlimited product listings",
    "24/7 seller support and chat",
    "Automated order management",
    "Inventory tracking system",
    "Seller mobile app",
    "Promotional tools and coupons",
    "Multi-currency support",
    "No hidden charges or transaction fees",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                AliazaStore
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              🚀 Start Your Business Today
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Become a Seller on
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent block mt-2">
                AliazaStore
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Join thousands of successful entrepreneurs who trust AliazaStore to grow their online business. 
              Start selling to millions of customers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8">
                  Create Your Store <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Sell on AliazaStore?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to build a successful online business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in 4 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Seller Features</h2>
            <p className="text-xl text-slate-600">
              Everything you need to succeed
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">
              Start with a free trial, no credit card required
            </p>
          </div>
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
            <CardContent className="p-12">
              <div className="text-center">
                <Badge className="bg-green-500 text-white mb-4">Limited Time Offer</Badge>
                <h3 className="text-3xl font-bold mb-4">14-Day Free Trial</h3>
                <div className="text-5xl font-bold mb-2">FREE</div>
                <p className="text-white/90 mb-4">for 14 days, then ₱200/month</p>
                <p className="text-sm text-white/80 mb-8">No commission fees, keep 100% of your sales!</p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="font-semibold mb-1">14 Days Free</p>
                    <p className="text-sm text-white/80">Full access, no credit card needed</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="font-semibold mb-1">No Commission</p>
                    <p className="text-sm text-white/80">Keep all your earnings</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="font-semibold mb-1">Cancel Anytime</p>
                    <p className="text-sm text-white/80">No long-term contracts</p>
                  </div>
                </div>

                <Link to="/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90 w-full">
                    Start Selling Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How We Compare</h2>
            <p className="text-xl text-slate-600">
              See how much you save with AliazaStore vs competitors
            </p>
          </div>
          
          <div className="mb-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">💰 Your Savings with AliazaStore</h3>
                  <p className="text-lg mb-4">On ₱10,000 monthly sales, you save:</p>
                  <div className="text-4xl font-bold mb-2">₱700-₱1,800</div>
                  <p className="text-white/90">compared to competitors</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Shopee */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white`}>
                <CardTitle className="text-xl">Shopee</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Commission:</span>
                    <span className="font-semibold">5-12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Transaction Fee:</span>
                    <span className="font-semibold">2-5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Fee:</span>
                    <span className="font-semibold">2-3%</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-red-600">
                      <span>Total Fees:</span>
                      <span>9-20%</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">₱900-₱2,000 on ₱10,000 sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lazada */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white`}>
                <CardTitle className="text-xl">Lazada</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Commission:</span>
                    <span className="font-semibold">4-10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Transaction Fee:</span>
                    <span className="font-semibold">2-4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Fee:</span>
                    <span className="font-semibold">2-3%</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-red-600">
                      <span>Total Fees:</span>
                      <span>8-17%</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">₱800-₱1,700 on ₱10,000 sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Others */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className={`bg-gradient-to-r from-gray-500 to-gray-600 text-white`}>
                <CardTitle className="text-xl">Other Platforms</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Commission:</span>
                    <span className="font-semibold">6-15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Transaction Fee:</span>
                    <span className="font-semibold">3-6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Fee:</span>
                    <span className="font-semibold">2-4%</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-red-600">
                      <span>Total Fees:</span>
                      <span>11-25%</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">₱1,100-₱2,500 on ₱10,000 sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AliazaStore Advantage */}
          <Card className="mt-8 border-0 shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">🏆 AliazaStore Advantage</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Your Cost: ₱200/month</p>
                    <p className="text-sm text-white/80">Fixed monthly subscription</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Your Earnings: 100%</p>
                    <p className="text-sm text-white/80">Keep all your sales revenue</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/20 rounded-lg">
                  <p className="text-lg font-semibold">
                    Example: Sell ₱10,000 worth of products
                  </p>
                  <p className="mt-2">You keep: <span className="text-2xl font-bold">₱10,000</span></p>
                  <p className="text-sm text-white/80 mt-1">After ₱200 subscription fee = ₱9,800 profit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Business?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful sellers on AliazaStore. Open your store today and reach millions of customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                Create Your Store
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HeadphonesIcon className="w-8 h-8 text-orange-600" />
            <h3 className="text-2xl font-bold">Need Help Getting Started?</h3>
          </div>
          <p className="text-slate-600 mb-6">
            Our dedicated seller support team is available 24/7 to help you succeed
          </p>
          <Button variant="outline" className="border-2">
            Contact Seller Support
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">AliazaStore</span>
          </div>
          <p className="text-slate-400 mb-4">
            Your premium multi-vendor marketplace for buying and selling amazing products.
          </p>
          <p className="text-slate-500 text-sm">
            © 2025 AliazaStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Sellers;
