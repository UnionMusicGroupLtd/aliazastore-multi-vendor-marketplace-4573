import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Ban, Edit, Trash2, Plus, Save, 
  Package, DollarSign, Truck, Image as ImageIcon,
  CheckCircle2, AlertCircle, Eye 
} from "lucide-react";
import db from "@/lib/shared/kliv-database.js";
import { content } from "@/lib/shared/kliv-content.js";

interface Product {
  _row_id: number;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  image_url: string;
  category: string;
  subcategory?: string;
  in_stock: number;
  featured: number;
  age_restricted: number;
  is_banned: number;
  ban_reason?: string;
  on_sale: number;
  sale_price?: number;
  discount_percentage?: number;
  sale_start_date?: string;
  sale_end_date?: string;
  offer_badge?: string;
  offer_description?: string;
  delivery_enabled: number;
  delivery_fee?: number;
  free_delivery_threshold?: number;
  delivery_time?: string;
}

const AdminProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Full category objects
  const [subcategories, setSubcategories] = useState<any[]>([]); // Subcategories for selected category
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    compare_price: "",
    category: "",
    subcategory: "",
    in_stock: "1",
    featured: "0",
    age_restricted: "0",
    image_url: "",
    on_sale: "0",
    sale_price: "",
    discount_percentage: "",
    sale_start_date: "",
    sale_end_date: "",
    offer_badge: "",
    offer_description: "",
    delivery_enabled: "1",
    delivery_fee: "0",
    free_delivery_threshold: "50",
    delivery_time: "2-3 business days"
  });

  // Ban form
  const [banForm, setBanForm] = useState({
    ban_reason: ""
  });

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Load data on mount
  useEffect(() => {
    console.log("🚀 AdminProductManagement component mounted");
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // Load main categories (level 0) from categories_new table
      const allCategories = await db.query("categories_new", { 
        is_active: `eq.${1}`,
        order: "name.asc" 
      });
      
      setCategories(allCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
      // Fallback to basic categories if database fails
      setCategories([
        { _row_id: 1, name: 'Vibrators', level: 0 },
        { _row_id: 2, name: 'Couples Toys', level: 0 },
        { _row_id: 3, name: 'Lingerie', level: 0 },
        { _row_id: 4, name: 'Massage', level: 0 },
        { _row_id: 5, name: 'Bondage', level: 0 },
        { _row_id: 6, name: 'Lubricants', level: 0 },
        { _row_id: 7, name: 'Massagers', level: 0 },
        { _row_id: 8, name: 'Games', level: 0 }
      ]);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    try {
      // Find the selected category to get its _row_id
      const selectedCategory = categories.find(cat => cat.name === categoryId);
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }

      // Load subcategories for this category using correct PostgREST format
      const subcatsData = await db.query("categories_new", {
        is_active: `eq.${1}`,
        parent_id: `eq.${selectedCategory._row_id}`,
        level: `eq.${1}`,
        order: "name.asc"
      });
      
      setSubcategories(subcatsData);
    } catch (err) {
      console.error("Error loading subcategories:", err);
      setSubcategories([]);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      console.log("📦 Loading products...");
      const productsData = await db.query("products", { order: "_created_at.desc" });
      console.log("✅ Products loaded:", productsData.length, "products");
      console.log("📋 Product details:", productsData.map(p => ({ id: p._row_id, name: p.name })));
      setProducts(productsData as unknown as Product[]);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Upload to content filesystem
      const result = await content.uploadFile(file, '/content/product-images/');
      
      if (result && result.path) {
        setImagePreview(result.path);
        setProductForm({ ...productForm, image_url: result.path });
        setSuccess('Image uploaded successfully!');
      } else {
        setError('Failed to upload image');
      }
    } catch (err: any) {
      setError('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      compare_price: "",
      category: "",
      subcategory: "",
      in_stock: "1",
      featured: "0",
      age_restricted: "0",
      image_url: "",
      on_sale: "0",
      sale_price: "",
      discount_percentage: "",
      sale_start_date: "",
      sale_end_date: "",
      offer_badge: "",
      offer_description: "",
      delivery_enabled: "1",
      delivery_fee: "0",
      free_delivery_threshold: "50",
      delivery_time: "2-3 business days"
    });
    setImagePreview("");
    setSubcategories([]);
    setShowAddModal(true);
  };

  const openEditModal = async (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compare_price: product.compare_price?.toString() || "",
      category: product.category,
      subcategory: product.subcategory || "",
      in_stock: product.in_stock.toString(),
      featured: product.featured.toString(),
      age_restricted: product.age_restricted.toString(),
      image_url: product.image_url,
      on_sale: product.on_sale.toString(),
      sale_price: product.sale_price?.toString() || "",
      discount_percentage: product.discount_percentage?.toString() || "",
      sale_start_date: product.sale_start_date || "",
      sale_end_date: product.sale_end_date || "",
      offer_badge: product.offer_badge || "",
      offer_description: product.offer_description || "",
      delivery_enabled: product.delivery_enabled.toString(),
      delivery_fee: product.delivery_fee?.toString() || "0",
      free_delivery_threshold: product.free_delivery_threshold?.toString() || "50",
      delivery_time: product.delivery_time || "2-3 business days"
    });
    setImagePreview(product.image_url);
    
    // Load subcategories for this product's category
    if (product.category) {
      await loadSubcategories(product.category);
    } else {
      setSubcategories([]);
    }
    
    setShowEditModal(true);
  };

  const openBanModal = (product: Product) => {
    setSelectedProduct(product);
    setBanForm({
      ban_reason: product.ban_reason || ""
    });
    setShowBanModal(true);
  };

  const handleSaveProduct = async () => {
    // Basic validation
    if (!productForm.name || !productForm.price || !productForm.description) {
      setError('Name, price, and description are required');
      return;
    }

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        compare_price: productForm.compare_price ? parseFloat(productForm.compare_price) : null,
        image_url: productForm.image_url || 'https://images.pexels.com/photos/11482458/pexels-photo-11482458.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        category: productForm.category,
        subcategory: productForm.subcategory || null,
        in_stock: parseInt(productForm.in_stock),
        featured: parseInt(productForm.featured),
        age_restricted: parseInt(productForm.age_restricted),
        is_banned: 0,
        on_sale: parseInt(productForm.on_sale),
        sale_price: productForm.sale_price ? parseFloat(productForm.sale_price) : null,
        discount_percentage: productForm.discount_percentage ? parseFloat(productForm.discount_percentage) : null,
        sale_start_date: productForm.sale_start_date || null,
        sale_end_date: productForm.sale_end_date || null,
        offer_badge: productForm.offer_badge || null,
        offer_description: productForm.offer_description || null,
        delivery_enabled: parseInt(productForm.delivery_enabled),
        delivery_fee: productForm.delivery_fee ? parseFloat(productForm.delivery_fee) : null,
        free_delivery_threshold: productForm.free_delivery_threshold ? parseFloat(productForm.free_delivery_threshold) : null,
        delivery_time: productForm.delivery_time
      };

      if (selectedProduct) {
        // Update existing product
        await db.update("products", { _row_id: `eq.${selectedProduct._row_id}` }, productData);
        setSuccess('Product updated successfully!');
      } else {
        // Add new product
        await db.insert("products", productData);
        setSuccess('Product added successfully!');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setTimeout(() => setSuccess(''), 3000);
      loadProducts(); // Reload products from database
    } catch (err: any) {
      setError('Failed to save product: ' + err.message);
    }
  };

  const handleBanProduct = async () => {
    if (!selectedProduct) return;

    try {
      await db.update("products", { _row_id: `eq.${selectedProduct._row_id}` }, {
        is_banned: 1,
        ban_reason: banForm.ban_reason || 'Violates content guidelines'
      });

      setSuccess(`Product "${selectedProduct.name}" has been banned`);
      setShowBanModal(false);
      setTimeout(() => setSuccess(''), 3000);
      loadProducts();
    } catch (err: any) {
      setError('Failed to ban product: ' + err.message);
    }
  };

  const handleUnbanProduct = async (product: Product) => {
    try {
      await db.update("products", { _row_id: `eq.${product._row_id}` }, {
        is_banned: 0,
        ban_reason: null
      });

      setSuccess(`Product "${product.name}" has been restored`);
      setTimeout(() => setSuccess(''), 3000);
      loadProducts();
    } catch (err: any) {
      setError('Failed to unban product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    // Enhanced delete function with comprehensive debugging and fallback
    console.log("🗑️ DELETE PRODUCT STARTED");
    console.log("Product details:", { 
      _row_id: product._row_id, 
      name: product.name,
      category: product.category 
    });
    
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      console.log("✅ User confirmed deletion");
      
      try {
        // Try multiple delete approaches to ensure one works
        console.log("🔄 Attempting delete with _row_id filter...");
        
        let deleteSuccess = false;
        let deleteError = null;
        
        // Method 1: Using eq._row_id format
        try {
          console.log("📌 Method 1: db.delete with eq._row_id");
          const result1 = await db.delete("products", { _row_id: `eq.${product._row_id}` });
          console.log("✅ Method 1 succeeded:", result1);
          deleteSuccess = true;
        } catch (err1: any) {
          console.log("❌ Method 1 failed:", err1.message);
          deleteError = err1;
          
          // Method 2: Using eq._row_id with string format
          try {
            console.log("📌 Method 2: db.delete with string _row_id");
            const result2 = await db.delete("products", { _row_id: String(product._row_id) });
            console.log("✅ Method 2 succeeded:", result2);
            deleteSuccess = true;
          } catch (err2: any) {
            console.log("❌ Method 2 failed:", err2.message);
            
            // Method 3: Using filter with eq operator
            try {
              console.log("📌 Method 3: db.delete with eq filter");
              const result3 = await db.delete("products", { filter: { _row_id: `eq.${product._row_id}` } } as any);
              console.log("✅ Method 3 succeeded:", result3);
              deleteSuccess = true;
            } catch (err3: any) {
              console.log("❌ Method 3 failed:", err3.message);
              deleteError = err3;
            }
          }
        }
        
        if (deleteSuccess) {
          console.log("🎉 DELETE SUCCESSFUL");
          setSuccess(`Product "${product.name}" has been deleted`);
          setTimeout(() => setSuccess(''), 3000);
          
          console.log("🔄 Reloading products after successful deletion...");
          await loadProducts();
          console.log("✅ Products reloaded successfully");
        } else {
          console.error("💥 ALL DELETE METHODS FAILED:", deleteError);
          throw deleteError;
        }
        
      } catch (err: any) {
        console.error("❌ DELETE FAILED:", err);
        setError(`Failed to delete product: ${err.message}`);
        console.error("Full error details:", {
          message: err.message,
          stack: err.stack,
          product: product
        });
      }
    } else {
      console.log("❌ User cancelled deletion");
    }
    
    console.log("🗑️ DELETE PRODUCT FUNCTION ENDED");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <span className="text-2xl font-bold text-white">ifudda Admin</span>
            </Link>
            
            <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Product Management</h1>
            <p className="text-gray-400">Manage products, pricing, sales, and delivery settings</p>
          </div>
          <Button 
            onClick={openAddModal}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/20 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-white">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Sales</p>
                  <p className="text-2xl font-bold text-white">{products.filter(p => p.on_sale).length}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Banned Products</p>
                  <p className="text-2xl font-bold text-white">{products.filter(p => p.is_banned).length}</p>
                </div>
                <Ban className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Delivery Enabled</p>
                  <p className="text-2xl font-bold text-white">{products.filter(p => p.delivery_enabled).length}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DEBUG SECTION - Product Delete Testing */}
        <Card className="mb-8 bg-yellow-900/10 border-yellow-600/30">
          <CardContent className="p-4">
            <h3 className="text-yellow-400 font-semibold mb-2">🔍 DEBUG: Product Delete Testing</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Current Products (IDs): {products.map(p => `${p.name} (ID: ${p._row_id})`).join(', ')}</p>
              <div className="flex space-x-2">
                {products.slice(0, 3).map(product => (
                  <button
                    key={product._row_id}
                    onClick={() => {
                      console.log("🧪 TEST DELETE for:", product);
                      handleDeleteProduct(product);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                  >
                    Test Delete: {product.name}
                  </button>
                ))}
              </div>
              <p className="text-yellow-300 text-xs">Try clicking these test buttons to see console logs</p>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Products Inventory</CardTitle>
            <CardDescription className="text-gray-400">Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div 
                  key={product._row_id}
                  className={`p-4 rounded-lg border transition-all ${
                    product.is_banned 
                      ? 'bg-red-900/20 border-red-800' 
                      : 'bg-gray-800/50 border-gray-700 hover:border-red-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-semibold">{product.name}</h3>
                          {product.is_banned && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">BANNED</span>
                          )}
                          {product.on_sale && !product.is_banned && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">SALE</span>
                          )}
                          {product.featured && !product.is_banned && (
                            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">FEATURED</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{product.category}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-white font-bold">£{product.price.toFixed(2)}</span>
                          {product.compare_price && product.compare_price > product.price && (
                            <span className="text-gray-500 line-through text-sm">£{product.compare_price.toFixed(2)}</span>
                          )}
                          {product.on_sale && product.sale_price && (
                            <span className="text-green-400 text-sm">Sale: £{product.sale_price.toFixed(2)}</span>
                          )}
                        </div>
                        {product.is_banned && product.ban_reason && (
                          <p className="text-red-400 text-sm mt-1">Reason: {product.ban_reason}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!product.is_banned ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(product)}
                            className="border-gray-700 text-white hover:bg-gray-800"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openBanModal(product)}
                            className="border-red-900 text-red-400 hover:bg-red-900/20"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log("🗑️ Delete button clicked for:", product);
                              handleDeleteProduct(product);
                            }}
                            className="border-red-700 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {/* Emergency Delete - Text button for easier debugging */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`EMERGENCY DELETE: "${product.name}" (ID: ${product._row_id})?`)) {
                                console.log("🚨 EMERGENCY DELETE for product:", product._row_id);
                                
                                // Use the enhanced delete function
                                handleDeleteProduct(product).catch(err => {
                                  console.error("❌ Emergency delete failed:", err);
                                });
                              }
                            }}
                            className="text-red-500 hover:text-red-400 text-xs"
                          >
                            Del
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnbanProduct(product)}
                          className="border-green-900 text-green-400 hover:bg-green-900/20"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Add New Product</CardTitle>
              <CardDescription className="text-gray-400">Create a new product with all details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Product Name *</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Premium Luxury Vibrator"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Category *</Label>
                    <select
                      value={productForm.category}
                      onChange={(e) => {
                        const selectedCategory = e.target.value;
                        setProductForm({ 
                          ...productForm, 
                          category: selectedCategory,
                          subcategory: "" // Reset subcategory when category changes
                        });
                        loadSubcategories(selectedCategory);
                      }}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter(cat => cat.level === 0) // Only show main categories
                        .map(cat => (
                          <option key={cat._row_id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                  </div>
                  {subcategories.length > 0 && (
                    <div>
                      <Label className="text-white">Subcategory *</Label>
                      <select
                        value={productForm.subcategory}
                        onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories.map(sub => (
                          <option key={sub._row_id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-white">Description *</Label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Detailed product description..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Pricing</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Price *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="49.99"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Compare Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={productForm.compare_price}
                      onChange={(e) => setProductForm({ ...productForm, compare_price: e.target.value })}
                      placeholder="69.99"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Stock</Label>
                    <Input
                      type="number"
                      value={productForm.in_stock}
                      onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.value })}
                      placeholder="1"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Product Image</h3>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-300">
                      {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                    </p>
                    <p className="text-gray-500 text-sm">JPG, PNG, GIF, WebP (max 5MB)</p>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </div>

              {/* Sale & Offer */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Sale & Offer</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">On Sale</Label>
                    <select
                      value={productForm.on_sale}
                      onChange={(e) => setProductForm({ ...productForm, on_sale: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  {productForm.on_sale === "1" && (
                    <>
                      <div>
                        <Label className="text-white">Sale Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.sale_price}
                          onChange={(e) => setProductForm({ ...productForm, sale_price: e.target.value })}
                          placeholder="39.99"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Discount %</Label>
                        <Input
                          type="number"
                          step="1"
                          value={productForm.discount_percentage}
                          onChange={(e) => setProductForm({ ...productForm, discount_percentage: e.target.value })}
                          placeholder="20"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Sale Start</Label>
                        <Input
                          type="date"
                          value={productForm.sale_start_date}
                          onChange={(e) => setProductForm({ ...productForm, sale_start_date: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Sale End</Label>
                        <Input
                          type="date"
                          value={productForm.sale_end_date}
                          onChange={(e) => setProductForm({ ...productForm, sale_end_date: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-white">Offer Badge</Label>
                        <Input
                          value={productForm.offer_badge}
                          onChange={(e) => setProductForm({ ...productForm, offer_badge: e.target.value })}
                          placeholder="Best Seller"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-white">Offer Description</Label>
                        <textarea
                          value={productForm.offer_description}
                          onChange={(e) => setProductForm({ ...productForm, offer_description: e.target.value })}
                          placeholder="Limited time offer..."
                          rows={2}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Delivery Setup */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Delivery Setup</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Delivery Enabled</Label>
                    <select
                      value={productForm.delivery_enabled}
                      onChange={(e) => setProductForm({ ...productForm, delivery_enabled: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  {productForm.delivery_enabled === "1" && (
                    <>
                      <div>
                        <Label className="text-white">Delivery Fee (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.delivery_fee}
                          onChange={(e) => setProductForm({ ...productForm, delivery_fee: e.target.value })}
                          placeholder="0.00"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Free Delivery (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.free_delivery_threshold}
                          onChange={(e) => setProductForm({ ...productForm, free_delivery_threshold: e.target.value })}
                          placeholder="50.00"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-white">Delivery Time</Label>
                        <Input
                          value={productForm.delivery_time}
                          onChange={(e) => setProductForm({ ...productForm, delivery_time: e.target.value })}
                          placeholder="2-3 business days"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Product Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Product Settings</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Featured</Label>
                    <select
                      value={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white">Age Restricted</Label>
                    <select
                      value={productForm.age_restricted}
                      onChange={(e) => setProductForm({ ...productForm, age_restricted: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes (18+)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 border-t border-gray-800">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProduct}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Product
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Edit Product Modal - Same as Add but with update logic */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Edit Product</CardTitle>
              <CardDescription className="text-gray-400">Update product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Same content as Add Modal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Product Name *</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Category *</Label>
                    <select
                      value={productForm.category}
                      onChange={(e) => {
                        const selectedCategory = e.target.value;
                        setProductForm({ 
                          ...productForm, 
                          category: selectedCategory,
                          subcategory: "" // Reset subcategory when category changes
                        });
                        loadSubcategories(selectedCategory);
                      }}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter(cat => cat.level === 0) // Only show main categories
                        .map(cat => (
                          <option key={cat._row_id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                  </div>
                  {subcategories.length > 0 && (
                    <div>
                      <Label className="text-white">Subcategory *</Label>
                      <select
                        value={productForm.subcategory}
                        onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories.map(sub => (
                          <option key={sub._row_id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-white">Description *</Label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Pricing</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Price *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Compare Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={productForm.compare_price}
                      onChange={(e) => setProductForm({ ...productForm, compare_price: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Stock</Label>
                    <Input
                      type="number"
                      value={productForm.in_stock}
                      onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Product Image</h3>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="image-upload-edit"
                  />
                  <label 
                    htmlFor="image-upload-edit"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-300">
                      {uploadingImage ? 'Uploading...' : 'Click to upload new image'}
                    </p>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Sale & Offer</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">On Sale</Label>
                    <select
                      value={productForm.on_sale}
                      onChange={(e) => setProductForm({ ...productForm, on_sale: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  {productForm.on_sale === "1" && (
                    <>
                      <div>
                        <Label className="text-white">Sale Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.sale_price}
                          onChange={(e) => setProductForm({ ...productForm, sale_price: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Discount %</Label>
                        <Input
                          type="number"
                          step="1"
                          value={productForm.discount_percentage}
                          onChange={(e) => setProductForm({ ...productForm, discount_percentage: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Sale Start</Label>
                        <Input
                          type="date"
                          value={productForm.sale_start_date}
                          onChange={(e) => setProductForm({ ...productForm, sale_start_date: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Sale End</Label>
                        <Input
                          type="date"
                          value={productForm.sale_end_date}
                          onChange={(e) => setProductForm({ ...productForm, sale_end_date: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-white">Offer Badge</Label>
                        <Input
                          value={productForm.offer_badge}
                          onChange={(e) => setProductForm({ ...productForm, offer_badge: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-white">Offer Description</Label>
                        <textarea
                          value={productForm.offer_description}
                          onChange={(e) => setProductForm({ ...productForm, offer_description: e.target.value })}
                          rows={2}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Delivery Setup</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Delivery Enabled</Label>
                    <select
                      value={productForm.delivery_enabled}
                      onChange={(e) => setProductForm({ ...productForm, delivery_enabled: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  {productForm.delivery_enabled === "1" && (
                    <>
                      <div>
                        <Label className="text-white">Delivery Fee (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.delivery_fee}
                          onChange={(e) => setProductForm({ ...productForm, delivery_fee: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Free Delivery (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.free_delivery_threshold}
                          onChange={(e) => setProductForm({ ...productForm, free_delivery_threshold: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-white">Delivery Time</Label>
                        <Input
                          value={productForm.delivery_time}
                          onChange={(e) => setProductForm({ ...productForm, delivery_time: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Product Settings</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Featured</Label>
                    <select
                      value={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white">Age Restricted</Label>
                    <select
                      value={productForm.age_restricted}
                      onChange={(e) => setProductForm({ ...productForm, age_restricted: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes (18+)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 border-t border-gray-800">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProduct}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Product
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Ban Product Modal */}
      {showBanModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Ban Product</CardTitle>
              <CardDescription className="text-gray-400">
                Remove "{selectedProduct.name}" from the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Reason for banning *</Label>
                <textarea
                  value={banForm.ban_reason}
                  onChange={(e) => setBanForm({ ban_reason: e.target.value })}
                  placeholder="Violates content guidelines, inappropriate content, etc."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                />
              </div>
              <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will remove the product from the marketplace. Customers will no longer be able to see or purchase it.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 border-t border-gray-800">
              <Button
                variant="outline"
                onClick={() => setShowBanModal(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBanProduct}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <Ban className="w-4 h-4 mr-2" />
                Ban Product
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;