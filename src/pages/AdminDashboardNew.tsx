import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, ShoppingCart, Users, TrendingUp, DollarSign,
  Settings, LogOut, Plus, Truck, Store, Upload, 
  CheckCircle, ChevronRight, Badge, Home, Menu, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminDashboardNew = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  console.log("🔍 AdminDashboardNew: Component mounted");
  console.log("🔍 AdminDashboardNew: Current URL:", window.location.href);
  console.log("🔍 AdminDashboardNew: User from AuthContext:", user);
  console.log("🔍 AdminDashboardNew: isAdmin from AuthContext:", isAdmin);
  console.log("🔍 AdminDashboardNew: authLoading:", authLoading);
  console.log("🔄 FORCED REBUILD - Admin Dashboard: Payments & Withdrawals sections removed");
  console.log("🔍 AdminDashboardNew: Navigation should show: Home | Admin Dashboard | Avatar | Sign Out");

  // Authentication guard - redirect if not logged in or not admin
  useEffect(() => {
    const checkAuthStatus = () => {
      console.log("🔍 AdminDashboardNew: Authentication guard check");
      console.log("🔍 AdminDashboardNew: User:", user);
      console.log("🔍 AdminDashboardNew: isAdmin:", isAdmin);
      console.log("🔍 AdminDashboardNew: authLoading:", authLoading);
      
      // Don't check while auth is loading
      if (authLoading) {
        console.log("⏳ AdminDashboardNew: Auth still loading, waiting...");
        return;
      }
      
      if (!user) {
        console.log("❌ AdminDashboardNew: No user found, redirecting to login");
        navigate("/login");
      } else {
        // Check if user is admin by email or role
        const adminEmails = ['info@unionmusicgroup.co.uk', 'admin@ifudda.com', 'support@ifudda.com'];
        const isAdminByEmail = adminEmails.some(email => 
          user.email?.toLowerCase() === email.toLowerCase()
        );
        const isAdminByRole = user.role === 'admin' || user.metadata?.role === 'admin';
        
        console.log("🔍 AdminDashboardNew: Admin email check:", isAdminByEmail);
        console.log("🔍 AdminDashboardNew: Admin role check:", isAdminByRole);
        
        if (isAdminByEmail || isAdminByRole) {
          console.log("✅ AdminDashboardNew: User IS admin, showing dashboard");
          setIsCheckingAuth(false);
        } else {
          console.log("❌ AdminDashboardNew: User is not admin, redirecting to home");
          navigate("/");
        }
      }
    };

    checkAuthStatus();
  }, [user, isAdmin, authLoading, navigate]);

  const handleSignOut = async () => {
    console.log("🔍 AdminDashboardNew: Sign out triggered");
    // Use the real signOut function from AuthContext
    await signOut();
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "£0.00",
      change: "Start selling to see earnings",
      icon: DollarSign,
      color: "from-red-600 to-pink-600",
      bgColor: "bg-red-900/30"
    },
    {
      title: "Active Products",
      value: "0",
      change: "Upload products to get started",
      icon: Package,
      color: "from-purple-600 to-indigo-600",
      bgColor: "bg-purple-900/30"
    },
    {
      title: "Orders",
      value: "0",
      change: "No orders yet",
      icon: ShoppingCart,
      color: "from-blue-600 to-cyan-600",
      bgColor: "bg-blue-900/30"
    },
    {
      title: "Customers",
      value: "0",
      change: "Build your customer base",
      icon: Users,
      color: "from-amber-600 to-orange-600",
      bgColor: "bg-amber-900/30"
    }
  ];

  const adminActions = [
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
      href: "/admin/delivery",
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
      icon: Settings,
      label: "Settings",
      description: "Configure store preferences",
      href: "/admin/settings",
      color: "from-gray-600 to-slate-600"
    }
  ];

  // Show loading while checking authentication
  if (isCheckingAuth || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <nav className="bg-black/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
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
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link to="/admin" className="text-red-400 text-sm hover:text-red-300 transition-colors font-semibold">
                Admin Dashboard
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <button 
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-800">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="text-gray-400 text-sm hover:text-white transition-colors flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/admin" 
                  className="text-red-400 text-sm hover:text-red-300 transition-colors font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-400 text-sm hover:text-white transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-br ${stat.color} text-white border-0 shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 mb-1 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/70 mt-2">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

        {/* Admin Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className={`group hover:shadow-xl transition-all duration-300 border-0 bg-gray-900/50 backdrop-blur-sm cursor-pointer border border-gray-800 hover:border-gray-700 ${action.urgent ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 ${action.urgent ? 'bg-red-900/30' : `bg-gradient-to-br ${action.color}`} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <action.icon className={`w-7 h-7 ${action.urgent ? 'text-red-500' : 'text-white'}`} />
                      </div>
                      {action.urgent && (
                        <Badge className="bg-red-900/50 text-red-400 border border-red-800 animate-pulse">
                          Start Here
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">{action.label}</h3>
                    <p className="text-gray-400 text-sm mb-4">{action.description}</p>
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
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  The UK's premier adult wellness marketplace since 2000. Professional products, premium service, 18+ verified.
                </p>
                <div className="flex items-center justify-center space-x-6">
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

export default AdminDashboardNew;