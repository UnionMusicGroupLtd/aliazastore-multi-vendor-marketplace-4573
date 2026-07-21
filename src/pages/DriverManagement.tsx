import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  UserCog, Plus, Search, Edit, CheckCircle, 
  XCircle, AlertCircle, ArrowLeft, User, Car, Phone, Mail, MapPin, Bike, Eye
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";

import db from "@/lib/shared/kliv-database.js";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle_type: "motorcycle",
    vehicle_number: "",
    license_number: "",
    availability_status: "available",
    current_location: "",
    bank_account: "",
    is_active: true
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchTerm, availabilityFilter, vehicleFilter]);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const driversData = await db.query("drivers", { order: "_created_at.desc" });
      setDrivers(driversData || []);
    } catch (err) {
      console.error("Error loading drivers:", err);
      setError("Failed to load driver data");
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    let filtered = drivers;

    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (availabilityFilter !== "all") {
      filtered = filtered.filter(d => d.availability_status === availabilityFilter);
    }

    if (vehicleFilter !== "all") {
      filtered = filtered.filter(d => d.vehicle_type === vehicleFilter);
    }

    setFilteredDrivers(filtered);
  };

  const handleAddDriver = async () => {
    try {
      setError("");
      
      if (!formData.name || !formData.email || !formData.phone || !formData.license_number) {
        setError("Name, email, phone and license number are required");
        return;
      }

      await db.insert("drivers", formData);

      setSuccess("Driver added successfully!");
      setShowAddModal(false);
      resetForm();
      loadDrivers();
    } catch (err) {
      console.error("Error adding driver:", err);
      setError("Failed to add driver. Email or license number might already exist.");
    }
  };

  const handleUpdateDriver = async () => {
    try {
      setError("");
      
      await db.update("drivers", { 
        _row_id: `eq.${selectedDriver._row_id}` 
      }, formData);

      setSuccess("Driver updated successfully!");
      setShowEditModal(false);
      setSelectedDriver(null);
      resetForm();
      loadDrivers();
    } catch (err) {
      console.error("Error updating driver:", err);
      setError("Failed to update driver");
    }
  };

  const handleDeleteDriver = async (driverId: number) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    try {
      await db.delete("drivers", { _row_id: `eq.${driverId}` });
      setSuccess("Driver deleted successfully!");
      loadDrivers();
    } catch (err) {
      console.error("Error deleting driver:", err);
      setError("Failed to delete driver");
    }
  };

  const handleToggleActive = async (driver: any) => {
    try {
      await db.update("drivers", { 
        _row_id: `eq.${driver._row_id}` 
      }, { is_active: driver.is_active ? 0 : 1 });

      setSuccess(`Driver ${driver.is_active ? 'deactivated' : 'activated'} successfully!`);
      loadDrivers();
    } catch (err) {
      console.error("Error toggling driver status:", err);
      setError("Failed to update driver status");
    }
  };

  const openViewModal = (driver: any) => {
    setSelectedDriver(driver);
    setShowViewModal(true);
  };

  const openEditModal = (driver: any) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name || "",
      email: driver.email || "",
      phone: driver.phone || "",
      vehicle_type: driver.vehicle_type || "motorcycle",
      vehicle_number: driver.vehicle_number || "",
      license_number: driver.license_number || "",
      availability_status: driver.availability_status || "available",
      current_location: driver.current_location || "",
      bank_account: driver.bank_account || "",
      is_active: driver.is_active !== 0
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      vehicle_type: "motorcycle",
      vehicle_number: "",
      license_number: "",
      availability_status: "available",
      current_location: "",
      bank_account: "",
      is_active: true
    });
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700";
      case "busy": return "bg-red-100 text-red-700";
      case "on_delivery": return "bg-blue-100 text-blue-700";
      case "offline": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "motorcycle": return <Bike className="w-4 h-4" />;
      case "car": return <Car className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'DR';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading drivers...</p>
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
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <UserCog className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Driver Management</span>
                  <p className="text-sm text-slate-600">Manage delivery drivers</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Plus className="mr-2 w-4 h-4" />
              Add Driver
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Drivers</p>
                  <p className="text-3xl font-bold">{drivers.length}</p>
                </div>
                <User className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Available</p>
                  <p className="text-3xl font-bold">{drivers.filter(d => d.availability_status === "available").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">On Delivery</p>
                  <p className="text-3xl font-bold">{drivers.filter(d => d.availability_status === "on_delivery").length}</p>
                </div>
                <MapPin className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 mb-1">Inactive</p>
                  <p className="text-3xl font-bold">{drivers.filter(d => d.is_active === 0).length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search drivers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="on_delivery">On Delivery</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Drivers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No drivers found</p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Add First Driver
              </Button>
            </div>
          ) : (
            filteredDrivers.map((driver) => (
              <Card key={driver._row_id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {getInitials(driver.name)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{driver.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {driver.email}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getAvailabilityColor(driver.availability_status)} flex items-center gap-1`}>
                      {driver.availability_status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getVehicleIcon(driver.vehicle_type)}
                      <span className="capitalize">{driver.vehicle_type}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Car className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-600">{driver.vehicle_number}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Rating:</span>
                      <Badge variant="outline" className="text-yellow-600">
                        ⭐ {driver.rating?.toFixed(1) || "0.0"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Deliveries:</span>
                      <span className="font-semibold">{driver.total_deliveries || 0}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openViewModal(driver)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEditModal(driver)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={driver.is_active ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                      onClick={() => handleToggleActive(driver)}
                    >
                      {driver.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>Register a new delivery driver</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+63 912 345 6789"
                />
              </div>
              <div>
                <Label>Vehicle Type</Label>
                <Select value={formData.vehicle_type} onValueChange={(value) => setFormData({...formData, vehicle_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vehicle Number *</Label>
                <Input
                  value={formData.vehicle_number}
                  onChange={(e) => setFormData({...formData, vehicle_number: e.target.value})}
                  placeholder="ABC 1234"
                />
              </div>
              <div>
                <Label>License Number *</Label>
                <Input
                  value={formData.license_number}
                  onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                  placeholder="L-123456789"
                />
              </div>
            </div>

            <div>
              <Label>Current Location</Label>
              <Input
                value={formData.current_location}
                onChange={(e) => setFormData({...formData, current_location: e.target.value})}
                placeholder="Manila, Philippines"
              />
            </div>

            <div>
              <Label>Bank Account (for payments)</Label>
              <Input
                value={formData.bank_account}
                onChange={(e) => setFormData({...formData, bank_account: e.target.value})}
                placeholder="Account number for withdrawals"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddDriver}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Add Driver
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Driver Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update driver information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+63 912 345 6789"
                />
              </div>
              <div>
                <Label>Vehicle Type</Label>
                <Select value={formData.vehicle_type} onValueChange={(value) => setFormData({...formData, vehicle_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vehicle Number *</Label>
                <Input
                  value={formData.vehicle_number}
                  onChange={(e) => setFormData({...formData, vehicle_number: e.target.value})}
                  placeholder="ABC 1234"
                />
              </div>
              <div>
                <Label>License Number *</Label>
                <Input
                  value={formData.license_number}
                  onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                  placeholder="L-123456789"
                />
              </div>
            </div>

            <div>
              <Label>Current Location</Label>
              <Input
                value={formData.current_location}
                onChange={(e) => setFormData({...formData, current_location: e.target.value})}
                placeholder="Manila, Philippines"
              />
            </div>

            <div>
              <Label>Bank Account (for payments)</Label>
              <Input
                value={formData.bank_account}
                onChange={(e) => setFormData({...formData, bank_account: e.target.value})}
                placeholder="Account number for withdrawals"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Availability Status</Label>
                <Select value={formData.availability_status} onValueChange={(value) => setFormData({...formData, availability_status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="on_delivery">On Delivery</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.is_active ? "active" : "inactive"} onValueChange={(value) => setFormData({...formData, is_active: value === "active"})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateDriver}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Update Driver
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Driver Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">
                    {getInitials(selectedDriver.name)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedDriver.name}</h3>
                  <p className="text-sm text-slate-600">{selectedDriver.email}</p>
                  <Badge className={`${getAvailabilityColor(selectedDriver.availability_status)} mt-2`}>
                    {selectedDriver.availability_status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="font-medium">{selectedDriver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Vehicle Type</p>
                  <p className="font-medium capitalize">{selectedDriver.vehicle_type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Vehicle Number</p>
                  <p className="font-medium">{selectedDriver.vehicle_number}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">License Number</p>
                  <p className="font-medium">{selectedDriver.license_number}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Current Location</p>
                  <p className="font-medium">{selectedDriver.current_location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <p className="font-medium">{selectedDriver.is_active ? "Active" : "Inactive"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Rating</p>
                  <p className="font-medium">⭐ {selectedDriver.rating?.toFixed(1) || "0.0"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Deliveries</p>
                  <p className="font-medium">{selectedDriver.total_deliveries || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Wallet Balance</p>
                  <p className="font-medium">₱{selectedDriver.wallet_balance?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Bank Account</p>
                  <p className="font-medium">{selectedDriver.bank_account || "Not specified"}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedDriver);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  Edit Driver
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverManagement;