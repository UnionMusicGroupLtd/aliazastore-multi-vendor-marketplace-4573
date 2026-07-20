import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Store, User, Mail, Phone, MapPin, Facebook, 
  Upload, Camera, Save, Edit, CheckCircle, 
  Building, Globe, Star, Award, Calendar
} from "lucide-react";
import db from "@/lib/shared/kliv-database.js";
import auth from "@/lib/shared/kliv-auth.js";
import { content } from "@/lib/shared/kliv-content.js";

const SellerProfile = () => {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    owner_full_name: "",
    owner_mobile: "",
    owner_address: "",
    owner_facebook_id: "",
    store_bio: "",
    store_profile_photo: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await auth.getUser();
      if (!currentUser) return;

      const stores = await db.query("stores", {
        owner_uuid: `eq.${currentUser.userUuid}`
      });
      
      if (stores.length > 0) {
        const storeData = stores[0];
        setStore(storeData);
        setProfileData({
          owner_full_name: storeData.owner_full_name || "",
          owner_mobile: storeData.owner_mobile || "",
          owner_address: storeData.owner_address || "",
          owner_facebook_id: storeData.owner_facebook_id || "",
          store_bio: storeData.store_bio || "",
          store_profile_photo: storeData.store_profile_photo || ""
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      const result = await content.uploadFile(file, '/content/store-profiles/');
      setProfileData(prev => ({ ...prev, store_profile_photo: result.path }));
      setMessage("Profile photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    if (!store) return;
    
    setSaving(true);
    setMessage("");
    
    try {
      await db.update("stores", { _row_id: `eq.${store._row_id}` }, {
        owner_full_name: profileData.owner_full_name,
        owner_mobile: profileData.owner_mobile,
        owner_address: profileData.owner_address,
        owner_facebook_id: profileData.owner_facebook_id,
        store_bio: profileData.store_bio,
        store_profile_photo: profileData.store_profile_photo
      });
      
      setStore({
        ...store,
        owner_full_name: profileData.owner_full_name,
        owner_mobile: profileData.owner_mobile,
        owner_address: profileData.owner_address,
        owner_facebook_id: profileData.owner_facebook_id,
        store_bio: profileData.store_bio,
        store_profile_photo: profileData.store_profile_photo
      });
      
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard/seller" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Store Profile</span>
            </Link>
            <Button 
              variant={editing ? "default" : "outline"}
              onClick={() => setEditing(!editing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Store Owner Profile</h1>
          <p className="text-slate-600">Manage your personal information and store details</p>
        </div>

        {message && (
          <Card className={`mb-6 border-0 shadow-lg ${message.includes("success") ? "bg-green-50" : "bg-red-50"}`}>
            <CardContent className="p-4">
              <div className={`flex items-center space-x-2 ${message.includes("success") ? "text-green-700" : "text-red-700"}`}>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{message}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Profile Photo Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold">
                      {profileData.store_profile_photo ? (
                        <img 
                          src={profileData.store_profile_photo} 
                          alt="Store Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Store className="w-16 h-16" />
                      )}
                    </div>
                    {editing && (
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    {store?.name || "Your Store Name"}
                  </h3>
                  <p className="text-sm text-slate-600">{store?.email || "store@example.com"}</p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Seller
                    </Badge>
                  </div>
                </div>

                {/* Store Stats */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Member Since</span>
                    <span className="font-medium">
                      {store?._created_at ? new Date(store._created_at * 1000).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Store Status</span>
                    <Badge className={
                      store?.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }>
                      {store?.status || 'Trial'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/dashboard/seller/documents" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Button>
                </Link>
                <Link to="/dashboard/seller/settings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="w-4 h-4 mr-2" />
                    Store Settings
                  </Button>
                </Link>
                <Link to="/dashboard/seller/products" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Store className="w-4 h-4 mr-2" />
                    Manage Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Bio */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="w-5 h-5 text-orange-600" />
                  <span>Store Bio</span>
                </CardTitle>
                <CardDescription>Tell customers about your store story and mission</CardDescription>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Textarea
                    value={profileData.store_bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, store_bio: e.target.value }))}
                    placeholder="Share your store's story, values, and what makes your business special..."
                    rows={4}
                  />
                ) : (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-slate-700">
                      {profileData.store_bio || "No store bio added yet. Tell customers about your store!"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Owner Information</span>
                </CardTitle>
                <CardDescription>Your personal contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  {editing ? (
                    <Input
                      value={profileData.owner_full_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, owner_full_name: e.target.value }))}
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {profileData.owner_full_name || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mobile Number</Label>
                    {editing ? (
                      <Input
                        value={profileData.owner_mobile}
                        onChange={(e) => setProfileData(prev => ({ ...prev, owner_mobile: e.target.value }))}
                        placeholder="+63 912 345 6789"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-600" />
                        <p className="text-slate-900 font-medium">
                          {profileData.owner_mobile || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Facebook Profile</Label>
                    {editing ? (
                      <Input
                        value={profileData.owner_facebook_id}
                        onChange={(e) => setProfileData(prev => ({ ...prev, owner_facebook_id: e.target.value }))}
                        placeholder="facebook.com/yourprofile"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Facebook className="w-4 h-4 text-slate-600" />
                        <p className="text-slate-900 font-medium">
                          {profileData.owner_facebook_id || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Complete Address</Label>
                  {editing ? (
                    <Textarea
                      value={profileData.owner_address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, owner_address: e.target.value }))}
                      placeholder="Your complete address"
                      rows={2}
                    />
                  ) : (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-slate-600 mt-1" />
                      <p className="text-slate-900 font-medium">
                        {profileData.owner_address || "Not provided"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Store Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  <span>Store Information</span>
                </CardTitle>
                <CardDescription>Basic store details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Store Name</Label>
                    <p className="text-slate-900 font-medium">{store?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Store Email</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <p className="text-slate-900 font-medium">{store?.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Store Description</Label>
                  <p className="text-slate-700">{store?.description || "No description provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Store QR Code</Label>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-slate-600" />
                      <p className="text-slate-900 font-mono text-sm">
                        {store?.store_qr_code ? store.store_qr_code.substring(0, 30) + "..." : "Not generated"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <p className="text-slate-900 font-medium">
                        {store?._created_at ? new Date(store._created_at * 1000).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {editing && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditing(false);
                        loadProfile(); // Reset to original data
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                      <Save className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
