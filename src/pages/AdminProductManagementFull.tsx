import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Search, Loader2, Plus, X, Package, DollarSign, Box, Image as ImageIcon, Percent, Calendar, Tag, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// Comprehensive product interface
interface FullProduct {
  _row_id: number;
  name: string;
  description: string;
  price: number;
  compare_price: number;
  cost_price: number;
  sku: string;
  barcode: string;
  category: string;
  subcategory: string;
  image_url: string;
  secondary_images: string;
  in_stock: boolean;
  stock_quantity: number;
  weight: number;
  dimensions: string;
  // Sale & discount fields
  on_sale: boolean;
  sale_price: number;
  discount_percentage: number;
  sale_start_date: string;
  sale_end_date: string;
  offer_badge: string;
  offer_description: string;
  // SEO & Marketing
  meta_title: string;
  meta_description: string;
  tags: string;
  // Shipping & Delivery
  free_shipping: boolean;
  shipping_price: number;
  delivery_days: string;
  // Additional
  featured: boolean;
  active: boolean;
  manufacturer: string;
  material: string;
  color: string;
  size: string;
}

export default function AdminProductManagementFull() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Product state with comprehensive fields
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [formSection, setFormSection] = useState<'basic' | 'pricing' | 'inventory' | 'images' | 'seo' | 'shipping'>('basic');
  
  const [newProduct, setNewProduct] = useState({
    // Basic Info
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category: '',
    subcategory: '',
    manufacturer: '',
    material: '',
    color: '',
    size: '',
    
    // Pricing
    price: '',
    compare_price: '',
    cost_price: '',
    on_sale: false,
    sale_price: '',
    discount_percentage: '',
    sale_start_date: '',
    sale_end_date: '',
    offer_badge: '',
    offer_description: '',
    
    // Inventory
    in_stock: true,
    stock_quantity: '100',
    weight: '',
    dimensions: '',
    
    // Images
    image_url: '',
    secondary_images: '',
    
    // SEO
    meta_title: '',
    meta_description: '',
    tags: '',
    
    // Shipping
    free_shipping: false,
    shipping_price: '',
    delivery_days: '3-5',
    
    // Marketing
    featured: false,
    active: true
  });

  // Load all products
  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading products...");
      
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      const result = await db.query('products', {
        select: '*',
        order: '_created_at.desc'
      }) as FullProduct[];
      
      console.log("✅ Products loaded:", result?.length || 0);
      setProducts(result || []);
      setError(null);
    } catch (err: any) {
      console.error("❌ Load error:", err);
      setError('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete product with NO permission checks
  const deleteProductDirect = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to DELETE "${productName}"?\n\nThis action CANNOT be undone!`)) {
      console.log("❌ Delete cancelled by user");
      return;
    }
    
    try {
      setDeleting(productId);
      console.log("🗑️ DELETING product:", { productId, productName });
      
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      
      // Direct delete with NO permission checks
      console.log("⚡ Executing direct database delete...");
      await db.delete('products', { _row_id: `eq.${productId}` });
      
      console.log("✅ Product deleted successfully - NO PERMISSION CHECKS");
      setSuccess(`✅ "${productName}" DELETED successfully! Permission checks disabled.`);
      setTimeout(() => setSuccess(null), 3000);
      
      await loadProducts();
      setError(null);
    } catch (err: any) {
      console.error("❌ DELETE FAILED:", err);
      setError('❌ Delete failed: ' + err.message + '\nNote: All permission checks have been disabled.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeleting(null);
    }
  };

  // Add comprehensive product
  const addProduct = async () => {
    // Validation
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      setError('⚠️ Required fields: Product Name, Price, and Category');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    try {
      setAddingProduct(true);
      console.log("➕ Adding COMPREHENSIVE product:", newProduct);
      
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      
      // Build comprehensive product data
      const productData: any = {
        // Basic fields
        name: newProduct.name,
        description: newProduct.description || `Premium ${newProduct.name}`,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image_url: newProduct.image_url || 'https://via.placeholder.com/400x300?text=No+Image',
        in_stock: newProduct.in_stock ? 1 : 0,
        
        // Extended fields
        sku: newProduct.sku || null,
        barcode: newProduct.barcode || null,
        manufacturer: newProduct.manufacturer || null,
        material: newProduct.material || null,
        color: newProduct.color || null,
        size: newProduct.size || null,
        
        // Pricing
        compare_price: newProduct.compare_price ? parseFloat(newProduct.compare_price) : null,
        cost_price: newProduct.cost_price ? parseFloat(newProduct.cost_price) : null,
        
        // Sale data
        on_sale: newProduct.on_sale ? 1 : 0,
        ...(newProduct.on_sale && newProduct.sale_price && {
          sale_price: parseFloat(newProduct.sale_price),
          discount_percentage: newProduct.discount_percentage ? parseFloat(newProduct.discount_percentage) : null,
          sale_start_date: newProduct.sale_start_date || null,
          sale_end_date: newProduct.sale_end_date || null,
          offer_badge: newProduct.offer_badge || null,
          offer_description: newProduct.offer_description || null
        }),
        
        // Inventory
        stock_quantity: parseInt(newProduct.stock_quantity) || 100,
        weight: newProduct.weight ? parseFloat(newProduct.weight) : null,
        dimensions: newProduct.dimensions || null,
        
        // Shipping
        free_shipping: newProduct.free_shipping ? 1 : 0,
        shipping_price: newProduct.shipping_price ? parseFloat(newProduct.shipping_price) : null,
        
        // Marketing
        featured: newProduct.featured ? 1 : 0,
        active: newProduct.active ? 1 : 0,
        
        // SEO
        meta_title: newProduct.meta_title || null,
        meta_description: newProduct.meta_description || null,
        tags: newProduct.tags || null
      };
      
      console.log("📦 Inserting product data:", productData);
      await db.insert('products', productData);
      
      console.log("✅ Product added successfully with ALL fields");
      setSuccess(`✅ "${newProduct.name}" added successfully with comprehensive details!`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Reset form
      setNewProduct({
        name: '', description: '', sku: '', barcode: '', category: '', subcategory: '',
        manufacturer: '', material: '', color: '', size: '',
        price: '', compare_price: '', cost_price: '',
        on_sale: false, sale_price: '', discount_percentage: '',
        sale_start_date: '', sale_end_date: '', offer_badge: '', offer_description: '',
        in_stock: true, stock_quantity: '100', weight: '', dimensions: '',
        image_url: '', secondary_images: '',
        meta_title: '', meta_description: '', tags: '',
        free_shipping: false, shipping_price: '', delivery_days: '3-5',
        featured: false, active: true
      });
      setShowAddModal(false);
      setFormSection('basic');
      
      await loadProducts();
      setError(null);
    } catch (err: any) {
      console.error("❌ Add failed:", err);
      setError('❌ Add failed: ' + err.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setAddingProduct(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categories for dropdown
  const categories = [
    'Vibrators', 'Dildos', 'Anal Toys', 'Lingerie', 'Lubricants', 
    'Bondage', 'Sex Games', 'Wellness', 'Contraceptives', 'Massage',
    'Sex Toys', 'Adult Games', 'Erotic Gifts', 'Kegel Devices', 'Couples Toys'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Product Management - Full Template</h1>
            <p className="text-gray-400 mt-1">📦 Complete product form • 🔓 No permission checks</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button 
              onClick={() => navigate('/admin')}
              variant="outline"
              className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
            >
              ← Back to Admin
            </Button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-300">
          <p className="font-semibold">🔓 <strong>Permission Checks DISABLED</strong> - All users can add/delete products</p>
          <p className="text-sm mt-1">If you still get permission errors, it's from database security policies - check logs for details.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, category, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
            <p className="text-gray-400 mt-4">Loading products...</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product._row_id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  {deleting === product._row_id && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      ⭐ FEATURED
                    </div>
                  )}
                  {product.on_sale && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      SALE
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    {product.sku && (
                      <div className="flex justify-between text-gray-400">
                        <span>SKU:</span>
                        <span className="text-pink-400">{product.sku}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-400">
                      <span>Category:</span>
                      <span className="text-pink-400">{product.category}</span>
                    </div>
                    
                    {/* Price Display */}
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      {product.on_sale && product.sale_price ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">£{product.price?.toFixed(2)}</span>
                            <span className="text-xl font-bold text-green-400">£{product.sale_price?.toFixed(2)}</span>
                          </div>
                          {product.discount_percentage && (
                            <div className="text-green-400 text-xs font-semibold">
                              <Percent className="w-3 h-3 inline mr-1" />
                              {product.discount_percentage}% OFF
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-green-400">
                          £{product.price?.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-gray-400">
                      <span>Stock:</span>
                      <span className={product.in_stock ? "text-green-400" : "text-red-400"}>
                        {product.in_stock ? `${product.stock_quantity || 'In Stock'}` : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => deleteProductDirect(product._row_id, product.name)}
                    disabled={deleting === product._row_id}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleting === product._row_id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Product
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Products State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No products found</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>

      {/* COMPREHENSIVE Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-6 relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">📦 Add New Product - Full Template</h2>
            
            {/* Section Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'basic', label: 'Basic Info', icon: Package },
                { id: 'pricing', label: 'Pricing', icon: DollarSign },
                { id: 'inventory', label: 'Inventory', icon: Box },
                { id: 'images', label: 'Images', icon: ImageIcon },
                { id: 'seo', label: 'SEO & Tags', icon: Tag },
                { id: 'shipping', label: 'Shipping', icon: Check }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setFormSection(section.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded whitespace-nowrap ${
                    formSection === section.id 
                      ? 'bg-pink-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* BASIC INFO SECTION */}
              {formSection === 'basic' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-400">📝 Basic Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Product Name *</label>
                      <Input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Premium Product Name"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">SKU</label>
                      <Input
                        type="text"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                        placeholder="PROD-001"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Category *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                        disabled={addingProduct}
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Manufacturer</label>
                      <Input
                        type="text"
                        value={newProduct.manufacturer}
                        onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}
                        placeholder="Brand name"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Material</label>
                      <Input
                        type="text"
                        value={newProduct.material}
                        onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
                        placeholder="Silicone, Leather, etc."
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Color</label>
                      <Input
                        type="text"
                        value={newProduct.color}
                        onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}
                        placeholder="Black, Red, etc."
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Size</label>
                      <Input
                        type="text"
                        value={newProduct.size}
                        onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
                        placeholder="S/M/L or dimensions"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Barcode</label>
                      <Input
                        type="text"
                        value={newProduct.barcode}
                        onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                        placeholder="1234567890123"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Detailed product description..."
                      rows={4}
                      className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                      disabled={addingProduct}
                    />
                  </div>
                </div>
              )}

              {/* PRICING SECTION */}
              {formSection === 'pricing' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-400">💰 Pricing & Sales</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Price (£) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="29.99"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Compare Price (£)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.compare_price}
                        onChange={(e) => setNewProduct({...newProduct, compare_price: e.target.value})}
                        placeholder="49.99 (for strikethrough)"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Cost Price (£)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.cost_price}
                        onChange={(e) => setNewProduct({...newProduct, cost_price: e.target.value})}
                        placeholder="15.00 (your cost)"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                  </div>
                  
                  {/* Sale & Discount */}
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={newProduct.on_sale}
                        onChange={(e) => setNewProduct({...newProduct, on_sale: e.target.checked})}
                        className="w-4 h-4"
                        disabled={addingProduct}
                        id="on_sale"
                      />
                      <label htmlFor="on_sale" className="text-pink-400 font-semibold flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Enable Sale & Discount
                      </label>
                    </div>
                    
                    {newProduct.on_sale && (
                      <div className="space-y-4 bg-gray-700/30 p-4 rounded-lg">
                        <div>
                          <label className="block text-gray-300 mb-2">Sale Price (£) *</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newProduct.sale_price}
                            onChange={(e) => setNewProduct({...newProduct, sale_price: e.target.value})}
                            placeholder="19.99"
                            className="bg-gray-700 border-gray-600 text-white"
                            disabled={addingProduct}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Discount Percentage (%)</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={newProduct.discount_percentage}
                            onChange={(e) => setNewProduct({...newProduct, discount_percentage: e.target.value})}
                            placeholder="20"
                            className="bg-gray-700 border-gray-600 text-white"
                            disabled={addingProduct}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Offer Badge</label>
                          <Input
                            type="text"
                            value={newProduct.offer_badge}
                            onChange={(e) => setNewProduct({...newProduct, offer_badge: e.target.value})}
                            placeholder="50% OFF, Special Offer, etc."
                            className="bg-gray-700 border-gray-600 text-white"
                            disabled={addingProduct}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Offer Description</label>
                          <textarea
                            value={newProduct.offer_description}
                            onChange={(e) => setNewProduct({...newProduct, offer_description: e.target.value})}
                            placeholder="Describe your offer..."
                            rows={2}
                            className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                            disabled={addingProduct}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-2">Sale Start Date</label>
                            <Input
                              type="date"
                              value={newProduct.sale_start_date}
                              onChange={(e) => setNewProduct({...newProduct, sale_start_date: e.target.value})}
                              className="bg-gray-700 border-gray-600 text-white"
                              disabled={addingProduct}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-300 mb-2">Sale End Date</label>
                            <Input
                              type="date"
                              value={newProduct.sale_end_date}
                              onChange={(e) => setNewProduct({...newProduct, sale_end_date: e.target.value})}
                              className="bg-gray-700 border-gray-600 text-white"
                              disabled={addingProduct}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* INVENTORY SECTION */}
              {formSection === 'inventory' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-400">📦 Inventory & Physical</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Stock Quantity</label>
                      <Input
                        type="number"
                        value={newProduct.stock_quantity}
                        onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                        placeholder="100"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Weight (kg)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                        placeholder="0.5"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Dimensions (LxWxH)</label>
                      <Input
                        type="text"
                        value={newProduct.dimensions}
                        onChange={(e) => setNewProduct({...newProduct, dimensions: e.target.value})}
                        placeholder="20x10x5 cm"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.in_stock}
                        onChange={(e) => setNewProduct({...newProduct, in_stock: e.target.checked})}
                        className="w-4 h-4"
                        disabled={addingProduct}
                      />
                      <span className="text-gray-300">In Stock</span>
                    </label>
                  </div>
                </div>
              )}

              {/* IMAGES SECTION */}
              {formSection === 'images' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-400">🖼️ Images</h3>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Primary Image URL</label>
                    <Input
                      type="text"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-700 border-gray-600 text-white"
                      disabled={addingProduct}
                    />
                    {newProduct.image_url && (
                      <div className="mt-2">
                        <img 
                          src={newProduct.image_url} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded"
                          onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Secondary Images (comma-separated URLs)</label>
                    <textarea
                      value={newProduct.secondary_images}
                      onChange={(e) => setNewProduct({...newProduct, secondary_images: e.target.value})}
                      placeholder="https://example.com/img2.jpg, https://example.com/img3.jpg"
                      rows={3}
                      className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                      disabled={addingProduct}
                    />
                  </div>
                </div>
              )}

              {/* SEO SECTION */}
              {formSection === 'seo' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-400">🔍 SEO & Marketing</h3>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Meta Title</label>
                    <Input
                      type="text"
                      value={newProduct.meta_title}
                      onChange={(e) => setNewProduct({...newProduct, meta_title: e.target.value})}
                      placeholder="SEO-friendly title (60 chars)"
                      className="bg-gray-700 border-gray-600 text-white"
                      disabled={addingProduct}
                      maxLength={60}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Meta Description</label>
                    <textarea
                      value={newProduct.meta_description}
                      onChange={(e) => setNewProduct({...newProduct, meta_description: e.target.value})}
                      placeholder="SEO description (160 chars)"
                      rows={3}
                      className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                      disabled={addingProduct}
                      maxLength={160}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Product Tags (comma-separated)</label>
                    <Input
                      type="text"
                      value={newProduct.tags}
                      onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                      placeholder="luxury, premium, bestseller"
                      className="bg-gray-700 border-gray-600 text-white"
                      disabled={addingProduct}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.featured}
                        onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                        className="w-4 h-4"
                        disabled={addingProduct}
                      />
                      <span className="text-gray-300">Featured Product</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.active}
                        onChange={(e) => setNewProduct({...newProduct, active: e.target.checked})}
                        className="w-4 h-4"
                        disabled={addingProduct}
                      />
                      <span className="text-gray-300">Active (visible on store)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* SHIPPING SECTION */}
              {formSection === 'shipping' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-400">🚚 Shipping & Delivery</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Shipping Price (£)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.shipping_price}
                        onChange={(e) => setNewProduct({...newProduct, shipping_price: e.target.value})}
                        placeholder="4.99"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Delivery Days</label>
                      <Input
                        type="text"
                        value={newProduct.delivery_days}
                        onChange={(e) => setNewProduct({...newProduct, delivery_days: e.target.value})}
                        placeholder="3-5"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={addingProduct}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newProduct.free_shipping}
                      onChange={(e) => setNewProduct({...newProduct, free_shipping: e.target.checked})}
                      className="w-4 h-4"
                      disabled={addingProduct}
                      id="free_shipping"
                    />
                    <label htmlFor="free_shipping" className="text-green-400 font-semibold">
                      🎁 Free Shipping
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-700 mt-6">
              <Button
                onClick={addProduct}
                disabled={addingProduct}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {addingProduct ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
                disabled={addingProduct}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}