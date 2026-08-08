import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronRight, Home, Grid, List, Filter, 
  ShoppingBag, Heart, Star, Zap, Shield, 
  Lock, Droplets, Flame, Gamepad2, Target,
  Activity, Armchair, Settings, Package,
  Sparkles, Eye, Circle, Cherry, Leaf,
  Snowflake, ShoppingBag as ShoppingBagIcon
} from 'lucide-react';

interface Category {
  _row_id: number;
  name: string;
  parent_id: number | null;
  level: number;
  description: string;
  icon: string;
  display_order: number;
}

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

const CategoryPageNew = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load categories - for now using sample data structure
    const sampleCategories: Category[] = [
      // Main Categories
      { _row_id: 1, name: 'Vibrators', parent_id: null, level: 0, description: 'Premium vibrators and personal massagers', icon: 'Vibrate', display_order: 1 },
      { _row_id: 2, name: 'Dildos', parent_id: null, level: 0, description: 'Realistic and fantasy dildos', icon: 'Zap', display_order: 2 },
      { _row_id: 3, name: 'Couples Toys', parent_id: null, level: 0, description: 'Toys for couples and partner play', icon: 'Heart', display_order: 3 },
      { _row_id: 4, name: 'Lingerie', parent_id: null, level: 0, description: 'Sexy lingerie and intimate apparel', icon: 'ShoppingBag', display_order: 4 },
      { _row_id: 5, name: 'Bondage', parent_id: null, level: 0, description: 'BDSM gear and bondage equipment', icon: 'Lock', display_order: 5 },
      { _row_id: 6, name: 'Lubricants', parent_id: null, level: 0, description: 'Personal lubricants and enhancement products', icon: 'Droplets', display_order: 6 },
      { _row_id: 7, name: 'Massage', parent_id: null, level: 0, description: 'Massage oils and intimacy products', icon: 'Sparkles', display_order: 7 },
      { _row_id: 8, name: 'Contraceptives', parent_id: null, level: 0, description: 'Protection and sexual health products', icon: 'Shield', display_order: 8 },
      { _row_id: 9, name: 'Adult Games', parent_id: null, level: 0, description: 'Games and novelty items for adults', icon: 'Gamepad2', display_order: 9 },
      { _row_id: 10, name: 'Anal Toys', parent_id: null, level: 0, description: 'Anal toys and beads', icon: 'Target', display_order: 10 },
      { _row_id: 11, name: 'Male Toys', parent_id: null, level: 0, description: 'Masturbators and pleasure sleeves', icon: 'Zap', display_order: 11 },
      { _row_id: 12, name: 'Kegel & Fitness', parent_id: null, level: 0, description: 'Kegel exercisers and fitness products', icon: 'Activity', display_order: 12 },
      { _row_id: 13, name: 'Sex Furniture', parent_id: null, level: 0, description: 'Furniture and positioning equipment', icon: 'Armchair', display_order: 13 },
      { _row_id: 14, name: 'Health & Wellness', parent_id: null, level: 0, description: 'Sexual health and wellness products', icon: 'Heart', display_order: 14 },
      { _row_id: 15, name: 'Accessories', parent_id: null, level: 0, description: 'Toy accessories and essentials', icon: 'Settings', display_order: 15 },
      
      // Vibrators Subcategories
      { _row_id: 16, name: 'Bullet Vibrators', parent_id: 1, level: 1, description: 'Compact and powerful bullet vibrators', icon: 'Zap', display_order: 1 },
      { _row_id: 17, name: 'Rabbit Vibrators', parent_id: 1, level: 1, description: 'Dual-action rabbit style vibrators', icon: 'Zap', display_order: 2 },
      { _row_id: 18, name: 'Wand Vibrators', parent_id: 1, level: 1, description: 'Powerful wand massagers', icon: 'Zap', display_order: 3 },
      { _row_id: 19, name: 'G-Spot Vibrators', parent_id: 1, level: 1, description: 'Curved for G-spot stimulation', icon: 'Zap', display_order: 4 },
      { _row_id: 20, name: 'Clitoral Vibrators', parent_id: 1, level: 1, description: 'Focused clitoral stimulation', icon: 'Zap', display_order: 5 },
      
      // Dildos Subcategories
      { _row_id: 21, name: 'Realistic Dildos', parent_id: 2, level: 1, description: 'Life-like realistic dildos', icon: 'Zap', display_order: 1 },
      { _row_id: 22, name: 'Glass Dildos', parent_id: 2, level: 1, description: 'Tempered glass pleasure wands', icon: 'Sparkles', display_order: 2 },
      { _row_id: 23, name: 'Silicone Dildos', parent_id: 2, level: 1, description: 'Body-safe silicone dildos', icon: 'Zap', display_order: 3 },
      { _row_id: 24, name: 'Double-Ended', parent_id: 2, level: 1, description: 'Double-ended for shared pleasure', icon: 'Heart', display_order: 4 },
      
      // Lingerie Subcategories
      { _row_id: 25, name: 'Bra & Panty Sets', parent_id: 4, level: 1, description: 'Matching bra and panty sets', icon: 'ShoppingBag', display_order: 1 },
      { _row_id: 26, name: 'Babydolls', parent_id: 4, level: 1, description: 'Flowy babydoll lingerie', icon: 'ShoppingBag', display_order: 2 },
      { _row_id: 27, name: 'Chemises', parent_id: 4, level: 1, description: 'Elegant slip-style lingerie', icon: 'ShoppingBag', display_order: 3 },
      { _row_id: 28, name: 'Corsets', parent_id: 4, level: 1, description: 'Waist-cinching corsets', icon: 'ShoppingBag', display_order: 4 },
      { _row_id: 29, name: 'Stockings', parent_id: 4, level: 1, description: 'Sexy stockings and hosiery', icon: 'ShoppingBag', display_order: 5 },
      
      // Bondage Subcategories
      { _row_id: 30, name: 'Handcuffs', parent_id: 5, level: 1, description: 'Restraint handcuffs', icon: 'Lock', display_order: 1 },
      { _row_id: 31, name: 'Ropes', parent_id: 5, level: 1, description: 'Bondage ropes and accessories', icon: 'Zap', display_order: 2 },
      { _row_id: 32, name: 'Blindfolds', parent_id: 5, level: 1, description: 'Sensory deprivation blindfolds', icon: 'Eye', display_order: 3 },
      { _row_id: 33, name: 'Gags', parent_id: 5, level: 1, description: 'Speech restraint gags', icon: 'Zap', display_order: 4 },
      { _row_id: 34, name: 'Collars', parent_id: 5, level: 1, description: 'BDSM collars and leads', icon: 'Circle', display_order: 5 },
    ];
    
    setCategories(sampleCategories);
    
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
        name: 'Realistic Silicone Dildo',
        description: 'Premium silicone realistic dildo with detailed texture and strong suction cup base.',
        price: 34.99,
        compare_price: 44.99,
        image_url: 'https://images.pexels.com/photos/33538414/pexels-photo-33538414.png?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Dildos',
        in_stock: 1,
        featured: 1,
        age_restricted: 1,
        on_sale: 1,
        sale_price: 29.99,
        discount_percentage: 22
      },
      {
        _row_id: 3,
        name: 'Couples Ring Enhancement',
        description: 'Enhance intimacy with this premium silicone couples ring. Features 7 vibration patterns.',
        price: 24.99,
        compare_price: 29.99,
        image_url: 'https://images.pexels.com/photos/33538415/pexels-photo-33538415.png?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Couples Toys',
        in_stock: 1,
        featured: 0,
        age_restricted: 1
      },
      {
        _row_id: 4,
        name: 'Black Lace Lingerie Set',
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
        name: 'Beginner Bondage Kit',
        description: 'Complete introduction kit with soft restraints, blindfold, and feather tickler.',
        price: 29.99,
        compare_price: 39.99,
        image_url: 'https://images.pexels.com/photos/36339062/pexels-photo-36339062.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        category: 'Bondage',
        in_stock: 1,
        featured: 0,
        age_restricted: 1
      }
    ];
    
    setProducts(sampleProducts);
  }, [slug]);

  const mainCategories = categories.filter(cat => cat.level === 0);
  const subCategories = categories.filter(cat => cat.level === 1);
  
  const getSubCategories = (parentId: number) => {
    return subCategories.filter(cat => cat.parent_id === parentId);
  };

  const getIcon = (iconName: string): React.ElementType => {
    const iconMap: { [key: string]: React.ElementType } = {
      'Vibrate': Zap,
      'Zap': Zap,
      'Heart': Heart,
      'ShoppingBag': ShoppingBagIcon,
      'Lock': Lock,
      'Droplets': Droplets,
      'Sparkles': Sparkles,
      'Shield': Shield,
      'Gamepad2': Gamepad2,
      'Target': Target,
      'Activity': Activity,
      'Armchair': Armchair,
      'Settings': Settings,
      'Package': Package,
      'Eye': Eye,
      'Circle': Circle,
      'Cherry': Cherry,
      'Leaf': Leaf,
      'Flame': Flame,
      'Snowflake': Snowflake,
    };
    return iconMap[iconName] || ShoppingBagIcon;
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => {
        const category = categories.find(c => c._row_id === selectedCategory);
        return category && p.category === category.name;
      })
    : products;

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
            
            <div className="flex items-center space-x-4">
              <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm mb-8">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white">All Categories</span>
        </div>

        <div className="flex gap-8">
          {/* Category Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Categories
              </h2>
              
              <div className="space-y-2">
                {mainCategories.map((category) => {
                  const IconComponent = getIcon(category.icon);
                  const subs = getSubCategories(category._row_id);
                  const isExpanded = expandedCategories.has(category._row_id);
                  
                  return (
                    <div key={category._row_id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category._row_id);
                          if (subs.length > 0) {
                            toggleCategory(category._row_id);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                          selectedCategory === category._row_id
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                            : 'hover:bg-gray-800 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-4 h-4" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        {subs.length > 0 && (
                          <ChevronRight 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                          />
                        )}
                      </button>
                      
                      {isExpanded && subs.length > 0 && (
                        <div className="ml-8 mt-2 space-y-1">
                          {subs.map((sub) => {
                            const SubIcon = getIcon(sub.icon);
                            return (
                              <button
                                key={sub._row_id}
                                onClick={() => setSelectedCategory(sub._row_id)}
                                className={`w-full flex items-center space-x-2 p-2 rounded-lg text-sm transition-all ${
                                  selectedCategory === sub._row_id
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'hover:bg-gray-800 text-gray-400'
                                }`}
                              >
                                <SubIcon className="w-3 h-3" />
                                <span>{sub.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Current Category Info */}
            {selectedCategory && (
              <div className="bg-gradient-to-r from-red-500/10 to-pink-600/10 rounded-xl p-6 border border-red-500/20 mb-6">
                {(() => {
                  const category = categories.find(c => c._row_id === selectedCategory);
                  if (!category) return null;
                  const IconComponent = getIcon(category.icon);
                  return (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                        <p className="text-gray-400">{category.description}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Products Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {selectedCategory ? 'Products in Category' : 'All Products'}
                  <span className="text-gray-400 text-base ml-2">({filteredProducts.length} items)</span>
                </h3>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <Link
                    key={product._row_id}
                    to={`/products/${product._row_id}`}
                    className="block"
                  >
                    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all group">
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
                        <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white font-bold text-lg">
                              £{product.on_sale && product.sale_price ? product.sale_price.toFixed(2) : product.price.toFixed(2)}
                            </span>
                            {product.compare_price && (
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
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No products found in this category</p>
                  <Link to="/products" className="text-red-400 hover:text-red-300 mt-2 inline-block">
                    Browse all products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPageNew;