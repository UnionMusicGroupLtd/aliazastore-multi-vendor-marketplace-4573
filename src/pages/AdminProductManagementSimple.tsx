import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Search, Loader2 } from 'lucide-react';
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
            <p className="text-gray-400 mt-1">Delete products instantly - Simple & Direct</p>
          </div>
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
            className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
          >
            ← Back to Admin
          </Button>
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
              onClick={() => navigate('/admin')}
              className="mt-4 bg-pink-600 hover:bg-pink-700"
            >
              Back to Admin Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}