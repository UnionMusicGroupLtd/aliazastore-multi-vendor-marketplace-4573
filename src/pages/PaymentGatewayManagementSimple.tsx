import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import db from "@/lib/shared/kliv-database.js";
import { content } from "@/lib/shared/kliv-content.js";

const PaymentGatewayManagementSimple = () => {
  const [gcashNumber, setGcashNumber] = useState("");
  const [gcashQRCode, setGcashQRCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = async () => {
    try {
      const result = await db.query("payment_methods", { gateway_type: "eq.gcash" });
      if (result && Array.isArray(result) && result.length > 0) {
        const gateway = result[0] as any;
        setGcashNumber(gateway.gcash_number || "");
        setGcashQRCode(gateway.gcash_qr_code || "");
        console.log("✅ Loaded current GCash settings:", {
          number: gateway.gcash_number,
          qrCode: gateway.gcash_qr_code
        });
      }
    } catch (err) {
      console.error("❌ Error loading settings:", err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("❌ No file selected");
      return;
    }

    console.log("✅ File selected:", file.name, file.size, file.type);
    
    try {
      setUploading(true);
      setError("");
      setSuccess("");

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        setUploading(false);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setUploading(false);
        return;
      }

      console.log("🔄 Starting upload...");
      
      // Upload file to content filesystem
      const result = await content.uploadFile(file, '/content/gcash-qr-codes/');
      
      console.log("📤 Upload result:", JSON.stringify(result, null, 2));
      
      if (result && result.path) {
        setGcashQRCode(result.path);
        setSuccess("✅ QR code uploaded successfully! Click 'Save Changes' to apply.");
        console.log("✅ QR code uploaded to:", result.path);
      } else {
        setError("Upload failed - no file path returned");
        console.error("❌ Upload failed - no path returned");
      }
    } catch (err) {
      const errorMsg = "Upload failed: " + (err as Error).message;
      setError(errorMsg);
      console.error("❌ Upload error:", err);
    } finally {
      setUploading(false);
      console.log("🔄 Upload process completed");
    }
  };

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");

      console.log("💾 Saving settings to database...");
      
      // Get the GCash gateway
      const result = await db.query("payment_methods", { gateway_type: "eq.gcash" });
      
      if (!result || result.length === 0) {
        setError("GCash payment gateway not found");
        return;
      }

      const gateway = result[0];
      console.log("🔧 Updating gateway:", gateway._row_id);

      // Update the gateway
      await db.update("payment_methods", { 
        _row_id: `eq.${gateway._row_id}` 
      }, {
        gcash_number: gcashNumber,
        gcash_qr_code: gcashQRCode || ""
      });

      setSuccess("✅ Settings saved successfully! Customers will now see the updated QR code.");
      console.log("✅ Settings saved successfully");
      
      // Reload to verify
      setTimeout(() => loadCurrentSettings(), 1000);
      
    } catch (err) {
      const errorMsg = "Save failed: " + (err as Error).message;
      setError(errorMsg);
      console.error("❌ Save error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/admin" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <span className="text-xl font-bold">GCash QR Code Upload</span>
              <p className="text-sm text-slate-600">Upload your InstaPay QR code for customer payments</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Success</p>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6 space-y-6">
            
            {/* Current Settings Display */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Current Settings</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">GCash Number:</span>
                  <span className="ml-2 text-slate-600">{gcashNumber || "Not set"}</span>
                </div>
                <div>
                  <span className="font-medium">QR Code:</span>
                  <span className="ml-2 text-slate-600">{gcashQRCode ? "✅ Uploaded" : "❌ Not uploaded"}</span>
                </div>
              </div>
            </div>

            {/* GCash Number Input */}
            <div>
              <Label className="text-base font-semibold">GCash Number</Label>
              <Input
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                placeholder="09172345678"
                type="tel"
                className="mt-2"
              />
              <p className="text-sm text-slate-500 mt-1">Customers can send payment to this GCash number</p>
            </div>

            {/* QR Code Upload */}
            <div>
              <Label className="text-base font-semibold">InstaPay QR Code Image</Label>
              <div className="mt-2 space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading QR code...</span>
                  </div>
                )}

                {gcashQRCode && !uploading && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-green-800 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">✅ QR Code Ready!</span>
                    </div>
                    <div className="flex justify-center">
                      <img 
                        src={gcashQRCode} 
                        alt="GCash QR Code Preview" 
                        className="w-32 h-32 object-contain border border-green-300 rounded"
                      />
                    </div>
                    <p className="text-xs text-green-600 mt-2 text-center">This InstaPay QR code will open GCash app when scanned</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📱 Upload Instructions</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Open your GCash app and go to "Send Money"</li>
                <li>Tap "InstaPay" and generate your QR code</li>
                <li>Screenshot or save the QR code image</li>
                <li>Upload the image above using the file input</li>
                <li>Click "Save Changes" to apply the new QR code</li>
              </ol>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <Button
                onClick={handleSave}
                disabled={!gcashNumber}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Console Debug Info */}
        <div className="mt-6 bg-slate-900 text-green-400 rounded-lg p-4 text-xs font-mono">
          <p className="font-bold mb-2">🔍 Debug Console:</p>
          <p>Upload Status: {gcashQRCode ? "✅ QR code uploaded" : "❌ No QR code"}</p>
          <p>Database Status: {gcashNumber ? "✅ GCash number set" : "❌ No GCash number"}</p>
          <p>Current QR Path: {gcashQRCode || "None"}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayManagementSimple;
