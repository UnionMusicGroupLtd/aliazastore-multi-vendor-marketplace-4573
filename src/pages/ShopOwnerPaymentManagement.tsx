import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, Upload, CheckCircle, AlertCircle, 
  ArrowLeft, Smartphone, Search, Store, QrCode
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import db from "@/lib/shared/kliv-database.js";
import { content } from "@/lib/shared/kliv-content.js";

const ShopOwnerPaymentManagement = () => {
  const [shopOwners, setShopOwners] = useState<any[]>([]);
  const [filteredShopOwners, setFilteredShopOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedShopOwner, setSelectedShopOwner] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingQR, setUploadingQR] = useState(false);

  const [formData, setFormData] = useState({
    gcash_number: "",
    gcash_qr_code: "",
    gcash_enabled: false,
    payment_note: ""
  });

  useEffect(() => {
    loadShopOwners();
  }, []);

  useEffect(() => {
    filterShopOwners();
  }, [shopOwners, searchTerm, statusFilter]);

  const loadShopOwners = async () => {
    try {
      setLoading(true);
      
      // Load all stores
      const stores = await db.query("stores", { order: "_created_at.desc" });
      
      // Load shop owner payment settings for each store
      // Load shop owner payment settings for each store
      const enrichedShopOwners = await Promise.all(
        (stores || []).map(async (store: any) => {
          try {
            const paymentSettings = await db.query("shopowner_payment_settings", { 
              shop_owner_id: `eq.${store._row_id}` 
            });
            
            return {
              ...store,
              payment_settings: paymentSettings[0] || null,
              has_custom_payment: paymentSettings.length > 0,
              payment_enabled: paymentSettings[0]?.gcash_enabled !== 0
            };
          } catch {
            return {
              ...store,
              payment_settings: null,
              has_custom_payment: false,
              payment_enabled: false
            };
          }
        })
      );
      
      setShopOwners(enrichedShopOwners);
    } catch (err) {
      console.error("Error loading shop owners:", err);
      setError("Failed to load shop owner payment settings");
    } finally {
      setLoading(false);
    }
  };

  const filterShopOwners = () => {
    let filtered = shopOwners;

    if (searchTerm) {
      filtered = filtered.filter(owner => 
        owner.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.payment_settings?.gcash_number?.includes(searchTerm)
      );
    }

    if (statusFilter === "enabled") {
      filtered = filtered.filter(owner => owner.payment_enabled);
    } else if (statusFilter === "disabled") {
      filtered = filtered.filter(owner => !owner.payment_enabled);
    } else if (statusFilter === "custom") {
      filtered = filtered.filter(owner => owner.has_custom_payment);
    }

    setFilteredShopOwners(filtered);
  };

  const handleQRUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingQR(true);
      setError("");

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file (JPG, PNG, etc.)");
        setUploadingQR(false);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setUploadingQR(false);
        return;
      }

      // Upload file to content filesystem
      const result = await content.uploadFile(file, '/content/shopowner-qr-codes/');
      
      if (result && result.path) {
        setFormData({
          ...formData,
          gcash_qr_code: result.path
        });
        setSuccess("QR code uploaded successfully!");
      }
    } catch (err) {
      console.error("Error uploading QR code:", err);
      setError("Failed to upload QR code image");
    } finally {
      setUploadingQR(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setError("");

      if (selectedShopOwner.payment_settings) {
        // Update existing settings
        await db.update("shopowner_payment_settings", { 
          shop_owner_id: `eq.${selectedShopOwner._row_id}` 
        }, {
          gcash_number: formData.gcash_number,
          gcash_qr_code: formData.gcash_qr_code,
          gcash_enabled: formData.gcash_enabled ? 1 : 0,
          payment_note: formData.payment_note
        });
      } else {
        // Insert new settings
        await db.insert("shopowner_payment_settings", {
          shop_owner_id: selectedShopOwner._row_id,
          gcash_number: formData.gcash_number,
          gcash_qr_code: formData.gcash_qr_code,
          gcash_enabled: formData.gcash_enabled ? 1 : 0,
          payment_note: formData.payment_note
        });
      }

      setSuccess("Payment settings saved successfully!");
      setShowConfigModal(false);
      setSelectedShopOwner(null);
      loadShopOwners();
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save payment settings");
    }
  };

  const openConfigModal = (shopOwner: any) => {
    setSelectedShopOwner(shopOwner);
    
    if (shopOwner.payment_settings) {
      setFormData({
        gcash_number: shopOwner.payment_settings.gcash_number || "",
        gcash_qr_code: shopOwner.payment_settings.gcash_qr_code || "",
        gcash_enabled: shopOwner.payment_settings.gcash_enabled !== 0,
        payment_note: shopOwner.payment_settings.payment_note || ""
      });
    } else {
      setFormData({
        gcash_number: "",
        gcash_qr_code: "",
        gcash_enabled: false,
        payment_note: ""
      });
    }
    
    setShowConfigModal(true);
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'SO';
  };

  const getStatusColor = (owner: any) => {
    if (!owner.has_custom_payment) return "bg-gray-100 text-gray-700";
    if (owner.payment_enabled) return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusText = (owner: any) => {
    if (!owner.has_custom_payment) return "Using Default";
    if (owner.payment_enabled) return "Custom Enabled";
    return "Custom Disabled";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading shop owner payment settings...</p>
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
              <Link to="/dashboard/admin" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Shop Owner Payment Settings</span>
                  <p className="text-sm text-slate-600">Configure individual GCash payment settings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Shop Owners</p>
                  <p className="text-3xl font-bold">{shopOwners.length}</p>
                </div>
                <Store className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Custom Payment</p>
                  <p className="text-3xl font-bold">{shopOwners.filter(o => o.has_custom_payment).length}</p>
                </div>
                <QrCode className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Enabled Custom</p>
                  <p className="text-3xl font-bold">{shopOwners.filter(o => o.payment_enabled).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Using Default</p>
                  <p className="text-3xl font-bold">{shopOwners.filter(o => !o.has_custom_payment).length}</p>
                </div>
                <Smartphone className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search shop owners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="custom">Has Custom Payment</SelectItem>
                  <SelectItem value="enabled">Custom Enabled</SelectItem>
                  <SelectItem value="disabled">Custom Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shop Owners Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Shop Owner Payment Configurations</CardTitle>
            <CardDescription>
              Configure individual GCash payment settings for each shop owner. 
              Shop owners without custom settings will use the platform default GCash configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredShopOwners.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No shop owners found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-4 font-semibold text-slate-900">Shop Owner</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Store Name</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Payment Status</th>
                      <th className="text-left p-4 font-semibold text-slate-900">GCash Number</th>
                      <th className="text-left p-4 font-semibold text-slate-900">QR Code</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShopOwners.map((owner) => (
                      <tr key={owner._row_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600">
                              <AvatarFallback className="text-white text-sm">
                                {getInitials(owner.owner_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{owner.owner_name}</p>
                              <p className="text-sm text-slate-600">{owner.owner_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{owner.store_name}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(owner)}>
                            {getStatusText(owner)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {owner.payment_settings?.gcash_number ? (
                            <span className="font-mono text-sm">{owner.payment_settings.gcash_number}</span>
                          ) : (
                            <span className="text-slate-400 text-sm">Using default</span>
                          )}
                        </td>
                        <td className="p-4">
                          {owner.payment_settings?.gcash_qr_code ? (
                            <div className="flex items-center space-x-2">
                              <img 
                                src={owner.payment_settings.gcash_qr_code} 
                                alt="QR Code" 
                                className="w-8 h-8 object-contain border border-slate-200 rounded"
                              />
                              <span className="text-xs text-green-600">Custom</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Default</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Button
                            size="sm"
                            onClick={() => openConfigModal(owner)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          >
                            Configure
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuration Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Shop Owner Payment Settings</DialogTitle>
            <DialogDescription>
              Set up custom GCash payment settings for {selectedShopOwner?.store_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Shop Owner Info */}
            {selectedShopOwner && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600">
                    <AvatarFallback className="text-white">
                      {getInitials(selectedShopOwner.owner_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedShopOwner.store_name}</p>
                    <p className="text-sm text-slate-600">{selectedShopOwner.owner_name}</p>
                    <p className="text-xs text-slate-500">{selectedShopOwner.owner_email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="gcash_enabled"
                checked={formData.gcash_enabled}
                onChange={(e) => setFormData({...formData, gcash_enabled: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="gcash_enabled">Enable custom GCash payment for this shop owner</Label>
            </div>

            <div>
              <Label>GCash Number</Label>
              <Input
                value={formData.gcash_number}
                onChange={(e) => setFormData({...formData, gcash_number: e.target.value})}
                placeholder="09172345678"
                type="tel"
              />
              <p className="text-xs text-slate-500 mt-1">Customers will send payment to this GCash number</p>
            </div>

            <div>
              <Label>GCash QR Code</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative"
                    disabled={uploadingQR}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingQR ? "Uploading..." : "Upload QR Code"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQRUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingQR}
                    />
                  </Button>
                  <span className="text-sm text-slate-500">
                    JPG, PNG • Max 5MB
                  </span>
                </div>
                
                {formData.gcash_qr_code && (
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    QR code uploaded successfully
                  </div>
                )}
              </div>
            </div>

            {formData.gcash_qr_code && (
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">QR Code Preview:</p>
                <img 
                  src={formData.gcash_qr_code} 
                  alt="GCash QR Code Preview" 
                  className="w-40 h-40 object-contain border border-slate-100 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Invalid+QR+Code';
                  }}
                />
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({...formData, gcash_qr_code: ""})}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label>Payment Note (Optional)</Label>
              <Input
                value={formData.payment_note}
                onChange={(e) => setFormData({...formData, payment_note: e.target.value})}
                placeholder="Special payment instructions for customers"
              />
              <p className="text-xs text-slate-500 mt-1">Additional instructions that will be shown to customers</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Payment Flow:</strong> When customers purchase from this shop owner, 
                they will see this custom GCash configuration instead of the platform default.
                If custom payment is disabled, customers will see the platform default GCash settings.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopOwnerPaymentManagement;