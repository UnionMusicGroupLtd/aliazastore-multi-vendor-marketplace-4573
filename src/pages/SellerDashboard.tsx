import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, Package, ShoppingCart, Users, TrendingUp, DollarSign,
  Settings, Bell, MessageSquare, LogOut, Plus,
  ChevronRight, Eye, Star, Upload, Wallet, User, CreditCard,
  Clock, AlertCircle, Gift, Lock, XCircle, CheckCircle
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { checkSubscriptionStatus } from "@/lib/subscription-check";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import auth from "@/lib/shared/kliv-auth.js";
import db from "@/lib/shared/kliv-database.js";

const SellerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log("🔄 Loading seller dashboard data...");
      const currentUser = await auth.getUser();
      if (!currentUser) {
        console.log("❌ No user found, redirecting to login");
        window.location.href = "/login";
        return;
      }
      console.log("✅ User authenticated:", currentUser.email);
      setUser(currentUser);

      // Load seller's store
      const stores = await db.query("stores", {
        owner_uuid: `eq.${currentUser.userUuid}`
      });
      
      console.log("📦 Stores found:", stores.length);
      
      if (stores.length === 0) {
        console.log("⚠️ No store found for seller");
        setStore(null);
        setSubscriptionStatus({
          status: 'trial',
          canAddProducts: true,
          canReceiveOrders: true,
          storeVisible: true,
          showSubscribeNotice: true,
          icon: Gift,
          color: "bg-purple-100 text-purple-700",
          message: "Create your store to get started",
          actionText: "Create Store",
          daysRemaining: 14
        });
      } else {
        const storeData = stores[0];
        console.log("✅ Store loaded:", storeData.name);
        setStore(storeData);

        // Initialize trial if not set
        if (!storeData.trial_start_date && !storeData.subscription_start_date) {
          console.log("🎁 Initializing 14-day trial for store...");
          const now = new Date();
          const trialEnd = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
          
          await db.update("stores", { _row_id: `eq.${storeData._row_id}` }, {
            trial_start_date: now.toISOString(),
            trial_end_date: trialEnd.toISOString(),
            subscription_status: "trial",
            subscription_price: 200.00,
            subscription_plan: "basic"
          });
          
          storeData.trial_start_date = now.toISOString();
          storeData.trial_end_date = trialEnd.toISOString();
          storeData.subscription_status = "trial";
          storeData.subscription_price = 200.00;
          console.log("✅ Trial initialized:", trialEnd);
        }

        // Check subscription status
        console.log("🔍 Checking subscription status...");
        const status = checkSubscriptionStatus(storeData);
        console.log("📋 Subscription status:", status);
        setSubscriptionStatus(status);

        // Load store products only if subscription is active
        if (status.canAddProducts) {
          console.log("📦 Loading products...");
          const storeProducts = await db.query("products", {
            store_id: `eq.${storeData._row_id}`,
            order: "_created_at.desc",
            limit: "5"
          });
          console.log("✅ Products loaded:", storeProducts.length);
          setProducts(storeProducts);
        } else {
          console.log("🔒 Products locked - subscription not active");
          setProducts([]);
        }

        // Load store orders only if subscription is active
        if (status.canReceiveOrders) {
          console.log("📋 Loading orders...");
          const storeOrders = await db.query("orders", {
            store_id: `eq.${storeData._row_id}`,
            order: "_created_at.desc",
            limit: "5"
          });
          console.log("✅ Orders loaded:", storeOrders.length);
          setOrders(storeOrders);
        } else {
          console.log("🔒 Orders locked - subscription not active");
          setOrders([]);
        }
      }
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      console.error("Error details:", error.message, error.stack);
      // Set default values to prevent white screen
      setStore({
        name: "Error Loading Store",
        owner_govt_id_uploaded: 1,
        store_logo_uploaded: 1
      });
      setProducts([]);
      setOrders([]);
      setSubscriptionStatus({
        status: 'trial',
        canAddProducts: true,
        canReceiveOrders: true,
        storeVisible: true,
        showSubscribeNotice: true,
        icon: AlertCircle,
        color: "bg-red-100 text-red-700",
        message: "Error loading store data. Please refresh the page.",
        actionText: "Retry",
        daysRemaining: 0
      });
    } finally {
      console.log("✅ Dashboard data loading complete");
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
  const salesData = [
    { month: "Jan", sales: 4000, orders: 120 },
    { month: "Feb", sales: 5500, orders: 165 },
    { month: "Mar", sales: 7200, orders: 216 },
    { month: "Apr", sales: 6800, orders: 204 },
    { month: "May", sales: 8900, orders: 267 },
    { month: "Jun", sales: 10500, orders: 315 }
  ];

  const categoryData = [
    { name: "Electronics", value: 45, color: "#3b82f6" },
    { name: "Fashion", value: 30, color: "#f97316" },
    { name: "Home", value: 15, color: "#22c55e" },
    { name: "Others", value: 10, color: "#a855f7" }
  ];

  const menuItems = [
    { 
      icon: Package, 
      label: "Products", 
      description: subscriptionStatus?.canAddProducts ? "Manage your inventory" : "Upgrade to manage products", 
      count: products.length, 
      href: "/dashboard/seller/products",
      disabled: !subscriptionStatus?.canAddProducts,
      badge: !subscriptionStatus?.canAddProducts ? "Subscribe Required" : null
    },
    { 
      icon: ShoppingCart, 
      label: "Orders", 
      description: subscriptionStatus?.canReceiveOrders ? "Process customer orders" : "Upgrade to receive orders", 
      count: orders.length, 
      href: "/dashboard/seller/orders",
      disabled: !subscriptionStatus?.canReceiveOrders,
      badge: !subscriptionStatus?.canReceiveOrders ? "Subscribe Required" : null
    },
    { 
      icon: Users, 
      label: "Customers", 
      description: "View customer insights", 
      href: "/dashboard/seller/customers",
      disabled: false
    },
    { 
      icon: MessageSquare, 
      label: "Messages", 
      description: "Chat with customers", 
      count: 5, 
      href: "/dashboard/seller/messages",
      disabled: !subscriptionStatus?.storeVisible,
      badge: !subscriptionStatus?.storeVisible ? "Store Hidden" : null
    },
    { 
      icon: TrendingUp, 
      label: "Analytics", 
      description: "View performance metrics", 
      href: "/dashboard/seller/analytics",
      disabled: false
    },
    { 
      icon: DollarSign, 
      label: "Earnings", 
      description: "Manage your revenue", 
      href: "/dashboard/seller/earnings",
      disabled: false
    },
    { 
      icon: Wallet, 
      label: "Request Withdrawal", 
      description: "Withdraw your earnings", 
      count: 0, 
      href: "/dashboard/seller/withdrawal",
      disabled: false
    },
    { 
      icon: CreditCard, 
      label: "Subscription", 
      description: subscriptionStatus?.showSubscribeNotice ? "Subscribe now to continue" : "Manage ₱200/month subscription", 
      count: subscriptionStatus?.showSubscribeNotice ? 1 : 0, 
      href: "/dashboard/seller/subscription",
      disabled: false,
      urgent: subscriptionStatus?.showSubscribeNotice
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      description: "Stay updated", 
      count: 12, 
      href: "/dashboard/seller/notifications",
      disabled: false
    },
    { 
      icon: Settings, 
      label: "Settings", 
      description: "Store configuration", 
      href: "/dashboard/seller/settings",
      disabled: false
    },
    { 
      icon: User, 
      label: "My Profile", 
      description: "Manage your profile", 
      href: "/dashboard/seller/profile",
      disabled: false
    },
  ];

  console.log("🎨 SellerDashboard component rendering...");
console.log("👤 User state:", user);
console.log("🏪 Store state:", store);
console.log("⚡ Loading state:", loading);
console.log("📊 Subscription status:", subscriptionStatus);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">AliazaStore</span>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              {store && (
                <div className="flex items-center space-x-2">
                  <Store className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">{store.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/dashboard/seller/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>
              <Link to="/dashboard/seller/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </Button>
              </Link>
              <Link to="/dashboard/seller/settings">
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Seller Dashboard
              </h1>
              <p className="text-slate-600">Manage your store and track your performance</p>
            </div>
            <div className="flex space-x-2">
              {subscriptionStatus?.showSubscribeNotice && (
                <Link to="/dashboard/seller/subscription">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <AlertCircle className="mr-2 w-4 h-4" />
                    {subscriptionStatus.actionText}
                  </Button>
                </Link>
              )}
              {subscriptionStatus?.canAddProducts ? (
                <Link to="/dashboard/seller/products/new">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Product
                  </Button>
                </Link>
              ) : (
                <Button 
                  disabled 
                  className="bg-slate-300 cursor-not-allowed"
                  title={subscriptionStatus?.message}
                >
                  <Lock className="mr-2 w-4 h-4" />
                  Add Product
                </Button>
              )}
            </div>
          </div>

          {/* Subscription Status Banner */}
          {subscriptionStatus && (
            <Card className={`border-0 shadow-lg ${
              subscriptionStatus.status === "trial" ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" :
              subscriptionStatus.status === "active" ? "bg-gradient-to-r from-green-500 to-green-600 text-white" :
              "bg-gradient-to-r from-red-500 to-red-600 text-white"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {subscriptionStatus.icon && React.createElement(subscriptionStatus.icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{subscriptionStatus.message}</h3>
                      {!subscriptionStatus.canAddProducts && (
                        <p className="text-sm text-white/90 mt-1">
                          Product uploads and new orders are paused. Subscribe to continue.
                        </p>
                      )}
                      {!subscriptionStatus.storeVisible && (
                        <p className="text-sm text-white/90 mt-1">
                          Your store is currently hidden from customers.
                        </p>
                      )}
                    </div>
                  </div>
                  {subscriptionStatus.showSubscribeNotice && (
                    <Link to="/dashboard/seller/subscription">
                      <Button size="sm" className="bg-white text-red-600 hover:bg-white/90">
                        {subscriptionStatus.actionText}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">{formatPrice(12450)}</p>
                  <p className="text-sm text-blue-100 mt-2">↑ 23% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">324</p>
                  <p className="text-sm text-green-100 mt-2">↑ 18% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Products</p>
                  <p className="text-3xl font-bold">48</p>
                  <p className="text-sm text-purple-100 mt-2">12 active listings</p>
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
                  <p className="text-orange-100 mb-1">Store Rating</p>
                  <p className="text-3xl font-bold">4.8</p>
                  <p className="text-sm text-orange-100 mt-2">256 reviews</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly revenue and orders</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Product distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Menu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Documents Status Card */}
            {store && (store.owner_govt_id_uploaded === 0 || store.store_logo_uploaded === 0) && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Complete Your Documents</h3>
                        <p className="text-sm text-slate-600">
                          {store.owner_govt_id_uploaded === 0 && store.store_logo_uploaded === 0 
                            ? "Upload your government ID and store logo to complete your profile"
                            : store.owner_govt_id_uploaded === 0
                            ? "Upload your government ID to complete your verification"
                            : "Upload your store logo to complete your profile"}
                        </p>
                      </div>
                    </div>
                    <Link to="/dashboard/seller/documents">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Upload Documents
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.disabled ? (
                    <Card className="group border-2 border-red-200 bg-red-50/50 cursor-not-allowed opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Lock className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-1 flex items-center">
                                {item.label}
                                {item.badge && (
                                  <Badge className="ml-2 bg-red-100 text-red-700 text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-slate-600">{item.description}</p>
                              <p className="text-xs text-red-600 mt-2 font-medium">
                                {item.badge || "Feature locked - Subscribe to unlock"}
                              </p>
                            </div>
                          </div>
                          <Link to="/dashboard/seller/subscription">
                            <Button 
                              size="sm" 
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Subscribe
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Link key={item.label} to={item.href}>
                      <Card className={`group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer ${item.urgent ? 'ring-2 ring-orange-500' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className={`w-12 h-12 ${item.urgent ? 'bg-orange-100' : 'bg-gradient-to-br from-orange-500 to-orange-600'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <item.icon className={`w-6 h-6 ${item.urgent ? 'text-orange-600' : 'text-white'}`} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-1 flex items-center">
                                  {item.label}
                                  {item.urgent && (
                                    <Badge className="ml-2 bg-orange-100 text-orange-700 animate-pulse">
                                      Urgent
                                    </Badge>
                                  )}
                                </h3>
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
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.slice(0, 5).map((order: any) => (
                  <Link key={order._row_id} to={`/orders/${order._row_id}`}>
                    <div className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-slate-900">{order.order_number}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(order._created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={
                          order.status === "completed" ? "bg-green-100 text-green-700" :
                          order.status === "processing" ? "bg-orange-100 text-orange-700" :
                          "bg-blue-100 text-blue-700"
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total</span>
                        <span className="font-semibold text-orange-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link to="/dashboard/seller/orders">
                  <Button variant="outline" className="w-full">
                    View All Orders <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Top Products</CardTitle>
                <CardDescription>Best sellers this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.slice(0, 5).map((product: any) => (
                  <Link key={product._row_id} to={`/products/${product._row_id}`}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <img 
                        src={product.primary_image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{product.name}</p>
                        <p className="text-sm text-slate-600">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span>{product.views_count || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
