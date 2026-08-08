import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight, Users, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LoginNew = () => {
  const navigate = useNavigate();
  const { signIn, user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [isAdminEmail, setIsAdminEmail] = useState(false);

  // Admin emails that should get admin UI and redirect
  const ADMIN_EMAILS = [
    'info@unionmusicgroup.co.uk',
    'admin@ifudda.com',
    'support@ifudda.com'
  ];

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  // Registration form
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Check if user is already logged in using AuthContext
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Use AuthContext state instead of raw auth check
        console.log("🔍 LoginNew: Using AuthContext for logged-in check");
        console.log("🔍 LoginNew: User from context:", user);
        console.log("🔍 LoginNew: isAdmin:", isAdmin);
        
        if (user && isAdmin) {
          console.log("✅ Admin user already logged in, redirecting to /admin");
          navigate("/admin");
        } else if (user && !isAdmin) {
          console.log("✅ Normal user already logged in, redirecting to home");
          navigate("/");
        }
      } catch (err) {
        console.error("❌ Error checking auth status:", err);
      }
    };
    
    checkUserAuth();
  }, [user, isAdmin, navigate]);

  // Real-time admin email detection
  useEffect(() => {
    const email = loginForm.email.toLowerCase().trim();
    const detectedAdmin = ADMIN_EMAILS.some(adminEmail => 
      email === adminEmail.toLowerCase()
    );
    
    if (detectedAdmin && !isAdminEmail) {
      console.log("🛡️ Admin email detected:", email);
      setIsAdminEmail(true);
    } else if (!detectedAdmin && isAdminEmail) {
      setIsAdminEmail(false);
    }
  }, [loginForm.email, isAdminEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signIn(loginForm.email, loginForm.password);
      console.log("✅ Login successful!");
      
      setSuccess("✅ Login successful! Redirecting...");
      
      // Immediate redirect check using current user data
      setTimeout(async () => {
        try {
          console.log("🔍 Direct redirect check after login");
          
          // Check if we just logged in with an admin email
          const isAdminUser = ADMIN_EMAILS.some(adminEmail => 
            loginForm.email.toLowerCase().trim() === adminEmail.toLowerCase()
          );
          
          if (isAdminUser) {
            console.log("✅✅✅ ADMIN EMAIL LOGIN - Redirecting to /admin");
            window.location.href = "/admin";
          } else {
            console.log("✅ Normal user - Redirecting to home");
            navigate("/");
          }
        } catch (err) {
          console.error("❌ Error checking user role:", err);
          console.log("🔄 Fallback: Redirecting to home due to error");
          navigate("/");
        }
      }, 1000);
      
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message?.includes("bad_credentials")) {
        setError("Invalid email or password");
      } else if (err.message?.includes("account_locked")) {
        setError("Account locked due to too many failed attempts. Please reset your password.");
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

    try {
      // Check if user is trying to register with an admin email
      const isEmailAdmin = ADMIN_EMAILS.some(adminEmail => 
        registration.email.toLowerCase().trim() === adminEmail.toLowerCase()
      );

      if (isEmailAdmin) {
        setError("This email is reserved for admin accounts. Please contact support@ifudda.com for access.");
        setLoading(false);
        return;
      }

      // For now, disable all registrations
      setError("Registration is currently disabled. Please contact admin@ifudda.com for account access.");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
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
          <p className="text-gray-400 mt-2">Premium Adult Wellness</p>
        </div>

        {!showRegistration ? (
          <>
            {/* Login Card */}
            <Card className="border-gray-800 shadow-xl bg-gray-900/80 backdrop-blur-lg">
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                  {isAdminEmail ? (
                    <Shield className="w-6 h-6 text-red-500" />
                  ) : (
                    <Users className="w-6 h-6 text-red-500" />
                  )}
                  <CardTitle className="text-2xl text-white">
                    {isAdminEmail ? "Admin Portal" : "Welcome Back"}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  {isAdminEmail 
                    ? "Admin access to ifudda management system" 
                    : "Sign in to your ifudda account"}
                </CardDescription>
                {isAdminEmail && (
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800 mt-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Admin account detected - Dashboard access enabled
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <form onSubmit={handleLogin}>
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
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="text-red-500 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className={isAdminEmail 
                      ? "w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      : "w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    }
                    disabled={loading}
                  >
                    {loading 
                      ? "Signing in..." 
                      : isAdminEmail 
                        ? "Access Admin Dashboard" 
                        : "Sign In"
                    }
                  </Button>
                  
                  <div className="text-sm text-center text-gray-400">
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => setShowRegistration(true)}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </>
        ) : (
          <>
            {/* Registration Card */}
            <Card className="border-gray-800 shadow-xl bg-gray-900/80 backdrop-blur-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-white">Create Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Join ifudda today
                </CardDescription>
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
                        placeholder="your@email.com"
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
                  
                  <div className="text-sm text-center text-gray-400">
                    Already have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => setShowRegistration(false)}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-red-500 hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-red-500 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginNew;
