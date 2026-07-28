import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { content } from "@/lib/shared/kliv-content.js";

const QRCodeUploadHelp = () => {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError("Please upload an image file (JPG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      // Upload to content filesystem
      const result = await content.uploadFile(file, '/content/gcash-qr-codes/');
      
      if (result && result.path) {
        setUploaded(true);
        
        // Update the database
        const db = (await import('@/lib/shared/kliv-database.js')).default;
        await db.update('payment_methods', { gateway_type: 'eq.gcash' }, {
          gcash_qr_code: result.path
        });
        
        // Refresh after 2 seconds
        setTimeout(() => {
          window.location.href = '/admin/payment-gateways';
        }, 2000);
      }
    } catch (err) {
      setError("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Upload GCash QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploaded ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-green-600 font-semibold">QR Code Uploaded Successfully!</p>
              <p className="text-sm text-slate-600 mt-2">Redirecting to payment gateways...</p>
            </div>
          ) : (
            <>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">Upload your GCash InstaPay QR code image</p>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 mx-auto"
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              
              {uploading && (
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              )}
              
              <div className="text-xs text-slate-500 space-y-1">
                <p>• Accepts: JPG, PNG, GIF, WebP</p>
                <p>• Maximum size: 5MB</p>
                <p>• This will open GCash app when scanned</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeUploadHelp;