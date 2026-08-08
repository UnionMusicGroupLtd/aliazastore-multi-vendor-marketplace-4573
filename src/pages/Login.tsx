import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingBag, Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import auth from "@/lib/shared/kliv-auth.js";
import { SimpleTabs, SimpleTabsList, SimpleTabsTrigger, SimpleTabsContent } from "@/components/ui/simple-tabs";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Customer login form
  const [customerLogin, setCustomerLogin] = useState({
    email: "",
    password: ""
  });

  // Seller login form
  const [sellerLogin, setSellerLogin] = useState({
    email: "",
    password: ""
  });

  // Registration form
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "customer"
  });

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await auth.signIn(customerLogin.email, customerLogin.password);
      console.log("Login result:", result);
      
      // Handle TOTP required
      if (result.status === 'totp_required') {
        setError("Two-factor authentication required. Please use the admin authentication flow.");
        setLoading(false);
        return;
      }
      
      const user = result.user;
      console.log("Customer logged in:", user);
      console.log("User groups:", user.groups);
      console.log("User metadata:", user.metadata);
      
      // Check metadata.role 
      const userRole = user.metadata?.role as string | undefined;
      console.log("User role:", userRole);
      
      // Check if user is in admin group
      const isAdmin = user.groups?.some((g: any) => 
        g === 'admins' || g === 'tenant_admin' || g?.key === 'admins' || g?.key === 'tenant_admin' || g?.name === 'Admins' || g?.name === 'Kliv Administrators'
      );
      console.log("Is admin by group:", isAdmin);
      
      // All users redirect to admin dashboard for simplified platform
      setSuccess("Login successful! Redirecting to admin dashboard...");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message.includes("bad_credentials")) {
        setError("Invalid email or password");
      } else if (err.message.includes("account_locked")) {
        setError("Account locked due to too many failed attempts. Please reset your password.");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await auth.signIn(sellerLogin.email, sellerLogin.password);
      console.log("Login result:", result);
      
      // Handle TOTP required
      if (result.status === 'totp_required') {
        setError("Two-factor authentication required. Please use the admin authentication flow.");
        setLoading(false);
        return;
      }
      
      const user = result.user;
      console.log("Seller logged in:", user);
      console.log("User groups:", user.groups);
      console.log("User metadata:", user.metadata);
      
      // Check metadata.role 
      const userRole = user.metadata?.role as string | undefined;
      console.log("Seller login - User role:", userRole);
      
      // Check if user is in admin group
      const isAdmin = user.groups?.some((g: any) => 
        g === 'admins' || g === 'tenant_admin' || g?.key === 'admins' || g?.key === 'tenant_admin' || g?.name === 'Admins' || g?.name === 'Kliv Administrators'
      );
      console.log("Seller login - Is admin by group:", isAdmin);
      
      // All users redirect to admin dashboard for simplified platform
      setSuccess("Login successful! Redirecting to admin dashboard...");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message.includes("bad_credentials")) {
        setError("Invalid email or password");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate passwords match
    if (registration.password !== registration.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const user = await auth.signUp(
        registration.email,
        registration.password,
        `${registration.firstName} ${registration.lastName}`,
        "en-US", // locale
        {
          role: registration.accountType === "seller" ? "seller" : "customer"
        } // metadata
      );
      console.log("Registration successful:", user);
      setSuccess("Registration successful! Redirecting to admin dashboard...");
      
      // All new accounts redirect to admin dashboard for simplified platform
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.message.includes("email_exists")) {
        setError("An account with this email already exists");
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">i</span>
            </div>
            <span className="text-2xl font-bold text-white">ifudda</span>
          </Link>
          <p className="text-gray-400 mt-2">Premium Adult Wellness - Admin Portal</p>
        </div>

        <SimpleTabs defaultValue="customer" className="w-full">
          <SimpleTabsList className="grid w-full grid-cols-2 mb-6 gap-2 p-1 bg-slate-100 rounded-lg">
            <SimpleTabsTrigger value="customer" className="py-2 px-4 rounded-md transition-colors">Admin Access</SimpleTabsTrigger>
            <SimpleTabsTrigger value="seller" className="py-2 px-4 rounded-md transition-colors">Admin Management</SimpleTabsTrigger>
          </SimpleTabsList>

          {/* Customer Login */}
          <SimpleTabsContent value="customer">
            <Card className="border-gray-800 shadow-xl bg-gray-900/80 backdrop-blur-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-white">Admin Portal</CardTitle>
                <CardDescription className="text-gray-400">Sign in to manage ifudda store</CardDescription>
              </CardHeader>
              <form onSubmit={handleCustomerLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="customer-email"
                        type="email"
                        placeholder="customer@example.com"
                        className="pl-10"
                        value={customerLogin.email}
                        onChange={(e) => setCustomerLogin({ ...customerLogin, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="customer-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={customerLogin.password}
                        onChange={(e) => setCustomerLogin({ ...customerLogin, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="text-orange-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="text-sm text-center text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-orange-600 hover:underline font-medium">
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </SimpleTabsContent>

          {/* Seller Login */}
          <SimpleTabsContent value="seller">
            <Card className="border-gray-800 shadow-xl bg-gray-900/80 backdrop-blur-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-white">Admin Portal</CardTitle>
                <CardDescription className="text-gray-400">Access store management</CardDescription>
              </CardHeader>
              <form onSubmit={handleSellerLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="seller-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="seller-email"
                        type="email"
                        placeholder="seller@example.com"
                        className="pl-10"
                        value={sellerLogin.email}
                        onChange={(e) => setSellerLogin({ ...sellerLogin, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seller-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="seller-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={sellerLogin.password}
                        onChange={(e) => setSellerLogin({ ...sellerLogin, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="text-orange-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Access Admin Dashboard"}
                  </Button>
                  <div className="text-sm text-center text-slate-600">
                    New seller?{" "}
                    <Link to="/register" className="text-orange-600 hover:underline font-medium">
                      Create store
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </SimpleTabsContent>

          {/* Registration */}
          <SimpleTabsContent value="register">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create account</CardTitle>
                <CardDescription>Join ifudda today</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegistration}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="pl-10"
                          value={registration.firstName}
                          onChange={(e) => setRegistration({ ...registration, firstName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={registration.lastName}
                        onChange={(e) => setRegistration({ ...registration, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={registration.email}
                        onChange={(e) => setRegistration({ ...registration, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registration.password}
                        onChange={(e) => setRegistration({ ...registration, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registration.confirmPassword}
                        onChange={(e) => setRegistration({ ...registration, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <div className="text-sm text-center text-slate-600">
                    Already have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => {
                        // This would normally switch tabs - for now, navigate to login
                        navigate("/login");
                      }}
                      className="text-orange-600 hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </SimpleTabsContent>

          {/* Admin tab removed - admin users auto-redirect from Customer/Seller login based on groups */}
        </SimpleTabs>

        <p className="text-center text-sm text-slate-600 mt-8">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
