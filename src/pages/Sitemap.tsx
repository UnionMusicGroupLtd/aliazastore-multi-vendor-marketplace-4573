import { Link } from "react-router-dom";
import { Map, Home, Package, Layers, User, ShoppingCart, MessageCircle, Settings, FileText, Users, Store, Truck, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Sitemap = () => {
  const sitemapSections = [
    {
      title: "Main Navigation",
      icon: Home,
      links: [
        { name: "Home", path: "/", description: "Homepage and featured products" },
        { name: "Products", path: "/products", description: "Browse all products" },
        { name: "Categories", path: "/categories", description: "Shop by category" },
      ]
    },
    {
      title: "Customer Account",
      icon: User,
      links: [
        { name: "Sign In", path: "/login", description: "Login to your account" },
        { name: "Register", path: "/register", description: "Create new account" },
        { name: "Customer Dashboard", path: "/dashboard/customer", description: "Manage your account" },
        { name: "My Orders", path: "/dashboard/orders", description: "View order history" },
        { name: "Shopping Cart", path: "/cart", description: "View your cart" },
        { name: "Wishlist", path: "/wishlist", description: "Saved items" },
        { name: "Addresses", path: "/dashboard/addresses", description: "Manage delivery addresses" },
        { name: "Settings", path: "/dashboard/settings", description: "Account preferences" },
      ]
    },
    {
      title: "Seller Portal",
      icon: Store,
      links: [
        { name: "Become a Seller", path: "/sellers", description: "Start selling on AliazaStore" },
        { name: "Seller Dashboard", path: "/dashboard/seller", description: "Manage your store" },
        { name: "My Products", path: "/dashboard/seller/products", description: "Manage your listings" },
        { name: "Seller Orders", path: "/dashboard/seller/orders", description: "Process customer orders" },
        { name: "Store Settings", path: "/dashboard/seller/settings", description: "Configure your store" },
        { name: "Seller Analytics", path: "/dashboard/seller/analytics", description: "Track performance" },
        { name: "Earnings", path: "/dashboard/seller/earnings", description: "View your revenue" },
      ]
    },
    {
      title: "Help & Support",
      icon: MessageCircle,
      links: [
        { name: "Help Center", path: "/help", description: "FAQs and support articles" },
        { name: "Contact Us", path: "/contact", description: "Get in touch with support" },
        { name: "Shipping Info", path: "/shipping", description: "Delivery information" },
        { name: "Returns", path: "/returns", description: "Return policy and process" },
        { name: "Order Tracking", path: "/order-tracking", description: "Track your orders" },
        { name: "Payment Methods", path: "/payment-methods", description: "Accepted payment options" },
      ]
    },
    {
      title: "About Us",
      icon: FileText,
      links: [
        { name: "About AliazaStore", path: "/about", description: "Learn about our company" },
        { name: "Who We Are", path: "/about#who-we-are", description: "Our team and mission" },
        { name: "What We Do", path: "/about#what-we-do", description: "Our services and features" },
      ]
    },
    {
      title: "Legal & Policies",
      icon: Shield,
      links: [
        { name: "Privacy Policy", path: "/privacy", description: "How we protect your data" },
        { name: "Terms of Service", path: "/terms", description: "Terms and conditions" },
        { name: "Cookie Policy", path: "/cookies", description: "Cookie usage policy" },
      ]
    },
    {
      title: "Admin Portal",
      icon: Settings,
      links: [
        { name: "Admin Dashboard", path: "/dashboard/admin", description: "Admin control panel" },
        { name: "User Management", path: "/admin/users", description: "Manage users" },
        { name: "Shop Owners", path: "/admin/shop-owners", description: "Manage sellers" },
        { name: "Product Moderation", path: "/admin/products", description: "Review products" },
        { name: "Order Management", path: "/admin/orders", description: "Manage all orders" },
        { name: "Analytics", path: "/admin/analytics", description: "Platform analytics" },
      ]
    }
  ];

  const popularCategories = [
    { name: "Electronics", slug: "electronics", count: "12,500" },
    { name: "Fashion", slug: "fashion", count: "23,400" },
    { name: "Home & Garden", slug: "home-garden", count: "8,900" },
    { name: "Sports", slug: "sports", count: "5,600" },
    { name: "Beauty", slug: "beauty", count: "7,800" },
    { name: "Automotive", slug: "automotive", count: "3,200" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-orange-600 hover:text-orange-700 transition-colors">
            ← Back to Home
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Sitemap</CardTitle>
                <CardDescription>Navigate through all pages and sections of AliazaStore</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Sitemap Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {sitemapSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.path}
                        className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">
                              {link.name}
                            </h3>
                            <p className="text-sm text-slate-500">{link.description}</p>
                          </div>
                          <span className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Categories */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-xl">Popular Categories</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCategories.map((category) => (
                <Link key={category.slug} to={`/categories/${category.slug}`}>
                  <div className="p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-center">
                    <h3 className="font-medium text-slate-900 mb-1">{category.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {category.count} products
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <h3 className="text-2xl font-bold">2M+</h3>
              <p className="text-blue-100">Products Listed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Store className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <h3 className="text-2xl font-bold">50K+</h3>
              <p className="text-green-100">Active Sellers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <h3 className="text-2xl font-bold">10M+</h3>
              <p className="text-purple-100">Happy Customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/help" className="flex-1">
                <div className="p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-center">
                  <MessageCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-semibold text-slate-900">Help Center</h3>
                  <p className="text-sm text-slate-600">Find answers to common questions</p>
                </div>
              </Link>
              <Link to="/contact" className="flex-1">
                <div className="p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-semibold text-slate-900">Contact Support</h3>
                  <p className="text-sm text-slate-600">Get personalized assistance</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>
            Last updated: January 2026 | For the most current information, visit our <Link to="/help" className="text-orange-600 hover:underline">Help Center</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;