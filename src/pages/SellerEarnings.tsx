import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, TrendingUp, Wallet, Calendar,
  Download, ChevronRight, CheckCircle, Clock
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const SellerEarnings = () => {
  // Sample earnings data
  const earningsData = [
    { month: "Jan", revenue: 45000, commission: 0, net: 45000 },
    { month: "Feb", revenue: 52000, commission: 0, net: 52000 },
    { month: "Mar", revenue: 48000, commission: 0, net: 48000 },
    { month: "Apr", revenue: 61000, commission: 0, net: 61000 },
    { month: "May", revenue: 55000, commission: 0, net: 55000 },
    { month: "Jun", revenue: 72000, commission: 0, net: 72000 }
  ];

  const sourceData = [
    { name: "Product Sales", value: 85, color: "#3b82f6" },
    { name: "Shipping", value: 10, color: "#22c55e" },
    { name: "Other", value: 5, color: "#a855f7" }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "sale",
      description: "Order #12345 - Premium Wireless Headphones",
      amount: 129.99,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: 2,
      type: "sale",
      description: "Order #12346 - Smart Fitness Watch",
      amount: 89.99,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    },
    {
      id: 3,
      type: "withdrawal",
      description: "Withdrawal Request",
      amount: -5000,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "processing"
    },
    {
      id: 4,
      type: "sale",
      description: "Order #12347 - Designer Leather Bag",
      amount: 249.99,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed"
    }
  ];

  const stats = [
    { label: "Total Revenue", value: "₱333,000", description: "Lifetime earnings", icon: DollarSign, color: "from-blue-500 to-blue-600" },
    { label: "Available Balance", value: "₱28,450", description: "Ready for withdrawal", icon: Wallet, color: "from-green-500 to-green-600" },
    { label: "Pending Clearance", value: "₱15,200", description: "Processing transactions", icon: Clock, color: "from-orange-500 to-orange-600" },
    { label: "Total Withdrawn", value: "₱289,350", description: "Withdrawn to date", icon: TrendingUp, color: "from-purple-500 to-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard/seller" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Seller Earnings</span>
            </Link>
            <Link to="/dashboard/seller/withdrawal">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                Request Withdrawal
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Earnings Overview</h1>
          <p className="text-slate-600">Track your revenue and manage withdrawals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Earnings Chart */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly earnings overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="net" stroke="#22c55e" strokeWidth={2} name="Net Earnings" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Sources */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue Sources</CardTitle>
              <CardDescription>Earnings by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest earnings and withdrawals</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'sale' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {transaction.type === 'sale' ? (
                        <DollarSign className="w-5 h-5 text-green-600" />
                      ) : (
                        <Wallet className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{transaction.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatPrice(Math.abs(transaction.amount))}
                    </p>
                    <Badge className={
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-2xl">
          <CardContent className="p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to withdraw your earnings?</h3>
                <p className="text-white/90">Your available balance is ready for withdrawal</p>
              </div>
              <Link to="/dashboard/seller/withdrawal">
                <Button className="bg-white text-orange-600 hover:bg-white/90">
                  Request Withdrawal
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerEarnings;
