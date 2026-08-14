import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Search, Loader2, Plus, X, Percent, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// Simple, direct product types
interface SimpleProduct {
  _row_id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  // Sale & discount fields
  on_sale?: boolean;
  sale_price?: number;
  discount_percentage?: number;
  sale_start_date?: string;
  sale_end_date?: string;
  offer_badge?: string;
  offer_description?: string;
}

export default function AdminProductManagementSimple() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Product state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    image_url: '',
    in_stock: true,
    // Sale & discount fields
    on_sale: false,
    sale_price: '',
    discount_percentage: '',
    sale_start_date: '',
    sale_end_date: '',
    offer_badge: '',
    offer_description: ''
  });

  // Load products - simple direct query
  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading products...");
      
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      const result = await db.query('products', {
        select: '*',
        order: '_created_at.desc'
      }) as SimpleProduct[];
      
      console.log("✅ Products loaded:", result || []);
      setProducts(result || []);
      setError(null);
    } catch (err: any) {
      console.error("❌ Load error:", err);
      setError('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simple delete function using database SDK
  const deleteProductDirect = async (productId: number, productName: string) => {
    console.log("🎯 DELETE CLICKED - Product ID:", productId, "Name:", productName);
    
    if (!confirm(`Delete "${productName}"?`)) {
      console.log("❌ User cancelled deletion");
      return;
    }
    
    try {
      setDeleting(productId);
      console.log("🔄 Deleting product...");
      
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      
      // Delete using database SDK
      await db.delete('products', {
        _row_id: `eq.${productId}`
      });
      
      console.log("✅ Product deleted successfully");
      setSuccess(`"${productName}" deleted successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Reload products
      await loadProducts();
      setError(null);
      
    } catch (err: any) {
      console.error("❌ DELETE FAILED:", err);
      setError(`❌ Delete failed: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeleting(null);
    }
  };

  // Add new product - simple
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      setError('⚠️ Please fill in all required fields');
      setTimeout(() => setError(null), 2000);
      return;
    }
    
    try {
      setAddingProduct(true);
      console.log("➕ Adding product:", newProduct);
      
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      
      const productData: any = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image_url: newProduct.image_url || 'https://via.placeholder.com/400x300?text=No+Image',
        in_stock: newProduct.in_stock ? 1 : 0,
        description: `Premium ${newProduct.name} - ${newProduct.category}`
      };
      
      if (newProduct.on_sale && newProduct.sale_price) {
        productData.on_sale = 1;
        productData.sale_price = parseFloat(newProduct.sale_price);
        
        if (newProduct.discount_percentage) {
          productData.discount_percentage = parseFloat(newProduct.discount_percentage);
        }
        
        if (newProduct.sale_start_date) {
          productData.sale_start_date = newProduct.sale_start_date;
        }
        
        if (newProduct.sale_end_date) {
          productData.sale_end_date = newProduct.sale_end_date;
        }
        
        if (newProduct.offer_badge) {
          productData.offer_badge = newProduct.offer_badge;
        }
        
        if (newProduct.offer_description) {
          productData.offer_description = newProduct.offer_description;
        }
      } else {
        productData.on_sale = 0;
      }
      
      await db.insert('products', productData);
      
      console.log("✅ Product added successfully");
      setSuccess(`"${newProduct.name}" added successfully!`);
      setTimeout(() => setSuccess(null), 2000);
      
      setNewProduct({
        name: '',
        price: '',
        category: '',
        image_url: '',
        in_stock: true,
        on_sale: false,
        sale_price: '',
        discount_percentage: '',
        sale_start_date: '',
        sale_end_date: '',
        offer_badge: '',
        offer_description: ''
      });
      setShowAddModal(false);
      
      await loadProducts();
      setError(null);
    } catch (err: any) {
      console.error("❌ Add failed:", err);
      setError('❌ Add failed: ' + err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setAddingProduct(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products for search - MUST be before useEffect that uses it
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Comprehensive debugging useEffect
  useEffect(() => {
    console.log("🔍🔍🔍 ADMIN PRODUCT MANAGEMENT MOUNTED 🔍🔍🔍");
    console.log("📦 Current products:", products);
    console.log("📊 Product count:", products.length);
    console.log("🔍 Filtered products:", filteredProducts);
    console.log("❌ Any errors:", error);
    console.log("✅ Any success:", success);
    console.log("🖱️ Click handlers attached:", products.length + " delete buttons");
    
    // Create prominent debug info panel
    const existingDebug = document.getElementById('comprehensive-debug-panel');
    if (existingDebug) existingDebug.remove();
    
    const debugPanel = document.createElement('div');
    debugPanel.id = 'comprehensive-debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: linear-gradient(135deg, #ffeb3b 0%, #ffc107 100%);
      border: 3px solid #f44336;
      border-radius: 8px;
      padding: 15px;
      z-index: 99999;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      max-width: 350px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    `;
    
    debugPanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 10px; color: #d32f2f;">
        🔍 DELETE SYSTEM DEBUG PANEL
      </div>
      <div style="margin: 5px 0;">
        <strong>Products Loaded:</strong> ${products.length}
      </div>
      <div style="margin: 5px 0;">
        <strong>Status:</strong> ${loading ? '🔄 Loading...' : '✅ Ready'}
      </div>
      <div style="margin: 5px 0;">
        <strong>Errors:</strong> ${error ? '❌ ' + error : 'None ✅'}
      </div>
      <div style="margin: 5px 0;">
        <strong>Success:</strong> ${success ? '✅ ' + success : 'None'}
      </div>
      <div style="margin: 10px 0; padding: 8px; background: #fff3cd; border-radius: 4px; font-size: 11px;">
        <strong>📋 INSTRUCTIONS:</strong><br>
        1. Open browser console (F12)<br>
        2. Click any Delete button<br>
        3. Watch for detailed logs<br>
        4. Confirm deletion when prompted
      </div>
      <div style="margin: 5px 0; font-size: 10px; color: #666;">
        <em>Debug panel will disappear after page close</em>
      </div>
    `;
    
    document.body.appendChild(debugPanel);
    
    return () => {
      const existing = document.getElementById('comprehensive-debug-panel');
      if (existing) existing.remove();
    };
  }, [products, filteredProducts, error, success, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Product Management</h1>
            <p className="text-gray-400 mt-1">🗑️ Delete System Enhanced - Open Browser Console (F12) for Detailed Logs</p>
            <div className="mt-2 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
              <div className="text-blue-300 text-sm">
                <strong>🔍 DELETE INSTRUCTIONS:</strong>
                <ul className="ml-4 mt-1 list-disc">
                  <li>Open browser console (F12)</li>
                  <li>Click Delete button on any product</li>
                  <li>Confirm deletion in popup</li>
                  <li>Watch detailed logs in console</li>
                  <li>Check yellow debug panel (bottom-right)</li>
                </ul>
              </div>
            </div>
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
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            ❌ {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
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
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Category:</span>
                      <span className="text-pink-400">{product.category}</span>
                    </div>
                    
                    {/* Price Display with Sale Info */}
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      {product.on_sale && product.sale_price ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">£{product.price.toFixed(2)}</span>
                            <span className="text-2xl font-bold text-green-400">£{product.sale_price.toFixed(2)}</span>
                          </div>
                          
                          {product.offer_badge && (
                            <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full inline-block font-bold">
                              {product.offer_badge}
                            </div>
                          )}
                          
                          {product.discount_percentage && (
                            <div className="text-green-400 text-xs font-semibold">
                              <Percent className="w-3 h-3 inline mr-1" />
                              {product.discount_percentage}% OFF
                            </div>
                          )}
                          
                          {product.sale_start_date && product.sale_end_date && (
                            <div className="text-gray-400 text-xs">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(product.sale_start_date).toLocaleDateString()} - {new Date(product.sale_end_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-green-400">
                          £{product.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-gray-400">
                      <span>Status:</span>
                      <span className={product.in_stock ? "text-green-400" : "text-red-400"}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={(e) => {
                      console.log("🖱️ DELETE BUTTON CLICKED - Product:", product.name, "ID:", product._row_id);
                      console.log("🖱️ Event object:", e);
                      console.log("🖱️ Button disabled state:", deleting === product._row_id);
                      deleteProductDirect(product._row_id, product.name);
                    }}
                    disabled={deleting === product._row_id}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
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
            <p className="text-gray-400 text-lg">No products found</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">Add New Product</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Product Name *</label>
                <Input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={addingProduct}
                />
              </div>
              
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
                <label className="block text-gray-300 mb-2">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                  disabled={addingProduct}
                >
                  <option value="">Select category</option>
                  <option value="Vibrators">Vibrators</option>
                  <option value="Lingerie">Lingerie</option>
                  <option value="Lubricants">Lubricants</option>
                  <option value="Bondage">Bondage</option>
                  <option value="Dildos">Dildos</option>
                  <option value="Anal Toys">Anal Toys</option>
                  <option value="Sex Games">Sex Games</option>
                  <option value="Wellness">Wellness</option>
                </select>
              </div>
              
              {/* Sale & Discount Section */}
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
                    Enable Sale & Offer
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
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Image URL</label>
                <Input
                  type="text"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={addingProduct}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProduct.in_stock}
                  onChange={(e) => setNewProduct({...newProduct, in_stock: e.target.checked})}
                  className="w-4 h-4"
                  disabled={addingProduct}
                />
                <label className="text-gray-300">In Stock</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={addProduct}
                  disabled={addingProduct}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {addingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
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
        </div>
      )}
    </div>
  );
}