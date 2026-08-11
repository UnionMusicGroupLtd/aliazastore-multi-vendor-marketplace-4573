import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Search, Loader2, Plus, X } from 'lucide-react';
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
    in_stock: true
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

  // Simple, direct delete function using edge function
  const deleteProductDirect = async (productId: number, productName: string) => {
    if (!confirm(`Delete "${productName}"?`)) return;
    
    try {
      setDeleting(productId);
      console.log("🗑️ Deleting product:", productId);
      
      // Direct database delete - use the proper API
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      
      // Use the delete API with PostgREST format
      await db.delete('products', { _row_id: `eq.${productId}` });
      
      console.log("✅ Product deleted successfully");
      setSuccess(`"${productName}" deleted successfully!`);
      setTimeout(() => setSuccess(null), 2000);
      await loadProducts(); // Reload
      
      setError(null);
    } catch (err: any) {
      console.error("❌ Delete failed:", err);
      setError('Delete failed: ' + err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleting(null);
    }
  };

  // Add new product function
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      setError('Please fill in all required fields');
      setTimeout(() => setError(null), 2000);
      return;
    }
    
    try {
      setAddingProduct(true);
      console.log("➕ Adding product:", newProduct);
      
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      
      await db.insert('products', {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image_url: newProduct.image_url || 'https://via.placeholder.com/400x300?text=No+Image',
        in_stock: newProduct.in_stock ? 1 : 0,
        description: `Premium ${newProduct.name} - ${newProduct.category}`
      });
      
      console.log("✅ Product added successfully");
      setSuccess(`"${newProduct.name}" added successfully!`);
      setTimeout(() => setSuccess(null), 2000);
      
      // Reset form and close modal
      setNewProduct({
        name: '',
        price: '',
        category: '',
        image_url: '',
        in_stock: true
      });
      setShowAddModal(false);
      
      await loadProducts(); // Reload products
      setError(null);
    } catch (err: any) {
      console.error("❌ Add failed:", err);
      setError('Add failed: ' + err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setAddingProduct(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Product Management</h1>
            <p className="text-gray-400 mt-1">Add & Delete products - Simple & Direct</p>
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
                    <div className="flex justify-between text-gray-400">
                      <span>Price:</span>
                      <span className="text-green-400 font-bold">£{product.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Status:</span>
                      <span className={product.in_stock ? "text-green-400" : "text-red-400"}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
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