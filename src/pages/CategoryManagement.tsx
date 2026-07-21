import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Layers, Plus, Search, Store, 
  ChevronRight, ChevronDown, FolderOpen, Tag
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import db from "@/lib/shared/kliv-database.js";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [shopCategories, setShopCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShopType, setSelectedShopType] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShopCategoryModal, setShowShopCategoryModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    parent_id: null as number | null,
    level: 0,
    shop_type: "general",
    status: "active"
  });

  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, storesData, shopCategoriesData] = await Promise.all([
        db.query("categories", { 
          status: "eq.active",
          order: "shop_type.asc,level.asc,display_order.asc",
          limit: "500"
        }),
        db.query("stores", {
          status: "eq.active",
          limit: "100"
        }),
        db.query("shop_categories", {
          limit: "500"
        })
      ]);
      
      setCategories(categoriesData || []);
      setStores(storesData || []);
      setShopCategories(shopCategoriesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getShopTypeBadge = (shopType: string) => {
    const colors: any = {
      fashion: "bg-pink-100 text-pink-700",
      electronics: "bg-blue-100 text-blue-700",
      food: "bg-green-100 text-green-700",
      home: "bg-yellow-100 text-yellow-700",
      sports: "bg-orange-100 text-orange-700",
      kids: "bg-purple-100 text-purple-700",
      automotive: "bg-red-100 text-red-700",
      books: "bg-indigo-100 text-indigo-700",
      general: "bg-gray-100 text-gray-700"
    };
    return colors[shopType] || "bg-slate-100 text-slate-700";
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchQuery || 
      category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShopType = selectedShopType === "all" || category.shop_type === selectedShopType;
    return matchesSearch && matchesShopType;
  });

  const mainCategories = filteredCategories.filter(cat => cat.level === 0);
  const getSubcategories = (parentId: number) => {
    return filteredCategories.filter(cat => cat.parent_id === parentId);
  };

  const handleAddCategory = async () => {
    try {
      const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-');
      const categoryData = {
        name: newCategory.name,
        slug,
        description: newCategory.description,
        icon: newCategory.icon,
        parent_id: newCategory.parent_id,
        level: newCategory.parent_id ? 1 : 0,
        shop_type: newCategory.shop_type,
        status: newCategory.status
      };
      
      await db.insert("categories", categoryData);
      
      setNewCategory({
        name: "",
        slug: "",
        description: "",
        icon: "",
        parent_id: null,
        level: 0,
        shop_type: "general",
        status: "active"
      });
      setShowAddModal(false);
      loadData();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAssignCategoriesToShop = async () => {
    try {
      if (!selectedStore || selectedCategories.length === 0) return;

      // Remove existing shop categories
      await db.delete("shop_categories", { store_id: `eq.${selectedStore}` });

      // Add new shop categories
      for (const categoryId of selectedCategories) {
        await db.insert("shop_categories", {
          store_id: selectedStore,
          category_id: categoryId,
          is_primary: selectedCategories[0] === categoryId ? 1 : 0
        });
      }

      setShowShopCategoryModal(false);
      setSelectedStore(null);
      setSelectedCategories([]);
      loadData();
    } catch (error) {
      console.error("Error assigning categories:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading categories...</p>
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
            <div className="flex items-center space-x-4">
              <Link to="/dashboard/admin" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">AliazaStore</span>
                  <Badge className="ml-2 bg-purple-100 text-purple-700">Admin</Badge>
                </div>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold">Category Management</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setShowShopCategoryModal(true)}
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white border-0"
              >
                <Store className="w-4 h-4 mr-2" />
                Assign to Shops
              </Button>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
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
                  <p className="text-purple-100 mb-1">Total Categories</p>
                  <p className="text-3xl font-bold">{categories.length}</p>
                </div>
                <Layers className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Main Categories</p>
                  <p className="text-3xl font-bold">{mainCategories.length}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Subcategories</p>
                  <p className="text-3xl font-bold">{categories.length - mainCategories.length}</p>
                </div>
                <Tag className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 mb-1">Shop Types</p>
                  <p className="text-3xl font-bold">{new Set(categories.map(c => c.shop_type)).size}</p>
                </div>
                <Store className="w-8 h-8 text-pink-200" />
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
                  placeholder="Search categories..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="shop-type-filter">Shop Type:</Label>
                <Select value={selectedShopType} onValueChange={setSelectedShopType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="home">Home & Living</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="kids">Kids & Baby</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="books">Books & Stationery</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Display */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Categories & Subcategories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mainCategories.map(category => {
                const subcategories = getSubcategories(category._row_id);
                const isExpanded = expandedCategories.has(category._row_id);
                
                return (
                  <div key={category._row_id} className="border border-slate-200 rounded-lg overflow-hidden">
                    {/* Main Category */}
                    <div 
                      className="p-4 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between cursor-pointer hover:bg-slate-100"
                      onClick={() => subcategories.length > 0 && toggleCategory(category._row_id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{category.name}</h3>
                            <Badge className={getShopTypeBadge(category.shop_type)}>
                              {category.shop_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {subcategories.length > 0 && (
                          <Badge className="bg-blue-100 text-blue-700">
                            {subcategories.length} subcategories
                          </Badge>
                        )}
                        {subcategories.length > 0 && (
                          isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          )
                        )}
                      </div>
                    </div>
                    
                    {/* Subcategories */}
                    {isExpanded && subcategories.length > 0 && (
                      <div className="border-t border-slate-200 bg-slate-50">
                        {subcategories.map(subcat => (
                          <div 
                            key={subcat._row_id}
                            className="p-3 ml-8 flex items-center justify-between hover:bg-white border-b border-slate-100 last:border-0"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{subcat.icon}</span>
                              <div>
                                <h4 className="font-medium text-slate-800">{subcat.name}</h4>
                                <p className="text-xs text-slate-600">{subcat.description}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Level {subcat.level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {mainCategories.length === 0 && (
                <div className="text-center py-12">
                  <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No categories found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new category or subcategory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name *</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div>
              <Label>Slug (optional)</Label>
              <Input
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                placeholder="category-url-slug"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Category description"
              />
            </div>
            <div>
              <Label>Icon (Emoji)</Label>
              <Input
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                placeholder="🏠"
              />
            </div>
            <div>
              <Label>Parent Category (for subcategories)</Label>
              <Select 
                value={newCategory.parent_id?.toString() || "none"} 
                onValueChange={(value) => setNewCategory({ 
                  ...newCategory, 
                  parent_id: value === "none" ? null : parseInt(value),
                  level: value === "none" ? 0 : 1
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No parent (main category)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Main Category</SelectItem>
                  {mainCategories.map(cat => (
                    <SelectItem key={cat._row_id} value={cat._row_id.toString()}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Shop Type *</Label>
              <Select 
                value={newCategory.shop_type} 
                onValueChange={(value) => setNewCategory({ ...newCategory, shop_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="home">Home & Living</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="kids">Kids & Baby</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="books">Books & Stationery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCategory}
                className="bg-gradient-to-r from-green-500 to-green-600"
                disabled={!newCategory.name}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Categories to Shop Modal */}
      <Dialog open={showShopCategoryModal} onOpenChange={setShowShopCategoryModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Categories to Shop</DialogTitle>
            <DialogDescription>Configure which categories this shop can use</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Shop *</Label>
              <Select 
                value={selectedStore?.toString() || ""} 
                onValueChange={(value) => {
                  const storeId = parseInt(value);
                  setSelectedStore(storeId);
                  // Load existing shop categories
                  const existingCategories = shopCategories
                    .filter(sc => sc.store_id === storeId)
                    .map(sc => sc.category_id);
                  setSelectedCategories(existingCategories);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shop" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map(store => (
                    <SelectItem key={store._row_id} value={store._row_id.toString()}>
                      {store.icon} {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStore && (
              <div>
                <Label>Select Categories for this Shop</Label>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-2">
                  {mainCategories.map(category => {
                    const subcategories = getSubcategories(category._row_id);
                    const isSelected = selectedCategories.includes(category._row_id);
                    
                    return (
                      <div key={category._row_id} className="border-b border-slate-100 pb-2 last:border-0">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, category._row_id]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(id => id !== category._row_id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                          <Badge className={getShopTypeBadge(category.shop_type)} text-xs>
                            {category.shop_type}
                          </Badge>
                        </div>
                        {subcategories.length > 0 && isSelected && (
                          <div className="ml-6 mt-2 space-y-1">
                            {subcategories.map(subcat => (
                              <div key={subcat._row_id} className="flex items-center space-x-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(subcat._row_id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCategories([...selectedCategories, subcat._row_id]);
                                    } else {
                                      setSelectedCategories(selectedCategories.filter(id => id !== subcat._row_id));
                                    }
                                  }}
                                  className="w-4 h-4"
                                />
                                <span>{subcat.icon}</span>
                                <span>{subcat.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  {selectedCategories.length} categories selected
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowShopCategoryModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssignCategoriesToShop}
                className="bg-gradient-to-r from-green-500 to-green-600"
                disabled={!selectedStore || selectedCategories.length === 0}
              >
                <Store className="w-4 h-4 mr-2" />
                Assign Categories
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;