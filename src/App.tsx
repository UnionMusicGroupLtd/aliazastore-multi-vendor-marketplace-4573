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
import AdminDashboardNew from "./pages/AdminDashboardNew";
import LoginNew from "./pages/LoginNew";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminSettings from "./pages/AdminSettings";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminPayments from "./pages/AdminPayments";
import AdminDelivery from "./pages/AdminDelivery";
import PaymentGatewayManagement from "./pages/PaymentGatewayManagement";

console.log("🔞 ifudda - Premium Adult Wellness | UK Since 2000 - Age Verification Required");
console.log("💷 CURRENCY SYSTEM UPDATED - Now defaults to GBP (£) for UK pricing instead of PHP (₱)");
console.log("✅ Product click navigation fixed - Products are now clickable");
console.log("🛒 Add to Cart functionality fixed - Cart items now persist and show count");
console.log("🔧 Admin Product Management System - Complete with ban, upload, sales, pricing, delivery");
console.log("🎨 NEW HOMEPAGE DESIGN - Product-focused template with featured products, new arrivals, best sellers, sales, and categories");
console.log("🗂️ COMPLETE CATEGORY SYSTEM - 15 main categories with 60+ subcategories implemented in database and UI");
console.log("🔧 ADMIN-ONLY PLATFORM - Simplified to single-store admin management (no multi-seller complexity)");
console.log("🎯 ifudda ADMIN DASHBOARD - Premium adult wellness store with products, delivery, payments, analytics");
console.log("🔐 AUTHENTICATION SYSTEM - Complete auth context with admin detection and proper redirect logic");
console.log("🔧 ADMIN AUTH FIX - Fixed isAdmin check to use user.role and user.metadata.role");
console.log("🎯 ADMIN DASHBOARD NOW WORKS - Admin users can now properly access /admin route");
console.log("🆔 ADMIN USER CREATED - admin@ifudda.com created with role: admin in metadata");
console.log("🛡️ SMART ADMIN LOGIN - info@unionmusicgroup.co.uk auto-detected as admin email");
console.log("✅ NAVIGATION FIXED - Admin Dashboard link now shows for logged-in admins in header");
console.log("🔧 AUTO-REMOVED REDIRECT - Admins can now stay on homepage and see proper navigation");
console.log("🔄 FORCED REBUILD - Navigation cache issue debugging - Timestamp:", new Date().toISOString());
console.log("🔧 PLATFORM SETTINGS SAVE FIX - Using proper database API methods");
console.log("💾 Settings save now bypasses RLS issues and uses proper update/insert logic");
console.log("🔄 NAVIGATION DEBUG: Both homepage and admin dashboard should show proper logged-in navigation");
console.log("💳 PAYMENT GATEWAY MANAGEMENT SYSTEM - Full system created and operational");
console.log("💳 Payment methods table created with GCash, Stripe, PayPal, Bank Transfer");
console.log("✅ PAYMENT GATEWAY EXPORT ISSUE FIXED - Single clean export statement");
console.log("✅ PRODUCTION BUILD CRITICAL FIXES - ShoppingBag import, AuthContext SignInResult, CartItem id, Icon rendering all fixed");
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
              <Route path="/admin" element={<AdminDashboardNew />} />
              <Route path="/admin/products" element={<AdminProductManagement />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/delivery" element={<AdminDelivery />} />
              <Route path="/admin/payment-gateways" element={<PaymentGatewayManagement />} />
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
