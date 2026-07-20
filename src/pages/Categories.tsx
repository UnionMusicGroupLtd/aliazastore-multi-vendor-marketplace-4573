import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, ShoppingBag, Heart, Store, 
  Grid, ArrowRight, Menu, X
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import db from "@/lib/shared/kliv-database.js";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await db.query("categories", { status: "eq.active" });
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconForCategory = (categoryName: string) => {
    const icons: { [key: string]: string } = {
      "Electronics": "📱",
      "Fashion": "👗", 
      "Home & Garden": "🏡",
      "Beauty & Health": "💄",
      "Sports & Outdoors": "⚽",
      "Automotive": "🚗",
      "Beauty": "💄",
      "Sports": "⚽",
      "Home": "🏡"
    };
    return icons[categoryName] || "📦";
  };

  const getColorForCategory = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      "Electronics": "from-blue-500 to-blue-600",
      "Fashion": "from-pink-500 to-pink-600",
      "Home & Garden": "from-green-500 to-green-600",
      "Beauty & Health": "from-purple-500 to-purple-600",
      "Sports & Outdoors": "from-orange-500 to-orange-600",
      "Automotive": "from-red-500 to-red-600",
      "Beauty": "from-purple-500 to-purple-600",
      "Sports": "from-orange-500 to-orange-600"
    };
    return colors[categoryName] || "from-slate-500 to-slate-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                AliazaStore
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 ml-12">
              <Link to="/" className="text-slate-700 hover:text-orange-600 transition-colors">Home</Link>
              <Link to="/products" className="text-slate-700 hover:text-orange-600 transition-colors">Products</Link>
              <Link to="/categories" className="text-orange-600 font-semibold">Categories</Link>
              <Link to="/sellers" className="text-slate-700 hover:text-orange-600 transition-colors">Become a Seller</Link>
              <Link to="/about" className="text-slate-700 hover:text-orange-600 transition-colors">About</Link>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Start Selling
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Link to="/products" className="block py-2 text-slate-700">Products</Link>
              <Link to="/categories" className="block py-2 text-orange-600 font-semibold">Categories</Link>
              <Link to="/sellers" className="block py-2 text-slate-700">Become a Seller</Link>
              <Link to="/login" className="block py-2 text-slate-700">Sign In</Link>
              <Link to="/register">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Link to="/" className="text-orange-600 hover:text-orange-700">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">Categories</span>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Categories</h1>
          <p className="text-xl text-slate-600">
            Explore our wide selection of categories to find exactly what you're looking for
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-40 bg-slate-200" />
                <CardContent className="p-4">
                  <div className="w-3/4 h-4 bg-slate-200 rounded mb-2" />
                  <div className="w-1/2 h-4 bg-slate-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Link key={category._row_id} to={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${getColorForCategory(category.name)} rounded-2xl flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform`}>
                      {getIconForCategory(category.name)}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">Browse products</p>
                    <div className="flex items-center justify-center text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Browse</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No categories found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search</p>
            <Button onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;