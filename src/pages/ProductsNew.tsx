import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Filter, Grid, List } from 'lucide-react';

interface Product {
  _row_id: number;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  image_url: string;
  category: string;
  in_stock: number;
  featured: number;
  age_restricted: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const categories = ['all', 'Vibrators', 'Couples Toys', 'Lingerie', 'Massage', 'Bondage', 'Lubricants', 'Massagers', 'Games'];

  useEffect(() => {
    // Load products - for now using sample data
    const sampleProducts: Product[] = [
      {
        _row_id: 1,
        name: 'Premium Luxury Vibrator',
        description: 'Experience ultimate pleasure with our premium luxury vibrator featuring 10 vibration modes, whisper-quiet operation, and waterproof design.',
        price: 49.99,
        compare_price: 69.99,
        image_url: 'https://images.pexels.com/photos/11482458/pexels-photo-11482458.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Vibrators',
        in_stock: 1,
        featured: 1,
        age_restricted: 1
      },
      {
        _row_id: 2,
        name: 'Couples Ring Enhancement',
        description: 'Enhance intimacy with this premium silicone couples ring. Features 7 vibration patterns and wireless remote control.',
        price: 34.99,
        compare_price: 44.99,
        image_url: 'https://images.pexels.com/photos/33538414/pexels-photo-33538414.png?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Couples Toys',
        in_stock: 1,
        featured: 1,
        age_restricted: 1
      },
      {
        _row_id: 3,
        name: 'Massage Oil Collection',
        description: 'Premium massage oil collection in three sensual scents. Made from natural ingredients.',
        price: 24.99,
        compare_price: 29.99,
        image_url: 'https://images.pexels.com/photos/33538415/pexels-photo-33538415.png?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Massage',
        in_stock: 1,
        featured: 0,
        age_restricted: 0
      },
      {
        _row_id: 4,
        name: 'Lingerie Set - Black Lace',
        description: 'Elegant black lace lingerie set featuring adjustable straps and comfortable fit.',
        price: 39.99,
        compare_price: 54.99,
        image_url: 'https://images.pexels.com/photos/12456285/pexels-photo-12456285.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Lingerie',
        in_stock: 1,
        featured: 1,
        age_restricted: 1
      }
    ];

    setProducts(sampleProducts);
    setLoading(false);
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._row_id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <span className="text-2xl font-bold text-white">ifudda</span>
            </Link>
            
            <Link to="/cart" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <ShoppingCart className="w-5 h-5 mr-1" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Shop Products</h1>
          <p className="text-gray-400">Discover our premium collection of adult wellness products</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 mb-8 border border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg ${view === 'grid' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg ${view === 'list' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product._row_id} 
              className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer group"
              onClick={() => handleProductClick(product._row_id)}
            >
              <div className="relative aspect-square">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.compare_price && product.compare_price > product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SAVE {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-semibold">View Details</span>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-400 text-sm mb-1">{product.category}</p>
                <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-bold text-lg">£{product.price.toFixed(2)}</span>
                    {product.compare_price && product.compare_price > product.price && (
                      <span className="text-gray-500 text-sm line-through ml-2">£{product.compare_price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product._row_id);
                    }}
                    className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;