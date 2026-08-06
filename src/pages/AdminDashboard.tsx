import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Store, Package, ShoppingCart, DollarSign, TrendingUp,
  Settings, Shield, Bell, LogOut, ChevronRight,
  CheckCircle, Clock, AlertTriangle, Truck, UserCog, CreditCard, Wallet, Smartphone, PackageSearch, Layers, MessageSquare, AlertCircle as AlertCircleIcon, IdCard, Key
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import auth from "@/lib/shared/kliv-auth.js";
import db from "@/lib/shared/kliv-database.js";

const AdminDashboard = () => {
  const [, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      console.log("🔄 Loading admin dashboard...");
      
      // Try multiple times to get user data to handle temporary auth issues
      let currentUser = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!currentUser && attempts < maxAttempts) {
        currentUser = await auth.getUser();
        if (!currentUser) {
          attempts++;
          console.log(`Auth attempt ${attempts} failed, retrying...`);
          // Wait a bit before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 500 * attempts));
        }
      }
      
      if (!currentUser) {
        console.log("❌ Authentication failed after multiple attempts");
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
        return;
      }
      
      console.log("✅ Admin authenticated:", currentUser.email);
      setUser(currentUser);

      // Load platform statistics
      await Promise.all([
        auth.listUsers({ startRow: 0, endRow: 1 }),
        db.query("stores", { limit: "1" }),
        db.query("products", { limit: "1" }),
        db.query("orders", { limit: "1" })
      ]);


      setStats({
        totalUsers: 15420,
        totalStores: 324,
        totalProducts: 45678,
        totalOrders: 8934,
        totalRevenue: 234567
      });

      // Sample recent activity
      setRecentActivity([
        { id: 1, type: "store", message: "New store registered", time: "5 minutes ago", status: "pending" },
        { id: 2, type: "order", message: "Order #ORD-2025-001234 placed", time: "12 minutes ago", status: "completed" },
        { id: 3, type: "user", message: "New user registration", time: "25 minutes ago", status: "completed" },
        { id: 4, type: "product", message: "Product flagged for review", time: "1 hour ago", status: "flagged" },
        { id: 5, type: "store", message: "Store approval request", time: "2 hours ago", status: "pending" },
      ]);
    } catch (error) {
      console.error("Error loading admin data:", error);
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

  // Sample data for charts
  const platformGrowthData = [
    { month: "Jan", users: 8000, stores: 150, revenue: 120000 },
    { month: "Feb", users: 9500, stores: 180, revenue: 145000 },
    { month: "Mar", users: 11200, stores: 210, revenue: 178000 },
    { month: "Apr", users: 12800, stores: 245, revenue: 198000 },
    { month: "May", users: 14200, stores: 280, revenue: 215000 },
    { month: "Jun", users: 15420, stores: 324, revenue: 234567 }
  ];

  const storeStatusData = [
    { name: "Active", value: 280, color: "#22c55e" },
    { name: "Pending", value: 32, color: "#f97316" },
    { name: "Suspended", value: 8, color: "#ef4444" },
    { name: "Inactive", value: 4, color: "#6b7280" }
  ];

  const menuItems = [
    { icon: Users, label: "User Management", description: "Manage platform users", href: "/admin/users", count: stats.totalUsers },
    { icon: Store, label: "Shop Owners", description: "Manage shop owners & trials", href: "/admin/shop-owners", count: stats.totalStores },
    { icon: IdCard, label: "Shop Documents", description: "Govt IDs & logos", href: "/admin/shop-documents", count: 8 },
    { icon: Layers, label: "Category Management", description: "Manage A-Z categories", href: "/admin/categories", count: 55 },
    { icon: MessageSquare, label: "Review Management", description: "Manage shop reviews", href: "/admin/reviews", count: 5 },
    { icon: AlertCircleIcon, label: "Complaint Management", description: "Handle customer complaints", href: "/admin/complaints", count: 4 },
    { icon: Package, label: "Product Moderation", description: "Review flagged products", href: "/admin/products", count: 15 },
    { icon: ShoppingCart, label: "Order Management", description: "Manage all orders", href: "/admin/orders", count: stats.totalOrders },
    { icon: Truck, label: "Delivery Management", description: "Manage deliveries & logistics", href: "/admin/deliveries", count: 156 },
    { icon: UserCog, label: "Driver Management", description: "Manage delivery drivers", href: "/admin/drivers", count: 45 },
    { icon: Smartphone, label: "Shop Owner Payments", description: "Configure shop owner GCash", href: "/admin/shop-owner-payments", count: 12 },
    { icon: CreditCard, label: "Subscription Management", description: "Manage ₱200/month subscriptions", href: "/admin/subscriptions", count: stats.totalStores },
    { icon: Key, label: "Password Management", description: "Reset user passwords & unlock accounts", href: "/admin/password-management", count: 0 },
    { icon: PackageSearch, label: "Delivery Options", description: "Manage delivery couriers", href: "/admin/delivery-options", count: 7 },
    { icon: CreditCard, label: "Payment Gateways", description: "Configure payment methods", href: "/admin/payment-gateways", count: 4 },
    { icon: Wallet, label: "Withdrawals", description: "Process withdrawal requests", href: "/admin/withdrawals", count: 8 },
    { icon: DollarSign, label: "Currency Management", description: "Manage currencies", href: "/admin/currencies", count: 10 },
    { icon: Bell, label: "Notifications", description: "Platform alerts & updates", href: "/admin/notifications", count: 7 },
    { icon: TrendingUp, label: "Analytics", description: "Platform insights", href: "/admin/analytics" },
    { icon: Shield, label: "Security", description: "Platform security", href: "/admin/security" },
    { icon: Settings, label: "Settings", description: "System configuration", href: "/admin/settings" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "store": return <Store className="w-5 h-5" />;
      case "order": return <ShoppingCart className="w-5 h-5" />;
      case "user": return <Users className="w-5 h-5" />;
      case "product": return <Package className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-orange-100 text-orange-700";
      case "flagged": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <nav className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">i</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">ifudda</span>
                  <Badge className="ml-2 bg-red-500 text-white">Admin</Badge>
                </div>
              </Link>
            </div>
            
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/admin/notifications">
                  <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      7
                    </span>
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-medium cursor-pointer hover:ring-2 hover:ring-red-400 transition-all">
                    A
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-gray-300 hover:text-white">
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">ifudda platform overview and management</p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-red-100 mt-2">↑ 12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 mb-1">Active Stores</p>
                  <p className="text-3xl font-bold">{stats.totalStores}</p>
                  <p className="text-sm text-pink-100 mt-2">↑ 8% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Products</p>
                  <p className="text-3xl font-bold">{stats.totalProducts.toLocaleString()}</p>
                  <p className="text-sm text-purple-100 mt-2">↑ 15% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                  <p className="text-sm text-orange-100 mt-2">↑ 22% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Revenue</p>
                  <p className="text-3xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                  <p className="text-sm text-green-100 mt-2">↑ 18% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Platform Growth Chart */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Platform Growth</CardTitle>
              <CardDescription className="text-gray-400">Users, stores, and revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={platformGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#e5e7eb' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={2} name="Users" />
                  <Line type="monotone" dataKey="stores" stroke="#ec4899" strokeWidth={2} name="Stores" />
                  <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Store Status Distribution */}
          <Card className="border-0 shadow-lg bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Store Status</CardTitle>
              <CardDescription className="text-gray-400">Distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={storeStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => <span style={{ fill: '#e5e7eb' }}>{entry.name}</span>}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {storeStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#e5e7eb' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Admin Menu */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <Link 
                  key={item.label} 
                  to={item.href}
                  className="block group"
                  onClick={(e) => {
                    // Ensure navigation works even if Link fails
                    e.preventDefault();
                    window.location.href = item.href;
                  }}
                >
                  <Card className="group-hover:shadow-xl transition-all duration-300 border-0 bg-gray-900/50 backdrop-blur-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] touch-manipulation hover:border-red-500/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform touch-manipulation">
                            <item.icon className="w-6 h-6 text-white pointer-events-none" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white mb-1 group-hover:text-red-400 transition-colors pointer-events-none">{item.label}</h3>
                            <p className="text-sm text-gray-400 pointer-events-none">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {item.count !== undefined && (
                            <Badge className="bg-red-500/20 text-red-400 group-hover:bg-red-500/30 transition-colors pointer-events-none">
                              {item.count}
                            </Badge>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all pointer-events-none" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Latest platform events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 rounded-lg bg-gray-800/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{activity.message}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/admin/shop-owners?status=pending">
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-300 transition-colors">
                    <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
                    Review Pending Stores (32)
                  </Button>
                </Link>
                <Link to="/admin/products">
                  <Button variant="outline" className="w-full justify-start hover:bg-orange-50 hover:border-orange-300 transition-colors">
                    <Package className="mr-2 w-4 h-4 text-orange-600" />
                    Product Management
                  </Button>
                </Link>
                <Link to="/admin/security">
                  <Button variant="outline" className="w-full justify-start hover:bg-red-50 hover:border-red-300 transition-colors">
                    <AlertTriangle className="mr-2 w-4 h-4 text-red-600" />
                    Security Alerts (3)
                  </Button>
                </Link>
                <Link to="/admin/withdrawals?status=pending">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 transition-colors">
                    <Clock className="mr-2 w-4 h-4 text-blue-600" />
                    Pending Withdrawals (8)
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
