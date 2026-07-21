import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Store, Users, Clock, AlertCircle, CheckCircle, 
  Pause, Ban, Gift, Search, X, Eye,
  Package, ShoppingCart, Plus, Edit, Trash2
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog-simple";
import { Textarea } from "@/components/ui/textarea";
import db from "@/lib/shared/kliv-database.js";

const ShopOwnerManagement = () => {
  const [shopOwners, setShopOwners] = useState<any[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);
  const [showStoreDetailModal, setShowStoreDetailModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  const [newStore, setNewStore] = useState({
    name: "",
    description: "",
    owner_email: "",
    owner_full_name: "",
    owner_mobile: "",
    owner_address: "",
    owner_facebook_id: "",
    owner_govt_id: "",
    store_bio: "",
    status: "trial"
  });
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: ""
  });
  
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'grant_trial' | 'suspend' | 'hold' | 'activate' | null;
    owner: any;
  }>({ open: false, type: null, owner: null });
  const [actionData, setActionData] = useState({
    trialDays: 14,
    reason: "",
    notes: ""
  });

  useEffect(() => {
    loadShopOwners();
  }, []);

  useEffect(() => {
    filterShopOwners();
  }, [shopOwners, searchQuery, statusFilter]);

  const loadShopOwners = async () => {
    try {
      setLoading(true);
      // Load stores with owner information
      const stores = await db.query("stores", {
        limit: "100",
        order: "_created_at.desc"
      });
      
      // Enhance with mock user data and additional info
      const enrichedOwners = stores.map((store: any) => {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        const trialEnd = store.trial_end_date || (store._created_at + (14 * dayInMs));
        const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / dayInMs));
        
        return {
          ...store,
          owner_name: store.name?.split(' ')[0] || 'Unknown',
          owner_email: `owner${store._row_id}@example.com`,
          products_count: Math.floor(Math.random() * 100) + 5,
          orders_count: Math.floor(Math.random() * 50) + 1,
            trial_days_left: daysLeft,
          is_trial_expired: daysLeft === 0
        };
      });
      
      setShopOwners(enrichedOwners);
      setFilteredOwners(enrichedOwners);
    } catch (error) {
      console.error("Error loading shop owners:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterShopOwners = () => {
    let filtered = [...shopOwners];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(owner => 
        owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.owner_email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(owner => owner.status === statusFilter);
    }
    
    setFilteredOwners(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "trial": return "bg-blue-100 text-blue-700";
      case "active": return "bg-green-100 text-green-700";
      case "suspended": return "bg-red-100 text-red-700";
      case "held": return "bg-orange-100 text-orange-700";
      case "cancelled": return "bg-gray-100 text-gray-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "trial": return <Clock className="w-4 h-4" />;
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "suspended": return <Ban className="w-4 h-4" />;
      case "held": return <Pause className="w-4 h-4" />;
      case "cancelled": return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleCreateStore = async () => {
    try {
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      // Generate store QR code data (unique URL for each store)
      const storeQrData = `https://aliazastore-multi-vendor-marketplace.kliv.site/store/${now}`;
      
      const storeData = {
        name: newStore.name,
        description: newStore.description,
        owner_email: newStore.owner_email,
        owner_full_name: newStore.owner_full_name,
        owner_mobile: newStore.owner_mobile,
        owner_address: newStore.owner_address,
        owner_facebook_id: newStore.owner_facebook_id,
        owner_govt_id: newStore.owner_govt_id,
        store_bio: newStore.store_bio,
        store_qr_code: storeQrData,
        status: newStore.status,
        trial_start_date: now,
        trial_end_date: now + (14 * dayInMs),
        admin_granted_free_trials: 0
      };
      
      await db.insert("stores", storeData);
      
      // Reset form and refresh
      setNewStore({
        name: "",
        description: "",
        owner_email: "",
        owner_full_name: "",
        owner_mobile: "",
        owner_address: "",
        owner_facebook_id: "",
        owner_govt_id: "",
        store_bio: "",
        status: "trial"
      });
      setShowCreateStoreModal(false);
      loadShopOwners();
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

  const openStoreDetail = async (store: any) => {
    try {
      setSelectedStore(store);
      
      // Load store products
      const products = await db.query("products", {
        store_id: `eq.${store._row_id}`,
        limit: "50"
      });
      
      setStoreProducts(products || []);
      setShowStoreDetailModal(true);
    } catch (error) {
      console.error("Error loading store details:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        store_id: selectedStore._row_id,
        category_id: parseInt(newProduct.category_id) || 1,
        is_active: 1,
        is_flagged: 0
      };
      
      await db.insert("products", productData);
      
      // Reset form and refresh products
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: ""
      });
      setShowAddProductModal(false);
      
      // Reload products
      await openStoreDetail(selectedStore);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await db.delete("products", { _row_id: `eq.${productId}` });
      
      // Reload products
      await openStoreDetail(selectedStore);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateStore = async () => {
    try {
      await db.update("stores", { _row_id: `eq.${selectedStore._row_id}` }, {
        name: selectedStore.name,
        description: selectedStore.description,
        owner_email: selectedStore.owner_email
      });
      
      setShowStoreDetailModal(false);
      loadShopOwners();
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  const handleAction = async () => {
    try {
      const { type, owner } = actionDialog;
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;

      let updateData: any = {};

      switch (type) {
        case 'grant_trial':
          const newTrialEnd = now + (actionData.trialDays * dayInMs);
          updateData = {
            trial_start_date: now,
            trial_end_date: newTrialEnd,
            admin_granted_free_trials: (owner.admin_granted_free_trials || 0) + 1,
            status: 'trial'
          };
          break;
        case 'suspend':
          updateData = {
            status: 'suspended',
            suspension_reason: actionData.reason,
            suspension_notes: actionData.notes,
            suspended_date: now
          };
          break;
        case 'hold':
          updateData = {
            status: 'held',
            suspension_reason: actionData.reason,
            suspension_notes: actionData.notes
          };
          break;
        case 'activate':
          updateData = {
            status: 'active',
            subscription_start_date: now,
            suspension_reason: null,
            suspension_notes: null,
            suspended_date: null
          };
          break;
      }

      await db.update("stores", { _row_id: `eq.${owner._row_id}` }, updateData);
      
      // Refresh data
      await loadShopOwners();
      setActionDialog({ open: false, type: null, owner: null });
      setActionData({ trialDays: 14, reason: "", notes: "" });
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  const stats = {
    total: shopOwners.length,
    trial: shopOwners.filter(o => o.status === 'trial').length,
    active: shopOwners.filter(o => o.status === 'active').length,
    suspended: shopOwners.filter(o => o.status === 'suspended').length,
    held: shopOwners.filter(o => o.status === 'held').length,
    expired_trial: shopOwners.filter(o => o.is_trial_expired).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading shop owners...</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">AliazaStore</span>
                  <Badge className="ml-2 bg-purple-100 text-purple-700">Admin</Badge>
                </div>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold">Shop Owner Management</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Owners</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm">On Trial</p>
                  <p className="text-2xl font-bold">{stats.trial}</p>
                </div>
                <Clock className="w-8 h-8 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Suspended</p>
                  <p className="text-2xl font-bold">{stats.suspended}</p>
                </div>
                <Ban className="w-8 h-8 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">On Hold</p>
                  <p className="text-2xl font-bold">{stats.held}</p>
                </div>
                <Pause className="w-8 h-8 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Trial Expired</p>
                  <p className="text-2xl font-bold">{stats.expired_trial}</p>
                </div>
                <AlertCircle className="w-8 h-8 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-filter">Status:</Label>
                <select
                  id="status-filter"
                  className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="trial">On Trial</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="held">On Hold</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shop Owners List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Shop Owners</CardTitle>
                <CardDescription>Manage shop owner accounts, trials, and subscriptions</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-700">
                  {filteredOwners.length} owners
                </Badge>
                <Button 
                  onClick={() => setShowCreateStoreModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Store
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOwners.map((owner) => (
                <div key={owner._row_id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {owner.owner_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{owner.name}</h3>
                          <Badge className={`text-xs ${getStatusColor(owner.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(owner.status)}
                              <span>{owner.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{owner.owner_email}</p>
                        
                        {/* Trial Info */}
                        {owner.status === 'trial' && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-slate-600">
                              {owner.trial_days_left} days left in trial
                            </span>
                            {owner.trial_days_left <= 3 && (
                              <Badge className="bg-orange-100 text-orange-700 text-xs">
                                Trial ending soon
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Package className="w-4 h-4" />
                            <span>{owner.products_count} products</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ShoppingCart className="w-4 h-4" />
                            <span>{owner.orders_count} orders</span>
                          </div>
                          {owner.admin_granted_free_trials > 0 && (
                            <div className="flex items-center space-x-1">
                              <Gift className="w-4 h-4 text-purple-500" />
                              <span>{owner.admin_granted_free_trials} free trials granted</span>
                            </div>
                          )}
                        </div>

                        {/* Suspension Info */}
                        {(owner.status === 'suspended' || owner.status === 'held') && owner.suspension_reason && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                            <p className="font-medium text-red-700">Reason: {owner.suspension_reason}</p>
                            {owner.suspension_notes && (
                              <p className="text-red-600 text-xs mt-1">Notes: {owner.suspension_notes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openStoreDetail(owner)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Manage
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{owner.name} - Details</DialogTitle>
                            <DialogDescription>Complete shop owner information</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-slate-600">Status</Label>
                                <p className="font-medium">{owner.status}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-slate-600">Email</Label>
                                <p className="font-medium">{owner.owner_email}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-slate-600">Products</Label>
                                <p className="font-medium">{owner.products_count}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-slate-600">Orders</Label>
                                <p className="font-medium">{owner.orders_count}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-slate-600">Trial Days Left</Label>
                                <p className="font-medium">{owner.trial_days_left}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-slate-600">Free Trials Granted</Label>
                                <p className="font-medium">{owner.admin_granted_free_trials}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {owner.status !== 'active' && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => setActionDialog({ open: true, type: 'activate', owner })}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}

                      {owner.status !== 'trial' && (
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => setActionDialog({ open: true, type: 'grant_trial', owner })}
                        >
                          <Gift className="w-4 h-4 mr-1" />
                          Grant Trial
                        </Button>
                      )}

                      {owner.status !== 'suspended' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setActionDialog({ open: true, type: 'suspend', owner })}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {owner.status !== 'held' && (
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                          onClick={() => setActionDialog({ open: true, type: 'hold', owner })}
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Hold
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredOwners.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No shop owners found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Store Modal */}
      <Dialog open={showCreateStoreModal} onOpenChange={setShowCreateStoreModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Store</DialogTitle>
            <DialogDescription>Add a new store to the marketplace with complete owner information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Store Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Store Name *</Label>
                  <Input
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    placeholder="My Amazing Store"
                  />
                </div>
                <div>
                  <Label>Owner Email *</Label>
                  <Input
                    type="email"
                    value={newStore.owner_email}
                    onChange={(e) => setNewStore({ ...newStore, owner_email: e.target.value })}
                    placeholder="owner@example.com"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={newStore.description}
                    onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                    placeholder="Brief store description"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Store Bio</Label>
                  <Input
                    value={newStore.store_bio}
                    onChange={(e) => setNewStore({ ...newStore, store_bio: e.target.value })}
                    placeholder="Detailed store story and mission"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Owner Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={newStore.owner_full_name}
                    onChange={(e) => setNewStore({ ...newStore, owner_full_name: e.target.value })}
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div>
                  <Label>Mobile Number *</Label>
                  <Input
                    value={newStore.owner_mobile}
                    onChange={(e) => setNewStore({ ...newStore, owner_mobile: e.target.value })}
                    placeholder="+63 912 345 6789"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Complete Address *</Label>
                  <Input
                    value={newStore.owner_address}
                    onChange={(e) => setNewStore({ ...newStore, owner_address: e.target.value })}
                    placeholder="123 Main St, Barangay, City, Province"
                  />
                </div>
                <div>
                  <Label>Facebook ID/Link</Label>
                  <Input
                    value={newStore.owner_facebook_id}
                    onChange={(e) => setNewStore({ ...newStore, owner_facebook_id: e.target.value })}
                    placeholder="facebook.com/username"
                  />
                </div>
                <div>
                  <Label>Government ID Number</Label>
                  <Input
                    value={newStore.owner_govt_id}
                    onChange={(e) => setNewStore({ ...newStore, owner_govt_id: e.target.value })}
                    placeholder="Passport/UMID/TIN Number"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Initial Status</Label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                value={newStore.status}
                onChange={(e) => setNewStore({ ...newStore, status: e.target.value })}
              >
                <option value="trial">Trial (14 days free)</option>
                <option value="active">Active (Paid)</option>
              </select>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>🎁 Store QR Code:</strong> A unique QR code will be automatically generated for this store, allowing customers to directly scan and visit your store page.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateStoreModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateStore}
                className="bg-gradient-to-r from-green-500 to-green-600"
                disabled={!newStore.name || !newStore.owner_email || !newStore.owner_full_name || !newStore.owner_mobile || !newStore.owner_address}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Store with QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Store Detail Modal */}
      <Dialog open={showStoreDetailModal} onOpenChange={setShowStoreDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Store Management</DialogTitle>
            <DialogDescription>Manage store details and products</DialogDescription>
          </DialogHeader>
          
          {selectedStore && (
            <div className="space-y-6">
              {/* Store Information */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Store Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-600">Store Name</Label>
                    <Input
                      value={selectedStore.name}
                      onChange={(e) => setSelectedStore({ ...selectedStore, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Owner Email</Label>
                    <Input
                      type="email"
                      value={selectedStore.owner_email}
                      onChange={(e) => setSelectedStore({ ...selectedStore, owner_email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-slate-600">Description</Label>
                    <Input
                      value={selectedStore.description}
                      onChange={(e) => setSelectedStore({ ...selectedStore, description: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    onClick={handleUpdateStore}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Update Store
                  </Button>
                </div>
              </div>

              {/* Products Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Products ({storeProducts.length})</h3>
                  <Button
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {storeProducts.map((product) => (
                    <div key={product._row_id} className="p-3 border border-slate-200 rounded-lg bg-white flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="flex items-center space-x-3 text-sm text-slate-600">
                            <span>₱{product.price?.toFixed(2)}</span>
                            <Badge className={product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product._row_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {storeProducts.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No products yet. Add your first product!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Store Stats */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Store Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{storeProducts.length}</p>
                    <p className="text-sm text-slate-600">Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {storeProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}
                    </p>
                    <p className="text-sm text-slate-600">Total Stock</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      ₱{storeProducts.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">Inventory Value</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Add a product to {selectedStore?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Product Name *</Label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Product description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₱) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Stock *</Label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Category ID</Label>
              <Input
                type="number"
                value={newProduct.category_id}
                onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                placeholder="1"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddProductModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-orange-500 to-orange-600"
                disabled={!newProduct.name || !newProduct.price || !newProduct.stock}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null, owner: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'grant_trial' && 'Grant Free Trial'}
              {actionDialog.type === 'suspend' && 'Suspend Shop Owner'}
              {actionDialog.type === 'hold' && 'Place Shop Owner on Hold'}
              {actionDialog.type === 'activate' && 'Activate Shop Owner'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'grant_trial' && `Grant free trial to ${actionDialog.owner?.name}`}
              {actionDialog.type === 'suspend' && `Suspend ${actionDialog.owner?.name} - store will go offline`}
              {actionDialog.type === 'hold' && `Place ${actionDialog.owner?.name} on hold - read-only mode`}
              {actionDialog.type === 'activate' && `Activate ${actionDialog.owner?.name} - start paid subscription`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionDialog.type === 'grant_trial' && (
              <div>
                <Label>Trial Duration (days)</Label>
                <Input
                  type="number"
                  value={actionData.trialDays}
                  onChange={(e) => setActionData({ ...actionData, trialDays: parseInt(e.target.value) || 14 })}
                  min="1"
                  max="90"
                />
              </div>
            )}

            {actionDialog.type === 'suspend' && (
              <>
                <div>
                  <Label>Reason for Suspension *</Label>
                  <Input
                    placeholder="e.g., Policy violation, fraud, inactive account"
                    value={actionData.reason}
                    onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Any additional information..."
                    value={actionData.notes}
                    onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                  />
                </div>
              </>
            )}

            {actionDialog.type === 'hold' && (
              <>
                <div>
                  <Label>Reason for Hold *</Label>
                  <Input
                    placeholder="e.g., Account review, payment issues"
                    value={actionData.reason}
                    onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Any additional information..."
                    value={actionData.notes}
                    onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null, owner: null })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                className={
                  actionDialog.type === 'activate' ? 'bg-green-500 hover:bg-green-600' :
                  actionDialog.type === 'grant_trial' ? 'bg-blue-500 hover:bg-blue-600' :
                  actionDialog.type === 'hold' ? 'bg-orange-500 hover:bg-orange-600' :
                  'bg-red-500 hover:bg-red-600'
                }
              >
                {actionDialog.type === 'grant_trial' && 'Grant Trial'}
                {actionDialog.type === 'suspend' && 'Suspend Owner'}
                {actionDialog.type === 'hold' && 'Place on Hold'}
                {actionDialog.type === 'activate' && 'Activate'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopOwnerManagement;