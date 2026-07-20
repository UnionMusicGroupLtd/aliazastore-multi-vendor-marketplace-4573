import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, TrendingUp, Users, ShoppingCart, DollarSign, 
  Store, Package, BarChart3, Download
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const revenueData = [
    { month: "Jan", revenue: 120000, orders: 450, users: 800 },
    { month: "Feb", revenue: 145000, orders: 520, users: 950 },
    { month: "Mar", revenue: 178000, orders: 680, users: 1120 },
    { month: "Apr", revenue: 198000, orders: 750, users: 1280 },
    { month: "May", revenue: 215000, orders: 820, users: 1420 },
    { month: "Jun", revenue: 234567, orders: 893, users: 1542 }
  ];

  const categoryData = [
    { name: "Electronics", value: 35, color: "#3b82f6" },
    { name: "Fashion", value: 28, color: "#f97316" },
    { name: "Home & Living", value: 18, color: "#22c55e" },
    { name: "Beauty", value: 12, color: "#ec4899" },
    { name: "Sports", value: 7, color: "#8b5cf6" }
  ];

  const storePerformanceData = [
    { name: "Store A", sales: 45000, orders: 234, rating: 4.8 },
    { name: "Store B", sales: 38000, orders: 189, rating: 4.6 },
    { name: "Store C", sales: 32000, orders: 156, rating: 4.7 },
    { name: "Store D", sales: 28000, orders: 143, rating: 4.5 },
    { name: "Store E", sales: 22000, orders: 112, rating: 4.4 }
  ];

  const userGrowthData = [
    { day: "Mon", newUsers: 45, activeUsers: 1200 },
    { day: "Tue", newUsers: 52, activeUsers: 1350 },
    { day: "Wed", newUsers: 38, activeUsers: 1180 },
    { day: "Thu", newUsers: 65, activeUsers: 1420 },
    { day: "Fri", newUsers: 71, activeUsers: 1680 },
    { day: "Sat", newUsers: 48, activeUsers: 1890 },
    { day: "Sun", newUsers: 42, activeUsers: 2100 }
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: 234, revenue: 117000, store: "ElectroHub" },
    { name: "Smart Watch Pro", sales: 189, revenue: 94500, store: "TechZone" },
    { name: "Designer Handbag", sales: 156, revenue: 78000, store: "FashionForward" },
    { name: "Running Shoes", sales: 143, revenue: 71500, store: "SportsElite" },
    { name: "Organic Skincare Set", sales: 112, revenue: 56000, store: "BeautyNatural" }
  ];

  const keyMetrics = {
    totalRevenue: 234567,
    totalOrders: 8934,
    totalUsers: 15420,
    totalStores: 324,
    averageOrderValue: 26.24,
    conversionRate: 3.8,
    revenueGrowth: 18.2,
    userGrowth: 12.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard/admin" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Analytics Dashboard</span>
                  <p className="text-sm text-slate-600">Platform insights and performance metrics</p>
                </div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600">
              <Download className="mr-2 w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">₱{keyMetrics.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-blue-100 mt-2">↑ {keyMetrics.revenueGrowth}% from last month</p>
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
                  <p className="text-3xl font-bold">{keyMetrics.totalOrders.toLocaleString()}</p>
                  <p className="text-sm text-green-100 mt-2">↑ 22% from last month</p>
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
                  <p className="text-purple-100 mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{keyMetrics.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-purple-100 mt-2">↑ {keyMetrics.userGrowth}% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Active Stores</p>
                  <p className="text-3xl font-bold">{keyMetrics.totalStores}</p>
                  <p className="text-sm text-orange-100 mt-2">↑ 8% from last month</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 mb-1">Avg. Order Value</p>
                  <p className="text-2xl font-bold">₱{keyMetrics.averageOrderValue.toFixed(2)}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold">{keyMetrics.conversionRate}%</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 mb-1">Products Sold</p>
                  <p className="text-2xl font-bold">45.6K</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 mb-1">Active Sellers</p>
                  <p className="text-2xl font-bold">287</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue and order growth</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Product category distribution</CardDescription>
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

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Store Performance */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Store Performance</CardTitle>
              <CardDescription>Top performing stores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={storePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                  <Bar dataKey="orders" fill="#22c55e" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Daily user acquisition and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="newUsers" stroke="#f97316" strokeWidth={2} name="New Users" />
                  <Line type="monotone" dataKey="activeUsers" stroke="#8b5cf6" strokeWidth={2} name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-900">Product</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Store</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Sales</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{product.store}</td>
                      <td className="p-4 font-semibold">{product.sales}</td>
                      <td className="p-4 font-semibold text-green-600">₱{product.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;