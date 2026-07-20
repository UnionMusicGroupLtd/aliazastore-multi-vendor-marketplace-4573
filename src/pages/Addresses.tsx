import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SimpleModal } from "@/components/ui/simple-modal";
import { ShoppingBag, ArrowLeft, MapPin, Plus, Trash2, Edit, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    label: "",
    name: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    phone: "",
    is_default: false
  });

  // Load addresses from localStorage or use defaults
  useEffect(() => {
    const savedAddresses = localStorage.getItem('user_addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      // Use default addresses if none saved
      setAddresses([
        {
          _row_id: 1,
          label: "Home",
          name: "John Doe",
          address: "123 Main Street, Apt 4B",
          city: "Manila",
          province: "Metro Manila",
          postal_code: "1000",
          phone: "+63 912 345 6789",
          is_default: true
        },
        {
          _row_id: 2,
          label: "Office",
          name: "John Doe",
          address: "456 Business Avenue, Floor 12",
          city: "Makati",
          province: "Metro Manila",
          postal_code: "1200",
          phone: "+63 917 234 5678",
          is_default: false
        }
      ]);
    }
    setLoading(false);
  }, []);

  const saveAddresses = (updatedAddresses) => {
    setAddresses(updatedAddresses);
    localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
  };

  const handleAddNew = () => {
    setFormData({
      label: "",
      name: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      phone: "",
      is_default: false
    });
    setShowAddModal(true);
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setFormData({ ...address });
    setShowEditModal(true);
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr._row_id !== addressId);
      saveAddresses(updatedAddresses);
      setMessage({ type: "success", text: "Address deleted successfully" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleSetDefault = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      is_default: addr._row_id === addressId
    }));
    saveAddresses(updatedAddresses);
    setMessage({ type: "success", text: "Default address updated successfully" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.label || !formData.name || !formData.address || !formData.city || !formData.province || !formData.postal_code || !formData.phone) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    let updatedAddresses;
    
    if (showEditModal) {
      // Update existing address
      updatedAddresses = addresses.map(addr => 
        addr._row_id === selectedAddress._row_id 
          ? { ...formData, _row_id: selectedAddress._row_id } 
          : addr
      );
    } else {
      // Add new address
      const newId = Math.max(...addresses.map(a => a._row_id), 0) + 1;
      const newAddress = { ...formData, _row_id: newId };
      
      // If this is the first address or set as default, make it default
      if (formData.is_default || addresses.length === 0) {
        updatedAddresses = addresses.map(addr => ({ ...addr, is_default: false }));
        updatedAddresses.unshift({ ...newAddress, is_default: true });
      } else {
        updatedAddresses = [...addresses, newAddress];
      }
    }

    saveAddresses(updatedAddresses);
    setShowAddModal(false);
    setShowEditModal(false);
    setMessage({ type: "success", text: showEditModal ? "Address updated successfully" : "Address added successfully" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading addresses...</p>
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
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AliazaStore</span>
            </Link>
            
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/customer")}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Shipping Addresses</h1>
            <p className="text-slate-600">Manage your delivery addresses</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-orange-600"
            onClick={handleAddNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {message.text && (
          <Alert className={`mb-4 ${message.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            {message.type === 'error' ? <AlertCircle className="h-4 w-4 text-red-600" /> : <CheckCircle2 className="h-4 w-4 text-green-600" />}
            <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address._row_id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{address.label}</h3>
                        {address.is_default && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-slate-900 font-medium">{address.name}</p>
                      <p className="text-slate-600">{address.address}</p>
                      <p className="text-slate-600">{address.city}, {address.province} {address.postal_code}</p>
                      <p className="text-slate-600">{address.phone}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!address.is_default && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(address._row_id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500"
                      onClick={() => handleDelete(address._row_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No addresses saved</h3>
            <p className="text-slate-600 mb-4">Add your first address to get started</p>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-orange-600"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </Button>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      <SimpleModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Address"
        description="Enter your delivery address details"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="label">Address Label *</Label>
            <Input
              id="label"
              name="label"
              placeholder="Home, Office, etc."
              value={formData.label}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main Street, Apt 4B"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                placeholder="Manila"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="province">Province *</Label>
              <Input
                id="province"
                name="province"
                placeholder="Metro Manila"
                value={formData.province}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="postal_code">Postal Code *</Label>
            <Input
              id="postal_code"
              name="postal_code"
              placeholder="1000"
              value={formData.postal_code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+63 912 345 6789"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleInputChange}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <Label htmlFor="is_default" className="text-sm">Set as default address</Label>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600">
              Add Address
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SimpleModal>

      {/* Edit Address Modal */}
      <SimpleModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Address"
        description="Update your delivery address details"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-label">Address Label *</Label>
            <Input
              id="edit-label"
              name="label"
              placeholder="Home, Office, etc."
              value={formData.label}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-name">Full Name *</Label>
            <Input
              id="edit-name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-address">Street Address *</Label>
            <Input
              id="edit-address"
              name="address"
              placeholder="123 Main Street, Apt 4B"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-city">City *</Label>
              <Input
                id="edit-city"
                name="city"
                placeholder="Manila"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-province">Province *</Label>
              <Input
                id="edit-province"
                name="province"
                placeholder="Metro Manila"
                value={formData.province}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-postal_code">Postal Code *</Label>
            <Input
              id="edit-postal_code"
              name="postal_code"
              placeholder="1000"
              value={formData.postal_code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-phone">Phone Number *</Label>
            <Input
              id="edit-phone"
              name="phone"
              placeholder="+63 912 345 6789"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleInputChange}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <Label htmlFor="edit-is_default" className="text-sm">Set as default address</Label>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600">
              Update Address
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
};

export default Addresses;