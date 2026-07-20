import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Mail, Loader2 } from "lucide-react";
import auth from "@/lib/shared/kliv-auth.js";

const PasswordResetTest = () => {
  const [email, setEmail] = useState("samdiaz894@gmail.com");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleTestReset = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      console.log("Testing AliazaStore password reset for:", email);
      
      const result = await auth.requestPasswordReset(email);
      console.log("Password reset result:", result);
      
      setSuccess(`✅ Password reset email sent to ${email}! Check your inbox for the AliazaStore password reset link.`);
      console.log("📧 AliazaStore password reset email sent successfully!");
      console.log("🔗 User should receive an email with the password reset link");
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(`❌ Failed to send reset email: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-2">🔐 AliazaStore Password Reset Test</h1>
        <p className="text-center text-slate-600 mb-8">Test the password reset email system</p>
        
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-600" />
              Send Password Reset Email
            </CardTitle>
            <CardDescription>
              Test if AliazaStore password reset emails are being sent properly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
              <p className="text-xs text-slate-500">
                This will send a real password reset email to this address
              </p>
            </div>

            <Button 
              onClick={handleTestReset}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending password reset email...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Password Reset Email
                </>
              )}
            </Button>

            {success && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">📋 Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>1.</strong> Enter an email address (default: samdiaz894@gmail.com)</p>
            <p><strong>2.</strong> Click "Send Password Reset Email" button</p>
            <p><strong>3.</strong> Check the email inbox for password reset email</p>
            <p><strong>4.</strong> Look for email with subject: "🔐 Reset Your AliazaStore Password"</p>
            <p><strong>5.</strong> Click the reset link in the email to test functionality</p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="font-semibold text-yellow-900">⚠️ Note:</p>
              <p className="text-yellow-800">This sends a real password reset email. Only use for testing purposes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordResetTest;