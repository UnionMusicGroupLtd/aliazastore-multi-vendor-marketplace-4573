import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

import IfuddaHomeNew from "./pages/IfuddaHomeNew";
import Products from "./pages/ProductsNew";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import AdminProductManagement from "./pages/AdminProductManagement";
import CategoryPageNew from "./pages/CategoryPageNew";
import SimpleAdminDashboard from "./pages/SimpleAdminDashboard";
import LoginNew from "./pages/LoginNew";

console.log("🔞 ifudda - Premium Adult Wellness | UK Since 2000 - Age Verification Required");
console.log("✅ Product click navigation fixed - Products are now clickable");
console.log("🛒 Add to Cart functionality fixed - Cart items now persist and show count");
console.log("🔧 Admin Product Management System - Complete with ban, upload, sales, pricing, delivery");
console.log("🎨 NEW HOMEPAGE DESIGN - Product-focused template with featured products, new arrivals, best sellers, sales, and categories");
console.log("🗂️ COMPLETE CATEGORY SYSTEM - 15 main categories with 60+ subcategories implemented in database and UI");
console.log("🔧 ADMIN-ONLY PLATFORM - Simplified to single-store admin management (no multi-seller complexity)");
console.log("🎯 ifudda ADMIN DASHBOARD - Premium adult wellness store with products, delivery, payments, analytics");
console.log("🚫 ADMIN LINKS REMOVED - Admin access hidden from header and footer (only accessible via direct URL)");
console.log("🔐 AUTHENTICATION SYSTEM - Complete auth context with admin detection and proper redirect logic");
console.log("🚫 EMAIL DISPLAY REMOVED - No email addresses shown in UI, just 'Sign in' and 'Dashboard' links");
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <div className="ifudda-app">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IfuddaHomeNew />} />
              <Route path="/login" element={<LoginNew />} />
              <Route path="/categories" element={<CategoryPageNew />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<SimpleAdminDashboard />} />
              <Route path="/admin/products" element={<AdminProductManagement />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<IfuddaHomeNew />} />
            </Routes>
          </BrowserRouter>
        </div>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
