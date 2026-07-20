import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingUp, Package, Users, DollarSign, 
  ShoppingCart, Star, Eye, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

const SellerAnalytics = () => {
  // Sample analytics data
  const salesData = [
    { month: "Jan", sales: 45000, orders: 120, visitors: 1200 },
    { month: "Feb", sales: 52000, orders: 145, visitors: 1500 },
    { month: "Mar", sales: 48000, orders: 130, visitors: 1350 },
    { month: "Apr", sales: 61000, orders: 168, visitors: 1800 },
    { month: "May", sales: 55000, orders: 155, visitors: 1650 },
    { month: "Jun", sales: 72000, orders: 195, visitors: 2100 }
  ];

  const categoryData = [
    { name: "Electronics", value: 45, color: "#3b82f6" },
    { name: "Fashion", value: 30, color: "#f97316" },
    { name: "Home", value: 15, color: "#22c55e" },
    { name: "Beauty", value: 10, color: "#a855f7" }
  ];

  const topProducts = [
    { name: "Premium Wireless Headphones", views: 2450, sales: 145, conversion: 5.9 },
    { name: "Smart Fitness Watch", views: 1890, sales: 98, conversion: 5.2 },
    { name: "Designer Leather Bag", views: 1650, sales: 87, conversion: 5.3 },
    { name: "Organic Skincare Set", views: 1420, sales: 76, conversion: 5.4 },
    { name: "Bluetooth Earbuds", views: 1180, sales: 62, conversion: 5.3 }
  ];

  const metrics = [
    { label: "Total Revenue", value: "₱333,000", change: "+15.2%", trend: "up", icon: DollarSign, color: "text-green-600" },
    { label: "Total Orders", value: "913", change: "+12.8%", trend: "up", icon: ShoppingCart, color: "text-blue-600" },
    { label: "Store Visitors", value: "9,600", change: "+18.5%", trend: "up", icon: Users, color: "text-purple-600" },
    { label: "Conversion Rate", value: "9.5%", change: "+2.1%", trend: "up", icon: TrendingUp, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard/seller" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Seller Analytics</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Performance Analytics</h1>
          <p className="text-slate-600">Track your store's performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${metric.color}`}>
                    {metric.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span className="font-medium">{metric.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                  <p className="text-sm text-slate-600">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue & Orders</CardTitle>
              <CardDescription>Monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Product category performance</CardDescription>
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

        {/* Visitor Trends */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Visitor Trends</CardTitle>
            <CardDescription>Monthly store visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Products by views, sales, and conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <h4 className="font-medium text-slate-900">{product.name}</h4>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{product.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ShoppingCart className="w-3 h-3" />
                        <span>{product.sales} sales</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{product.conversion}%</div>
                    <div className="text-xs text-slate-500">conversion rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerAnalytics;
