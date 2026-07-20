import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft, Bell, CheckCircle, Clock } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      _row_id: 1,
      title: "Order Delivered!",
      message: "Your order ORD-2025-001234 has been delivered successfully.",
      type: "success",
      created_at: Date.now() - 3600000,
      read: false
    },
    {
      _row_id: 2,
      title: "Payment Confirmed",
      message: "Your payment for order ORD-2025-001235 has been confirmed.",
      type: "success",
      created_at: Date.now() - 86400000,
      read: true
    },
    {
      _row_id: 3,
      title: "Flash Sale - 50% Off!",
      message: "Limited time offer on electronics. Shop now and save big!",
      type: "promo",
      created_at: Date.now() - 172800000,
      read: true
    }
  ];

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
          <Button variant="outline">
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
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
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;