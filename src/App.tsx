import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// Temporarily disable TooltipProvider due to Radix UI dependency issues
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Sellers from "./pages/Sellers";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import HelpTopic from "./pages/HelpTopic";
import Contact from "./pages/Contact";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import OrderTracking from "./pages/OrderTracking";
import PaymentMethods from "./pages/PaymentMethods";
import AdminDirect from "./pages/AdminDirect";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerOrders from "./pages/CustomerOrders";
import Addresses from "./pages/Addresses";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import CustomerSettings from "./pages/CustomerSettings";
import Support from "./pages/Support";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerProductNew from "./pages/SellerProductNew";
import SellerOrders from "./pages/SellerOrders";
import SellerCustomers from "./pages/SellerCustomers";
import SellerMessages from "./pages/SellerMessages";
import SellerMessageReply from "./pages/SellerMessageReply";
import SellerAnalytics from "./pages/SellerAnalytics";
import SellerEarnings from "./pages/SellerEarnings";
import SellerNotifications from "./pages/SellerNotifications";
import SellerSettings from "./pages/SellerSettings";
import SellerProfile from "./pages/SellerProfile";
import AdminDashboard from "./pages/AdminDashboard";
import ShopOwnerManagement from "./pages/ShopOwnerManagement";
import StoreDetail from "./pages/StoreDetail";
import CategoryManagement from "./pages/CategoryManagement";
import ReviewManagement from "./pages/ReviewManagement";
import ComplaintManagement from "./pages/ComplaintManagement";
import ShopOwnerDocuments from "./pages/ShopOwnerDocuments";
import SellerDocumentUpload from "./pages/SellerDocumentUpload";
import CurrencyManagement from "./pages/CurrencyManagement";
import DeliveryManagement from "./pages/DeliveryManagement";
import DriverManagement from "./pages/DriverManagement";
import PaymentGatewayManagement from "./pages/PaymentGatewayManagement";
import WithdrawalManagement from "./pages/WithdrawalManagement";
import ShopOwnerPaymentManagement from "./pages/ShopOwnerPaymentManagement";
import DeliveryOptionsManagement from "./pages/DeliveryOptionsManagement";
import UserManagement from "./pages/UserManagement";
import AdminSettings from "./pages/AdminSettings";
import ProductModeration from "./pages/ProductModeration";
import OrderManagement from "./pages/OrderManagement";
import Analytics from "./pages/Analytics";
import Security from "./pages/Security";
import AdminPasswordManagement from "./pages/AdminPasswordManagement";
import PaymentDemo from "./pages/PaymentDemo";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import SellerSubscription from "./pages/SellerSubscription";
import CheckoutPage from "./pages/CheckoutPage";
import SellerWithdrawalRequest from "./pages/SellerWithdrawalRequest";
import CategoryPage from "./pages/CategoryPage";
import Categories from "./pages/Categories";
import SubscriptionDebug from "./pages/SubscriptionDebug";
import PasswordResetTest from "./pages/PasswordResetTest";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// COMPREHENSIVE ADMIN DIALOG FIX - All admin pages now use dialog-simple: ReviewManagement, ShopOwnerDocuments, CategoryManagement, ComplaintManagement, ProductModeration, ShopOwnerPaymentManagement, PaymentGatewayManagement
console.log("App component loaded - COMPREHENSIVE ADMIN DIALOG FIX COMPLETE - All admin modals now functional - ", new Date().toISOString());
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      {/* TooltipProvider temporarily disabled due to dependency issues */}
      <div className="tooltip-wrapper">
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/help" element={<Help />} />
          <Route path="/help/topic/*" element={<HelpTopic />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/admin-direct" element={<AdminDirect />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-demo" element={<PaymentDemo />} />
          <Route path="/subscription-debug" element={<SubscriptionDebug />} />
          <Route path="/password-reset-test" element={<PasswordResetTest />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Customer Routes */}
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/orders" element={<CustomerOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/dashboard/addresses" element={<Addresses />} />
          <Route path="/dashboard/payments" element={<Payments />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          <Route path="/dashboard/settings" element={<CustomerSettings />} />
          <Route path="/dashboard/support" element={<Support />} />
          
          {/* Seller Routes */}
          <Route path="/dashboard/seller" element={<SellerDashboard />} />
          <Route path="/dashboard/seller/profile" element={<SellerProfile />} />
          <Route path="/dashboard/seller/subscription" element={<SellerSubscription />} />
          <Route path="/dashboard/seller/products" element={<SellerProducts />} />
          <Route path="/dashboard/seller/products/new" element={<SellerProductNew />} />
          <Route path="/dashboard/seller/orders" element={<SellerOrders />} />
          <Route path="/dashboard/seller/customers" element={<SellerCustomers />} />
          <Route path="/dashboard/seller/messages" element={<SellerMessages />} />
          <Route path="/dashboard/seller/messages/reply/:messageId" element={<SellerMessageReply />} />
          <Route path="/dashboard/seller/analytics" element={<SellerAnalytics />} />
          <Route path="/dashboard/seller/earnings" element={<SellerEarnings />} />
          <Route path="/dashboard/seller/notifications" element={<SellerNotifications />} />
          <Route path="/dashboard/seller/settings" element={<SellerSettings />} />
          <Route path="/dashboard/seller/documents" element={<SellerDocumentUpload />} />
          <Route path="/dashboard/seller/withdrawal" element={<SellerWithdrawalRequest />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/products" element={<ProductModeration />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/security" element={<Security />} />
          <Route path="/admin/shop-owners" element={<ShopOwnerManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/reviews" element={<ReviewManagement />} />
          <Route path="/admin/complaints" element={<ComplaintManagement />} />
          <Route path="/admin/shop-documents" element={<ShopOwnerDocuments />} />
          <Route path="/admin/store/:storeId" element={<StoreDetail />} />
          <Route path="/admin/currencies" element={<CurrencyManagement />} />
          <Route path="/admin/deliveries" element={<DeliveryManagement />} />
          <Route path="/admin/drivers" element={<DriverManagement />} />
          <Route path="/admin/payment-gateways" element={<PaymentGatewayManagement />} />
          <Route path="/admin/withdrawals" element={<WithdrawalManagement />} />
          <Route path="/admin/shop-owner-payments" element={<ShopOwnerPaymentManagement />} />
          <Route path="/admin/delivery-options" element={<DeliveryOptionsManagement />} />
          <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
          <Route path="/admin/password-management" element={<AdminPasswordManagement />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </div>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
