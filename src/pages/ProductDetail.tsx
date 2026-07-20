import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, Star, Heart, Store, ChevronLeft, 
  ShoppingCart, Bolt, Truck, Shield, CheckCircle
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import db from "@/lib/shared/kliv-database.js";
import { useCart } from "@/context/CartContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Load product details
      const products = await db.query("products", { _row_id: `eq.${id}` });
      
      if (products.length === 0) {
        setProduct(null);
        setLoading(false);
        return;
      }

      const productData = products[0];
      setProduct(productData);

      // Load store information
      if (productData.store_id) {
        const stores = await db.query("stores", { _row_id: `eq.${productData.store_id}` });
        if (stores.length > 0) {
          setStore(stores[0]);
        }
      }

      // Load related products from same category
      if (productData.category_id) {
        const related = await db.query("products", {
          category_id: `eq.${productData.category_id}`,
          _row_id: `neq.${id}`,
          status: "eq.active",
          limit: "4"
        });
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      _row_id: Date.now(),
      product_id: product._row_id,
      name: product.name,
      price: product.price,
      original_price: product.compare_price || product.price,
      quantity: quantity,
      image: product.primary_image,
      store_name: store?.name || "Verified Seller",
      rating: product.rating_average || 0
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }

    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = [
    product.primary_image,
    product.secondary_image,
    product.tertiary_image,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AliazaStore</span>
            </Link>
            
            <Link to="/products">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img 
                    src={images[selectedImage] || product.primary_image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Product+Image';
                    }}
                  />
                  {product.featured && (
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                      Featured
                    </Badge>
                  )}
                  {product.compare_price && product.compare_price > product.price && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                      Sale
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? "border-orange-500" 
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="bg-blue-100 text-blue-700 mb-2">
                {product.category_name || "General"}
              </Badge>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
              <p className="text-slate-600">{product.short_description || "No description available"}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{product.rating_average || 4.5}</span>
                <span className="text-slate-500">({product.review_count || 0} reviews)</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500">
                <ShoppingCart className="w-4 h-4" />
                <span>{product.sales_count || 0} sold</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-orange-600">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <>
                    <span className="text-xl text-slate-400 line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                    <Badge className="bg-red-100 text-red-700">
                      {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {product.stock_quantity > 10 
                  ? "In Stock" 
                  : product.stock_quantity > 0 
                  ? `Only ${product.stock_quantity} left in stock!`
                  : "Out of Stock"}
              </p>
            </div>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Store className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600">Sold by:</span>
                  <Link to={`/stores/${store?._row_id}`} className="font-medium text-orange-600 hover:underline">
                    {store?.name || "Verified Seller"}
                  </Link>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
                      disabled={quantity >= (product.stock_quantity || 10)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    onClick={handleBuyNow}
                    disabled={product.stock_quantity === 0}
                  >
                    <Bolt className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-900">Free Delivery</p>
                    <p className="text-sm text-slate-600">On orders over ₱1,000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900">Secure Payment</p>
                    <p className="text-sm text-slate-600">GCash, Credit Card, Bank Transfer</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-slate-900">Verified Seller</p>
                    <p className="text-sm text-slate-600">Quality guaranteed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Description */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Product Description</h2>
            <div className="prose prose-slate max-w-none">
              <p>{product.description || product.short_description || "No detailed description available."}</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct._row_id} to={`/products/${relatedProduct._row_id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <div className="relative">
                      <img 
                        src={relatedProduct.primary_image} 
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      {relatedProduct.compare_price && relatedProduct.compare_price > relatedProduct.price && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                          Sale
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-orange-600">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        {relatedProduct.compare_price && relatedProduct.compare_price > relatedProduct.price && (
                          <span className="text-sm text-slate-400 line-through">
                            {formatPrice(relatedProduct.compare_price)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
