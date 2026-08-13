import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestProduct {
  _row_id: number;
  name: string;
  category: string;
}

export default function DeleteTestPage() {
  const [products, setProducts] = useState<TestProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState<string>('');

  // Load products
  const loadProducts = async () => {
    try {
      console.log("🔄 Loading products...");
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      const result = await db.query('products', {
        select: '_row_id, name, category',
        order: '_row_id.asc'
      }) as TestProduct[];
      
      console.log("✅ Products loaded:", result);
      setProducts(result || []);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ Load error:", err);
      setDeleteStatus(`❌ Load failed: ${err.message}`);
      setLoading(false);
    }
  };

  // Test different delete methods
  const testDelete = async (productId: number, productName: string, method: number) => {
    try {
      console.log(`🗑️ Testing delete method ${method} for product:`, productId);
      setDeleteStatus(`🔄 Testing method ${method}...`);
      
      const db = (await import('@/lib/shared/kliv-database.js')).default;
      
      let result;
      switch(method) {
        case 1:
          console.log("Method 1: db.delete with eq._row_id");
          result = await db.delete('products', { _row_id: `eq.${productId}` } as any);
          break;
        case 2:
          console.log("Method 2: db.delete with string _row_id");
          result = await db.delete('products', { _row_id: String(productId) } as any);
          break;
        case 3:
          console.log("Method 3: db.delete with filter");
          result = await db.delete('products', { filter: { _row_id: `eq.${productId}` } } as any);
          break;
        default:
          throw new Error("Invalid method");
      }
      
      console.log(`✅ Method ${method} succeeded:`, result);
      setDeleteStatus(`✅ Method ${method} deleted "${productName}" successfully!`);
      
      // Reload products after successful delete
      setTimeout(() => loadProducts(), 1000);
      
    } catch (err: any) {
      console.error(`❌ Method ${method} failed:`, err);
      setDeleteStatus(`❌ Method ${method} failed: ${err.message}`);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">🗑️ Delete Function Test Page</h1>
        
        {deleteStatus && (
          <div className={`mb-6 p-4 rounded-lg ${deleteStatus.includes('✅') ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-400'}`}>
            {deleteStatus}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Current Products ({products.length})</h2>
            
            {products.map((product) => (
              <div key={product._row_id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{product.name}</h3>
                    <p className="text-gray-400 text-sm">ID: {product._row_id} | Category: {product.category}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => testDelete(product._row_id, product.name, 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Test Method 1
                    </Button>
                    <Button 
                      onClick={() => testDelete(product._row_id, product.name, 2)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                    >
                      Test Method 2
                    </Button>
                    <Button 
                      onClick={() => testDelete(product._row_id, product.name, 3)}
                      className="bg-pink-600 hover:bg-pink-700 text-white text-sm"
                    >
                      Test Method 3
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No products left to test!</p>
                <Button 
                  onClick={loadProducts}
                  className="mt-4 bg-green-600 hover:bg-green-700"
                >
                  Reload Products
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Delete Methods Explained:</h3>
          <div className="space-y-2 text-sm">
            <div className="text-gray-300">
              <span className="text-blue-400 font-bold">Method 1:</span> db.delete with eq._row_id syntax
            </div>
            <div className="text-gray-300">
              <span className="text-purple-400 font-bold">Method 2:</span> db.delete with string conversion
            </div>
            <div className="text-gray-300">
              <span className="text-pink-400 font-bold">Method 3:</span> db.delete with filter object
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={() => window.location.href = '/admin/products'}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            ← Back to Product Management
          </Button>
        </div>
      </div>
    </div>
  );
}