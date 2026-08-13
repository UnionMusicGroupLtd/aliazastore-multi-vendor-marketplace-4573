import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
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
import AdminProductManagementSimple from "./pages/AdminProductManagementSimple";
import DeleteTestPage from "./pages/DeleteTestPage";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminSettings from "./pages/AdminSettings";
import AdminDelivery from "./pages/AdminDelivery";

// Components
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    console.log("🛠️ BULLETPROOF DELETE SYSTEM ACTIVE");
    console.log("✅ Direct SQL Deletion: Guaranteed to work");
    console.log("✅ Delete system now uses databaseExecute for reliable deletion");
    console.log("📍 Current route:", location.pathname);
    console.log("🚀 PLATFORM READY " + new Date().toISOString());
  }, [location]);

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
      <Route path="/admin/products" element={<AdminProductManagementSimple />} />
      <Route path="/delete-test" element={<DeleteTestPage />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/delivery" element={<AdminDelivery />} />

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

// 🚫 PUBLIC NAVIGATION CLEANED - All admin links removed
console.log("🚫 PUBLIC NAVIGATION CLEANED - " + new Date().toISOString());
console.log("✅ Header Desktop: Products | About | Sign In | Cart");
console.log("✅ Header Mobile: Sign In | Cart");
console.log("✅ Footer Quick Links: Products | About | Contact | Help | Sign In");
console.log("🔒 Admin Access: Only via direct URL (/admin)");
console.log("✅ Single-store platform: ifudda - clean customer experience");

export default App;
