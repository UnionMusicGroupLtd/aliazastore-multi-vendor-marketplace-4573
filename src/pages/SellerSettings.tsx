import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, Store, Package, Bell, Lock,
  DollarSign, Globe, Save, Eye, ChevronRight
} from "lucide-react";
import db from "@/lib/shared/kliv-database.js";
import auth from "@/lib/shared/kliv-auth.js";

const SellerSettings = () => {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Store settings state
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeTagline, setStoreTagline] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeWebsite, setStoreWebsite] = useState("");
  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    newMessages: true,
    newReviews: true,
    lowStock: true,
    priceChanges: false
  });

  useEffect(() => {
    loadStoreSettings();
  }, []);

  const loadStoreSettings = async () => {
    try {
      const currentUser = await auth.getUser();
      if (!currentUser) {
        console.log("No current user found");
        return;
      }

      console.log("Loading store for user:", currentUser.userUuid);

      const stores = await db.query("stores", {
        owner_uuid: `eq.${currentUser.userUuid}`
      });
      
      console.log("Found stores:", stores.length);
      
      if (stores.length > 0) {
        const storeData = stores[0];
        console.log("Store data:", storeData);
        setStore(storeData);
        setStoreName(storeData.name || "");
        setStoreDescription(storeData.description || "");
        setStoreTagline(storeData.tagline || "");
        setStoreEmail(storeData.email || storeData.business_email || "");
        setStorePhone(storeData.phone || storeData.business_phone || "");
        setStoreAddress(storeData.address || "");
        setStoreWebsite(storeData.website || "");
      } else {
        console.log("No store found for user, creating default store");
        // Create a default store for the user
        try {
          const newStore = await db.insert("stores", {
            owner_uuid: currentUser.userUuid,
            name: "My Store",
            slug: `my-store-${currentUser.userUuid.substring(0, 8)}`,
            description: "Welcome to my store",
            status: "active",
            email: currentUser.email || "",
            tagline: "Quality products, great prices"
          });
          
          if (newStore && newStore.length > 0) {
            const storeData = newStore[0];
            console.log("Created new store:", storeData);
            setStore(storeData);
            setStoreName(storeData.name || "");
            setStoreDescription(storeData.description || "");
            setStoreTagline(storeData.tagline || "");
            setStoreEmail(storeData.email || "");
            setStorePhone(storeData.phone || "");
            setStoreAddress(storeData.address || "");
            setStoreWebsite(storeData.website || "");
            setMessage("Store created successfully! You can now update your settings.");
          }
        } catch (createError) {
          console.error("Error creating store:", createError);
          setMessage("Error creating store. Please contact support.");
        }
      }
    } catch (error) {
      console.error("Error loading store settings:", error);
      setMessage("Error loading store settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!store) {
      setMessage("No store found. Please create a store first.");
      return;
    }
    
    setSaving(true);
    setMessage("");
    
    try {
      console.log("Saving store settings for store ID:", store._row_id);
      
      const updateData = {
        name: storeName,
        description: storeDescription,
        tagline: storeTagline,
        email: storeEmail,
        phone: storePhone,
        business_email: storeEmail,
        business_phone: storePhone,
        address: storeAddress,
        website: storeWebsite
      };
      
      console.log("Update data:", updateData);
      
      await db.update("stores", { _row_id: `eq.${store._row_id}` }, updateData);
      
      const updatedStore = {
        ...store,
        ...updateData
      };
      
      setStore(updatedStore);
      
      console.log("Settings saved successfully");
      setMessage("✅ Settings saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("❌ Error saving settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading settings...</p>
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
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Store Settings</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link to="/dashboard/seller" className="text-sm text-slate-600 hover:text-orange-600">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Store Configuration</h1>
          <p className="text-slate-600">Manage your store settings and preferences</p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Store Info</h3>
                  <p className="text-sm text-slate-600">Basic details</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link to="/dashboard/seller/products" className="block">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Products</h3>
                    <p className="text-sm text-slate-600">Manage items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/seller/documents" className="block">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Documents</h3>
                    <p className="text-sm text-slate-600">Verification</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <p className="text-sm text-slate-600">Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Store Information */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span>Store Information</span>
              </CardTitle>
              <CardDescription>Update your store's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="My Awesome Store"
                />
              </div>

              <div>
                <Label htmlFor="storeTagline">Store Tagline</Label>
                <Input
                  id="storeTagline"
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  placeholder="Quality products, great prices"
                />
              </div>

              <div>
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="Tell customers about your store..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeEmail">Business Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    placeholder="store@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="storePhone">Business Phone</Label>
                  <Input
                    id="storePhone"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeAddress">Business Address</Label>
                <Textarea
                  id="storeAddress"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Your business address"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="storeWebsite">Website URL (optional)</Label>
                <Input
                  id="storeWebsite"
                  value={storeWebsite}
                  onChange={(e) => setStoreWebsite(e.target.value)}
                  placeholder="https://yourstore.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'newOrders', label: 'New Orders', description: 'Get notified when you receive new orders' },
                { key: 'newMessages', label: 'Customer Messages', description: 'Get notified when customers send messages' },
                { key: 'newReviews', label: 'Product Reviews', description: 'Get notified when customers leave reviews' },
                { key: 'lowStock', label: 'Low Stock Alerts', description: 'Get notified when products are running low' },
                { key: 'priceChanges', label: 'Price Change Alerts', description: 'Get notified about market price changes' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div>
                    <h4 className="font-medium text-slate-900">{setting.label}</h4>
                    <p className="text-sm text-slate-600">{setting.description}</p>
                  </div>
                  <Button
                    variant={notificationSettings[setting.key] ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [setting.key]: !notificationSettings[setting.key]
                    })}
                  >
                    {notificationSettings[setting.key] ? "On" : "Off"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">Password</h4>
                  <Badge className="bg-green-100 text-green-700">Strong</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">Last changed 30 days ago</p>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>

              <div className="p-4 rounded-lg bg-slate-50">
                <h4 className="font-medium text-slate-900 mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-slate-600 mb-3">Add an extra layer of security</p>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Payment Settings</span>
              </CardTitle>
              <CardDescription>Configure your payment preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/dashboard/seller/withdrawal" className="block">
                <div className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">Withdrawal Settings</h4>
                      <p className="text-sm text-slate-600">Manage your withdrawal methods and schedule</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </Link>

              <div className="p-4 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">GCash Number</h4>
                    <p className="text-sm text-slate-600">Configure your GCash payment details</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Configured</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex-1">
            {message && (
              <div className={`p-4 rounded-lg border-0 shadow-lg ${
                message.includes("success") || message.includes("✅") 
                  ? "bg-green-50 text-green-700" 
                  : message.includes("Store created")
                  ? "bg-blue-50 text-blue-700"
                  : "bg-red-50 text-red-700"
              }`}>
                <div className="flex items-center space-x-2">
                  {message.includes("✅") || message.includes("❌") ? (
                    <span className="text-xl">{message.includes("✅") ? "✅" : "❌"}</span>
                  ) : null}
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}
          </div>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            onClick={handleSaveSettings}
            disabled={saving}
            size="lg"
          >
            {saving ? "Saving..." : "Save Settings"}
            <Save className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
