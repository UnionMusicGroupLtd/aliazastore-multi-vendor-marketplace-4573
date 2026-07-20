import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ShoppingCart, ArrowLeft, Search, CheckCircle, Clock, XCircle, Package, Eye
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import db from "@/lib/shared/kliv-database.js";

const OrderManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await db.query("orders", { 
        order: "_created_at.desc",
        limit: "50"
      });
      
      setOrders(allOrders || []);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      setError("");
      await db.update("orders", { _row_id: `eq.${orderId}` }, {
        status: newStatus,
        updated_at: Math.floor(Date.now() / 1000)
      });
      
      setSuccess(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
    }
  };

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const filteredOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    return filtered;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return { label: "Pending", color: "bg-orange-100 text-orange-700" };
      case "processing": return { label: "Processing", color: "bg-blue-100 text-blue-700" };
      case "shipped": return { label: "Shipped", color: "bg-purple-100 text-purple-700" };
      case "delivered": return { label: "Delivered", color: "bg-green-100 text-green-700" };
      case "cancelled": return { label: "Cancelled", color: "bg-red-100 text-red-700" };
      default: return { label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid": return { label: "Paid", color: "bg-green-100 text-green-700" };
      case "pending": return { label: "Pending", color: "bg-orange-100 text-orange-700" };
      case "failed": return { label: "Failed", color: "bg-red-100 text-red-700" };
      default: return { label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/admin" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Order Management</span>
                <p className="text-sm text-slate-600">Manage and track all platform orders</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Pending</p>
                  <p className="text-3xl font-bold">{orders.filter(o => o.status === "pending").length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Delivered</p>
                  <p className="text-3xl font-bold">{orders.filter(o => o.status === "delivered").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 mb-1">Cancelled</p>
                  <p className="text-3xl font-bold">{orders.filter(o => o.status === "cancelled").length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Track and manage platform orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-900">Order ID</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Customer</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Store</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Total</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Payment</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Date</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders().map((order) => {
                    const statusBadge = getStatusBadge(order.status);
                    const paymentBadge = getPaymentBadge(order.payment_status);
                    return (
                      <tr key={order._row_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <ShoppingCart className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{order.order_id?.substring(0, 12)}...</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{order.customer_email?.substring(0, 20)}...</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{order.store_id}</td>
                        <td className="p-4 font-semibold">₱{order.total_amount?.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={paymentBadge.color}>{paymentBadge.label}</Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {order._created_at ? new Date(order._created_at * 1000).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openOrderModal(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order._row_id, "processing")}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Package className="w-4 h-4 mr-1" />
                                Process
                              </Button>
                            )}
                            {order.status === "processing" && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order._row_id, "shipped")}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Package className="w-4 h-4 mr-1" />
                                Ship
                              </Button>
                            )}
                            {order.status === "shipped" && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order._row_id, "delivered")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Deliver
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order View Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-600">Order ID:</span>
                    <p className="font-medium">{selectedOrder.order_id?.substring(0, 20)}...</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Status:</span>
                    <Badge className={getStatusBadge(selectedOrder.status).color}>{getStatusBadge(selectedOrder.status).label}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Customer Email:</span>
                    <p className="font-medium">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Store ID:</span>
                    <p className="font-medium">{selectedOrder.store_id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Total Amount:</span>
                    <p className="font-medium text-lg">₱{selectedOrder.total_amount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Payment Status:</span>
                    <Badge className={getPaymentBadge(selectedOrder.payment_status).color}>{getPaymentBadge(selectedOrder.payment_status).label}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Created:</span>
                    <p className="font-medium">{selectedOrder._created_at ? new Date(selectedOrder._created_at * 1000).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Updated:</span>
                    <p className="font-medium">{selectedOrder.updated_at ? new Date(selectedOrder.updated_at * 1000).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Order Notes</h4>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowOrderModal(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder._row_id, "processing");
                    setShowOrderModal(false);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                  disabled={selectedOrder.status !== "pending"}
                >
                  Process Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;