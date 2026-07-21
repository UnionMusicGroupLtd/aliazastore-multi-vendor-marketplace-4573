import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowLeft, Bell, CheckCircle, Clock, AlertTriangle, Store, Users, Package } from "lucide-react";

const AdminNotifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      _row_id: 1,
      title: "New Store Approval Request",
      message: "Sam Diaz Electronics has submitted a store application and requires approval.",
      type: "store",
      created_at: Date.now() - 3600000,
      read: false
    },
    {
      _row_id: 2,
      title: "Security Alert",
      message: "Unusual login activity detected from IP 192.168.1.100. Multiple failed login attempts.",
      type: "security",
      created_at: Date.now() - 7200000,
      read: false
    },
    {
      _row_id: 3,
      title: "Product Flagged for Review",
      message: "5 products have been flagged by customers and require moderation review.",
      type: "warning",
      created_at: Date.now() - 86400000,
      read: true
    },
    {
      _row_id: 4,
      title: "Withdrawal Request",
      message: "3 new withdrawal requests pending approval totaling ₱15,000.",
      type: "finance",
      created_at: Date.now() - 172800000,
      read: true
    },
    {
      _row_id: 5,
      title: "System Update Complete",
      message: "Platform has been successfully updated to version 2.5.1 with new features.",
      type: "success",
      created_at: Date.now() - 259200000,
      read: true
    },
    {
      _row_id: 6,
      title: "User Growth Milestone",
      message: "Congratulations! Platform has reached 15,000+ active users.",
      type: "success",
      created_at: Date.now() - 345600000,
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "store": return <Store className="w-5 h-5 text-blue-600" />;
      case "security": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning": return <Clock className="w-5 h-5 text-orange-600" />;
      case "finance": return <Shield className="w-5 h-5 text-green-600" />;
      case "success": return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "store": return "border-blue-200 bg-blue-50";
      case "security": return "border-red-200 bg-red-50";
      case "warning": return "border-orange-200 bg-orange-50";
      case "finance": return "border-green-200 bg-green-50";
      case "success": return "border-green-200 bg-green-50";
      default: return "border-slate-200 bg-slate-50";
    }
  };

  const getNotificationType = (type: string) => {
    switch (type) {
      case "store": return "Store Request";
      case "security": return "Security Alert";
      case "warning": return "Review Needed";
      case "finance": return "Withdrawal";
      case "success": return "System Update";
      default: return "Notification";
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">AliazaStore</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Admin</span>
              </div>
            </Link>
            
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin")}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Notifications</h1>
            <p className="text-slate-600">Platform alerts and important updates</p>
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
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {getNotificationType(notification.type)}
                        </span>
                      </div>
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

export default AdminNotifications;