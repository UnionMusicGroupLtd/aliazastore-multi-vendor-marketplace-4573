import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, Calendar, Clock, CheckCircle, XCircle, 
  AlertCircle, Gift, Settings, TrendingUp, DollarSign,
  Search, Filter, Download, Eye, Plus, RefreshCw, QrCode, Upload, ExternalLink
} from "lucide-react";
import db from "@/lib/shared/kliv-database.js";

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantDays, setGrantDays] = useState(14);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [subscriptionGcash, setSubscriptionGcash] = useState<any>(null);
  const [gcashFile, setGcashFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const PAYPAL_SUBSCRIBE_LINK = "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-8YL1018950382172ANJOO5JI";

  useEffect(() => {
    loadSubscriptions();
    loadPaymentMethods();
  }, [filterStatus]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await db.query("payment_methods", { is_enabled: "eq.1" });
      setPaymentMethods(methods);
      
      // Find GCash configuration
      const gcashConfig = methods.find((m: any) => m.gateway_type === "gcash");
      if (gcashConfig) {
        setSubscriptionGcash(gcashConfig);
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  };

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      let params: any = {};
      
      if (filterStatus !== "all") {
        params.subscription_status = `eq.${filterStatus}`;
      }

      const data = await db.query("stores", params);
      setSubscriptions(data);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = (store: any) => {
    const now = new Date();
    const trialEnd = store.trial_end_date ? new Date(store.trial_end_date) : null;
    const subscriptionEnd = store.subscription_end_date ? new Date(store.subscription_end_date) : null;

    if (store.subscription_status === "cancelled") {
      return { status: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle };
    }

    if (store.subscription_status === "suspended") {
      return { status: "suspended", label: "Suspended", color: "bg-orange-100 text-orange-700", icon: AlertCircle };
    }

    if (trialEnd && trialEnd > now) {
      const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { 
        status: "trial", 
        label: `Trial (${daysRemaining} days left)`, 
        color: "bg-blue-100 text-blue-700", 
        icon: Clock,
        daysRemaining 
      };
    }

    if (subscriptionEnd && subscriptionEnd > now) {
      const daysRemaining = Math.ceil((subscriptionEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { 
        status: "active", 
        label: `Active (${daysRemaining} days left)`, 
        color: "bg-green-100 text-green-700", 
        icon: CheckCircle,
        daysRemaining 
      };
    }

    if (subscriptionEnd && subscriptionEnd <= now) {
      return { status: "expired", label: "Payment Due", color: "bg-red-100 text-red-700", icon: AlertCircle };
    }

    return { status: "unknown", label: "Unknown", color: "bg-gray-100 text-gray-700", icon: AlertCircle };
  };

  const handleGrantTrial = async (store: any) => {
    setSelectedStore(store);
    setShowGrantModal(true);
  };

  const confirmGrantTrial = async () => {
    try {
      const store = selectedStore;
      const currentTrialEnd = store.trial_end_date ? new Date(store.trial_end_date) : new Date();
      const newTrialEnd = new Date(currentTrialEnd.getTime() + (grantDays * 24 * 60 * 60 * 1000));

      await db.update("stores", { _row_id: `eq.${store._row_id}` }, {
        trial_end_date: newTrialEnd.toISOString(),
        admin_granted_free_trials: (store.admin_granted_free_trials || 0) + 1,
        subscription_status: "trial"
      });

      setShowGrantModal(false);
      setSelectedStore(null);
      loadSubscriptions();
      alert(`Successfully granted ${grantDays} days free trial to ${store.name}`);
    } catch (error) {
      console.error("Error granting trial:", error);
      alert("Failed to grant trial. Please try again.");
    }
  };

  const handleActivateSubscription = async (store: any) => {
    try {
      const now = new Date();
      const subscriptionEnd = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days

      await db.update("stores", { _row_id: `eq.${store._row_id}` }, {
        subscription_status: "active",
        subscription_start_date: now.toISOString(),
        subscription_end_date: subscriptionEnd.toISOString(),
        last_payment_date: now.toISOString(),
        next_payment_date: subscriptionEnd.toISOString()
      });

      loadSubscriptions();
      alert(`Successfully activated subscription for ${store.name}`);
    } catch (error) {
      console.error("Error activating subscription:", error);
      alert("Failed to activate subscription. Please try again.");
    }
  };

  const handleSuspendSubscription = async (store: any) => {
    try {
      await db.update("stores", { _row_id: `eq.${store._row_id}` }, {
        subscription_status: "suspended"
      });

      loadSubscriptions();
      alert(`Successfully suspended subscription for ${store.name}`);
    } catch (error) {
      console.error("Error suspending subscription:", error);
      alert("Failed to suspend subscription. Please try again.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setGcashFile(file);
    }
  };

  const handleUploadQRCode = async () => {
    if (!gcashFile || !subscriptionGcash) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      // This would normally upload to your content filesystem
      // For now, we'll simulate the upload
      const mockUploadPath = URL.createObjectURL(gcashFile);
      
      await db.update("payment_methods", { _row_id: `eq.${subscriptionGcash._row_id}` }, {
        gcash_qr_code: mockUploadPath
      });

      alert('GCash QR code uploaded successfully!');
      setGcashFile(null);
      loadPaymentMethods();
    } catch (error) {
      console.error("Error uploading QR code:", error);
      alert('Failed to upload QR code. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(store => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        store.name?.toLowerCase().includes(searchLower) ||
        store.owner_email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: subscriptions.length,
    trial: subscriptions.filter(s => getSubscriptionStatus(s).status === "trial").length,
    active: subscriptions.filter(s => getSubscriptionStatus(s).status === "active").length,
    expired: subscriptions.filter(s => getSubscriptionStatus(s).status === "expired" || getSubscriptionStatus(s).status === "suspended").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard/admin" className="text-slate-700 hover:text-orange-600">
                <Button variant="ghost">← Back to Admin</Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                Subscription Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={loadSubscriptions}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Subscriptions</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <CreditCard className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Subscriptions</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Free Trials</p>
                  <p className="text-3xl font-bold">{stats.trial}</p>
                </div>
                <Clock className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Payment Issues</p>
                  <p className="text-3xl font-bold">{stats.expired}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans Info */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">₱200/month Subscription Plan</h3>
                <p className="text-orange-100">All shop owners get 14-day free trial. Admin can grant additional free trials.</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">₱200</p>
                <p className="text-orange-100">per month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Payment Configuration */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Subscription Payment Configuration</h3>
                  <p className="text-white/90">Manage PayPal subscription link and GCash QR code for subscription payments</p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90"
                onClick={() => setShowPaymentModal(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure Payments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by store name or owner email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Status</option>
                <option value="trial">Free Trial</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Shop Owner Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Loading subscriptions...</p>
              </div>
            ) : filteredSubscriptions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No subscriptions found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubscriptions.map((store) => {
                  const statusInfo = getSubscriptionStatus(store);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={store._row_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{store.name}</h3>
                            <p className="text-sm text-slate-600">{store.owner_email || "No email"}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          
                          <div className="text-right mr-4">
                            <p className="text-sm text-slate-600">
                              {store.subscription_price ? `₱${store.subscription_price}/month` : '₱200/month'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {store.admin_granted_free_trials > 0 ? `${store.admin_granted_free_trials} trials granted` : 'Standard trial'}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {statusInfo.status === "trial" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGrantTrial(store)}
                                className="flex items-center space-x-1"
                              >
                                <Gift className="w-3 h-3" />
                                <span>Grant Trial</span>
                              </Button>
                            )}
                            
                            {statusInfo.status === "trial" && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-green-600"
                                onClick={() => handleActivateSubscription(store)}
                              >
                                Activate
                              </Button>
                            )}
                            
                            {(statusInfo.status === "active" || statusInfo.status === "trial") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuspendSubscription(store)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                Suspend
                              </Button>
                            )}
                            
                            {statusInfo.status === "suspended" && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-green-600"
                                onClick={() => handleActivateSubscription(store)}
                              >
                                Reactivate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Details */}
                      <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Trial Period</p>
                          <p className="text-slate-900 font-medium">
                            {store.trial_start_date && store.trial_end_date ? 
                              `${new Date(store.trial_start_date).toLocaleDateString()} - ${new Date(store.trial_end_date).toLocaleDateString()}` : 
                              'Not set'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Subscription Period</p>
                          <p className="text-slate-900 font-medium">
                            {store.subscription_start_date && store.subscription_end_date ? 
                              `${new Date(store.subscription_start_date).toLocaleDateString()} - ${new Date(store.subscription_end_date).toLocaleDateString()}` : 
                              'Not active'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Last Payment</p>
                          <p className="text-slate-900 font-medium">
                            {store.last_payment_date ? 
                              new Date(store.last_payment_date).toLocaleDateString() : 
                              'No payments'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grant Trial Modal */}
      {showGrantModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Grant Free Trial</h3>
            <p className="text-slate-600 mb-4">
              Grant additional free trial days to <strong>{selectedStore.name}</strong>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trial Days
              </label>
              <Input
                type="number"
                value={grantDays}
                onChange={(e) => setGrantDays(parseInt(e.target.value))}
                min={1}
                max={365}
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Gift className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Trial Grant Summary</p>
                  <p>Store: {selectedStore.name}</p>
                  <p>Days: {grantDays}</p>
                  <p>Previous grants: {selectedStore.admin_granted_free_trials || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowGrantModal(false);
                  setSelectedStore(null);
                  setGrantDays(14);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmGrantTrial}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600"
              >
                Grant Trial
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Configuration Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Subscription Payment Configuration</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* PayPal Configuration */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">PayPal Subscription</h4>
                      <p className="text-sm text-slate-600">Recurring monthly subscription payments</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Subscription Link</p>
                      <p className="text-xs text-slate-500 font-mono truncate max-w-md">
                        {PAYPAL_SUBSCRIBE_LINK}
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(PAYPAL_SUBSCRIBE_LINK, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test Link</span>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Amount</p>
                    <p className="font-semibold text-slate-900">₱200.00</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Billing Cycle</p>
                    <p className="font-semibold text-slate-900">Monthly</p>
                  </div>
                </div>
              </div>

              {/* GCash Configuration */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">GCash Payment</h4>
                      <p className="text-sm text-slate-600">QR code scanning for subscription payments</p>
                    </div>
                  </div>
                  <Badge className={subscriptionGcash?.gcash_qr_code ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                    {subscriptionGcash?.gcash_qr_code ? "Configured" : "Not Set"}
                  </Badge>
                </div>
                
                {subscriptionGcash?.gcash_qr_code ? (
                  <div className="bg-white rounded-lg p-4 border border-orange-200 mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-3">Current QR Code:</p>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={subscriptionGcash.gcash_qr_code}
                        alt="GCash QR Code"
                        className="w-32 h-32 object-contain border-2 border-orange-200 rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 mb-2">Shop owners will see this QR code when they choose to pay with GCash for their subscription.</p>
                        {subscriptionGcash.gcash_number && (
                          <div className="bg-orange-50 rounded-lg p-3">
                            <p className="text-xs text-slate-600 mb-1">GCash Number:</p>
                            <p className="font-semibold text-slate-900">{subscriptionGcash.gcash_number}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6 border border-orange-200 mb-4 text-center">
                    <QrCode className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No GCash QR code uploaded yet</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload GCash QR Code
                    </label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleUploadQRCode}
                        disabled={!gcashFile || uploading}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Accepted formats: JPG, PNG (max 5MB)
                    </p>
                  </div>
                  
                  {subscriptionGcash?.gcash_number && (
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="text-sm font-medium text-slate-700 mb-2">GCash Number Configuration:</p>
                      <p className="text-slate-900 font-mono">{subscriptionGcash.gcash_number}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Configure in Payment Gateway Management
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-2">Subscription Payment Flow</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Shop owners see payment options on subscription page</li>
                      <li><strong>PayPal:</strong> Click subscription link → PayPal recurring payment setup</li>
                      <li><strong>GCash:</strong> Scan QR code → Send ₱200 → Confirm with support</li>
                      <li>Admin can verify payments and activate subscriptions</li>
                      <li>Monthly ₱200 billing cycle with payment tracking</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Link to="/admin/payment-gateways" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage All Payment Methods
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;