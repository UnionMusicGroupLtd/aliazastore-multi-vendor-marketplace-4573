import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, Search, Package, ShoppingCart, 
  DollarSign, Star, MessageSquare, Check, Trash2
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import db from "@/lib/shared/kliv-database.js";
import auth from "@/lib/shared/kliv-auth.js";

const SellerNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Icon mapping helper
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      ShoppingCart,
      Package,
      Star,
      DollarSign,
      MessageSquare,
      Bell
    };
    const IconComponent = icons[iconName] || Bell;
    return <IconComponent className={`w-6 h-6 text-slate-700`} />;
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      const user = await auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const loadNotifications = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userNotifications = await db.query("seller_notifications", {
        seller_uuid: `eq.${currentUser.userUuid}`,
        status: "eq.active",
        order: "_created_at.desc"
      });
      
      // If no notifications exist, create sample ones for this user
      if (userNotifications.length === 0) {
        await createSampleNotifications();
        // Reload after creating samples
        const reloaded = await db.query("seller_notifications", {
          seller_uuid: `eq.${currentUser.userUuid}`,
          status: "eq.active",
          order: "_created_at.desc"
        });
        setNotifications(reloaded);
      } else {
        setNotifications(userNotifications);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      // If database fails, show empty state
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const createSampleNotifications = async () => {
    if (!currentUser) return;

    const iconMap: { [key: string]: any } = {
      ShoppingCart,
      Package,
      Star,
      DollarSign,
      MessageSquare
    };

    const sampleNotifications = [
      {
        seller_uuid: currentUser.userUuid,
        type: "order",
        title: "New Order Received",
        message: "You received a new order #12348 for Premium Wireless Headphones",
        unread: 1,
        icon: "ShoppingCart",
        color: "text-green-600",
        bg_color: "bg-green-100"
      },
      {
        seller_uuid: currentUser.userUuid,
        type: "product",
        title: "Product Approved",
        message: "Your product 'Bluetooth Earbuds' has been approved",
        unread: 1,
        icon: "Package",
        color: "text-blue-600",
        bg_color: "bg-blue-100"
      },
      {
        seller_uuid: currentUser.userUuid,
        type: "review",
        title: "New Review",
        message: "Maria Garcia left a 5-star review on Premium Wireless Headphones",
        unread: 1,
        icon: "Star",
        color: "text-yellow-600",
        bg_color: "bg-yellow-100"
      },
      {
        seller_uuid: currentUser.userUuid,
        type: "payment",
        title: "Payment Received",
        message: `You received ₱129.99 from order #12345`,
        unread: 0,
        icon: "DollarSign",
        color: "text-purple-600",
        bg_color: "bg-purple-100"
      },
      {
        seller_uuid: currentUser.userUuid,
        type: "message",
        title: "New Customer Message",
        message: "Jose Santos sent you a message about Smart Fitness Watch",
        unread: 0,
        icon: "MessageSquare",
        color: "text-orange-600",
        bg_color: "bg-orange-100"
      },
      {
        seller_uuid: currentUser.userUuid,
        type: "product",
        title: "Low Stock Alert",
        message: "Premium Wireless Headphones is running low on stock (3 units left)",
        unread: 0,
        icon: "Package",
        color: "text-red-600",
        bg_color: "bg-red-100"
      },
      {
        seller_uuid: currentUser.userUuid,
        type: "system",
        title: "Store Performance Update",
        message: "Your store rating increased to 4.8 stars this month",
        unread: 0,
        icon: "Star",
        color: "text-green-600",
        bg_color: "bg-green-100"
      }
    ];

    // Insert sample notifications in reverse order so newest appears first
    for (let i = sampleNotifications.length - 1; i >= 0; i--) {
      await db.insert("seller_notifications", sampleNotifications[i]);
    }
  };

  const markAsRead = async (id: number) => {
    if (!currentUser) return;

    try {
      // Update database to mark as read
      await db.update(
        "seller_notifications",
        { _row_id: `eq.${id}` },
        {
          unread: 0,
          read_at: Math.floor(Date.now() / 1000)
        }
      );

      // Update local state
      setNotifications(notifications.map(n => 
        n._row_id === id ? { ...n, unread: false } : n
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser || notifications.length === 0) return;

    try {
      // Get all unread notification IDs
      const unreadIds = notifications
        .filter(n => n.unread)
        .map(n => n._row_id);

      // Update all unread notifications in database
      for (const id of unreadIds) {
        await db.update(
          "seller_notifications",
          { _row_id: `eq.${id}` },
          {
            unread: 0,
            read_at: Math.floor(Date.now() / 1000)
          }
        );
      }

      // Update local state
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    if (!currentUser) return;

    try {
      // Delete from database (soft delete by updating status)
      await db.update(
        "seller_notifications",
        { _row_id: `eq.${id}` },
        { status: "deleted" }
      );

      // Update local state
      setNotifications(notifications.filter(n => n._row_id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
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
                key={notification._row_id} 
                className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm ${notification.unread ? 'border-l-4 border-l-orange-500' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${notification.bg_color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        {getIconComponent(notification.icon)}
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
                          {notification._created_at ? new Date(notification._created_at * 1000).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.unread && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => markAsRead(notification._row_id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteNotification(notification._row_id)}
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
