import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Avatar replaced with div-based avatars
import { 
  ShoppingBag, Heart, Package, Settings, 
  MapPin, CreditCard, Bell, HelpCircle, LogOut,
  ChevronRight, Star, Truck, Clock, CheckCircle
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import auth from "@/lib/shared/kliv-auth.js";
import db from "@/lib/shared/kliv-database.js";

const CustomerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log("🔍 Starting user data load...");
      // Try multiple times to get user data to handle temporary auth issues
      let currentUser = null;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (!currentUser && attempts < maxAttempts) {
        try {
          currentUser = await auth.getUser();
          if (currentUser) {
            console.log(`✅ Auth success on attempt ${attempts + 1}`);
            break;
          }
        } catch (authError) {
          console.log(`Auth attempt ${attempts + 1} failed:`, authError);
        }
        
        attempts++;
        if (!currentUser && attempts < maxAttempts) {
          console.log(`Retrying auth in ${300 * attempts}ms...`);
          // Wait a bit before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 300 * attempts));
        }
      }
      
      if (!currentUser) {
        console.log("❌ Authentication failed after all attempts, redirecting to login");
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
        return;
      }
      
      console.log("✅ User authenticated successfully:", currentUser.email);
      setUser(currentUser);

      // Load customer orders with better error handling
      try {
        const customerOrders = await db.query("orders", {
          customer_uuid: `eq.${currentUser.userUuid}`,
          order: "_created_at.desc",
          limit: "5"
        });
        console.log(`📦 Loaded ${customerOrders.length} orders`);
        setOrders(customerOrders);
      } catch (dbError) {
        console.log("⚠️ Could not load orders, but continuing:", dbError);
        // Don't fail the entire dashboard if orders fail to load
        setOrders([]);
      }
    } catch (error) {
      console.error("💥 Error loading user data:", error);
      // Don't redirect to login on general errors, just show what we can
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: Package, label: "My Orders", description: "Track and manage your orders", href: "/dashboard/orders", count: orders.length },
    { icon: ShoppingBag, label: "Shopping Cart", description: "View items in your cart", href: "/cart", count: 3 },
    { icon: Heart, label: "Wishlist", description: "View your saved products", href: "/wishlist", count: 12 },
    { icon: MapPin, label: "Addresses", description: "Manage shipping addresses", href: "/dashboard/addresses" },
    { icon: CreditCard, label: "Payment Methods", description: "Manage payment options", href: "/dashboard/payments" },
    { icon: Bell, label: "Notifications", description: "View your notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", description: "Account and preferences", href: "/dashboard/settings" },
    { icon: HelpCircle, label: "Help & Support", description: "Get help with your orders", href: "/dashboard/support" },
  ];

  const recentOrders = [
    {
      _row_id: 1,
      order_number: "ORD-2025-001234",
      status: "delivered",
      total: 299.97,
      created_at: Date.now() - 86400000 * 2,
      items_count: 3
    },
    {
      _row_id: 2,
      order_number: "ORD-2025-001233",
      status: "shipped",
      total: 129.99,
      created_at: Date.now() - 86400000 * 5,
      items_count: 1
    },
    {
      _row_id: 3,
      order_number: "ORD-2025-001232",
      status: "processing",
      total: 79.99,
      created_at: Date.now() - 86400000 * 7,
      items_count: 2
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-orange-100 text-orange-700";
      case "pending": return "bg-slate-100 text-slate-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "processing": return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

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
              <span className="text-xl font-bold">AliazaStore</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/dashboard/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    7
                  </span>
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>
              <Link to="/dashboard/settings">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-medium cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user?.firstName || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-slate-600">Manage your orders and account settings</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Menu */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <Link key={item.label} to={item.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">{item.label}</h3>
                            <p className="text-sm text-slate-600">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.count !== undefined && item.count > 0 && (
                            <Badge className="bg-orange-100 text-orange-700">
                              {item.count}
                            </Badge>
                          )}
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar - Recent Orders */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.map((order) => (
                  <Link key={order._row_id} to={`/orders/${order._row_id}`}>
                    <div className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-slate-900">{order.order_number}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{order.items_count} items</span>
                        <span className="font-semibold text-orange-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link to="/dashboard/orders">
                  <Button variant="outline" className="w-full">
                    View All Orders <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Total Orders</span>
                  </div>
                  <span className="font-semibold text-blue-700">24</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-semibold text-green-700">21</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">Wishlist Items</span>
                  </div>
                  <span className="font-semibold text-purple-700">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-orange-600" />
                    <span className="text-sm">Reviews</span>
                  </div>
                  <span className="font-semibold text-orange-700">8</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
