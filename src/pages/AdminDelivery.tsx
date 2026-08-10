import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Truck, Package, Clock, DollarSign, Plus, Edit, 
  ArrowLeft, CheckCircle, XCircle, Settings, X
} from "lucide-react";

const AdminDelivery = () => {
  const navigate = useNavigate();

  // Delivery options data
  const [deliveryOptions, setDeliveryOptions] = useState([
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Standard shipping within 3-5 business days",
      enabled: true,
      price: "4.99",
      freeThreshold: "50",
      estimatedDays: "3-5",
      icon: Truck,
      color: "from-blue-600 to-blue-800"
    },
    {
      id: "express",
      name: "Express Delivery", 
      description: "Fast delivery within 1-2 business days",
      enabled: true,
      price: "9.99",
      freeThreshold: "100",
      estimatedDays: "1-2",
      icon: Package,
      color: "from-purple-600 to-purple-800"
    },
    {
      id: "nextday",
      name: "Next Day Delivery",
      description: "Order before 2 PM for next day delivery",
      enabled: false,
      price: "14.99",
      freeThreshold: "150",
      estimatedDays: "1",
      icon: Clock,
      color: "from-amber-600 to-amber-800"
    }
  ]);

  // Modal states
  const [editingOption, setEditingOption] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOption, setNewOption] = useState({
    name: "",
    description: "",
    price: "",
    freeThreshold: "",
    estimatedDays: ""
  });

  const toggleDelivery = (id: string) => {
    setDeliveryOptions(prev => prev.map(option =>
      option.id === id ? { ...option, enabled: !option.enabled } : option
    ));
  };

  const handleEdit = (option: any) => {
    setEditingOption({ ...option });
  };

  const handleSaveEdit = () => {
    setDeliveryOptions(prev => prev.map(option =>
      option.id === editingOption.id ? editingOption : option
    ));
    setEditingOption(null);
  };

  const handleAddNew = () => {
    const newId = `custom-${Date.now()}`;
    const option = {
      id: newId,
      name: newOption.name,
      description: newOption.description || "Custom delivery option",
      enabled: true,
      price: newOption.price,
      freeThreshold: newOption.freeThreshold || "100",
      estimatedDays: newOption.estimatedDays || "3-5",
      icon: Package,
      color: "from-green-600 to-green-800"
    };
    setDeliveryOptions(prev => [...prev, option]);
    setIsAddingNew(false);
    setNewOption({ name: "", description: "", price: "", freeThreshold: "", estimatedDays: "" });
  };

  const handleDelete = (id: string) => {
    setDeliveryOptions(prev => prev.filter(option => option.id !== id));
    if (editingOption?.id === id) {
      setEditingOption(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <nav className="bg-black/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
              </Link>
              <div className="flex items-center space-x-2">
                <Truck className="w-6 h-6 text-red-500" />
                <h1 className="text-xl font-bold text-white">Delivery Options Management</h1>
              </div>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Active Options</p>
                  <p className="text-3xl font-bold text-white">{deliveryOptions.filter(d => d.enabled).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-800/20 to-gray-700/10 border border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Inactive</p>
                  <p className="text-3xl font-bold text-white">{deliveryOptions.filter(d => !d.enabled).length}</p>
                </div>
                <XCircle className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Avg. Price</p>
                  <p className="text-3xl font-bold text-white">£6.66</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Free From</p>
                  <p className="text-3xl font-bold text-white">£50+</p>
                </div>
                <Truck className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Options */}
        <div className="space-y-6">
          {deliveryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.id}
                className={`border-0 bg-gray-900/50 backdrop-blur-sm ${option.enabled ? 'border-green-800/50' : 'border-gray-800/50'} border`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{option.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={option.enabled}
                        onChange={() => toggleDelivery(option.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Delivery Price</p>
                      <p className="text-white font-semibold text-lg">£{option.price}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Free Delivery From</p>
                      <p className="text-white font-semibold text-lg">£{option.freeThreshold}+</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Estimated Time</p>
                      <p className="text-white font-semibold text-lg">{option.estimatedDays} days</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => handleEdit(option)}
                    >
                      <Edit className="mr-2 w-4 h-4" />
                      Edit Options
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => handleEdit(option)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Delivery Option */}
          <Card className="border-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <Button 
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                  onClick={() => setIsAddingNew(true)}
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Add Delivery Option
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Delivery Option Modal */}
        {editingOption && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border border-gray-700 max-w-md w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Edit Delivery Option</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingOption(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Option Name</label>
                  <input
                    type="text"
                    value={editingOption.name}
                    onChange={(e) => setEditingOption({...editingOption, name: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Description</label>
                  <input
                    type="text"
                    value={editingOption.description}
                    onChange={(e) => setEditingOption({...editingOption, description: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Price (£)</label>
                    <input
                      type="text"
                      value={editingOption.price}
                      onChange={(e) => setEditingOption({...editingOption, price: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Free From (£)</label>
                    <input
                      type="text"
                      value={editingOption.freeThreshold}
                      onChange={(e) => setEditingOption({...editingOption, freeThreshold: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Estimated Days</label>
                  <input
                    type="text"
                    value={editingOption.estimatedDays}
                    onChange={(e) => setEditingOption({...editingOption, estimatedDays: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setEditingOption(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                    onClick={handleSaveEdit}
                  >
                    Save Changes
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleDelete(editingOption.id)}
                  >
                    Delete Delivery Option
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add New Delivery Option Modal */}
        {isAddingNew && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border border-gray-700 max-w-md w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Add New Delivery Option</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsAddingNew(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Create a new custom delivery option for your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Option Name *</label>
                  <input
                    type="text"
                    value={newOption.name}
                    onChange={(e) => setNewOption({...newOption, name: e.target.value})}
                    placeholder="e.g., Weekend Delivery"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Description</label>
                  <input
                    type="text"
                    value={newOption.description}
                    onChange={(e) => setNewOption({...newOption, description: e.target.value})}
                    placeholder="Brief description of the delivery option"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Price (£) *</label>
                    <input
                      type="text"
                      value={newOption.price}
                      onChange={(e) => setNewOption({...newOption, price: e.target.value})}
                      placeholder="4.99"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Free From (£)</label>
                    <input
                      type="text"
                      value={newOption.freeThreshold}
                      onChange={(e) => setNewOption({...newOption, freeThreshold: e.target.value})}
                      placeholder="50"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Estimated Days *</label>
                  <input
                    type="text"
                    value={newOption.estimatedDays}
                    onChange={(e) => setNewOption({...newOption, estimatedDays: e.target.value})}
                    placeholder="3-5"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setIsAddingNew(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                    onClick={handleAddNew}
                    disabled={!newOption.name || !newOption.price || !newOption.estimatedDays}
                  >
                    Add Option
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDelivery;