import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, Globe, Users, TrendingUp, Heart, 
  Award, Target, Zap, CheckCircle, Building2, Shield, Store
} from "lucide-react";

const About = () => {
  const milestones = [
    {
      year: "2008",
      title: "Humble Beginnings in London",
      description: "Founded in the United Kingdom with a vision to connect local artisans with global customers.",
      icon: Building2,
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "2012", 
      title: "European Expansion",
      description: "Grew from local UK marketplace to serving customers across Europe with trusted sellers.",
      icon: Globe,
      color: "from-green-500 to-green-600"
    },
    {
      year: "2016",
      title: "Platform Innovation",
      description: "Launched revolutionary seller tools and analytics, empowering thousands of entrepreneurs.",
      icon: Zap,
      color: "from-purple-500 to-purple-600"
    },
    {
      year: "2020",
      title: "Million Sellers Milestone",
      description: "Reached 1 million+ sellers worldwide and established ourselves as a trusted global marketplace.",
      icon: Users,
      color: "from-orange-500 to-orange-600"
    },
    {
      year: "2023",
      title: "Premium Marketplace Launch",
      description: "Redesigned platform with focus on quality, trust, and seller success with transparent pricing.",
      icon: Award,
      color: "from-red-500 to-red-600"
    },
    {
      year: "2025",
      title: "Global Leadership",
      description: "Leading multi-vendor marketplace with millions of products and thousands of successful entrepreneurs.",
      icon: TrendingUp,
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision starts with our customers. Your satisfaction drives our innovation."
    },
    {
      icon: Users,
      title: "Empower Entrepreneurs",
      description: "We provide tools, resources, and support to help sellers build successful businesses."
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Fair pricing, clear policies, and secure transactions build lasting relationships."
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connecting diverse cultures through commerce, creating opportunities worldwide."
    }
  ];

  const stats = [
    { value: "17+", label: "Years of Excellence" },
    { value: "50K+", label: "Active Sellers" },
    { value: "10M+", label: "Happy Customers" },
    { value: "150+", label: "Countries Served" }
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
              Since 2008
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Our Journey of
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent block mt-2">
                Excellence & Trust
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              From a small startup in London to a global marketplace powerhouse, AliazaStore has been 
              empowering entrepreneurs and connecting customers with quality products for over 17 years.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Who We Are
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              We Are AliazaStore
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A global marketplace platform that connects passionate entrepreneurs with customers who value quality, trust, and fair pricing.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-slate-900">What We Do</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Multi-Vendor Marketplace</h4>
                    <p className="text-slate-600">We provide a platform where thousands of independent sellers can showcase their products to millions of customers worldwide.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Seller Empowerment</h4>
                    <p className="text-slate-600">We offer powerful tools, analytics, and support to help entrepreneurs build successful online businesses with transparent ₱200/month pricing.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Trust & Security</h4>
                    <p className="text-slate-600">We maintain a secure, trustworthy environment where buyers can shop with confidence and sellers can thrive without hidden fees.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-slate-900">Who We Serve</h3>
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-lg">Entrepreneurs & Sellers</h4>
                    </div>
                    <p className="text-slate-600">Independent business owners, artisans, and brands looking to reach global customers without commission fees eating into their profits.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-lg">Quality-Conscious Buyers</h4>
                    </div>
                    <p className="text-slate-600">Customers seeking unique, quality products from trusted sellers while supporting small businesses and entrepreneurs worldwide.</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-lg">Global Community</h4>
                    </div>
                    <p className="text-slate-600">A diverse ecosystem spanning 150+ countries, connecting cultures through commerce and creating economic opportunities worldwide.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-6">
              "To democratize ecommerce by providing a fair, transparent marketplace where entrepreneurs can build successful businesses 
              without predatory fees, and customers can discover quality products from trusted sellers worldwide."
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="font-semibold">Fair Pricing</p>
                <p className="text-sm text-white/80 mt-1">₱200/month, no commission</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="font-semibold">Seller Success</p>
                <p className="text-sm text-white/80 mt-1">Keep 100% of sales</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="font-semibold">Global Reach</p>
                <p className="text-sm text-white/80 mt-1">150+ countries served</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                AliazaStore was founded in 2008 in London, United Kingdom, with a simple yet powerful vision: 
                to create a marketplace where independent sellers could thrive and customers could discover 
                unique, quality products from around the world.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                What started as a small platform connecting local UK artisans with curious shoppers has evolved 
                into a global marketplace serving millions. Throughout our journey, we've remained committed to 
                our core values: fairness, transparency, and empowering small businesses.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Today, AliazaStore stands as a testament to what's possible when you combine innovative 
                technology with genuine care for sellers and customers. Our transparent pricing model, 
                comprehensive seller tools, and customer-first approach have made us a trusted name in 
                ecommerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Key milestones that shaped our path to becoming a global marketplace leader
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-br ${milestone.color} rounded-xl flex items-center justify-center mb-4`}>
                    <milestone.icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 mb-2 w-fit">{milestone.year}</Badge>
                  <CardTitle className="text-xl">{milestone.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Sellers Choose AliazaStore</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built by sellers, for sellers. We understand what you need to succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Transparent Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  No hidden fees, no commission surprises. Just ₱200/month and keep 100% of your sales. 
                  Start with a 14-day free trial.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Seller Success Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Powerful analytics, marketing tools, and dedicated support to help you grow your business 
                  and reach millions of customers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Trust & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Secure payments, seller protection, and fraud prevention so you can focus on what 
                  matters most - your products.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Leadership Message</h2>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <p className="text-xl leading-relaxed mb-6">
                "When we started AliazaStore in 2008, we wanted to create something different - a marketplace 
                that truly cares about sellers and customers alike. Our journey from London to serving 
                millions worldwide has been incredible, but our mission remains the same: empowering 
                entrepreneurs to build successful businesses."
              </p>
              <p className="text-lg font-semibold mb-2">Sarah Mitchell</p>
              <p className="text-white/80">Founder & CEO, AliazaStore</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-white/90 mb-8">
            Be part of our success story. Whether you're a seller or customer, there's a place for you at AliazaStore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Products
              </Button>
            </Link>
          </div>
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
            Empowering entrepreneurs since 2008. Your trusted global marketplace.
          </p>
          <p className="text-slate-500 text-sm">
            © 2025 AliazaStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;