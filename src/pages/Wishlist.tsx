import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, ArrowLeft, ShoppingBag, Trash2
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface WishlistItem {
  _row_id: number;
  product_id: number;
  name: string;
  price: number;
  original_price: number;
  image: string;
  store_name: string;
  rating: number;
  in_stock: boolean;
}

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      _row_id: 1,
      product_id: 4,
      name: "Organic Skincare Set",
      price: 79.99,
      original_price: 99.99,
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
      store_name: "Natural Beauty",
      rating: 4.7,
      in_stock: true
    },
    {
      _row_id: 2,
      product_id: 5,
      name: "Wireless Earbuds Pro",
      price: 149.99,
      original_price: 199.99,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
      store_name: "AudioTech Store",
      rating: 4.5,
      in_stock: true
    },
    {
      _row_id: 3,
      product_id: 6,
      name: "Smart Home Speaker",
      price: 199.99,
      original_price: 299.99,
      image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
      store_name: "Smart Home Hub",
      rating: 4.8,
      in_stock: false
    }
  ]);

  const moveToCart = (item: WishlistItem) => {
    // In a real app, this would add to cart and remove from wishlist
    navigate("/cart");
  };

  const removeItem = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item._row_id !== id));
  };

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
            
            <Link to="/dashboard/customer">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Wishlist</h1>
          <p className="text-slate-600">{wishlistItems.length} items saved</p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h2>
              <p className="text-slate-600 mb-6">Start saving items you love</p>
              <Link to="/products">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item._row_id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm group hover:shadow-xl transition-all">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Link to={`/products/${item.product_id}`}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={() => removeItem(item._row_id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    {!item.in_stock && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  
                  <Link to={`/products/${item.product_id}`}>
                    <h3 className="font-semibold text-slate-900 mb-1 hover:text-orange-600 line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-slate-600 mb-2">{item.store_name}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      {item.rating} ★
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg text-orange-600">{formatPrice(item.price)}</p>
                      <p className="text-xs text-slate-500 line-through">{formatPrice(item.original_price)}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {Math.round((1 - item.price / item.original_price) * 100)}% OFF
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
                    disabled={!item.in_stock}
                    onClick={() => moveToCart(item)}
                  >
                    {item.in_stock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;