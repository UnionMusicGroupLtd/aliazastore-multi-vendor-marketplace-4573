import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";

import IfuddaHomeNew from "./pages/IfuddaHomeNew";
import Products from "./pages/ProductsNew";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import AdminProductManagement from "./pages/AdminProductManagement";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import CategoryPageNew from "./pages/CategoryPageNew";

console.log("🔞 ifudda - Premium Adult Wellness | UK Since 2000 - Age Verification Required");
console.log("✅ Product click navigation fixed - Products are now clickable");
console.log("🛒 Add to Cart functionality fixed - Cart items now persist and show count");
console.log("🔧 Admin Product Management System - Complete with ban, upload, sales, pricing, delivery");
console.log("🔐 Login System Fixed - Sign In now accessible from homepage and /login route");
console.log("🎨 NEW HOMEPAGE DESIGN - Product-focused template with featured products, new arrivals, best sellers, sales, and categories");
console.log("🗂️ COMPLETE CATEGORY SYSTEM - 15 main categories with 60+ subcategories implemented in database and UI");
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <div className="ifudda-app">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IfuddaHomeNew />} />
            <Route path="/login" element={<Login />} />
            <Route path="/categories" element={<CategoryPageNew />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProductManagement />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<IfuddaHomeNew />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
