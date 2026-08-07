import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, ShoppingCart, Users, TrendingUp, DollarSign,
  Settings, Bell, LogOut, Plus, Truck, CreditCard,
  BarChart3, Store, Upload, AlertCircle, CheckCircle,
  ChevronRight, Badge
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

const SimpleAdminDashboard = () => {
  const { user, isAdmin, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Add authentication check and redirect
  useEffect(() => {
    console.log("SimpleAdminDashboard mounted - User:", user);
    console.log("SimpleAdminDashboard - isAdmin:", isAdmin);
    
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    } else if (!isAdmin) {
      console.log("User is not admin, redirecting to home");
      navigate("/");
    }
  }, [user, isAdmin, navigate]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const menuItems = [
    { 
      icon: Package, 
      label: "Upload Products", 
      description: "Add adult wellness products to your catalog", 
      href: "/admin/products",
      urgent: true,
      color: "from-red-600 to-pink-600"
    },
    { 
      icon: Truck, 
      label: "Delivery Setup", 
      description: "Configure shipping and delivery options", 
      href: "/admin/settings",
      color: "from-purple-600 to-indigo-600"
    },
    { 
      icon: ShoppingCart, 
      label: "Orders", 
      description: "View and manage customer orders", 
      href: "/admin/orders",
      color: "from-blue-600 to-cyan-600"
    },
    { 
      icon: Users, 
      label: "Customers", 
      description: "View customer insights and data", 
      href: "/admin/customers",
      color: "from-green-600 to-emerald-600"
    },
    { 
      icon: CreditCard, 
      label: "Payments", 
      description: "Configure payment methods and withdrawals", 
      href: "/admin/payments",
      color: "from-amber-600 to-orange-600"
    },
    { 
      icon: TrendingUp, 
      label: "Analytics", 
      description: "View sales performance and metrics", 
      href: "/admin/analytics",
      color: "from-pink-600 to-rose-600"
    },
    { 
      icon: Settings, 
      label: "Settings", 
      description: "Configure store preferences", 
      href: "/admin/settings",
      color: "from-gray-600 to-slate-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <nav className="bg-black/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    ifudda
                  </span>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link to="/login" className="text-gray-400 text-sm hover:text-white transition-colors">Sign in</Link>
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <Link to="/">
                <button 
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-lg">Manage your ifudda premium adult wellness store</p>
            </div>
            <Link to="/admin/products">
              <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-500/20">
                <Plus className="mr-2 w-5 h-5" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Platform Info Banner */}
          <Card className="border-0 bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-900/50 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">ifudda Admin Platform</h3>
                    <p className="text-gray-400 text-sm">
                      Single-store management for your premium adult wellness business
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-900/30 text-green-400 border border-green-800">
                    Active Store
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-600 to-pink-600 text-white border-0 shadow-lg shadow-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 mb-1 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold">£0</p>
                  <p className="text-sm text-red-100 mt-2">Start selling to see earnings</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0 shadow-lg shadow-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1 text-sm">Active Products</p>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-purple-100 mt-2">Upload products to get started</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1 text-sm">Orders</p>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-blue-100 mt-2">No orders yet</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white border-0 shadow-lg shadow-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 mb-1 text-sm">Customers</p>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-amber-100 mt-2">Build your customer base</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <div className="mb-8">
          <Card className="border-0 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-5 h-5 mr-2 text-red-500" />
                Getting Started
              </CardTitle>
              <CardDescription className="text-gray-400">
                Quick setup for your ifudda adult wellness store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-800">
                    <span className="text-red-500 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Upload Products</h4>
                    <p className="text-gray-400 text-sm">Add adult wellness products with images</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-800">
                    <span className="text-purple-500 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Setup Delivery</h4>
                    <p className="text-gray-400 text-sm">Configure shipping options</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-800">
                    <span className="text-blue-500 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Start Selling</h4>
                    <p className="text-gray-400 text-sm">Launch your adult wellness store</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Menu */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Admin Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link key={item.label} to={item.href}>
                <Card className={`group hover:shadow-xl transition-all duration-300 border-0 bg-gray-900/50 backdrop-blur-sm cursor-pointer border border-gray-800 hover:border-gray-700 ${item.urgent ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 ${item.urgent ? 'bg-red-900/30' : `bg-gradient-to-br ${item.color}`} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <item.icon className={`w-7 h-7 ${item.urgent ? 'text-red-500' : 'text-white'}`} />
                      </div>
                      {item.urgent && (
                        <Badge className="bg-red-900/50 text-red-400 border border-red-800 animate-pulse">
                          Start Here
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">{item.label}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center text-red-500 text-sm font-medium group-hover:text-red-400">
                      <span>Open</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Platform Info Footer */}
        <div className="mt-12 mb-8">
          <Card className="border-0 bg-gradient-to-r from-gray-900 to-black border border-gray-800">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    ifudda
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">Premium Adult Wellness Platform</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  The UK's premier adult wellness marketplace since 2000. Professional products, premium service, 18+ verified.
                </p>
                <div className="flex items-center justify-center space-x-6 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">18+</p>
                    <p className="text-gray-500 text-xs">Age Verified</p>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">GBP</p>
                    <p className="text-gray-500 text-xs">UK Currency</p>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">2000</p>
                    <p className="text-gray-500 text-xs">Established</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;