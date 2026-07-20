import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Filter, ShoppingBag, Star, 
  Heart, Store, ChevronLeft, ChevronRight, Grid, List, ShoppingCart, Bolt, ArrowLeft
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import db from "@/lib/shared/kliv-database.js";
import { useCart } from "@/context/CartContext";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getCartCount, addToCart: addToCartContext } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadCategory();
    loadCategories();
  }, [slug]);

  useEffect(() => {
    if (category) {
      loadProducts();
    }
  }, [category, sortBy, searchQuery]);

  const loadCategories = async () => {
    try {
      const data = await db.query("categories", { status: "eq.active" });
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadCategory = async () => {
    try {
      const data = await db.query("categories", { slug: `eq.${slug}`, status: "eq.active" });
      if (data.length > 0) {
        setCategory(data[0]);
      } else {
        // If category not found, redirect to products page
        navigate("/products");
      }
    } catch (error) {
      console.error("Error loading category:", error);
    }
  };

  const loadProducts = async () => {
    if (!category) return;
    
    setLoading(true);
    try {
      let allProducts: any[] = [];
      
      // Main category products
      const mainParams: any = { 
        status: "eq.active", 
        category_id: `eq.${category._row_id}` 
      };
      
      if (searchQuery) {
        mainParams.name = `like.%${searchQuery}%`;
      }

      const mainProducts = await db.query("products", mainParams);
      allProducts = [...mainProducts];
      
      // Load related subcategory products for broad categories
      let relatedCategoryIds: number[] = [];
      
      if (category.name === "Fashion") {
        relatedCategoryIds = categories
          .filter(c => ["Apparel", "Accessories", "Bags", "Footwear", "Jewelry", "Kids Fashion", "Sportswear", "Formal Wear", "Traditional Wear"].includes(c.name))
          .map(c => c._row_id);
      } else if (category.name === "Electronics") {
        relatedCategoryIds = categories
          .filter(c => ["Android Phones", "iPhones", "Feature Phones", "Phone Cases", "Chargers", "Screen Protectors", "Power Banks", "Laptops", "Desktops", "Tablets", "Monitors", "Gaming Consoles", "Video Games", "Headphones", "Speakers", "Audio Cables", "Microphones", "Amplifiers", "Smart TVs", "OLED TVs"].includes(c.name))
          .map(c => c._row_id);
      } else if (category.name === "Beauty & Health") {
        relatedCategoryIds = categories
          .filter(c => c.name.includes("Beauty") || c.name.includes("Health"))
          .map(c => c._row_id);
      } else if (category.name === "Home & Garden") {
        relatedCategoryIds = categories
          .filter(c => ["Fresh Produce", "Dairy & Eggs", "Meat & Poultry", "Seafood", "Bakery", "Canned Goods", "Frozen Foods", "Snacks", "Beverages", "Condiments", "Spices"].includes(c.name))
          .map(c => c._row_id);
      }
      
      // Related category products
      if (relatedCategoryIds.length > 0) {
        for (const catId of relatedCategoryIds) {
          if (catId !== category._row_id) { // Avoid duplicates
            const relatedParams = { ...mainParams, category_id: `eq.${catId}` };
            const relatedProducts = await db.query("products", relatedParams);
            allProducts = [...allProducts, ...relatedProducts];
          }
        }
      }
      
      // Remove duplicates based on _row_id
      const uniqueProducts = Array.from(
        new Map(allProducts.map(product => [product._row_id, product])).values()
      );
      
      // Apply sorting
      let sortedProducts = uniqueProducts;
      if (sortBy === "featured") {
        sortedProducts = uniqueProducts.filter(p => p.featured).sort((a, b) => b.sales_count - a.sales_count);
      } else if (sortBy === "newest") {
        sortedProducts = uniqueProducts.sort((a, b) => new Date(b._created_at || 0).getTime() - new Date(a._created_at || 0).getTime());
      } else if (sortBy === "price-low") {
        sortedProducts = uniqueProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        sortedProducts = uniqueProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        sortedProducts = uniqueProducts.sort((a, b) => b.rating_average - a.rating_average);
      } else if (sortBy === "popular") {
        sortedProducts = uniqueProducts.sort((a, b) => b.sales_count - a.sales_count);
      }
      
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    const cartItem = {
      _row_id: Date.now(),
      product_id: product._row_id,
      name: product.name,
      price: product.price,
      original_price: product.compare_price || product.price,
      quantity: 1,
      image: product.primary_image,
      store_name: "Verified Seller",
      rating: product.rating_average || 0
    };
    addToCartContext(cartItem);
    console.log("Added to cart:", cartItem);
    alert(`${product.name} added to cart!`);
  };

  const buyNow = (product: any) => {
    addToCart(product);
    navigate("/checkout");
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700">Loading category...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                AliazaStore
              </span>
            </Link>
            
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-12 pr-4 py-3 text-lg rounded-full border-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Link to="/products" className="text-orange-600 hover:text-orange-700">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                All Categories
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{category.name}</h1>
              <p className="text-slate-600">
                {products.length} products found
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-orange-500 text-white" : "bg-white"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-orange-500 text-white" : "bg-white"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-slate-200" />
                <CardContent className="p-4 space-y-2">
                  <div className="w-3/4 h-4 bg-slate-200 rounded" />
                  <div className="w-1/2 h-4 bg-slate-200 rounded" />
                  <div className="w-1/4 h-6 bg-slate-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {products.map((product) => (
              <Link key={product._row_id} to={`/products/${product._row_id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className="relative">
                    <img 
                      src={product.primary_image} 
                      alt={product.name}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                        Featured
                      </Badge>
                    )}
                    {product.compare_price && product.compare_price > product.price && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                        Sale
                      </Badge>
                    )}
                    <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg">
                      <Heart className="w-5 h-5 text-slate-600 hover:text-red-500" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {category.name}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating_average}</span>
                        <span className="text-xs text-slate-500">({product.review_count})</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3 flex items-center space-x-1">
                      <Store className="w-3 h-3" />
                      <span>Verified Seller</span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-orange-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(product.compare_price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        onClick={(e) => {
                          e.preventDefault();
                          buyNow(product);
                        }}
                      >
                        <Bolt className="w-4 h-4 mr-1" />
                        Buy Now
                      </Button>
                    </div>
                    {product.stock_quantity <= 10 && (
                      <p className="text-xs text-orange-600 mt-2">
                        Only {product.stock_quantity} left in stock!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => {
              setSearchQuery("");
              navigate("/products");
            }}>
              Browse All Products
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-12">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-orange-500 text-white">
              1
            </Button>
            <Button variant="outline" size="icon">
              2
            </Button>
            <Button variant="outline" size="icon">
              3
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;