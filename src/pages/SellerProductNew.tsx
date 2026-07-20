import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, Plus, Save, X, ChevronLeft, Upload,
  DollarSign, Box, BarChart3, CheckCircle, 
  Percent, Calendar, Tag, Image as ImageIcon, Trash2, Lock, AlertCircle
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { checkSubscriptionStatus } from "@/lib/subscription-check";
import db from "@/lib/shared/kliv-database.js";
import auth from "@/lib/shared/kliv-auth.js";

const SellerProductNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Image upload states
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState("");
  const [secondaryImageFile, setSecondaryImageFile] = useState<File | null>(null);
  const [secondaryImagePreview, setSecondaryImagePreview] = useState("");

  // Product form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    price: "",
    compare_price: "",
    stock_quantity: "",
    category_id: "",
    subcategory_id: "",
    primary_image: "",
    secondary_image: "",
    weight: "",
    dimensions: "",
    sku: "",
    barcode: "",
    brand: "",
    manufacturer: "",
    country_of_origin: "Philippines",
    warranty: "",
    status: "active",
    // Sale & Offer fields
    on_sale: false,
    sale_price: "",
    discount_percentage: "",
    sale_start_date: "",
    sale_end_date: "",
    offer_badge: "",
    offer_description: ""
  });

  // Offer badge options
  const offerBadges = [
    "Limited Time Offer",
    "Best Seller",
    "New Arrival", 
    "Clearance",
    "Bundle Deal",
    "Free Shipping",
    "Premium Quality",
    "Eco Friendly",
    "Top Rated",
    "Exclusive"
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await auth.getUser();
      if (!currentUser) return;

      // Load seller's store
      const stores = await db.query("stores", {
        owner_uuid: `eq.${currentUser.userUuid}`
      });
      
      if (stores.length > 0) {
        const storeData = stores[0];
        setStore(storeData);
        
        // Check subscription status
        const subscriptionStatus = checkSubscriptionStatus(storeData);
        
        if (!subscriptionStatus.canAddProducts) {
          // Redirect to subscription page with alert
          alert(subscriptionStatus.message + "\n\nPlease subscribe to continue adding products.");
          navigate("/dashboard/seller/subscription");
          return;
        }
      } else {
        alert("No store found. Please create a store first.");
        navigate("/dashboard/seller");
        return;
      }

      // Load categories
      const categoryData = await db.query("categories", { status: "eq.active" });
      setCategories(categoryData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const checkSubscriptionStatus = (storeData: any) => {
    const now = new Date();
    const trialEnd = storeData.trial_end_date ? new Date(storeData.trial_end_date) : null;
    const subscriptionEnd = storeData.subscription_end_date ? new Date(storeData.subscription_end_date) : null;

    // Check if store is suspended or cancelled
    if (storeData.subscription_status === "suspended" || storeData.subscription_status === "cancelled") {
      return {
        canAddProducts: false,
        message: "Your subscription has been suspended. Subscribe to continue adding products."
      };
    }

    // Check trial status
    if (trialEnd && trialEnd > now) {
      return { canAddProducts: true };
    }

    // Check if trial ended
    if (trialEnd && trialEnd <= now && !subscriptionEnd) {
      return {
        canAddProducts: false,
        message: "Your trial has ended. Subscribe to continue adding products."
      };
    }

    // Check subscription status
    if (subscriptionEnd && subscriptionEnd > now) {
      return { canAddProducts: true };
    }

    // Check if subscription expired
    if (subscriptionEnd && subscriptionEnd <= now) {
      return {
        canAddProducts: false,
        message: "Your subscription has expired. Subscribe to continue adding products."
      };
    }

    return { canAddProducts: true };
  };

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleImageUpload = async (file: File, type: 'primary' | 'secondary') => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        if (type === 'primary') {
          setPrimaryImagePreview(preview);
        } else {
          setSecondaryImagePreview(preview);
        }
      };
      reader.readAsDataURL(file);

      // Here you would normally upload to your server/cloud storage
      // For now, we'll store the file reference
      if (type === 'primary') {
        setPrimaryImageFile(file);
        setFormData(prev => ({ ...prev, primary_image: `uploaded_${file.name}` }));
      } else {
        setSecondaryImageFile(file);
        setFormData(prev => ({ ...prev, secondary_image: `uploaded_${file.name}` }));
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      setPrimaryImageFile(null);
      setPrimaryImagePreview("");
      setFormData(prev => ({ ...prev, primary_image: "" }));
    } else {
      setSecondaryImageFile(null);
      setSecondaryImagePreview("");
      setFormData(prev => ({ ...prev, secondary_image: "" }));
    }
  };

  const calculateDiscount = () => {
    if (!formData.price || !formData.compare_price) return 0;
    const price = parseFloat(formData.price);
    const comparePrice = parseFloat(formData.compare_price);
    if (price >= comparePrice || comparePrice === 0) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const handleSaleToggle = () => {
    const newSaleState = !formData.on_sale;
    setFormData(prev => ({ 
      ...prev, 
      on_sale: newSaleState,
      sale_price: newSaleState ? formData.price : "",
      discount_percentage: newSaleState ? calculateDiscount().toString() : ""
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      price: newPrice,
      sale_price: prev.on_sale ? newPrice : prev.sale_price,
      discount_percentage: prev.on_sale && prev.compare_price 
        ? calculateDiscount().toString() 
        : prev.discount_percentage
    }));
  };

  const handleComparePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newComparePrice = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      compare_price: newComparePrice,
      discount_percentage: prev.on_sale && newComparePrice && prev.price 
        ? calculateDiscount().toString() 
        : prev.discount_percentage
    }));
  };

  const handleSaveProduct = async () => {
    if (!store) {
      alert("No store found");
      return;
    }

    // Check subscription status before saving
    const subscriptionStatus = checkSubscriptionStatus(store);
    if (!subscriptionStatus.canAddProducts) {
      alert(subscriptionStatus.message);
      navigate("/dashboard/seller/subscription");
      return;
    }

    // Validation
    if (!formData.name || !formData.price || !formData.category_id) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.primary_image && !primaryImageFile) {
      alert("Please upload a primary product image");
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const primaryImageUrl = primaryImagePreview || "https://via.placeholder.com/400?text=Product+Image";
      const secondaryImageUrl = secondaryImagePreview || null;

      const productData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.short_description,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        store_id: store._row_id,
        primary_image: primaryImageUrl,
        secondary_image: secondaryImageUrl,
        weight: formData.weight || null,
        dimensions: formData.dimensions || null,
        sku: formData.sku || null,
        barcode: formData.barcode || null,
        brand: formData.brand || null,
        manufacturer: formData.manufacturer || null,
        country_of_origin: formData.country_of_origin,
        warranty: formData.warranty || null,
        status: formData.status,
        featured: false,
        rating_average: 0,
        review_count: 0,
        sales_count: 0,
        views_count: 0,
        // Sale & Offer fields
        on_sale: formData.on_sale,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        sale_start_date: formData.sale_start_date || null,
        sale_end_date: formData.sale_end_date || null,
        offer_badge: formData.offer_badge || null,
        offer_description: formData.offer_description || null
      };

      await db.insert("products", productData);
      
      setSuccessMessage("✅ Product created successfully with images and offers!");
      
      // Redirect to products list after 2 seconds
      setTimeout(() => {
        navigate("/dashboard/seller/products");
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat._row_id === parseInt(formData.category_id));
    return category?.name || "";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard/seller/products" className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Add New Product</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Subscription Status Check */}
        {store && !checkSubscriptionStatus(store).canAddProducts && (
          <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Subscription Required</h3>
                    <p className="text-white/90">
                      {checkSubscriptionStatus(store).message}
                    </p>
                  </div>
                </div>
                <Link to="/dashboard/seller/subscription">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-white/90">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {successMessage && (
          <Card className="mb-6 border-0 shadow-lg bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{successMessage}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create New Product with Enhanced Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Box className="w-5 h-5 text-orange-600" />
                <span>Basic Information</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    placeholder="Brief product description (150 characters)"
                    maxLength={150}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed product description"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border bg-white"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._row_id} value={category._row_id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      Select the main category for your product
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span>Product Photos (Upload Images, Not URLs)</span>
              </h3>
              <div className="space-y-4">
                {/* Primary Image Upload */}
                <div>
                  <Label htmlFor="primary_image_upload">Primary Image * *</Label>
                  <div className="mt-2">
                    {primaryImagePreview ? (
                      <div className="relative">
                        <img 
                          src={primaryImagePreview} 
                          alt="Primary product" 
                          className="w-full h-64 object-cover rounded-lg border-2 border-blue-500"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage('primary')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                          Primary Image
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <p className="text-sm text-slate-600 mb-4">
                          Drag & drop your primary product image here, or click to browse
                        </p>
                        <input
                          id="primary_image_upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files?.[0]!, 'primary')}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('primary_image_upload')?.click()}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? "Uploading..." : "Choose Primary Image"}
                        </Button>
                        <p className="text-xs text-slate-500 mt-2">
                          Accepts: JPG, PNG, GIF, WebP (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Secondary Image Upload */}
                <div>
                  <Label htmlFor="secondary_image_upload">Secondary Image</Label>
                  <div className="mt-2">
                    {secondaryImagePreview ? (
                      <div className="relative">
                        <img 
                          src={secondaryImagePreview} 
                          alt="Secondary product" 
                          className="w-full h-48 object-cover rounded-lg border-2 border-green-500"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage('secondary')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                          Secondary Image
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                        <Upload className="w-8 h-8 text-green-500 mx-auto mb-3" />
                        <p className="text-sm text-slate-600 mb-3">
                          Add secondary view or angle
                        </p>
                        <input
                          id="secondary_image_upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files?.[0]!, 'secondary')}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('secondary_image_upload')?.click()}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? "Uploading..." : "Add Secondary Image"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing and Inventory */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Pricing & Inventory</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Regular Price (₱) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handlePriceChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="compare_price">Compare at Price (₱)</Label>
                  <Input
                    id="compare_price"
                    name="compare_price"
                    type="number"
                    value={formData.compare_price}
                    onChange={handleComparePriceChange}
                    placeholder="Original price for discount display"
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Shows as strikethrough price. Current discount: {calculateDiscount()}%
                  </p>
                </div>

                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU (optional)</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Stock Keeping Unit"
                  />
                </div>
              </div>
            </div>

            {/* Sale & Offer Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border-2 border-orange-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Tag className="w-5 h-5 text-orange-600" />
                <span>Sale & Offer Settings</span>
              </h3>
              
              <div className="space-y-4">
                {/* Enable Sale Toggle */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Enable Sale</h4>
                    <p className="text-sm text-slate-600">Put this product on sale with special pricing</p>
                  </div>
                  <Button
                    type="button"
                    variant={formData.on_sale ? "default" : "outline"}
                    onClick={handleSaleToggle}
                    className={formData.on_sale ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {formData.on_sale ? "✓ Sale Active" : "Enable Sale"}
                  </Button>
                </div>

                {formData.on_sale && (
                  <>
                    {/* Sale Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sale_price">Sale Price (₱)</Label>
                        <Input
                          id="sale_price"
                          name="sale_price"
                          type="number"
                          value={formData.sale_price}
                          onChange={handleInputChange}
                          placeholder="Special sale price"
                          step="0.01"
                          min="0"
                          className="border-green-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="discount_percentage"
                            name="discount_percentage"
                            type="number"
                            value={formData.discount_percentage}
                            onChange={handleInputChange}
                            placeholder="Auto-calculated"
                            step="1"
                            min="0"
                            max="100"
                            className="border-green-500"
                          />
                          <Percent className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    </div>

                    {/* Sale Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sale_start_date">Sale Start Date</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="sale_start_date"
                            name="sale_start_date"
                            type="date"
                            value={formData.sale_start_date}
                            onChange={handleInputChange}
                            className="border-green-500"
                          />
                          <Calendar className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="sale_end_date">Sale End Date</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="sale_end_date"
                            name="sale_end_date"
                            type="date"
                            value={formData.sale_end_date}
                            onChange={handleInputChange}
                            className="border-green-500"
                          />
                          <Calendar className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Offer Badge */}
                <div>
                  <Label htmlFor="offer_badge">Offer Badge</Label>
                  <select
                    id="offer_badge"
                    name="offer_badge"
                    value={formData.offer_badge}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border bg-white"
                  >
                    <option value="">Select offer badge (optional)</option>
                    {offerBadges.map((badge) => (
                      <option key={badge} value={badge}>
                        {badge}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Highlight your product with attractive badges
                  </p>
                </div>

                {/* Offer Description */}
                <div>
                  <Label htmlFor="offer_description">Offer Details</Label>
                  <Textarea
                    id="offer_description"
                    name="offer_description"
                    value={formData.offer_description}
                    onChange={handleInputChange}
                    placeholder="Describe your offer (e.g., 'Buy 2 Get 1 Free', 'Free shipping on orders over ₱500')"
                    rows={2}
                    className="border-orange-300"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span>Additional Details</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Product brand"
                  />
                </div>

                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="Manufacturer name"
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="dimensions">Dimensions (LxWxH cm)</Label>
                  <Input
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="10x5x3"
                  />
                </div>

                <div>
                  <Label htmlFor="country_of_origin">Country of Origin</Label>
                  <Input
                    id="country_of_origin"
                    name="country_of_origin"
                    value={formData.country_of_origin}
                    onChange={handleInputChange}
                    placeholder="Philippines"
                  />
                </div>

                <div>
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input
                    id="warranty"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="1 year warranty"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Link to="/dashboard/seller/products">
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                onClick={handleSaveProduct}
                disabled={loading}
                size="lg"
              >
                {loading ? "Creating Product..." : "Create Product with Images & Offers"}
                <Save className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerProductNew;