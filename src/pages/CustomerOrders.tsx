import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft, Package, CheckCircle, Clock, Truck, XCircle, Eye, ShoppingCart, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CustomerOrders = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showTemporaryMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleViewDetails = (orderId: number) => {
    // Toggle expanded state for this order
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const handleBuyAgain = async (order: any) => {
    try {
      // Add all items from the order back to the cart
      let addedCount = 0;
      for (const item of order.items) {
        await addToCart({
          _row_id: Date.now() + Math.random(), // Generate temporary ID
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          primary_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // Default image
          store_name: 'Various Sellers',
          category: 'Various'
        });
        addedCount += item.quantity;
      }
      
      showTemporaryMessage(`Added ${addedCount} items from order ${order.order_number} to cart!`, 'success');
      
      // Navigate to cart after a short delay
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding items to cart:', error);
      showTemporaryMessage('Failed to add items to cart. Please try again.', 'error');
    }
  };

  const handleCancelOrder = (orderNumber: string) => {
    // In a real app, this would call an API to cancel the order
    showTemporaryMessage(`Order ${orderNumber} cancellation requested. You'll receive confirmation shortly.`, 'success');
  };

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
      {/* Temporary Message */}
      {message && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert className={message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}>
            <AlertDescription>
              {message.text}
            </AlertDescription>
          </Alert>
        </div>
      )}

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
                
                {/* Order Details Expansion */}
                {expandedOrder === order._row_id && (
                  <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Order Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Order Number:</span>
                        <span className="font-medium">{order.order_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Order Date:</span>
                        <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Order Status:</span>
                        <span className={`font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Payment Method:</span>
                        <span className="font-medium">GCash</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <div className="font-medium mb-1">Items Ordered:</div>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-xs text-slate-600">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold pt-2 mt-2 border-t border-slate-200">
                        <span>Total Paid:</span>
                        <span className="text-orange-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-lg text-orange-600">{formatPrice(order.total)}</span>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(order._row_id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    {expandedOrder === order._row_id ? 'Hide Details' : 'View Details'}
                  </Button>
                  
                  {order.status === "delivered" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleBuyAgain(order)}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Again
                    </Button>
                  )}
                  
                  {order.status === "processing" && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelOrder(order.order_number)}
                    >
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