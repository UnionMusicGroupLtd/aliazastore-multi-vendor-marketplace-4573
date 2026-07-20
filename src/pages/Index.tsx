import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, ShoppingBag, Store, Shield, Truck, 
  HeadphonesIcon, Star, Users, BarChart3, 
  ChevronRight, Menu, X, Heart,
  Globe, Zap, MessageCircle, ArrowRight
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/context/CartContext";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartCount } = useCart();

  // Sample categories data
  const categories = [
    { name: "Electronics", icon: "📱", slug: "electronics", count: 12500, color: "from-blue-500 to-blue-600" },
    { name: "Fashion", icon: "👗", slug: "fashion", count: 23400, color: "from-pink-500 to-pink-600" },
    { name: "Home & Garden", icon: "🏡", slug: "home-garden", count: 8900, color: "from-green-500 to-green-600" },
    { name: "Sports", icon: "⚽", slug: "sports", count: 5600, color: "from-orange-500 to-orange-600" },
    { name: "Beauty", icon: "💄", slug: "beauty", count: 7800, color: "from-purple-500 to-purple-600" },
    { name: "Automotive", icon: "🚗", slug: "automotive", count: 3200, color: "from-red-500 to-red-600" },
  ];

  // Sample featured products
  const featuredProducts = [
    {
      _row_id: 1,
      name: "Premium Wireless Headphones",
      price: 129.99,
      compare_price: 179.99,
      primary_image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating_average: 4.8,
      review_count: 245,
      store_name: "TechHub Official",
      category: "Electronics"
    },
    {
      _row_id: 2,
      name: "Smart Fitness Watch",
      price: 89.99,
      compare_price: 129.99,
      primary_image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating_average: 4.6,
      review_count: 189,
      store_name: "FitLife Store",
      category: "Electronics"
    },
    {
      _row_id: 3,
      name: "Designer Leather Bag",
      price: 249.99,
      compare_price: 349.99,
      primary_image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
      rating_average: 4.9,
      review_count: 156,
      store_name: "Luxury Boutique",
      category: "Fashion"
    },
    {
      _row_id: 4,
      name: "Organic Skincare Set",
      price: 79.99,
      compare_price: 99.99,
      primary_image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      rating_average: 4.7,
      review_count: 312,
      store_name: "Natural Beauty",
      category: "Beauty"
    }
  ];

  const features = [
    { icon: Globe, title: "Global Reach", description: "Connect with millions of customers worldwide" },
    { icon: Shield, title: "Secure Payments", description: "Protected transactions with buyer guarantee" },
    { icon: Truck, title: "Fast Shipping", description: "Relliable delivery from trusted sellers" },
    { icon: HeadphonesIcon, title: "24/7 Support", description: "Dedicated customer service team ready to help" },
  ];

  const sellerBenefits = [
    { icon: Store, title: "Easy Store Setup", description: "Launch your store in minutes with our intuitive dashboard" },
    { icon: BarChart3, title: "Powerful Analytics", description: "Track sales, visitors, and performance in real-time" },
    { icon: Zap, title: "No Commission Fees", description: "Keep 100% of your sales with just ₱200/month subscription" },
    { icon: Users, title: "Marketing Tools", description: "Promote your products with built-in marketing features" },
  ];

  const stats = [
    { value: "50K+", label: "Active Sellers" },
    { value: "2M+", label: "Products Listed" },
    { value: "10M+", label: "Happy Customers" },
    { value: "99.9%", label: "Uptime Guarantee" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-dark-blue whitespace-nowrap">AliazaStore</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 ml-12">
              <Link to="/" className="text-slate-700 hover:text-orange-600 transition-colors">Home</Link>
              <Link to="/products" className="text-slate-700 hover:text-orange-600 transition-colors">Products</Link>
              <Link to="/categories" className="text-slate-700 hover:text-orange-600 transition-colors">Categories</Link>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Start Selling
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Link to="/products" className="block py-2 text-slate-700">Products</Link>
              <Link to="/categories" className="block py-2 text-slate-700">Categories</Link>
              <Link to="/login" className="block py-2 text-slate-700">Sign In</Link>
              <Link to="/register">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 w-fit">
                🚀 Launch Your Online Store Today
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Premium
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {" "}Multi-Vendor
                </span>
                <br />Marketplace
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Join thousands of sellers and millions of customers on the most trusted eCommerce platform. 
                Buy, sell, and discover amazing products from around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8">
                    Start Selling <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-white/80 backdrop-blur-lg border-0 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-2xl opacity-20" />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Featured Products</CardTitle>
                    <Badge className="bg-green-100 text-green-700">Hot 🔥</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredProducts.slice(0, 3).map((product) => (
                    <div key={product._row_id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <img 
                        src={product.primary_image} 
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{product.name}</p>
                        <p className="text-sm text-slate-500">{product.store_name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-bold text-orange-600">{formatPrice(product.price)}</span>
                          <span className="text-sm text-slate-400 line-through">{formatPrice(product.compare_price)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating_average}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Link to="/products" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Products <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              Why Choose AliazaStore
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built for both buyers and sellers, our platform provides the tools and features you need to thrive in eCommerce
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Explore Categories
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Browse through our wide selection of categories to find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.slug} to={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900">{category.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{category.count.toLocaleString()} products</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
                For Sellers
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Grow Your Business with AliazaStore</h2>
              <p className="text-xl text-slate-600 mb-8">
                Join thousands of successful sellers who trust AliazaStore to grow their online business. 
                Our platform provides everything you need to succeed.
              </p>
              <div className="space-y-6">
                {sellerBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                      <p className="text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/sellers" className="inline-block mt-8">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Become a Seller <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Seller Dashboard Preview</CardTitle>
                  <CardDescription>Manage your store with powerful tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                      <p className="text-sm text-slate-600">Total Sales</p>
                      <p className="text-2xl font-bold text-green-700">{formatPrice(12450)}</p>
                      <p className="text-xs text-green-600 mt-1">↑ 23% from last month</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                      <p className="text-sm text-slate-600">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-700">324</p>
                      <p className="text-xs text-blue-600 mt-1">↑ 18% from last month</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                      <p className="text-sm text-slate-600">Products</p>
                      <p className="text-2xl font-bold text-purple-700">48</p>
                      <p className="text-xs text-purple-600 mt-1">12 active listings</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                      <p className="text-sm text-slate-600">Rating</p>
                      <p className="text-2xl font-bold text-orange-700">4.8</p>
                      <p className="text-xs text-orange-600 mt-1">256 reviews</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-sm text-slate-600 mb-2">Recent Activity</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">New order #12345</span>
                        <span className="text-slate-500">2m ago</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">Product "Wireless Mouse" sold</span>
                        <span className="text-slate-500">15m ago</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">5-star review received</span>
                        <span className="text-slate-500">1h ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
                Trending Now
              </Badge>
              <h2 className="text-4xl font-bold">Featured Products</h2>
            </div>
            <Link to="/products">
              <Button variant="outline" className="hidden md:flex">
                View All Products <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product._row_id} to={`/products/${product._row_id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className="relative">
                    <img 
                      src={product.primary_image} 
                      alt={product.name}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                      Sale
                    </Badge>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <Badge className="bg-orange-100 text-orange-700 text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">{product.store_name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</span>
                        <span className="text-sm text-slate-400 line-through">{formatPrice(product.compare_price)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating_average}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/products">
              <Button variant="outline" className="w-full">
                View All Products <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-white">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Selling?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of successful sellers on AliazaStore. Open your store today and reach millions of customers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90">
                    Create Your Store
                  </Button>
                </Link>
                <Link to="/sellers">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">AliazaStore</span>
              </div>
              <p className="text-slate-400 mb-4">
                Your premium multi-vendor marketplace for buying and selling amazing products.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-slate-400 hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/categories" className="text-slate-400 hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/sellers" className="text-slate-400 hover:text-white transition-colors">Become a Seller</Link></li>
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/shipping" className="text-slate-400 hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-slate-400 hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/sitemap" className="text-slate-400 hover:text-white transition-colors">Sitemap</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 AliazaStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
