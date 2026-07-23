import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft, Bell, CheckCircle, Clock, Trash2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import auth from "@/lib/shared/kliv-auth.js";
import db from "@/lib/shared/kliv-database.js";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Get current user
      const currentUser = await auth.getUser();
      if (!currentUser) {
        console.log("No authenticated user found");
        setLoading(false);
        return;
      }
      setUser(currentUser);
      console.log("Loading notifications for user:", currentUser.userUuid);

      // Load customer notifications
      const customerNotifications = await db.query("customer_notifications", {
        customer_uuid: `eq.${currentUser.userUuid}`,
        order: "_created_at.desc"
      });

      console.log("Loaded notifications:", customerNotifications);

      // If no notifications exist, create sample ones
      if (customerNotifications.length === 0) {
        console.log("No notifications found, creating sample ones");
        await createSampleNotifications(currentUser.userUuid);
        // Reload after creating samples
        setTimeout(() => loadNotifications(), 500);
      } else {
        setNotifications(customerNotifications);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleNotifications = async (customerUuid: string) => {
    try {
      const sampleNotifications = [
        {
          customer_uuid: customerUuid,
          title: "Order Delivered!",
          message: "Your order ORD-2026-001234 has been delivered successfully.",
          type: "success",
          read: false
        },
        {
          customer_uuid: customerUuid,
          title: "Payment Confirmed",
          message: "Your payment for order ORD-2026-001235 has been confirmed.",
          type: "success",
          read: false
        },
        {
          customer_uuid: customerUuid,
          title: "Flash Sale - 50% Off!",
          message: "Limited time offer on electronics. Shop now and save big!",
          type: "promo",
          read: true
        },
        {
          customer_uuid: customerUuid,
          title: "Wishlist Price Drop",
          message: "An item in your wishlist just dropped in price!",
          type: "warning",
          read: false
        }
      ];

      for (const notification of sampleNotifications) {
        await db.insert("customer_notifications", notification);
      }
      console.log("Sample notifications created");
    } catch (error) {
      console.error("Error creating sample notifications:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await db.update("customer_notifications", { _row_id: `eq.${notificationId}` }, { read: true });
      // Update local state
      setNotifications(prev => 
        prev.map(n => n._row_id === notificationId ? { ...n, read: true } : n)
      );
      console.log("Notification marked as read:", notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      for (const notification of unreadNotifications) {
        await db.update("customer_notifications", { _row_id: `eq.${notification._row_id}` }, { read: true });
      }
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      console.log("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      await db.delete("customer_notifications", { _row_id: `eq.${notificationId}` });
      // Update local state
      setNotifications(prev => 
        prev.filter(n => n._row_id !== notificationId)
      );
      console.log("Notification deleted:", notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning": return <Clock className="w-5 h-5 text-orange-600" />;
      case "promo": return <Bell className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "border-green-200 bg-green-50";
      case "warning": return "border-orange-200 bg-orange-50";
      case "promo": return "border-purple-200 bg-purple-50";
      default: return "border-slate-200 bg-slate-50";
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
            <p className="text-slate-600">Stay updated with your account activity</p>
          </div>
          {notifications.some(n => !n.read) && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Notifications Yet</h3>
              <p className="text-slate-500">You're all caught up! We'll notify you when there's something new.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification._row_id} 
                className={`border ${getNotificationColor(notification.type)} ${!notification.read ? 'shadow-lg' : 'opacity-75'}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-slate-600">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(notification._created_at * 1000).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markAsRead(notification._row_id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteNotification(notification._row_id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;