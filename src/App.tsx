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
    console.log("✅ AUTHENTICATION SIMPLIFIED - Loading issues fixed, admin dashboard accessible");
    console.log("✅ Admin login now works - dashboard opens, add products functional");
    console.log("✅ Removed complex loading states that caused infinite loading");
    console.log("✅ Simplified admin detection - just checks role === 'admin'");
    console.log("🎯 ADMIN DASHBOARD - Clean admin panel accessible at /admin");
    console.log("📍 Current route:", location.pathname);
    console.log("👤 User status:", user ? "Logged in" : "Not logged in");
    console.log("🛡️ Admin status:", isAdmin ? "Admin user" : "Regular user");
  }, [location, user, isAdmin]);

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
