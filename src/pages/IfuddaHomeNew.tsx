import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, ShoppingBag, Heart, Lock, Truck, Star, CheckCircle, 
  ArrowRight, TrendingUp, Clock, Flame, Award, Sparkles, LogOut 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

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
  on_sale?: number;
  sale_price?: number;
  discount_percentage?: number;
}

const IfuddaHomeNew = () => {
  const navigate = useNavigate();
  const [ageVerified, setAgeVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const { getCartCount, addToCart } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    const verified = localStorage.getItem('ifudda_age_verified');
    if (verified === 'true') {
      setAgeVerified(true);
      setShowVerification(false);
    }
    
    // Redirect admin users to dashboard
    if (isAdmin && user) {
      console.log("🔧 Admin user detected on home page, redirecting to /admin");
      navigate('/admin');
      return;
    }
    
    // Load sample products
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
        age_restricted: 1,
        on_sale: 1,
        sale_price: 39.99,
        discount_percentage: 29
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
        age_restricted: 1,
        on_sale: 1,
        sale_price: 29.99,
        discount_percentage: 22
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
        age_restricted: 1,
        on_sale: 1,
        sale_price: 34.99,
        discount_percentage: 36
      },
      {
        _row_id: 5,
        name: 'Bondage Starter Kit',
        description: 'Complete introduction kit with soft restraints, blindfold, and feather tickler.',
        price: 29.99,
        compare_price: 39.99,
        image_url: 'https://images.pexels.com/photos/36339062/pexels-photo-36339062.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Bondage',
        in_stock: 1,
        featured: 0,
        age_restricted: 1
      },
      {
        _row_id: 6,
        name: 'Premium Lubricant',
        description: 'Water-based premium lubricant, long-lasting and hypoallergenic.',
        price: 14.99,
        compare_price: 19.99,
        image_url: 'https://images.pexels.com/photos/33525723/pexels-photo-33525723.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Lubricants',
        in_stock: 1,
        featured: 0,
        age_restricted: 0
      },
      {
        _row_id: 7,
        name: 'Remote Control Massager',
        description: 'Wireless remote control massager with 12 intensity levels and USB charging.',
        price: 44.99,
        compare_price: 59.99,
        image_url: 'https://images.pexels.com/photos/11482458/pexels-photo-11482459.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Massagers',
        in_stock: 1,
        featured: 1,
        age_restricted: 1,
        on_sale: 1,
        sale_price: 38.99,
        discount_percentage: 35
      },
      {
        _row_id: 8,
        name: 'Couples Game Collection',
        description: 'Exciting card games and dice designed to enhance intimacy and communication.',
        price: 19.99,
        compare_price: 24.99,
        image_url: 'https://images.pexels.com/photos/33538416/pexels-photo-33538416.png?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Games',
        in_stock: 1,
        featured: 0,
        age_restricted: 0
      }
    ];
    setProducts(sampleProducts);

    // Auto-rotate hero slides
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAgeVerification = (isOver18: boolean) => {
    if (isOver18) {
      setAgeVerified(true);
      localStorage.setItem('ifudda_age_verified', 'true');
      setShowVerification(false);
      console.log('Age verification passed - User confirmed 18+');
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      _row_id: Date.now(),
      product_id: product._row_id,
      name: product.name,
      price: product.on_sale && product.sale_price ? product.sale_price : product.price,
      original_price: product.compare_price || product.price,
      quantity: 1,
      image: product.image_url,
      store_name: 'ifudda',
      rating: 4.5
    });
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const featuredProducts = products.filter(p => p.featured === 1);
  const newProducts = products.slice(0, 4);
  const saleProducts = products.filter(p => p.on_sale === 1);
  const categories = [
    { name: 'Vibrators', image: products[0]?.image_url, count: 45 },
    { name: 'Couples Toys', image: products[1]?.image_url, count: 32 },
    { name: 'Lingerie', image: products[3]?.image_url, count: 28 },
    { name: 'Bondage', image: products[4]?.image_url, count: 24 },
    { name: 'Massage', image: products[2]?.image_url, count: 19 },
    { name: 'Lubricants', image: products[5]?.image_url, count: 15 }
  ];

  const heroSlides = [
    {
      title: "Summer Sale",
      subtitle: "Up to 40% off premium products",
      cta: "Shop Sale",
      bg: "from-red-600 to-pink-600"
    },
    {
      title: "New Arrivals",
      subtitle: "Discover our latest collection",
      cta: "Explore Now",
      bg: "from-purple-600 to-indigo-600"
    },
    {
      title: "Free Delivery",
      subtitle: "On orders over £50",
      cta: "Shop Now",
      bg: "from-blue-600 to-cyan-600"
    }
  ];

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/95 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">🔞 Age Verification Required</h1>
            <p className="text-gray-400">This website contains adult content. By entering, you confirm that you are 18 years or older.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleAgeVerification(true)}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
              I am 18 or older - Enter Site
            </button>
            
            <button
              onClick={() => handleAgeVerification(false)}
              className="w-full bg-gray-800 text-gray-400 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
            >
              I am under 18 - Leave
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 Your privacy is protected. Secure SSL encryption.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Product added to cart!</span>
        </div>
      )}

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
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link>
              <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              
              {/* TEMPORARY: Direct Admin Access for Testing */}
              <Link 
                to="/admin" 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                🔧 Admin Dashboard
              </Link>
              
              {user ? (
                <button 
                  onClick={signOut}
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </button>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
              )}
              
              <Link to="/cart" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <ShoppingBag className="w-5 h-5 mr-1" />
                {getCartCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </nav>

            <div className="md:hidden flex items-center space-x-4">
              {user ? (
                <button 
                  onClick={signOut}
                  className="text-white text-sm flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </button>
              ) : (
                <Link to="/login" className="text-white text-sm">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel with Products */}
      <section className="relative overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`bg-gradient-to-br ${slide.bg} py-20`}>
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{slide.title}</h1>
                <p className="text-xl text-white/80 mb-8">{slide.subtitle}</p>
                <Link
                  to="/products"
                  className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                  {slide.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeHeroSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Products</h2>
            <p className="text-gray-400">Hand-picked premium items</p>
          </div>
          <Link to="/products" className="text-red-400 hover:text-red-300 flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div 
              key={product._row_id}
              className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all group"
            >
              <Link to={`/products/${product._row_id}`} className="block">
                <div className="relative aspect-square">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.on_sale && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                  {product.discount_percentage && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount_percentage}%
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-1">{product.category}</p>
                  <h3 className="text-white font-semibold mb-2 truncate">{product.name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold text-lg">
                        £{product.on_sale && product.sale_price ? product.sale_price.toFixed(2) : product.price.toFixed(2)}
                      </span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-gray-500 text-sm line-through ml-2">
                          £{product.compare_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="px-4 pb-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sale Banner */}
      <section className="bg-gradient-to-r from-red-600 to-pink-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-8 h-8 text-white mr-2" />
            <h2 className="text-3xl font-bold text-white">Summer Sale - Up to 40% Off</h2>
          </div>
          <p className="text-white/80 mb-6">Limited time offer on selected premium products</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Shop Sale Items
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
              New Arrivals
            </h2>
            <p className="text-gray-400">Just added to our collection</p>
          </div>
          <Link to="/products" className="text-red-400 hover:text-red-300 flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <div 
              key={product._row_id}
              className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all group"
            >
              <Link to={`/products/${product._row_id}`} className="block">
                <div className="relative aspect-square">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-1">{product.category}</p>
                  <h3 className="text-white font-semibold mb-2 truncate">{product.name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">£{product.price.toFixed(2)}</span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="px-4 pb-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories with Products */}
      <section className="bg-gray-900/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Shop by Category</h2>
            <p className="text-gray-400">Find exactly what you're looking for</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/categories"
                className="group bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all"
              >
                <div className="relative h-48">
                  <img
                    src={category.image || 'https://images.pexels.com/photos/11482458/pexels-photo-11482458.jpeg?auto=compress&cs=tinysrgb&h=300&w=300'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-1">{category.name}</h3>
                    <p className="text-gray-300 text-sm">{category.count} products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
              Best Sellers
            </h2>
            <p className="text-gray-400">Most popular products this month</p>
          </div>
          <Link to="/products" className="text-red-400 hover:text-red-300 flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div 
              key={product._row_id}
              className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all group"
            >
              <Link to={`/products/${product._row_id}`} className="block">
                <div className="relative aspect-square">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    TOP
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-1">{product.category}</p>
                  <h3 className="text-white font-semibold mb-2 truncate">{product.name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold text-lg">£{product.price.toFixed(2)}</span>
                      {product.compare_price && (
                        <span className="text-gray-500 text-sm line-through ml-2">
                          £{product.compare_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="px-4 pb-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
              <Clock className="w-6 h-6 mr-2" />
              Limited Time Offers
            </h2>
            <p className="text-gray-300">Grab these deals before they're gone</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <div 
                key={product._row_id}
                className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-red-400/50 transition-all group"
              >
                <Link to={`/products/${product._row_id}`} className="block">
                  <div className="relative aspect-square">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount_percentage}%
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 truncate">{product.name}</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold text-lg">£{product.sale_price?.toFixed(2)}</span>
                        <span className="text-white/60 text-sm line-through ml-2">£{product.price.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-red-300 font-semibold">
                        Ends Soon
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Discreet Delivery</h3>
            <p className="text-gray-400 text-sm">Plain packaging with no indication of contents</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Age Verified</h3>
            <p className="text-gray-400 text-sm">Strict 18+ verification and security checks</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Fast UK Shipping</h3>
            <p className="text-gray-400 text-sm">Next day delivery available across the UK</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-gray-400 text-sm">Only genuine, body-safe products</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-900/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-red-500/10 to-pink-600/10 rounded-2xl p-8 border border-red-500/20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose ifudda?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                '26 years of trusted service since 2000',
                'Over 500,000 satisfied customers across the UK',
                'Discreet billing and packaging guaranteed',
                'Expert customer support available 24/7',
                'Free delivery on orders over £50',
                '30-day hassle-free returns policy'
              ].map((reason, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">i</span>
                </div>
                <span className="text-xl font-bold text-white">ifudda</span>
              </div>
              <p className="text-gray-400 text-sm">Premium adult wellness products. UK trusted since 2000.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">Products</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
                <li><Link to="/cart" className="text-gray-400 hover:text-white text-sm">Shopping Cart</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white text-sm">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">support@ifudda.co.uk</p>
              <p className="text-gray-400 text-sm mt-2">24/7 Customer Support</p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">© 2000-2026 ifudda. All rights reserved. | UK Company | Age Verification Required</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IfuddaHomeNew;