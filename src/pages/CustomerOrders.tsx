import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft, Package, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/currency";

const CustomerOrders = () => {
  const navigate = useNavigate();

  const orders = [
    {
      _row_id: 1,
      order_number: "ORD-2025-001234",
      status: "delivered",
      total: 299.97,
      created_at: Date.now() - 86400000 * 2,
      items_count: 3,
      items: [
        { name: "Premium Wireless Headphones", quantity: 1, price: 129.99 },
        { name: "Smart Fitness Watch", quantity: 1, price: 89.99 },
        { name: "USB-C Cable", quantity: 1, price: 79.99 }
      ]
    },
    {
      _row_id: 2,
      order_number: "ORD-2025-001233",
      status: "shipped",
      total: 129.99,
      created_at: Date.now() - 86400000 * 5,
      items_count: 1,
      items: [
        { name: "Designer Leather Bag", quantity: 1, price: 129.99 }
      ]
    },
    {
      _row_id: 3,
      order_number: "ORD-2025-001232",
      status: "processing",
      total: 79.99,
      created_at: Date.now() - 86400000 * 7,
      items_count: 2,
      items: [
        { name: "Screen Protector", quantity: 2, price: 39.99 }
      ]
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
      case "cancelled": return <XCircle className="w-4 h-4" />;
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
            
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/customer")}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Orders</h1>
          <p className="text-slate-600">Track and manage your orders</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._row_id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{order.order_number}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleDateString()} • {order.items_count} items
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-lg text-orange-600">{formatPrice(order.total)}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {order.status === "delivered" && (
                    <Button variant="outline" size="sm">
                      Buy Again
                    </Button>
                  )}
                  {order.status === "processing" && (
                    <Button variant="destructive" size="sm">
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;