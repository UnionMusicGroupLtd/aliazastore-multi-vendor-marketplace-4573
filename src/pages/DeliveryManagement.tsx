import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Truck, Plus, Search, Edit, Trash2, CheckCircle, 
  Clock, Package, XCircle, AlertCircle, ArrowLeft, User
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";
import db from "@/lib/shared/kliv-database.js";

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    order_id: "",
    customer_name: "",
    customer_address: "",
    customer_phone: "",
    driver_id: "",
    delivery_notes: "",
    status: "pending",
    estimated_delivery_time: "",
    distance_km: 0,
    delivery_fee: 50,
    payment_method: "cash"
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [deliveries, searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deliveriesData, driversData] = await Promise.all([
        db.query("deliveries", { order: "_created_at.desc" }),
        db.query("drivers", { is_active: "eq.1" })
      ]);
      
      setDeliveries(deliveriesData || []);
      setDrivers(driversData || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load delivery data");
    } finally {
      setLoading(false);
    }
  };

  const filterDeliveries = () => {
    let filtered = deliveries;

    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customer_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    setFilteredDeliveries(filtered);
  };

  const handleAddDelivery = async () => {
    try {
      setError("");
      
      if (!formData.order_id || !formData.customer_name || !formData.customer_address) {
        setError("Order ID, customer name and address are required");
        return;
      }

      await db.insert("deliveries", {
        ...formData,
        driver_id: formData.driver_id ? parseInt(formData.driver_id) : null
      });

      setSuccess("Delivery created successfully!");
      setShowAddModal(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error("Error adding delivery:", err);
      setError("Failed to create delivery");
    }
  };

  const handleUpdateDelivery = async () => {
    try {
      setError("");
      
      await db.update("deliveries", { 
        _row_id: `eq.${selectedDelivery._row_id}` 
      }, {
        ...formData,
        driver_id: formData.driver_id ? parseInt(formData.driver_id) : null
      });

      setSuccess("Delivery updated successfully!");
      setShowEditModal(false);
      setSelectedDelivery(null);
      resetForm();
      loadData();
    } catch (err) {
      console.error("Error updating delivery:", err);
      setError("Failed to update delivery");
    }
  };

  const handleDeleteDelivery = async (deliveryId: number) => {
    if (!confirm("Are you sure you want to delete this delivery?")) return;

    try {
      await db.delete("deliveries", { _row_id: `eq.${deliveryId}` });
      setSuccess("Delivery deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Error deleting delivery:", err);
      setError("Failed to delete delivery");
    }
  };

  const openEditModal = (delivery: any) => {
    setSelectedDelivery(delivery);
    setFormData({
      order_id: delivery.order_id || "",
      customer_name: delivery.customer_name || "",
      customer_address: delivery.customer_address || "",
      customer_phone: delivery.customer_phone || "",
      driver_id: delivery.driver_id?.toString() || "",
      delivery_notes: delivery.delivery_notes || "",
      status: delivery.status || "pending",
      estimated_delivery_time: delivery.estimated_delivery_time || "",
      distance_km: delivery.distance_km || 0,
      delivery_fee: delivery.delivery_fee || 50,
      payment_method: delivery.payment_method || "cash"
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      order_id: "",
      customer_name: "",
      customer_address: "",
      customer_phone: "",
      driver_id: "",
      delivery_notes: "",
      status: "pending",
      estimated_delivery_time: "",
      distance_km: 0,
      delivery_fee: 50,
      payment_method: "cash"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "assigned": return "bg-blue-100 text-blue-700";
      case "in_transit": return "bg-purple-100 text-purple-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "assigned": return <User className="w-4 h-4" />;
      case "in_transit": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDriverName = (driverId: number) => {
    const driver = drivers.find(d => d._row_id === driverId);
    return driver ? driver.name : "Unassigned";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading deliveries...</p>
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
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Delivery Management</span>
                  <p className="text-sm text-slate-600">Manage deliveries and logistics</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Plus className="mr-2 w-4 h-4" />
              New Delivery
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total</p>
                  <p className="text-3xl font-bold">{deliveries.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 mb-1">Pending</p>
                  <p className="text-3xl font-bold">{deliveries.filter(d => d.status === "pending").length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">In Transit</p>
                  <p className="text-3xl font-bold">{deliveries.filter(d => d.status === "in_transit").length}</p>
                </div>
                <Truck className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Delivered</p>
                  <p className="text-3xl font-bold">{deliveries.filter(d => d.status === "delivered").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 mb-1">Drivers</p>
                  <p className="text-3xl font-bold">{drivers.length}</p>
                </div>
                <User className="w-8 h-8 text-emerald-200" />
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
                    placeholder="Search deliveries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Deliveries Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>All Deliveries</CardTitle>
            <CardDescription>Manage and track all deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No deliveries found</p>
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  Create First Delivery
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-4 font-semibold text-slate-900">Order ID</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Customer</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Address</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Driver</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Fee</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.map((delivery) => (
                      <tr key={delivery._row_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 font-medium">{delivery.order_id}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{delivery.customer_name}</p>
                            <p className="text-sm text-slate-600">{delivery.customer_phone}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                          {delivery.customer_address}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {getDriverName(delivery.driver_id)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(delivery.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(delivery.status)}
                            {delivery.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium">₱{delivery.delivery_fee}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(delivery)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteDelivery(delivery._row_id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Delivery Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Delivery</DialogTitle>
            <DialogDescription>Add a new delivery to the system</DialogDescription>
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
                <Label>Order ID *</Label>
                <Input
                  value={formData.order_id}
                  onChange={(e) => setFormData({...formData, order_id: e.target.value})}
                  placeholder="ORD-2025-001234"
                />
              </div>
              <div>
                <Label>Customer Name *</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <Label>Customer Address *</Label>
              <Input
                value={formData.customer_address}
                onChange={(e) => setFormData({...formData, customer_address: e.target.value})}
                placeholder="123 Main St, City"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Phone *</Label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  placeholder="+63 912 345 6789"
                />
              </div>
              <div>
                <Label>Assign Driver</Label>
                <Select value={formData.driver_id} onValueChange={(value) => setFormData({...formData, driver_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {drivers.map(driver => (
                      <SelectItem key={driver._row_id} value={driver._row_id.toString()}>
                        {driver.name} - {driver.vehicle_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Delivery Fee</Label>
                <Input
                  type="number"
                  value={formData.delivery_fee}
                  onChange={(e) => setFormData({...formData, delivery_fee: parseFloat(e.target.value)})}
                  placeholder="50"
                />
              </div>
              <div>
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  value={formData.distance_km}
                  onChange={(e) => setFormData({...formData, distance_km: parseFloat(e.target.value)})}
                  placeholder="5.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="ewallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Delivery Notes</Label>
              <Input
                value={formData.delivery_notes}
                onChange={(e) => setFormData({...formData, delivery_notes: e.target.value})}
                placeholder="Special instructions..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddDelivery}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Create Delivery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Delivery Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Delivery</DialogTitle>
            <DialogDescription>Update delivery information</DialogDescription>
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
                <Label>Order ID *</Label>
                <Input
                  value={formData.order_id}
                  onChange={(e) => setFormData({...formData, order_id: e.target.value})}
                  placeholder="ORD-2025-001234"
                />
              </div>
              <div>
                <Label>Customer Name *</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <Label>Customer Address *</Label>
              <Input
                value={formData.customer_address}
                onChange={(e) => setFormData({...formData, customer_address: e.target.value})}
                placeholder="123 Main St, City"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Phone *</Label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  placeholder="+63 912 345 6789"
                />
              </div>
              <div>
                <Label>Assign Driver</Label>
                <Select value={formData.driver_id} onValueChange={(value) => setFormData({...formData, driver_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {drivers.map(driver => (
                      <SelectItem key={driver._row_id} value={driver._row_id.toString()}>
                        {driver.name} - {driver.vehicle_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Delivery Fee</Label>
                <Input
                  type="number"
                  value={formData.delivery_fee}
                  onChange={(e) => setFormData({...formData, delivery_fee: parseFloat(e.target.value)})}
                  placeholder="50"
                />
              </div>
              <div>
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  value={formData.distance_km}
                  onChange={(e) => setFormData({...formData, distance_km: parseFloat(e.target.value)})}
                  placeholder="5.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="ewallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Delivery Notes</Label>
              <Input
                value={formData.delivery_notes}
                onChange={(e) => setFormData({...formData, delivery_notes: e.target.value})}
                placeholder="Special instructions..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateDelivery}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Update Delivery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryManagement;