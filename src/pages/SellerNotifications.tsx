import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, Search, Package, ShoppingCart, 
  DollarSign, Star, MessageSquare, Check, Trash2, ChevronRight
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

const SellerNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Simulated notifications data
      const simulatedNotifications = [
        {
          id: 1,
          type: "order",
          title: "New Order Received",
          message: "You received a new order #12348 for Premium Wireless Headphones",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          unread: true,
          icon: ShoppingCart,
          color: "text-green-600",
          bgColor: "bg-green-100"
        },
        {
          id: 2,
          type: "product",
          title: "Product Approved",
          message: "Your product 'Bluetooth Earbuds' has been approved",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          unread: true,
          icon: Package,
          color: "text-blue-600",
          bgColor: "bg-blue-100"
        },
        {
          id: 3,
          type: "review",
          title: "New Review",
          message: "Maria Garcia left a 5-star review on Premium Wireless Headphones",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          unread: true,
          icon: Star,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100"
        },
        {
          id: 4,
          type: "payment",
          title: "Payment Received",
          message: `You received ₱129.99 from order #12345`,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          unread: false,
          icon: DollarSign,
          color: "text-purple-600",
          bgColor: "bg-purple-100"
        },
        {
          id: 5,
          type: "message",
          title: "New Customer Message",
          message: "Jose Santos sent you a message about Smart Fitness Watch",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          unread: false,
          icon: MessageSquare,
          color: "text-orange-600",
          bgColor: "bg-orange-100"
        },
        {
          id: 6,
          type: "product",
          title: "Low Stock Alert",
          message: "Premium Wireless Headphones is running low on stock (3 units left)",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          unread: false,
          icon: Package,
          color: "text-red-600",
          bgColor: "bg-red-100"
        },
        {
          id: 7,
          type: "system",
          title: "Store Performance Update",
          message: "Your store rating increased to 4.8 stars this month",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          unread: false,
          icon: Star,
          color: "text-green-600",
          bgColor: "bg-green-100"
        }
      ];
      setNotifications(simulatedNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => 
    notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading notifications...</p>
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
            <Link to="/dashboard/seller" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Seller Notifications</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Badge className="bg-orange-500 text-white">
                {notifications.filter(n => n.unread).length} unread
              </Badge>
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-600">{notifications.length} total notifications</p>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search notifications..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No notifications found</h2>
              <p className="text-slate-600">
                {searchQuery ? "Try adjusting your search" : "No notifications yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm ${notification.unread ? 'border-l-4 border-l-orange-500' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${notification.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <notification.icon className={`w-6 h-6 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                          {notification.unread && (
                            <Badge className="bg-orange-100 text-orange-700">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.unread && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerNotifications;
