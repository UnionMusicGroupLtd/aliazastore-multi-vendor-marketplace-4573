import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, Download, Search, Upload, ImageIcon, 
  CheckCircle, Clock, AlertCircle, Store
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { content } from "@/lib/shared/kliv-content.js";
import db from "@/lib/shared/kliv-database.js";

const ShopOwnerDocuments = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [uploadType, setUploadType] = useState<"govt_id" | "logo">("govt_id");
  const [uploading, setUploading] = useState(false);
  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    store: any;
    type: "govt_id" | "logo";
  }>({ open: false, store: null, type: "govt_id" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const storesData = await db.query("stores", {
        order: "_created_at.desc",
        limit: "500"
      });
      
      setStores(storesData || []);
    } catch (error) {
      console.error("Error loading stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchQuery || 
      store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.owner_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.owner_full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const hasGovtId = store.owner_govt_id_uploaded === 1;
    const hasLogo = store.store_logo_uploaded === 1;
    
    const matchesDocType = docTypeFilter === "all" ||
      (docTypeFilter === "govt_id" && hasGovtId) ||
      (docTypeFilter === "logo" && hasLogo) ||
      (docTypeFilter === "none" && !hasGovtId && !hasLogo);
    
    return matchesSearch && matchesDocType;
  });

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      
      const folder = uploadType === "govt_id" ? "/content/shop-documents/govt-ids/" : "/content/shop-documents/logos/";
      const result = await content.uploadFile(file, folder);
      
      const timestamp = Date.now();
      const updateData = uploadType === "govt_id" ? {
        owner_govt_id_file: result.path,
        owner_govt_id_uploaded: 1,
        owner_govt_id_uploaded_at: timestamp
      } : {
        store_logo: result.path,
        store_logo_uploaded: 1,
        store_logo_uploaded_at: timestamp
      };
      
      await db.update("stores", { _row_id: `eq.${selectedStore._row_id}` }, updateData);
      
      setShowUploadModal(false);
      setSelectedStore(null);
      loadData();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const getDocumentStatusBadge = (store: any) => {
    const hasGovtId = store.owner_govt_id_uploaded === 1;
    const hasLogo = store.store_logo_uploaded === 1;
    
    if (hasGovtId && hasLogo) {
      return <Badge className="bg-green-100 text-green-700">Complete</Badge>;
    } else if (hasGovtId || hasLogo) {
      return <Badge className="bg-yellow-100 text-yellow-700">Partial</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700">Missing</Badge>;
    }
  };

  const getStats = () => {
    const totalStores = stores.length;
    const completeDocs = stores.filter(s => s.owner_govt_id_uploaded === 1 && s.store_logo_uploaded === 1).length;
    const partialDocs = stores.filter(s => 
      (s.owner_govt_id_uploaded === 1 && s.store_logo_uploaded === 0) ||
      (s.owner_govt_id_uploaded === 0 && s.store_logo_uploaded === 1)
    ).length;
    const missingDocs = stores.filter(s => s.owner_govt_id_uploaded === 0 && s.store_logo_uploaded === 0).length;
    
    return { totalStores, completeDocs, partialDocs, missingDocs };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading shop documents...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard/admin" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">AliazaStore</span>
                  <Badge className="ml-2 bg-purple-100 text-purple-700">Admin</Badge>
                </div>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold">Shop Owner Documents</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Total Shops</p>
                  <p className="text-3xl font-bold">{stats.totalStores}</p>
                </div>
                <Store className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Complete Docs</p>
                  <p className="text-3xl font-bold">{stats.completeDocs}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 mb-1">Partial Docs</p>
                  <p className="text-3xl font-bold">{stats.partialDocs}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 mb-1">Missing Docs</p>
                  <p className="text-3xl font-bold">{stats.missingDocs}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search shops..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="doc-filter">Document Status:</Label>
                <Select value={docTypeFilter} onValueChange={setDocTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="govt_id">Has Govt ID</SelectItem>
                    <SelectItem value="logo">Has Logo</SelectItem>
                    <SelectItem value="none">Missing Docs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Shop Owner Documents</CardTitle>
            <CardDescription>Manage government IDs and store logos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStores.map((store) => {
                const hasGovtId = store.owner_govt_id_uploaded === 1;
                const hasLogo = store.store_logo_uploaded === 1;
                
                return (
                  <div key={store._row_id} className="p-6 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                          {store.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{store.name}</h3>
                            {getDocumentStatusBadge(store)}
                          </div>
                          <p className="text-sm text-slate-600">{store.owner_email}</p>
                          {store.owner_full_name && (
                            <p className="text-sm text-slate-600">{store.owner_full_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedStore(store);
                            setUploadType("govt_id");
                            setShowUploadModal(true);
                          }}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Upload ID
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStore(store);
                            setUploadType("logo");
                            setShowUploadModal(true);
                          }}
                        >
                          <ImageIcon className="w-4 h-4 mr-1" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {/* Government ID Section */}
                      <div className={`p-4 rounded-lg ${hasGovtId ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-5 h-5" />
                          <h4 className="font-medium">Government ID</h4>
                        </div>
                        
                        {hasGovtId ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">
                                Uploaded: {store.owner_govt_id_uploaded_at ? 
                                  new Date(store.owner_govt_id_uploaded_at).toLocaleDateString() : 'N/A'}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPreviewModal({ open: true, store, type: "govt_id" })}
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleDownloadFile(store.owner_govt_id_file, `${store.name}_govt_id`)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            {store.owner_govt_id && (
                              <p className="text-xs text-slate-500">ID: {store.owner_govt_id}</p>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">No government ID uploaded</p>
                          </div>
                        )}
                      </div>

                      {/* Store Logo Section */}
                      <div className={`p-4 rounded-lg ${hasLogo ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <ImageIcon className="w-5 h-5" />
                          <h4 className="font-medium">Store Logo</h4>
                        </div>
                        
                        {hasLogo ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">
                                Uploaded: {store.store_logo_uploaded_at ? 
                                  new Date(store.store_logo_uploaded_at).toLocaleDateString() : 'N/A'}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPreviewModal({ open: true, store, type: "logo" })}
                                >
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleDownloadFile(store.store_logo, `${store.name}_logo`)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">No store logo uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredStores.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No shops found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {uploadType === "govt_id" ? "Upload Government ID" : "Upload Store Logo"}
            </DialogTitle>
            <DialogDescription>
              {uploadType === "govt_id" 
                ? `Upload government ID for ${selectedStore?.name}`
                : `Upload store logo for ${selectedStore?.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>
                {uploadType === "govt_id" ? "Government ID File" : "Logo Image"} *
              </Label>
              <Input
                type="file"
                accept={uploadType === "govt_id" ? ".pdf,.jpg,.jpeg,.png" : ".jpg,.jpeg,.png,.svg"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                disabled={uploading}
              />
              <p className="text-xs text-slate-500 mt-1">
                {uploadType === "govt_id" 
                  ? "Accepted formats: PDF, JPG, PNG. Max size: 5MB"
                  : "Accepted formats: JPG, PNG, SVG. Max size: 5MB"}
              </p>
            </div>
            
            {uploading && (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">Uploading...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewModal.open} onOpenChange={(open) => setPreviewModal({ ...previewModal, open })}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {previewModal.type === "govt_id" ? "Government ID" : "Store Logo"} - {previewModal.store?.name}
            </DialogTitle>
            <DialogDescription>
              {previewModal.type === "govt_id" ? "Government ID document" : "Store logo/image"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center items-center min-h-96">
            {previewModal.store && (
              <img
                src={previewModal.type === "govt_id" 
                  ? previewModal.store.owner_govt_id_file 
                  : previewModal.store.store_logo}
                alt={previewModal.type === "govt_id" ? "Government ID" : "Store Logo"}
                className="max-w-full max-h-96 object-contain"
              />
            )}
          </div>
          
          <div className="flex justify-between pt-4">
            <p className="text-sm text-slate-500">
              {previewModal.type === "govt_id" && previewModal.store?.owner_govt_id && 
                `ID Number: ${previewModal.store.owner_govt_id}`}
            </p>
            {previewModal.store && (
              <Button
                onClick={() => handleDownloadFile(
                  previewModal.type === "govt_id" 
                    ? previewModal.store.owner_govt_id_file 
                    : previewModal.store.store_logo,
                  `${previewModal.store.name}_${previewModal.type}`
                )}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopOwnerDocuments;