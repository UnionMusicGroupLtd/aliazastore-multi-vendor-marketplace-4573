import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, Mail, Lock, User, Store, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import auth from "@/lib/shared/kliv-auth.js";
import { notifyNewShopRegistration } from "@/lib/notifications";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [accountType, setAccountType] = useState("customer");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    acceptTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate terms accepted
    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions");
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const metadata: any = {};
      
      if (accountType === "seller") {
        metadata.storeName = formData.storeName;
        metadata.accountType = "seller";
      } else {
        metadata.accountType = "customer";
      }

      const user = await auth.signUp(
        formData.email,
        formData.password,
        fullName,
        "en",
        metadata
      );
      
      console.log("Registration successful:", user);
      setSuccess("Registration successful! Redirecting...");
      
      // Send notification for new seller registration
      if (accountType === "seller" && formData.storeName) {
        await notifyNewShopRegistration({
          storeName: formData.storeName,
          ownerName: fullName,
          ownerEmail: formData.email,
          ownerPhone: "Not provided",
          businessType: "Online Store",
          category: "General",
          storeDescription: `New seller registration: ${formData.storeName}`
        });
      }
      
      // Redirect based on account type
      setTimeout(() => {
        if (accountType === "seller") {
          navigate("/dashboard/seller");
        } else {
          navigate("/dashboard/customer");
        }
      }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              AliazaStore
            </span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join AliazaStore and start buying or selling</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
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

              {/* Account Type Selection */}
              <div className="space-y-2">
                <Label>I want to</Label>
                <RadioGroup value={accountType} onValueChange={setAccountType}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <RadioGroupItem value="customer" id="customer" />
                    <label htmlFor="customer" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Buy products</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Shop from thousands of sellers</p>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <RadioGroupItem value="seller" id="seller" />
                    <label htmlFor="seller" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <Store className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Sell products</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Open your own store</p>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="pl-10"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {accountType === "seller" && (
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="storeName"
                      placeholder="My Awesome Store"
                      className="pl-10"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500">This will be your store's display name</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                />
                <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                  I accept the{" "}
                  <Link to="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <div className="text-sm text-center text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-600 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
