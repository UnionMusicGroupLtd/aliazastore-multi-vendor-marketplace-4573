import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, Package, CheckCircle, XCircle, Clock, 
  Truck, Eye, ArrowLeft, Search, Filter, Download, X, Box
} from "lucide-react";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Enhanced sample orders data with detailed items
  const orders = [
    {
      id: "ORD-2026-001",
      customer: "James Smith",
      email: "james.smith@email.com",
      phone: "+44 20 7123 4567",
      address: "123 Baker Street, London, UK",
      items: [
        { name: "Premium Wireless Headphones", quantity: 1, price: "£29.99" },
        { name: "Smart Fitness Watch", quantity: 1, price: "£39.99" },
        { name: "Portable Phone Charger", quantity: 1, price: "£19.99" }
      ],
      total: "£89.97",
      subtotal: "£89.97",
      shipping: "£4.99",
      status: "pending",
      date: "2026-08-07",
      time: "14:32",
      payment: "GCash",
      tracking: "GB-123456789",
      notes: "Customer requested gift wrapping"
    },
    {
      id: "ORD-2026-002", 
      customer: "Emma Johnson",
      email: "emma.j@email.com",
      phone: "+44 161 234 5678",
      address: "456 King Street, Manchester, UK",
      items: [
        { name: "Luxury Skincare Set", quantity: 1, price: "£45.00" }
      ],
      total: "£45.00",
      subtotal: "£45.00",
      shipping: "£0.00",
      status: "processing",
      date: "2026-08-07",
      time: "10:15",
      payment: "Card",
      tracking: "GB-987654321",
      notes: "Express delivery requested"
    },
    {
      id: "ORD-2026-003",
      customer: "Michael Brown",
      email: "m.brown@email.com",
      phone: "+44 131 345 6789",
      address: "789 Queen Street, Edinburgh, UK",
      items: [
        { name: "Professional Hair Dryer", quantity: 1, price: "£35.00" },
        { name: "Hair Styling Kit", quantity: 1, price: "£32.50" }
      ],
      total: "£67.50",
      subtotal: "£67.50",
      shipping: "£0.00",
      status: "shipped",
      date: "2026-08-06",
      time: "16:45",
      payment: "PayPal",
      tracking: "GB-456789123",
      notes: "Delivery to business address"
    }
  ];

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(orders.find(order => order.id === orderId));
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // In a real app, this would update the database
  };

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
                            <p className="text-white">{order.items?.length || 0} items</p>
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
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleViewDetails(order.id)}
                        >
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">Order Details - {selectedOrder.id}</CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      Placed on {selectedOrder.date} at {selectedOrder.time}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-green-400">{selectedOrder.total}</p>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Name</p>
                      <p className="text-white">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="text-white">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Address</p>
                      <p className="text-white">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-white font-semibold">{item.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">{selectedOrder.shipping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Total</span>
                      <span className="text-green-400 font-bold text-lg">{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Payment Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-400">Method</p>
                        <p className="text-white">{selectedOrder.payment}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Status</p>
                        <p className="text-green-400">Paid</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Shipping Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-400">Tracking Number</p>
                        <p className="text-white font-mono text-xs">{selectedOrder.tracking}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Delivery Type</p>
                        <p className="text-white">{selectedOrder.shipping === '£0.00' ? 'Free Shipping' : 'Standard Delivery'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Order Notes</h3>
                    <p className="text-gray-300 text-sm">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
                    Print Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;