import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Truck, CheckCircle, AlertCircle, 
  ArrowLeft, Search, Store, Plus, Edit, MapPin
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import db from "@/lib/shared/kliv-database.js";

const DeliveryOptionsManagement = () => {
  const [deliveryOptions, setDeliveryOptions] = useState<any[]>([]);
  const [shopOwners, setShopOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showShopOwnerModal, setShowShopOwnerModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedShopOwner, setSelectedShopOwner] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [optionForm, setOptionForm] = useState({
    courier_name: "",
    courier_code: "",
    base_fee: 0.0,
    per_km_fee: 0.0,
    estimated_days: "",
    logo_url: "",
    description: "",
    is_active: true,
    available_nationwide: true,
    api_key: "",
    api_secret: "",
    rate_limit: 50,
    api_tied_user: ""
  });

  const [shopOwnerForm, setShopOwnerForm] = useState({
    delivery_options: [] as number[],
    custom_fees: {} as Record<number, number>,
    minimum_order: 0.0,
    free_delivery_above: 0.0,
    special_instructions: "",
    manual_selection: {} as Record<number, boolean>
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load delivery options
      const options = await db.query("delivery_options", { order: "_created_at.desc" });
      setDeliveryOptions(options || []);

      // Load shop owners with delivery settings
      const stores = await db.query("stores", { order: "_created_at.desc" });
      const enrichedOwners = await Promise.all(
        (stores || []).map(async (store: any) => {
          try {
            const deliverySettings = await db.query("shop_owner_delivery_settings", { 
              shop_owner_id: `eq.${store._row_id}` 
            });
            
            return {
              ...store,
              delivery_settings: deliverySettings || [],
              has_custom_delivery: deliverySettings.length > 0
            };
          } catch {
            return {
              ...store,
              delivery_settings: [],
              has_custom_delivery: false
            };
          }
        })
      );
      
      setShopOwners(enrichedOwners);
    } catch (err) {
      console.error("Error loading delivery data:", err);
      setError("Failed to load delivery options");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOption = async () => {
    try {
      setError("");

      if (selectedOption) {
        // Update existing option
        await db.update("delivery_options", { 
          _row_id: `eq.${selectedOption._row_id}` 
        }, {
          ...optionForm,
          is_active: optionForm.is_active ? 1 : 0,
          available_nationwide: optionForm.available_nationwide ? 1 : 0
        });
      } else {
        // Insert new option
        await db.insert("delivery_options", {
          ...optionForm,
          is_active: optionForm.is_active ? 1 : 0,
          available_nationwide: optionForm.available_nationwide ? 1 : 0
        });
      }

      setSuccess("Delivery option saved successfully!");
      setShowOptionModal(false);
      setSelectedOption(null);
      loadData();
    } catch (err) {
      console.error("Error saving delivery option:", err);
      setError("Failed to save delivery option");
    }
  };

  const handleSaveShopOwnerSettings = async () => {
    try {
      setError("");

      // Remove existing settings for this shop owner
      // Then add new settings
      const shopOwnerId = selectedShopOwner._row_id;
      
      for (const optionId of shopOwnerForm.delivery_options) {
        const existing = selectedShopOwner.delivery_settings?.find((s: any) => s.delivery_option_id === optionId);
        
        if (existing) {
          await db.update("shop_owner_delivery_settings", { 
            _row_id: `eq.${existing._row_id}` 
          }, {
            enabled: 1,
            custom_fee: shopOwnerForm.custom_fees[optionId] || null,
            minimum_order: shopOwnerForm.minimum_order,
            free_delivery_above: shopOwnerForm.free_delivery_above,
            special_instructions: shopOwnerForm.special_instructions,
            manual_selection: shopOwnerForm.manual_selection[optionId] ? 1 : 0
          });
        } else {
          await db.insert("shop_owner_delivery_settings", {
            shop_owner_id: shopOwnerId,
            delivery_option_id: optionId,
            enabled: 1,
            custom_fee: shopOwnerForm.custom_fees[optionId] || null,
            minimum_order: shopOwnerForm.minimum_order,
            free_delivery_above: shopOwnerForm.free_delivery_above,
            special_instructions: shopOwnerForm.special_instructions,
            manual_selection: shopOwnerForm.manual_selection[optionId] ? 1 : 0
          });
        }
      }

      // Disable options that were removed
      if (selectedShopOwner.delivery_settings) {
        for (const existing of selectedShopOwner.delivery_settings) {
          if (!shopOwnerForm.delivery_options.includes(existing.delivery_option_id)) {
            await db.update("shop_owner_delivery_settings", { 
              _row_id: `eq.${existing._row_id}` 
            }, { enabled: 0 });
          }
        }
      }

      setSuccess("Shop owner delivery settings saved successfully!");
      setShowShopOwnerModal(false);
      setSelectedShopOwner(null);
      loadData();
    } catch (err) {
      console.error("Error saving shop owner settings:", err);
      setError("Failed to save shop owner delivery settings");
    }
  };

  const openOptionModal = (option?: any) => {
    if (option) {
      setSelectedOption(option);
      setOptionForm({
        courier_name: option.courier_name || "",
        courier_code: option.courier_code || "",
        base_fee: option.base_fee || 0.0,
        per_km_fee: option.per_km_fee || 0.0,
        estimated_days: option.estimated_days || "",
        logo_url: option.logo_url || "",
        description: option.description || "",
        is_active: option.is_active !== 0,
        available_nationwide: option.available_nationwide !== 0,
        api_key: option.api_key || "",
        api_secret: option.api_secret || "",
        rate_limit: option.rate_limit || 50,
        api_tied_user: option.api_tied_user || ""
      });
    } else {
      setSelectedOption(null);
      setOptionForm({
        courier_name: "",
        courier_code: "",
        base_fee: 0.0,
        per_km_fee: 0.0,
        estimated_days: "",
        logo_url: "",
        description: "",
        is_active: true,
        available_nationwide: true,
        api_key: "",
        api_secret: "",
        rate_limit: 50,
        api_tied_user: ""
      });
    }
    setShowOptionModal(true);
  };

  const openShopOwnerModal = (shopOwner: any) => {
    setSelectedShopOwner(shopOwner);
    
    // Get enabled delivery options and their custom fees
    const enabledOptions = shopOwner.delivery_settings
      ?.filter((s: any) => s.enabled !== 0)
      .map((s: any) => s.delivery_option_id) || [];
    
    const customFees: Record<number, number> = {};
    const manualSelection: Record<number, boolean> = {};
    
    shopOwner.delivery_settings?.forEach((s: any) => {
      if (s.custom_fee) {
        customFees[s.delivery_option_id] = s.custom_fee;
      }
      // Store manual selection status
      manualSelection[s.delivery_option_id] = s.manual_selection === 1;
    });
    
    const firstSetting = shopOwner.delivery_settings?.[0];
    
    setShopOwnerForm({
      delivery_options: enabledOptions,
      custom_fees: customFees,
      minimum_order: firstSetting?.minimum_order || 0.0,
      free_delivery_above: firstSetting?.free_delivery_above || 0.0,
      special_instructions: firstSetting?.special_instructions || "",
      manual_selection: manualSelection
    });
    
    setShowShopOwnerModal(true);
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'SO';
  };

  const filterOptions = () => {
    let filtered = deliveryOptions;

    if (searchTerm) {
      filtered = filtered.filter(option => 
        option.courier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.courier_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter === "active") {
      filtered = filtered.filter(option => option.is_active !== 0);
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter(option => option.is_active === 0);
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading delivery options...</p>
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
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Delivery Options Management</span>
                  <p className="text-sm text-slate-600">Configure delivery couriers and shop owner settings</p>
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
                  <p className="text-blue-100 mb-1">Total Options</p>
                  <p className="text-3xl font-bold">{deliveryOptions.length}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Active</p>
                  <p className="text-3xl font-bold">{deliveryOptions.filter(o => o.is_active !== 0).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Shop Owners</p>
                  <p className="text-3xl font-bold">{shopOwners.length}</p>
                </div>
                <Store className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Custom Delivery</p>
                  <p className="text-3xl font-bold">{shopOwners.filter(o => o.has_custom_delivery).length}</p>
                </div>
                <MapPin className="w-8 h-8 text-orange-200" />
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

        {/* Delivery Options Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Delivery Options</CardTitle>
                <CardDescription>Manage available delivery couriers and their pricing</CardDescription>
              </div>
              <Button onClick={() => openOptionModal()} className="bg-gradient-to-r from-blue-500 to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Delivery Option
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search delivery options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions().map((option) => (
                <Card key={option._row_id} className="border-0 shadow-sm bg-white/90">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{option.courier_name}</h3>
                          <p className="text-sm text-slate-600">{option.courier_code}</p>
                        </div>
                      </div>
                      <Badge className={option.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {option.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Base Fee:</span>
                        <span className="font-medium">₱{option.base_fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Per KM:</span>
                        <span className="font-medium">₱{option.per_km_fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Est. Delivery:</span>
                        <span className="font-medium">{option.estimated_days}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openOptionModal(option)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shop Owner Delivery Settings Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Shop Owner Delivery Settings</CardTitle>
            <CardDescription>Configure which delivery options each shop owner offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-900">Shop Owner</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Store Name</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Delivery Options</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shopOwners.map((owner) => (
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
                        {owner.has_custom_delivery ? (
                          <div className="flex flex-wrap gap-1">
                            {owner.delivery_settings?.filter((s: any) => s.enabled !== 0).length} options
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">Not configured</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={owner.has_custom_delivery ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {owner.has_custom_delivery ? "Configured" : "Using Default"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          onClick={() => openShopOwnerModal(owner)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600"
                        >
                          Configure
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Option Modal */}
      <Dialog open={showOptionModal} onOpenChange={setShowOptionModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedOption ? "Edit" : "Add"} Delivery Option</DialogTitle>
            <DialogDescription>
              {selectedOption ? "Update delivery option details" : "Add new delivery courier"}
            </DialogDescription>
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
                <Label>Courier Name *</Label>
                <Input
                  value={optionForm.courier_name}
                  onChange={(e) => setOptionForm({...optionForm, courier_name: e.target.value})}
                  placeholder="J&T Express"
                />
              </div>
              <div>
                <Label>Courier Code *</Label>
                <Input
                  value={optionForm.courier_code}
                  onChange={(e) => setOptionForm({...optionForm, courier_code: e.target.value})}
                  placeholder="JT_EXPRESS"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Base Fee (₱) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={optionForm.base_fee}
                  onChange={(e) => setOptionForm({...optionForm, base_fee: parseFloat(e.target.value)})}
                  placeholder="50.00"
                />
              </div>
              <div>
                <Label>Per KM Fee (₱) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={optionForm.per_km_fee}
                  onChange={(e) => setOptionForm({...optionForm, per_km_fee: parseFloat(e.target.value)})}
                  placeholder="2.50"
                />
              </div>
            </div>

            <div>
              <Label>Estimated Delivery Time *</Label>
              <Input
                value={optionForm.estimated_days}
                onChange={(e) => setOptionForm({...optionForm, estimated_days: e.target.value})}
                placeholder="2-3 business days"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={optionForm.description}
                onChange={(e) => setOptionForm({...optionForm, description: e.target.value})}
                placeholder="Leading courier service in the Philippines"
              />
            </div>

            <div>
              <Label>Logo URL</Label>
              <Input
                value={optionForm.logo_url}
                onChange={(e) => setOptionForm({...optionForm, logo_url: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </div>

            {/* API Configuration Section */}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-semibold text-sm text-slate-700 mb-3">API Configuration</h3>
              
              <div className="mb-4">
                <Label>API Key</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={optionForm.api_key}
                    onChange={(e) => setOptionForm({...optionForm, api_key: e.target.value})}
                    placeholder="pk_test_ae38a591808e084c10bad14c7c201b42"
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(optionForm.api_key);
                      setSuccess("API Key copied to clipboard!");
                      setTimeout(() => setSuccess(""), 2000);
                    }}
                    disabled={!optionForm.api_key}
                  >
                    📋
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <Label>API Secret</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    value={optionForm.api_secret}
                    onChange={(e) => setOptionForm({...optionForm, api_secret: e.target.value})}
                    placeholder="sk_test_V3jEgdb97yXRyBThAZ4CBZiVAEioqUc66hdb3KO/Ed/fPTGZn"
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(optionForm.api_secret);
                      setSuccess("API Secret copied to clipboard!");
                      setTimeout(() => setSuccess(""), 2000);
                    }}
                    disabled={!optionForm.api_secret}
                  >
                    📋
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Rate-Limit (QPM)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={optionForm.rate_limit}
                      onChange={(e) => setOptionForm({...optionForm, rate_limit: parseInt(e.target.value) || 50})}
                      placeholder="50"
                      min="1"
                    />
                    <span className="text-sm text-slate-600">Queries/min</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Contact partner.support for rate-limit uplift</p>
                </div>
                <div>
                  <Label>API-tied user</Label>
                  <Input
                    type="tel"
                    value={optionForm.api_tied_user}
                    onChange={(e) => setOptionForm({...optionForm, api_tied_user: e.target.value})}
                    placeholder="+639912633528"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Phone number for API access</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={optionForm.is_active}
                onChange={(e) => setOptionForm({...optionForm, is_active: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available_nationwide"
                checked={optionForm.available_nationwide}
                onChange={(e) => setOptionForm({...optionForm, available_nationwide: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="available_nationwide">Available Nationwide</Label>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowOptionModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveOption}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Save Delivery Option
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shop Owner Delivery Settings Modal */}
      <Dialog open={showShopOwnerModal} onOpenChange={setShowShopOwnerModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Shop Owner Delivery Settings</DialogTitle>
            <DialogDescription>
              Set up delivery options for {selectedShopOwner?.store_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Available Delivery Options</Label>
              <div className="space-y-3 mt-2">
                {deliveryOptions.filter(o => o.is_active !== 0).map((option) => (
                  <div key={option._row_id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={shopOwnerForm.delivery_options.includes(option._row_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setShopOwnerForm({
                              ...shopOwnerForm,
                              delivery_options: [...shopOwnerForm.delivery_options, option._row_id]
                            });
                          } else {
                            setShopOwnerForm({
                              ...shopOwnerForm,
                              delivery_options: shopOwnerForm.delivery_options.filter(id => id !== option._row_id)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <div>
                        <p className="font-medium">{option.courier_name}</p>
                        <p className="text-sm text-slate-600">Base: ₱{option.base_fee.toFixed(2)} + ₱{option.per_km_fee.toFixed(2)}/km</p>
                      </div>
                    </div>
                    
                    {shopOwnerForm.delivery_options.includes(option._row_id) && (
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">Custom Fee:</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={shopOwnerForm.custom_fees[option._row_id] || ""}
                            onChange={(e) => setShopOwnerForm({
                              ...shopOwnerForm,
                              custom_fees: {
                                ...shopOwnerForm.custom_fees,
                                [option._row_id]: parseFloat(e.target.value) || 0
                              }
                            })}
                            placeholder={"Default: ₱" + option.base_fee.toFixed(2)}
                            className="w-32"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Label className="text-xs text-slate-600">Manual Selection:</Label>
                          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => setShopOwnerForm({
                                ...shopOwnerForm,
                                manual_selection: {
                                  ...shopOwnerForm.manual_selection,
                                  [option._row_id]: true
                                }
                              })}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                shopOwnerForm.manual_selection[option._row_id] === true
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setShopOwnerForm({
                                ...shopOwnerForm,
                                manual_selection: {
                                  ...shopOwnerForm.manual_selection,
                                  [option._row_id]: false
                                }
                              })}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                shopOwnerForm.manual_selection[option._row_id] === false
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Admin selects if this option requires manual confirmation</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Order for Delivery (₱)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={shopOwnerForm.minimum_order}
                  onChange={(e) => setShopOwnerForm({...shopOwnerForm, minimum_order: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
                <p className="text-xs text-slate-500 mt-1">Minimum order amount to qualify for delivery</p>
              </div>
              <div>
                <Label>Free Delivery Above (₱)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={shopOwnerForm.free_delivery_above}
                  onChange={(e) => setShopOwnerForm({...shopOwnerForm, free_delivery_above: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
                <p className="text-xs text-slate-500 mt-1">Free delivery for orders above this amount</p>
              </div>
            </div>

            <div>
              <Label>Special Instructions (Optional)</Label>
              <Input
                value={shopOwnerForm.special_instructions}
                onChange={(e) => setShopOwnerForm({...shopOwnerForm, special_instructions: e.target.value})}
                placeholder="Additional delivery instructions for customers"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Delivery Configuration:</strong> Select which delivery options this shop owner offers.
                Set custom fees to override default courier pricing. Customers will see available options during checkout.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowShopOwnerModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveShopOwnerSettings}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Save Delivery Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryOptionsManagement;