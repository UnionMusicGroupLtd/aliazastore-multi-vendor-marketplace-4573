import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, Calendar, Clock, CheckCircle, AlertCircle,
  Gift, DollarSign, TrendingUp, Settings, Bell, HelpCircle,
  CreditCard as CardIcon, Zap, Shield, Crown, QrCode, Copy, ExternalLink,
  Store, Download, Share2
} from "lucide-react";
import auth from "@/lib/shared/kliv-auth.js";
import db from "@/lib/shared/kliv-database.js";

const SellerSubscription = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [subscriptionGcash, setSubscriptionGcash] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState({
    name: "Basic Plan",
    price: 200,
    duration: "monthly",
    features: [
      "Unlimited product listings",
      "No commission fees",
      "Advanced analytics dashboard",
      "Customer support",
      "Marketing tools",
      "Store customization"
    ]
  });
  const [showStoreQRModal, setShowStoreQRModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const PAYPAL_SUBSCRIBE_LINK = "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-8YL1018950382172ANJOO5JI";

  useEffect(() => {
    loadSubscription();
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const methods = await db.query("payment_methods", { is_enabled: "eq.1" });
      setPaymentMethods(methods);
      
      // Load GCash configuration specifically for subscriptions
      const gcashConfig = methods.find((m: any) => m.gateway_type === "gcash");
      if (gcashConfig) {
        setSubscriptionGcash(gcashConfig);
        console.log("GCash payment loaded for subscription:", gcashConfig);
      } else {
        console.log("No GCash payment method found");
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  };

  const loadSubscription = async () => {
    setLoading(true);
    try {
      const user = await auth.getUser();
      if (!user) {
        console.log("No user found in loadSubscription");
        setLoading(false);
        return;
      }

      console.log("Current user:", user.email, user.userUuid);

      // Try to find store by owner_uuid first, then owner_email as fallback
      let stores = await db.query("stores", { owner_uuid: `eq.${user.userUuid}` });
      
      if (stores.length === 0) {
        console.log("No store found by owner_uuid, trying owner_email");
        stores = await db.query("stores", { owner_email: `eq.${user.email}` });
      }
      
      console.log("Stores found:", stores.length);
      
      if (stores.length > 0) {
        const storeData = stores[0];
        console.log("Store data loaded:", storeData.name, storeData._row_id);
        
        // Initialize trial dates if not set
        if (!storeData.trial_start_date && !storeData.subscription_start_date) {
          const now = Math.floor(Date.now() / 1000); // Current Unix timestamp
          const trialEnd = now + (14 * 24 * 60 * 60); // 14 days in seconds
          
          await db.update("stores", { _row_id: `eq.${storeData._row_id}` }, {
            trial_start_date: now,
            trial_end_date: trialEnd,
            subscription_status: "trial",
            subscription_price: 200.00,
            subscription_plan: "basic"
          });
          
          storeData.trial_start_date = now;
          storeData.trial_end_date = trialEnd;
          storeData.subscription_status = "trial";
          storeData.subscription_price = 200.00;
        }
        
        setSubscription(storeData);
      } else {
        console.log("No store found for user:", user.email);
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return null;

    const now = new Date();
    // Convert Unix timestamps to Date objects (database uses seconds, JavaScript uses milliseconds)
    const trialEnd = subscription.trial_end_date ? new Date(subscription.trial_end_date * 1000) : null;
    const subscriptionEnd = subscription.subscription_end_date ? new Date(subscription.subscription_end_date * 1000) : null;

    if (subscription.subscription_status === "cancelled") {
      return {
        status: "cancelled",
        label: "Cancelled",
        color: "bg-red-100 text-red-700",
        icon: AlertCircle,
        message: "Your subscription has been cancelled"
      };
    }

    if (subscription.subscription_status === "suspended") {
      return {
        status: "suspended",
        label: "Suspended",
        color: "bg-orange-100 text-orange-700",
        icon: AlertCircle,
        message: "Your account is currently suspended"
      };
    }

    if (trialEnd && trialEnd > now) {
      const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: "trial",
        label: `Free Trial (${daysRemaining} days left)`,
        color: "bg-purple-100 text-purple-700",
        icon: Gift,
        daysRemaining,
        trialEnd,
        message: `Enjoy your free trial! ${daysRemaining} days remaining`
      };
    }

    if (subscriptionEnd && subscriptionEnd > now) {
      const daysRemaining = Math.ceil((subscriptionEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: "active",
        label: `Active Subscription (${daysRemaining} days left)`,
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
        daysRemaining,
        subscriptionEnd,
        message: `Your subscription is active! ${daysRemaining} days until renewal`
      };
    }

    if (trialEnd && trialEnd <= now && !subscription.subscription_start_date) {
      return {
        status: "trial_ended",
        label: "Trial Ended",
        color: "bg-red-100 text-red-700",
        icon: Clock,
        message: "Your free trial has ended. Subscribe to continue selling!"
      };
    }

    return {
      status: "unknown",
      label: "Unknown Status",
      color: "bg-gray-100 text-gray-700",
      icon: AlertCircle,
      message: "Please contact support for assistance"
    };
  };

  const status = getSubscriptionStatus();
  const StatusIcon = status?.icon;

  const handlePayPalSubscription = () => {
    window.open(PAYPAL_SUBSCRIBE_LINK, '_blank');
  };

  const handleGCashPayment = () => {
    setShowPaymentModal(true);
  };

  const copyGCashNumber = () => {
    if (subscriptionGcash?.gcash_number) {
      navigator.clipboard.writeText(subscriptionGcash.gcash_number);
      alert('GCash number copied to clipboard!');
    }
  };

  const handleShowStoreQR = () => {
    setShowStoreQRModal(true);
  };

  const copyStoreURL = () => {
    if (subscription?.store_qr_code) {
      navigator.clipboard.writeText(subscription.store_qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateStoreQRCode = () => {
    if (subscription?.store_qr_code) {
      // Using a free QR code API
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(subscription.store_qr_code)}`;
    }
    return "https://via.placeholder.com/200?text=No+Store+URL";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No Store Found</h2>
              <p className="text-slate-600 mb-6">You need to create a store first to manage subscriptions.</p>
              <Link to="/dashboard/seller/profile">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                  Create Your Store
                </Button>
              </Link>
            </CardContent>
          </Card>
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
            <div className="flex items-center space-x-4">
              <Link to="/dashboard/seller" className="text-slate-700 hover:text-orange-600">
                <Button variant="ghost">← Back to Dashboard</Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                Subscription Management
              </h1>
            </div>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status Banner */}
        <Card className={`mb-8 border-0 shadow-lg ${
          status.status === "trial" ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" :
          status.status === "active" ? "bg-gradient-to-r from-green-500 to-green-600 text-white" :
          status.status === "trial_ended" ? "bg-gradient-to-r from-red-500 to-red-600 text-white" :
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <StatusIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{status.label}</h2>
                  <p className="text-white/90">{status.message}</p>
                </div>
              </div>
              {status.status === "trial_ended" && (
                <Button size="lg" className="bg-white text-red-600 hover:bg-white/90">
                  Subscribe Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Subscription Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Crown className="w-6 h-6 mr-2 text-orange-600" />
                  Current Plan - {currentPlan.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl">
                  <div>
                    <p className="text-slate-600 mb-1">Monthly Price</p>
                    <p className="text-4xl font-bold text-slate-900">₱{currentPlan.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-600 mb-1">Billing Cycle</p>
                    <p className="text-2xl font-semibold text-slate-900">{currentPlan.duration}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Plan Features</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {currentPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">No Commission Fees</p>
                      <p>Keep 100% of your sales - only ₱200/month flat fee!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trial Information */}
            {status.status === "trial" && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-purple-600" />
                    Free Trial Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-600 mb-1">Trial Started</p>
                      <p className="font-semibold text-slate-900">
                        {subscription.trial_start_date ? 
                          new Date(subscription.trial_start_date * 1000).toLocaleDateString() : 
                          'Not set'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">Trial Ends</p>
                      <p className="font-semibold text-slate-900">
                        {status.trialEnd ? 
                          status.trialEnd.toLocaleDateString() : 
                          'Not set'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {status.daysRemaining !== undefined && (
                    <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                      <p className="text-purple-800 font-medium">
                        {status.daysRemaining} days remaining in your free trial
                      </p>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Bell className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Trial Reminder</p>
                        <p>Your trial will automatically convert to a paid subscription. Subscribe anytime during or after the trial to continue selling.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscription.last_payment_date ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-slate-900">Monthly Subscription</p>
                          <p className="text-sm text-slate-600">
                            Paid on {new Date(subscription.last_payment_date * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">₱200.00</Badge>
                    </div>
                    
                    {subscription.next_payment_date && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-slate-900">Next Payment Due</p>
                            <p className="text-sm text-slate-600">
                              {new Date(subscription.next_payment_date * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">₱200.00</Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No payment history yet</p>
                    <p className="text-sm">Payments will appear here once you subscribe</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Store QR Code Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-blue-600" />
                  Your Store QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white border-2 border-blue-200 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <img 
                      src={generateStoreQRCode()}
                      alt="Store QR Code"
                      className="w-48 h-48 object-contain mx-auto border-4 border-blue-100 rounded-lg"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-600 mb-1">Store URL</p>
                    <p className="text-sm text-slate-900 font-mono break-all">{subscription?.store_qr_code || "No URL set"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={copyStoreURL}
                      className="flex items-center justify-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? "Copied!" : "Copy URL"}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleShowStoreQR}
                      className="flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share QR</span>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Share2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-purple-800">
                      <p className="font-semibold mb-1">Share with Customers</p>
                      <p className="mb-2">Customers can scan this QR code to directly visit your store and browse your products. Perfect for:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Business cards and marketing materials</li>
                        <li>Social media posts and stories</li>
                        <li>Product packaging and receipts</li>
                        <li>Physical store displays</li>
                        <li>Events and trade shows</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Store className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Store Visibility</p>
                      <p>Share this QR code everywhere! Your store is at: <strong>{subscription?.name || "Your Store Name"}</strong></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Subscribe Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {status.status === "trial_ended" || status.status === "trial" || status.status === "unknown" ? (
                  <>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handlePayPalSubscription}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Subscribe with PayPal
                    </Button>
                    
                    {subscriptionGcash?.gcash_qr_code && (
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
                        onClick={handleGCashPayment}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Pay with GCash
                      </Button>
                    )}
                    
                    <div className="text-center text-sm text-slate-600 mt-2">
                      <p>₱200/month • Cancel anytime</p>
                    </div>
                  </>
                ) : status.status === "active" ? (
                  <>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handlePayPalSubscription}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Update PayPal
                    </Button>
                    {subscriptionGcash?.gcash_qr_code && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleGCashPayment}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Pay with GCash
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Reactivate Account
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Payment Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/help" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help Center
                  </Button>
                </Link>
                <Link to="/contact" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Subscription Benefits</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>No commission fees</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CardIcon className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Marketing tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* GCash Payment Modal */}
      {showPaymentModal && subscriptionGcash && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Subscribe with GCash</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-slate-600 mb-2">Subscription Amount</p>
                <p className="text-3xl font-bold text-slate-900">₱200.00</p>
                <p className="text-xs text-slate-500 mt-1">per month</p>
              </div>
              
              {subscriptionGcash.gcash_qr_code && (
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 mb-3">Scan QR Code to Pay</p>
                  <div className="bg-white border-2 border-orange-200 rounded-lg p-4 inline-block">
                    <img 
                      src={subscriptionGcash.gcash_qr_code}
                      alt="GCash QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
              )}
              
              {subscriptionGcash.gcash_number && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">GCash Number</p>
                      <p className="text-lg font-bold text-slate-900">{subscriptionGcash.gcash_number}</p>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={copyGCashNumber}
                      className="flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Payment Instructions</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Scan the QR code or copy the GCash number</li>
                      <li>Send ₱200.00 to the GCash number</li>
                      <li>Use your store name as reference</li>
                      <li>Screenshot the payment confirmation</li>
                      <li>Contact support with your payment proof</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Link to="/contact" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600">
                    Confirm Payment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Store QR Code Modal */}
      {showStoreQRModal && subscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center">
                <Store className="w-5 h-5 mr-2 text-blue-600" />
                Share Your Store QR Code
              </h3>
              <button 
                onClick={() => setShowStoreQRModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 inline-block">
                  <img 
                    src={generateStoreQRCode()}
                    alt="Store QR Code"
                    className="w-64 h-64 object-contain border-4 border-white rounded-lg shadow-lg"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Your Store URL:</p>
                <p className="text-sm text-slate-900 font-mono break-all">{subscription.store_qr_code || "No URL set"}</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Share2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-purple-800">
                    <p className="font-semibold mb-2">Ways to Share Your QR Code:</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-purple-600" />
                        <span>Right-click and save the QR code image</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Copy className="w-4 h-4 text-purple-600" />
                        <span>Share your store URL directly</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Store className="w-4 h-4 text-purple-600" />
                        <span>Print on business cards and marketing materials</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Share2 className="w-4 h-4 text-purple-600" />
                        <span>Share on social media and messaging apps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={copyStoreURL}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowStoreQRModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSubscription;