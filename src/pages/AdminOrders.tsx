import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, Package, CheckCircle, XCircle, Clock, 
  Truck, Eye, ArrowLeft, Search, Filter, Download
} from "lucide-react";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample orders data
  const orders = [
    {
      id: "ORD-2026-001",
      customer: "James Smith",
      email: "james.smith@email.com",
      items: 3,
      total: "£89.97",
      status: "pending",
      date: "2026-08-07",
      payment: "GCash"
    },
    {
      id: "ORD-2026-002", 
      customer: "Emma Johnson",
      email: "emma.j@email.com",
      items: 1,
      total: "£45.00",
      status: "processing",
      date: "2026-08-07",
      payment: "Card"
    },
    {
      id: "ORD-2026-003",
      customer: "Michael Brown",
      email: "m.brown@email.com",
      items: 2,
      total: "£67.50",
      status: "shipped",
      date: "2026-08-06",
      payment: "PayPal"
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-800", label: "Pending" },
      processing: { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-800", label: "Processing" },
      shipped: { bg: "bg-purple-900/30", text: "text-purple-400", border: "border-purple-800", label: "Shipped" },
      delivered: { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-800", label: "Delivered" },
      cancelled: { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-800", label: "Cancelled" }
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} ${badge.border} border`}>
        {badge.label}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <nav className="bg-black/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
              </Link>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-red-500" />
                <h1 className="text-xl font-bold text-white">Order Management</h1>
              </div>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Processing</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Shipped</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <Truck className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">£202.47</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer, email..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Download className="mr-2 w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Orders</CardTitle>
            <CardDescription className="text-gray-400">
              Manage and track all customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <div key={order.id} className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusIcon className="w-5 h-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-white">{order.id}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-400">Customer</p>
                            <p className="text-white font-medium">{order.customer}</p>
                            <p className="text-gray-500 text-xs">{order.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Order Details</p>
                            <p className="text-white">{order.items} items</p>
                            <p className="text-green-400 font-semibold">{order.total}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Payment & Date</p>
                            <p className="text-white">{order.payment}</p>
                            <p className="text-gray-500 text-xs">{order.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          <Eye className="mr-2 w-4 h-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;