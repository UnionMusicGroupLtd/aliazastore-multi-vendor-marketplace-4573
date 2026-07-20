import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, ImageIcon, CheckCircle, AlertCircle, FileText, Shield
} from "lucide-react";
import { content } from "@/lib/shared/kliv-content.js";
import auth from "@/lib/shared/kliv-auth.js";
import db from "@/lib/shared/kliv-database.js";

const SellerDocumentUpload = () => {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const [formData, setFormData] = useState({
    owner_govt_id: "",
    owner_govt_id_file: null as File | null,
    store_logo: null as File | null
  });

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const currentUser = await auth.getUser();
      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      // Get store for current user
      const stores = await db.query("stores", {
        owner_email: `eq.${currentUser.email}`,
        limit: "1"
      });

      if (stores && stores.length > 0) {
        const store = stores[0];
        setStoreData(store);
        setFormData({
          owner_govt_id: store.owner_govt_id || "",
          owner_govt_id_file: null,
          store_logo: null
        });
      }
    } catch (error) {
      console.error("Error loading store data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGovtIdUpload = async () => {
    try {
      setUploading(true);
      
      if (formData.owner_govt_id_file) {
        const result = await content.uploadFile(formData.owner_govt_id_file, "/content/shop-documents/govt-ids/");
        
        await db.update("stores", { _row_id: `eq.${storeData._row_id}` }, {
          owner_govt_id: formData.owner_govt_id,
          owner_govt_id_file: result.path,
          owner_govt_id_uploaded: 1,
          owner_govt_id_uploaded_at: Date.now()
        });
      }

      setSuccessMessage("Government ID uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      loadStoreData();
    } catch (error) {
      console.error("Error uploading government ID:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async () => {
    try {
      setUploading(true);
      
      if (formData.store_logo) {
        const result = await content.uploadFile(formData.store_logo, "/content/shop-documents/logos/");
        
        await db.update("stores", { _row_id: `eq.${storeData._row_id}` }, {
          store_logo: result.path,
          store_logo_uploaded: 1,
          store_logo_uploaded_at: Date.now()
        });
      }

      setSuccessMessage("Store logo uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      loadStoreData();
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Store Found</h3>
            <p className="text-slate-600 mb-4">You don't have a shop yet. Please create a shop first.</p>
            <Button onClick={() => window.location.href = "/dashboard/seller"}>
              Go to Seller Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">AliazaStore</span>
                <p className="text-sm text-slate-600">Shop Documents</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/dashboard/seller"}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Government ID Upload */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Government ID</CardTitle>
                  <CardDescription>Upload your government-issued identification document</CardDescription>
                </div>
                {storeData.owner_govt_id_uploaded === 1 && (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {storeData.owner_govt_id_uploaded === 1 && storeData.owner_govt_id_file && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Government ID uploaded on {storeData.owner_govt_id_uploaded_at ? 
                          new Date(storeData.owner_govt_id_uploaded_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-1" />
                      View Document
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label>Government ID Number *</Label>
                <Input
                  value={formData.owner_govt_id}
                  onChange={(e) => setFormData({ ...formData, owner_govt_id: e.target.value })}
                  placeholder="Passport Number, UMID, TIN, etc."
                  disabled={storeData.owner_govt_id_uploaded === 1}
                />
              </div>

              <div>
                <Label>Upload Government ID Document *</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFormData({ ...formData, owner_govt_id_file: e.target.files?.[0] || null })}
                  disabled={storeData.owner_govt_id_uploaded === 1}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Accepted formats: PDF, JPG, PNG. Max size: 5MB
                </p>
              </div>

              {storeData.owner_govt_id_uploaded === 0 && (
                <Button 
                  onClick={handleGovtIdUpload}
                  disabled={!formData.owner_govt_id || !formData.owner_govt_id_file || uploading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Government ID"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Store Logo Upload */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Store Logo/Profile Picture</CardTitle>
                  <CardDescription>Upload your store logo or profile picture</CardDescription>
                </div>
                {storeData.store_logo_uploaded === 1 && (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {storeData.store_logo_uploaded === 1 && storeData.store_logo && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={storeData.store_logo} 
                        alt="Store Logo" 
                        className="w-16 h-16 object-contain rounded border"
                      />
                      <div>
                        <span className="text-sm font-medium text-green-800">
                          Store logo uploaded on {storeData.store_logo_uploaded_at ? 
                            new Date(storeData.store_logo_uploaded_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label>Upload Store Logo *</Label>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={(e) => setFormData({ ...formData, store_logo: e.target.files?.[0] || null })}
                  disabled={storeData.store_logo_uploaded === 1}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Accepted formats: JPG, PNG, SVG. Max size: 5MB. Recommended size: 500x500px
                </p>
              </div>

              {storeData.store_logo_uploaded === 0 && (
                <Button 
                  onClick={handleLogoUpload}
                  disabled={!formData.store_logo || uploading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Store Logo"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Document Security & Privacy</h4>
                  <p className="text-sm text-slate-600">
                    Your government ID and store documents are securely stored and only accessible by AliazaStore administrators 
                    for verification purposes. Your information is protected and will not be shared with third parties without your consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerDocumentUpload;