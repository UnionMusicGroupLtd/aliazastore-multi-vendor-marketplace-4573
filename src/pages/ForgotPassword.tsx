import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingBag, Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import auth from "@/lib/shared/kliv-auth.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Request password reset through AliazaStore platform
      await auth.requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      
      // Handle distribution-related errors specifically
      if (err.message.includes('distribution') || err.message.includes('external') || err.message.includes('redirect')) {
        setError("Password reset is handled through AliazaStore platform. Please use your AliazaStore account email.");
      } else if (err.message.includes('not_found') || err.message.includes('email')) {
        setError("This email is not registered on AliazaStore. Please check your email or create a new account.");
      } else {
        setError(err.message || "Password reset request failed. Please try again or contact AliazaStore support.");
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
            <CardTitle className="text-2xl">Forgot AliazaStore Password</CardTitle>
            <CardDescription>
              {success 
                ? "AliazaStore password reset email sent" 
                : "Enter your AliazaStore account email and we'll send you a secure password reset link"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!success ? (
              <>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">AliazaStore Account Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@aliazastore.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Enter the email address associated with your AliazaStore account
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="inline-flex items-center text-sm text-slate-600 hover:text-orange-600">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    AliazaStore password reset email sent to <strong>{email}</strong>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">AliazaStore Password Reset Process</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-start">
                        <span className="font-bold mr-2">1.</span>
                        <span>Check your email for AliazaStore password reset message</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">2.</span>
                        <span>Click the secure AliazaStore reset link (valid for 24 hours)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">3.</span>
                        <span>Create your new AliazaStore account password</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">4.</span>
                        <span>Log in to AliazaStore with your new password</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">AliazaStore Password Reset Help</h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Check your spam folder for AliazaStore email</li>
                      <li>• Ensure you're using your registered AliazaStore account email</li>
                      <li>• Wait a few minutes for the AliazaStore email to arrive</li>
                      <li>• Try requesting a new AliazaStore password reset link</li>
                      <li>• Contact AliazaStore support if issues persist</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSuccess(false);
                        setEmail("");
                      }}
                    >
                      Try Again
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      onClick={() => window.location.href = '/login'}
                    >
                      Back to AliazaStore Login
                    </Button>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">🔒 AliazaStore Security Notice</h3>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Password resets are only processed through AliazaStore platform</li>
                      <li>• Never click on suspicious links or external distributions</li>
                      <li>• AliazaStore password reset emails always come from official AliazaStore domain</li>
                      <li>• Contact AliazaStore support if you receive suspicious password reset requests</li>
                      <li>• Keep your AliazaStore account secure with unique passwords</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Remember your AliazaStore password?{" "}
            <Link to="/login" className="text-orange-600 hover:underline font-medium">
              Sign in to AliazaStore
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-slate-600 mt-8">
          AliazaStore platform password reset. By continuing, you agree to our{" "}
          <Link to="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;