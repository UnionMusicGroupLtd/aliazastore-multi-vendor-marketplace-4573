import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Store, ArrowLeft, Plus, Edit, Trash2, Package, ShoppingCart, 
  TrendingUp, Users, CheckCircle, AlertCircle, Clock, Phone, MapPin,
  Facebook, FileText, QrCode
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { SimpleTabs, SimpleTabsList, SimpleTabsTrigger, SimpleTabsContent } from "@/components/ui/simple-tabs";
import db from "@/lib/shared/kliv-database.js";

console.log("StoreDetail component loaded - production build fix applied");

const StoreDetail = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [success, setSuccess] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "1"
  });

  useEffect(() => {
    if (storeId) {
      loadStoreData();
    }
  }, [storeId]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      
      if (!storeId) return;
      
      // Load store
      const stores = await db.query("stores", { _row_id: `eq.${storeId}` });
      const storeData = stores[0];
      
      // Load products
      const productsData = await db.query("products", { 
        store_id: `eq.${storeId}`,
        limit: "100"
      });
      
      // Load orders (mock data)
      const ordersData = await db.query("orders", { 
        store_id: `eq.${storeId}`,
        limit: "20"
      });
      
      setStore(storeData);
      setProducts(productsData || []);
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error loading store data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStore = async () => {
    try {
      await db.update("stores", { _row_id: `eq.${storeId}` }, {
        name: store.name,
        description: store.description,
        owner_email: store.owner_email,
        owner_full_name: store.owner_full_name,
        owner_mobile: store.owner_mobile,
        owner_address: store.owner_address,
        owner_facebook_id: store.owner_facebook_id,
        owner_govt_id: store.owner_govt_id,
        store_bio: store.store_bio
      });
      
      setSuccess("Store updated successfully!");
      setShowEditStoreModal(false);
      setTimeout(() => setSuccess(""), 3000);
      loadStoreData();
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        store_id: parseInt(storeId || "0"),
        category_id: parseInt(newProduct.category_id),
        is_active: 1,
        is_flagged: 0
      };
      
      await db.insert("products", productData);
      
      setSuccess("Product added successfully!");
      setShowAddProductModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "1"
      });
      setTimeout(() => setSuccess(""), 3000);
      loadStoreData();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await db.delete("products", { _row_id: `eq.${productId}` });
      setSuccess("Product deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      loadStoreData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getStoreStatusBadge = (status: string) => {
    switch (status) {
      case "trial": return { label: "Trial", color: "bg-blue-100 text-blue-700" };
      case "active": return { label: "Active", color: "bg-green-100 text-green-700" };
      case "suspended": return { label: "Suspended", color: "bg-red-100 text-red-700" };
      case "held": return { label: "On Hold", color: "bg-orange-100 text-orange-700" };
      default: return { label: "Unknown", color: "bg-gray-100 text-gray-700" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Store not found</p>
          <Link to="/dashboard/admin">
            <Button className="mt-4">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStoreStatusBadge(store.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin/shop-owners" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">{store.name}</span>
                  <Badge className={`ml-2 ${statusBadge.color}`}>{statusBadge.label}</Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowEditStoreModal(true)} className="bg-gradient-to-r from-orange-500 to-orange-600">
              <Edit className="w-4 h-4 mr-2" />
              Edit Store
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Store Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Total Stock</p>
                  <p className="text-3xl font-bold">{products.reduce((sum, p) => sum + (p.stock || 0), 0)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Inventory Value</p>
                  <p className="text-2xl font-bold">₱{products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0).toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Information */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-slate-600">Store Name</Label>
                <p className="font-medium">{store.name}</p>
              </div>
              <div>
                <Label className="text-sm text-slate-600">Owner Email</Label>
                <p className="font-medium">{store.owner_email}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm text-slate-600">Description</Label>
                <p className="font-medium">{store.description || "No description"}</p>
              </div>
              
              {/* Owner Information */}
              <div className="col-span-2">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Owner Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-600">Full Name</Label>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <p className="font-medium">{store.owner_full_name || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Mobile Number</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <p className="font-medium">{store.owner_mobile || "N/A"}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-slate-600">Complete Address</Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <p className="font-medium">{store.owner_address || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Facebook ID</Label>
                    <div className="flex items-center space-x-2">
                      <Facebook className="w-4 h-4 text-slate-400" />
                      <p className="font-medium">{store.owner_facebook_id || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Government ID</Label>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <p className="font-medium">{store.owner_govt_id || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Bio */}
              {store.store_bio && (
                <div className="col-span-2">
                  <Label className="text-sm text-slate-600">Store Bio</Label>
                  <p className="font-medium bg-blue-50 p-3 rounded-lg">{store.store_bio}</p>
                </div>
              )}

              <div>
                <Label className="text-sm text-slate-600">Status</Label>
                <Badge className={`${statusBadge.color} mt-1`}>{statusBadge.label}</Badge>
              </div>
              {store.status === "trial" && store.trial_end_date && (
                <div>
                  <Label className="text-sm text-slate-600">Trial Period</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">
                      {Math.max(0, Math.ceil((store.trial_end_date - Date.now()) / (24 * 60 * 60 * 1000)))} days remaining
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Store QR Code */}
        {store.store_qr_code && (
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                Store QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-32 h-32 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-800" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Direct Store Access</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Customers can scan this QR code to directly visit your store page. Share this on your marketing materials, social media, or physical products.
                  </p>
                  <div className="bg-slate-100 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Store URL:</p>
                    <p className="text-sm font-mono text-slate-800 break-all">{store.store_qr_code}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products and Orders */}
        <SimpleTabs defaultValue="products" className="space-y-6">
          <SimpleTabsList>
            <SimpleTabsTrigger value="products">Products ({products.length})</SimpleTabsTrigger>
            <SimpleTabsTrigger value="orders">Orders ({orders.length})</SimpleTabsTrigger>
          </SimpleTabsList>

          <SimpleTabsContent value="products">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products</CardTitle>
                  <Button onClick={() => setShowAddProductModal(true)} className="bg-gradient-to-r from-orange-500 to-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product._row_id} className="p-4 border border-slate-200 rounded-lg bg-white flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-slate-600">{product.description?.substring(0, 60)}...</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="font-semibold text-green-600">₱{product.price?.toFixed(2)}</span>
                            <Badge className={product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                            </Badge>
                            <Badge className={product.is_active ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                              {product.is_active ? "Active" : "Inactive"}
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
                  
                  {products.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No products yet</p>
                      <Button onClick={() => setShowAddProductModal(true)} className="bg-gradient-to-r from-orange-500 to-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Product
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </SimpleTabsContent>

          <SimpleTabsContent value="orders">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order._row_id} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Order #{order.order_id?.substring(0, 8)}</h4>
                          <div className="flex items-center space-x-3 mt-2 text-sm text-slate-600">
                            <span>Customer: {order.customer_email}</span>
                            <span>Total: ₱{order.total_amount?.toFixed(2)}</span>
                            <Badge className={
                              order.status === "delivered" ? "bg-green-100 text-green-700" :
                              order.status === "pending" ? "bg-orange-100 text-orange-700" :
                              "bg-blue-100 text-blue-700"
                            }>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm text-slate-600">
                          {order._created_at ? new Date(order._created_at * 1000).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No orders yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </SimpleTabsContent>
        </SimpleTabs>
      </div>

      {/* Edit Store Modal */}
      <Dialog open={showEditStoreModal} onOpenChange={setShowEditStoreModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>Update store information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Store Name</Label>
              <Input
                value={store.name}
                onChange={(e) => setStore({ ...store, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Owner Email</Label>
              <Input
                type="email"
                value={store.owner_email}
                onChange={(e) => setStore({ ...store, owner_email: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={store.description}
                onChange={(e) => setStore({ ...store, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Owner Full Name</Label>
              <Input
                value={store.owner_full_name}
                onChange={(e) => setStore({ ...store, owner_full_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input
                value={store.owner_mobile}
                onChange={(e) => setStore({ ...store, owner_mobile: e.target.value })}
              />
            </div>
            <div>
              <Label>Complete Address</Label>
              <Input
                value={store.owner_address}
                onChange={(e) => setStore({ ...store, owner_address: e.target.value })}
              />
            </div>
            <div>
              <Label>Facebook ID</Label>
              <Input
                value={store.owner_facebook_id}
                onChange={(e) => setStore({ ...store, owner_facebook_id: e.target.value })}
              />
            </div>
            <div>
              <Label>Government ID</Label>
              <Input
                value={store.owner_govt_id}
                onChange={(e) => setStore({ ...store, owner_govt_id: e.target.value })}
              />
            </div>
            <div>
              <Label>Store Bio</Label>
              <Input
                value={store.store_bio}
                onChange={(e) => setStore({ ...store, store_bio: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditStoreModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStore} className="bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Store
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Add a product to {store.name}</DialogDescription>
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
              <Button variant="outline" onClick={() => setShowAddProductModal(false)}>
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
    </div>
  );
};

export default StoreDetail;