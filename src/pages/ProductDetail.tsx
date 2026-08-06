import { Link, useParams } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Shield, Truck, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Sample product data - in production this would load from database
  const allProducts = [
    {
      _row_id: 1,
      name: 'Premium Luxury Vibrator',
      description: 'Experience ultimate pleasure with our premium luxury vibrator featuring 10 vibration modes, whisper-quiet operation, and waterproof design. Made from body-safe silicone.',
      price: 49.99,
      compare_price: 69.99,
      image_url: 'https://images.pexels.com/photos/11482458/pexels-photo-11482458.jpeg?auto=compress&cs=tinysrgb&h=500&w=500',
      category: 'Vibrators',
      in_stock: 1,
      age_restricted: 1
    },
    {
      _row_id: 2,
      name: 'Couples Ring Enhancement',
      description: 'Enhance intimacy with this premium silicone couples ring. Features 7 vibration patterns and wireless remote control.',
      price: 34.99,
      compare_price: 44.99,
      image_url: 'https://images.pexels.com/photos/33538414/pexels-photo-33538414.png?auto=compress&cs=tinysrgb&h=500&w=500',
      category: 'Couples Toys',
      in_stock: 1,
      age_restricted: 1
    },
    {
      _row_id: 3,
      name: 'Massage Oil Collection',
      description: 'Premium massage oil collection in three sensual scents. Made from natural ingredients.',
      price: 24.99,
      compare_price: 29.99,
      image_url: 'https://images.pexels.com/photos/33538415/pexels-photo-33538415.png?auto=compress&cs=tinysrgb&h=500&w=500',
      category: 'Massage',
      in_stock: 1,
      age_restricted: 0
    },
    {
      _row_id: 4,
      name: 'Lingerie Set - Black Lace',
      description: 'Elegant black lace lingerie set featuring adjustable straps and comfortable fit.',
      price: 39.99,
      compare_price: 54.99,
      image_url: 'https://images.pexels.com/photos/12456285/pexels-photo-12456285.jpeg?auto=compress&cs=tinysrgb&h=500&w=500',
      category: 'Lingerie',
      in_stock: 1,
      age_restricted: 1
    }
  ];

  const product = allProducts.find(p => p._row_id === parseInt(id || '1')) || allProducts[0];

  const handleAddToCart = () => {
    addToCart({
      id: product._row_id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800">
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
              Cart
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 text-center">
                <Shield className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">Body Safe</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 text-center">
                <Truck className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">Discreet</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">Premium</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <span className="text-red-500 text-sm font-semibold">{product.category}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-white">£{product.price.toFixed(2)}</span>
              {product.compare_price && product.compare_price > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">£{product.compare_price.toFixed(2)}</span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    SAVE {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800 mb-6">
              <h2 className="text-lg font-bold text-white mb-3">Product Description</h2>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {product.age_restricted && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">
                  <strong>🔞 Age Restricted:</strong> This product is only available to customers aged 18 and over.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
              >
                Add to Cart
              </button>

              <Link
                to="/checkout"
                className="block w-full bg-gray-800 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all text-center"
              >
                Buy Now
              </Link>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>Discreet billing as "IFD"</span>
              </div>
              <div className="flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                <span>Plain packaging - free UK delivery</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                <span>30-day hassle-free returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
