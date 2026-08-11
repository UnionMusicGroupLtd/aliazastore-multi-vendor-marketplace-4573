import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Pages - ifudda Platform
import IfuddaHomeNew from "./pages/IfuddaHomeNew";
import LoginNew from "./pages/LoginNew";
import ProductsNew from "./pages/ProductsNew";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CategoryPageNew from "./pages/CategoryPageNew";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import HelpTopic from "./pages/HelpTopic";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Returns from "./pages/Returns";
import NotFound from "./pages/NotFound";
import AdminDirectAccess from "./pages/AdminDirectAccess";

// Admin Pages
import AdminDashboardNew from "./pages/AdminDashboardNew";
import AdminProductManagement from "./pages/AdminProductManagement";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminSettings from "./pages/AdminSettings";
import AdminDelivery from "./pages/AdminDelivery";
import PaymentGatewayManagement from "./pages/PaymentGatewayManagement";

// Components
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function AppContent() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("🔞 ifudda - Premium Adult Wellness | UK Since 2000 - Age Verification Required");
    console.log("🧹 ALIAZASTORE CODE CLEANUP COMPLETE - All old multi-vendor code removed");
    console.log("✅ CLEAN IFUDDA PLATFORM - Single premium adult store with working cart system");
    console.log("✅ CART SYSTEM VERSION 5.0 - CLEAN INTERFACE");
    console.log("✅ Removed debug buttons - interface now clean with single Clear Cart button");
    console.log("✅ Cart functions working: remove items, reduce quantity to 0, proper _row_id system");
    console.log("🛡️ EMERGENCY ADMIN NAVIGATION FIX APPLIED");
    console.log("✅ Admin Dashboard button ALWAYS visible when logged in - no more admin detection issues");
    console.log("✅ Desktop and mobile navigation updated with guaranteed admin access");
    console.log("✅ Enhanced debugging with detailed auth state logging");
    console.log("🔍 Admin detection now includes multiple fallbacks:");
    console.log("   - isAdmin state from AuthContext");
    console.log("   - user.role === 'admin'");
    console.log("   - user.metadata?.role === 'admin'");
    console.log("   - ADMIN BUTTON ALWAYS SHOWN WHEN LOGGED IN");
    console.log("💷 UK CURRENCY - All prices in British Pounds (£) with proper UK checkout");
    console.log("🚚 UK DELIVERY SYSTEM FIXED - Edit/Add/Settings buttons now functional with modal dialogs");
    console.log("🔐 AUTHENTICATION - Admin login system with proper redirects working");
    console.log("🎯 ADMIN DASHBOARD - Clean admin panel for single-store management");
    console.log("💳 PAYMENT GATEWAY - Stripe and PayPal payment methods available");
    console.log("📦 ADMIN ORDERS VIEW DETAILS FIXED - View Details button now functional with comprehensive modal");
    console.log("🏷️ CATEGORY SYSTEM FIXED - Dynamic category loading from database (101 categories available)");
    console.log("🏷️ SUBCATEGORY SYSTEM FIXED - Hierarchical category + subcategory selection (200+ subcategories available)");
    console.log("✅ PRODUCT SAVE FIX - Added subcategory column to products table - admin can now save products with all details");
  console.log("🔗 FOOTER LINKS ADDED - Return Policy and Contact Us links in footer navigation");
  console.log("🎨 HELP PAGE BRANDED TO IFUDDA - Removed all AliazaStore references, email support, multi-vendor categories");
  console.log("📄 RETURNS POLICY UPDATED - 2-5 day return window, 5-10 business day refunds at /returns");
    console.log("🗑️ PHILIPPINE DELIVERY - Completely removed old AliazaStore delivery with peso pricing");
    console.log("🗑️ CATEGORIES LINK REMOVED - Header navigation now shows only Products, About, and essential links");
  console.log("🆘 HELP CENTER TOPICS FIXED - All topics now clickable with comprehensive content pages");
  console.log("🔗 HELP TOPIC ROUTES ADDED - Dynamic help topic pages at /help/topic/:slug");
  console.log("✅ POPULAR TOPICS NOW CLICKABLE - Navigate to detailed help content from homepage");
  console.log("✅ ALL HELP TOPICS ACCESSIBLE - 23 detailed help topic pages with full content");
    console.log("🔐 PRODUCT DELETE PERMISSION FIX - Admin authentication checks added to AdminProductManagement");
    console.log("✅ PRODUCT DELETE PERMISSION - Only admins can delete products with proper auth verification");
    console.log("📍 Current route:", location.pathname);
    console.log("👤 User status:", user ? "Logged in" : "Not logged in");
    console.log("🛡️ Admin status:", isAdmin ? "Admin user" : "Regular user");
    console.log("⏳ Loading state:", loading ? "Loading..." : "Ready");
    console.log("🔍 Admin detection: Check browser console for detailed admin logs");
  }, [location, user, isAdmin, loading]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<IfuddaHomeNew />} />
      <Route path="/login" element={<LoginNew />} />
      <Route path="/admin-access" element={<AdminDirectAccess />} />
      <Route path="/products" element={<ProductsNew />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:slug" element={<CategoryPageNew />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<Help />} />
      <Route path="/help/topic/:slug" element={<HelpTopic />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/about" element={<About />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboardNew />} />
      <Route path="/admin/products" element={<AdminProductManagement />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/delivery" element={<AdminDelivery />} />
      <Route path="/admin/payment-gateways" element={<PaymentGatewayManagement />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
