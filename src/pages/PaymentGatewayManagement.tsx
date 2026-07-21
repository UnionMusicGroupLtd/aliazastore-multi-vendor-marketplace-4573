import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, Edit, CheckCircle, XCircle, AlertCircle, 
  ArrowLeft, Smartphone, Building2, Wallet, Upload
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";
import db from "@/lib/shared/kliv-database.js";
import { content } from "@/lib/shared/kliv-content.js";

const PaymentGatewayManagement = () => {
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingQR, setUploadingQR] = useState(false);

  const [formData, setFormData] = useState({
    gateway_name: "",
    gateway_type: "gcash",
    api_key: "",
    api_secret: "",
    merchant_id: "",
    is_enabled: true,
    supports_cod: false,
    supports_ewallet: true,
    supports_card: false,
    supports_bank: false,
    transaction_fee_percentage: 0.0,
    fixed_fee: 0.0,
    min_amount: 0.0,
    max_amount: 0.0,
    config_json: "",
    gcash_number: "",
    gcash_qr_code: "",
    gcash_business_name: ""
  });

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    try {
      setLoading(true);
      const gatewaysData = await db.query("payment_methods", { order: "_created_at.desc" });
      setGateways(gatewaysData || []);
    } catch (err) {
      console.error("Error loading gateways:", err);
      setError("Failed to load payment gateways");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGateway = async () => {
    try {
      setError("");
      
      await db.update("payment_methods", { 
        _row_id: `eq.${selectedGateway._row_id}` 
      }, {
        ...formData,
        is_enabled: formData.is_enabled ? 1 : 0,
        supports_cod: formData.supports_cod ? 1 : 0,
        supports_ewallet: formData.supports_ewallet ? 1 : 0,
        supports_card: formData.supports_card ? 1 : 0,
        supports_bank: formData.supports_bank ? 1 : 0
      });

      setSuccess("Payment gateway updated successfully!");
      setShowEditModal(false);
      setSelectedGateway(null);
      loadGateways();
    } catch (err) {
      console.error("Error updating gateway:", err);
      setError("Failed to update payment gateway");
    }
  };

  const handleToggleEnabled = async (gateway: any) => {
    try {
      await db.update("payment_methods", { 
        _row_id: `eq.${gateway._row_id}` 
      }, { is_enabled: gateway.is_enabled ? 0 : 1 });

      setSuccess(`Payment gateway ${gateway.is_enabled ? 'disabled' : 'enabled'} successfully!`);
      loadGateways();
    } catch (err) {
      console.error("Error toggling gateway status:", err);
      setError("Failed to update gateway status");
    }
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
      const result = await content.uploadFile(file, '/content/gcash-qr-codes/');
      
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

  const openEditModal = (gateway: any) => {
    setSelectedGateway(gateway);
    setFormData({
      gateway_name: gateway.gateway_name || "",
      gateway_type: gateway.gateway_type || "gcash",
      api_key: gateway.api_key || "",
      api_secret: gateway.api_secret || "",
      merchant_id: gateway.merchant_id || "",
      is_enabled: gateway.is_enabled !== 0,
      supports_cod: gateway.supports_cod !== 0,
      supports_ewallet: gateway.supports_ewallet !== 0,
      supports_card: gateway.supports_card !== 0,
      supports_bank: gateway.supports_bank !== 0,
      transaction_fee_percentage: gateway.transaction_fee_percentage || 0.0,
      fixed_fee: gateway.fixed_fee || 0.0,
      min_amount: gateway.min_amount || 0.0,
      max_amount: gateway.max_amount || 0.0,
      config_json: gateway.config_json || "",
      gcash_number: gateway.gcash_number || "",
      gcash_qr_code: gateway.gcash_qr_code || "",
      gcash_business_name: gateway.gcash_business_name || ""
    });
    setShowEditModal(true);
  };

  const getGatewayIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "gcash": return <Smartphone className="w-5 h-5 text-blue-600" />;
      case "stripe": return <CreditCard className="w-5 h-5 text-purple-600" />;
      case "paypal": return <Wallet className="w-5 h-5 text-blue-800" />;
      case "bank": return <Building2 className="w-5 h-5 text-green-600" />;
      default: return <CreditCard className="w-5 h-5 text-slate-600" />;
    }
  };

  const getGatewayColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "gcash": return "bg-blue-100 text-blue-700";
      case "stripe": return "bg-purple-100 text-purple-700";
      case "paypal": return "bg-blue-100 text-blue-800";
      case "bank": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getSupportedMethods = (gateway: any) => {
    const methods = [];
    if (gateway.supports_cod) methods.push("COD");
    if (gateway.supports_ewallet) methods.push("E-Wallet");
    if (gateway.supports_card) methods.push("Card");
    if (gateway.supports_bank) methods.push("Bank");
    return methods;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading payment gateways...</p>
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
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Payment Gateway Management</span>
                  <p className="text-sm text-slate-600">Configure payment methods and gateways</p>
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
                  <p className="text-blue-100 mb-1">Total Gateways</p>
                  <p className="text-3xl font-bold">{gateways.length}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Active</p>
                  <p className="text-3xl font-bold">{gateways.filter(g => g.is_enabled !== 0).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">E-Wallets</p>
                  <p className="text-3xl font-bold">{gateways.filter(g => g.supports_ewallet !== 0).length}</p>
                </div>
                <Wallet className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 mb-1">Bank Transfer</p>
                  <p className="text-3xl font-bold">{gateways.filter(g => g.supports_bank !== 0).length}</p>
                </div>
                <Building2 className="w-8 h-8 text-emerald-200" />
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

        {/* Gateways Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gateways.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No payment gateways configured</p>
              <p className="text-sm text-slate-500 mt-2">Contact system administrator to add payment gateways</p>
            </div>
          ) : (
            gateways.map((gateway) => (
              <Card key={gateway._row_id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        {getGatewayIcon(gateway.gateway_type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{gateway.gateway_name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Badge className={`${getGatewayColor(gateway.gateway_type)} text-xs`}>
                            {gateway.gateway_type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">
                            {gateway.is_enabled ? "Active" : "Disabled"}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${gateway.is_enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} flex items-center gap-1`}>
                      {gateway.is_enabled ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {gateway.is_enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gateway.gateway_type === 'gcash' && gateway.gcash_number && (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">GCash Number:</p>
                      <p className="font-medium text-sm">{gateway.gcash_number}</p>
                    </div>
                  )}
                  
                  {gateway.gateway_type === 'gcash' && gateway.gcash_business_name && (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Business Name:</p>
                      <p className="font-medium text-sm">{gateway.gcash_business_name}</p>
                    </div>
                  )}
                  
                  {gateway.gateway_type === 'gcash' && gateway.gcash_qr_code && (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">GCash QR Code:</p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <img 
                          src={gateway.gcash_qr_code} 
                          alt="GCash QR Code" 
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">Supported Methods:</p>
                    <div className="flex flex-wrap gap-1">
                      {getSupportedMethods(gateway).map((method, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-600">Transaction Fee</p>
                      <p className="font-medium">{gateway.transaction_fee_percentage}% + ₱{gateway.fixed_fee}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Min/Max Amount</p>
                      <p className="font-medium">₱{gateway.min_amount} / ₱{gateway.max_amount}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEditModal(gateway)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={gateway.is_enabled ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                      onClick={() => handleToggleEnabled(gateway)}
                    >
                      {gateway.is_enabled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Edit Gateway Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Payment Gateway</DialogTitle>
            <DialogDescription>Update payment gateway settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gateway Name *</Label>
                <Input
                  value={formData.gateway_name}
                  onChange={(e) => setFormData({...formData, gateway_name: e.target.value})}
                  placeholder="GCash Payment Gateway"
                />
              </div>
              <div>
                <Label>Gateway Type *</Label>
                <Select value={formData.gateway_type} onValueChange={(value) => setFormData({...formData, gateway_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gcash">GCash</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>API Key</Label>
                <Input
                  value={formData.api_key}
                  onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                  placeholder="Enter API key"
                  type="password"
                />
              </div>
              <div>
                <Label>API Secret</Label>
                <Input
                  value={formData.api_secret}
                  onChange={(e) => setFormData({...formData, api_secret: e.target.value})}
                  placeholder="Enter API secret"
                  type="password"
                />
              </div>
            </div>

            <div>
              <Label>Merchant ID</Label>
              <Input
                value={formData.merchant_id}
                onChange={(e) => setFormData({...formData, merchant_id: e.target.value})}
                placeholder="Merchant ID"
              />
            </div>

            <div className="space-y-3">
              <Label>Supported Payment Methods</Label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.supports_cod}
                    onChange={(e) => setFormData({...formData, supports_cod: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.supports_ewallet}
                    onChange={(e) => setFormData({...formData, supports_ewallet: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">E-Wallet</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.supports_card}
                    onChange={(e) => setFormData({...formData, supports_card: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.supports_bank}
                    onChange={(e) => setFormData({...formData, supports_bank: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Bank Transfer</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Transaction Fee (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.transaction_fee_percentage}
                  onChange={(e) => setFormData({...formData, transaction_fee_percentage: parseFloat(e.target.value)})}
                  placeholder="2.5"
                />
              </div>
              <div>
                <Label>Fixed Fee (₱)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.fixed_fee}
                  onChange={(e) => setFormData({...formData, fixed_fee: parseFloat(e.target.value)})}
                  placeholder="10.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Amount (₱)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.min_amount}
                  onChange={(e) => setFormData({...formData, min_amount: parseFloat(e.target.value)})}
                  placeholder="100.00"
                />
              </div>
              <div>
                <Label>Maximum Amount (₱)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.max_amount}
                  onChange={(e) => setFormData({...formData, max_amount: parseFloat(e.target.value)})}
                  placeholder="50000.00"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_enabled}
                onChange={(e) => setFormData({...formData, is_enabled: e.target.checked})}
                className="rounded"
              />
              <Label>Enable this payment gateway</Label>
            </div>

            {formData.gateway_type === 'gcash' && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900">GCash Specific Settings</h3>
                
                <div>
                  <Label>GCash Business Name</Label>
                  <Input
                    value={formData.gcash_business_name}
                    onChange={(e) => setFormData({...formData, gcash_business_name: e.target.value})}
                    placeholder="Your Business Name"
                  />
                </div>

                <div>
                  <Label>GCash Number</Label>
                  <Input
                    value={formData.gcash_number}
                    onChange={(e) => setFormData({...formData, gcash_number: e.target.value})}
                    placeholder="09172345678"
                    type="tel"
                  />
                  <p className="text-xs text-slate-500 mt-1">Customers can send payment to this GCash number</p>
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
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateGateway}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentGatewayManagement;