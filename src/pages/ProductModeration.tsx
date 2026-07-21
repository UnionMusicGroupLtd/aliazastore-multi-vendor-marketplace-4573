import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Package, ArrowLeft, Search, CheckCircle, XCircle, AlertTriangle, Eye
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";
import db from "@/lib/shared/kliv-database.js";

const ProductModeration = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("flagged");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Load products that need moderation
      const allProducts = await db.query("products", { 
        order: "_created_at.desc",
        limit: "100"
      });
      
      // Filter products that need attention
      const needsAttention = (allProducts || []).filter((p: any) => 
        p.requires_moderation === 1 || p.is_flagged === 1 || p.is_active === 0
      );
      
      setProducts(needsAttention);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProduct = async (product: any) => {
    try {
      setError("");
      await db.update("products", { _row_id: `eq.${product._row_id}` }, {
        is_active: 1,
        is_flagged: 0,
        requires_moderation: 0,
        moderated_at: Math.floor(Date.now() / 1000)
      });
      
      setSuccess("Product approved successfully!");
      loadProducts();
    } catch (err) {
      console.error("Error approving product:", err);
      setError("Failed to approve product");
    }
  };

  const handleRejectProduct = async (product: any) => {
    try {
      setError("");
      await db.update("products", { _row_id: `eq.${product._row_id}` }, {
        is_active: 0,
        is_flagged: 1,
        requires_moderation: 0,
        rejection_reason: "Violates community guidelines"
      });
      
      setSuccess("Product rejected successfully!");
      loadProducts();
    } catch (err) {
      console.error("Error rejecting product:", err);
      setError("Failed to reject product");
    }
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const filteredProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter === "flagged") {
      filtered = filtered.filter(p => p.is_flagged === 1);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(p => p.requires_moderation === 1);
    } else if (statusFilter === "rejected") {
      filtered = filtered.filter(p => p.is_active === 0);
    }

    return filtered;
  };

  const getStatusBadge = (product: any) => {
    if (product.is_flagged === 1) return { label: "Flagged", color: "bg-red-100 text-red-700" };
    if (product.requires_moderation === 1) return { label: "Pending", color: "bg-orange-100 text-orange-700" };
    if (product.is_active === 0) return { label: "Rejected", color: "bg-gray-100 text-gray-700" };
    return { label: "Active", color: "bg-green-100 text-green-700" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/admin" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Product Moderation</span>
                <p className="text-sm text-slate-600">Review flagged and pending products</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Flagged</p>
                  <p className="text-3xl font-bold">{products.filter(p => p.is_flagged === 1).length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 mb-1">Pending</p>
                  <p className="text-3xl font-bold">{products.filter(p => p.requires_moderation === 1).length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 mb-1">Rejected</p>
                  <p className="text-3xl font-bold">{products.filter(p => p.is_active === 0).length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Total to Review</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
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
                    placeholder="Search products..."
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
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Products Requiring Review</CardTitle>
            <CardDescription>Review and moderate flagged or pending products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts().map((product) => {
                const statusBadge = getStatusBadge(product);
                return (
                  <div key={product._row_id} className="p-6 border border-slate-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{product.description?.substring(0, 100)}...</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-sm font-medium">₱{product.price?.toFixed(2)}</span>
                            <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
                            <span className="text-sm text-slate-600">Store ID: {product.store_id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openProductModal(product)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveProduct(product)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectProduct(product)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product View Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                  <p className="text-lg font-semibold text-green-600 mt-2">₱{selectedProduct.price?.toFixed(2)}</p>
                  <p className="text-sm text-slate-600 mt-4">{selectedProduct.description}</p>
                  <div className="flex items-center space-x-2 mt-4">
                    <span className="text-sm">Stock:</span>
                    <Badge>{selectedProduct.stock || 0}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Product Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Store ID:</span>
                    <p className="font-medium">{selectedProduct.store_id}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Category:</span>
                    <p className="font-medium">{selectedProduct.category_id}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Created:</span>
                    <p className="font-medium">{selectedProduct._created_at ? new Date(selectedProduct._created_at * 1000).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Status:</span>
                    <Badge className={getStatusBadge(selectedProduct).color}>{getStatusBadge(selectedProduct).label}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductModeration;