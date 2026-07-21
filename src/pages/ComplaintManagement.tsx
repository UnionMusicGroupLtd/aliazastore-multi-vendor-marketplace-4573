import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, MessageSquare, Search, Clock, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import db from "@/lib/shared/kliv-database.js";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  
  const [resolution, setResolution] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [complaintsData, storesData] = await Promise.all([
        db.query("shop_complaints", {
          order: "_created_at.desc",
          limit: "500"
        }),
        db.query("stores", {
          status: "eq.active",
          limit: "100"
        })
      ]);
      
      // Enrich complaints with store information
      const enrichedComplaints = await Promise.all(
        (complaintsData || []).map(async (complaint) => {
          const store = (storesData || []).find((s: any) => s._row_id === complaint.store_id);
          return {
            ...complaint,
            store_name: store?.name || "Unknown Store",
            store_icon: store?.icon || "🏪"
          };
        })
      );
      
      setComplaints(enrichedComplaints);
      setStores(storesData || []);
    } catch (error) {
      console.error("Error loading complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = !searchQuery || 
      complaint.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.store_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesType = typeFilter === "all" || complaint.complaint_type === typeFilter;
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter;
    const matchesStore = selectedStore === "all" || complaint.store_id === parseInt(selectedStore);
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesStore;
  });

  const getComplaintTypeBadge = (type: string) => {
    const badges: any = {
      product_quality: { label: "Product Quality", color: "bg-red-100 text-red-700" },
      shipping: { label: "Shipping", color: "bg-blue-100 text-blue-700" },
      customer_service: { label: "Customer Service", color: "bg-orange-100 text-orange-700" },
      payment: { label: "Payment", color: "bg-purple-100 text-purple-700" },
      fraud: { label: "Fraud", color: "bg-red-100 text-red-700" },
      other: { label: "Other", color: "bg-gray-100 text-gray-700" }
    };
    return badges[type] || badges.other;
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: { label: "Pending", color: "bg-orange-100 text-orange-700", icon: Clock },
      under_review: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: AlertCircle },
      resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CheckCircle },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle }
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: any = {
      low: { label: "Low", color: "bg-gray-100 text-gray-700" },
      normal: { label: "Normal", color: "bg-blue-100 text-blue-700" },
      high: { label: "High", color: "bg-orange-100 text-orange-700" },
      urgent: { label: "Urgent", color: "bg-red-100 text-red-700" }
    };
    return badges[priority] || badges.normal;
  };

  const handleUpdateComplaint = async () => {
    try {
      if (!selectedComplaint) return;
      
      await db.update("shop_complaints", { _row_id: `eq.${selectedComplaint._row_id}` }, {
        status: "resolved",
        resolution,
        admin_notes: adminNotes
      });
      
      setShowDetailModal(false);
      setResolution("");
      setAdminNotes("");
      setSelectedComplaint(null);
      loadData();
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  const getStats = () => {
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
    const urgentComplaints = complaints.filter(c => c.priority === 'urgent').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
    
    return { totalComplaints, pendingComplaints, urgentComplaints, resolvedComplaints };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading complaints...</p>
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
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">AliazaStore</span>
                  <Badge className="ml-2 bg-purple-100 text-purple-700">Admin</Badge>
                </div>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold">Complaint Management</h1>
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
                  <p className="text-purple-100 mb-1">Total Complaints</p>
                  <p className="text-3xl font-bold">{stats.totalComplaints}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Pending</p>
                  <p className="text-3xl font-bold">{stats.pendingComplaints}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 mb-1">Urgent</p>
                  <p className="text-3xl font-bold">{stats.urgentComplaints}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Resolved</p>
                  <p className="text-3xl font-bold">{stats.resolvedComplaints}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
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
                  placeholder="Search complaints..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-filter">Status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="type-filter">Type:</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="product_quality">Product Quality</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="customer_service">Customer Service</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="priority-filter">Priority:</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="store-filter">Store:</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Stores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map(store => (
                      <SelectItem key={store._row_id} value={store._row_id.toString()}>
                        {store.icon} {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Customer Complaints</CardTitle>
            <CardDescription>Manage and resolve customer complaints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => {
                const typeBadge = getComplaintTypeBadge(complaint.complaint_type);
                const statusBadge = getStatusBadge(complaint.status);
                const priorityBadge = getPriorityBadge(complaint.priority);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <div 
                    key={complaint._row_id} 
                    className="p-6 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setResolution(complaint.resolution || "");
                      setAdminNotes(complaint.admin_notes || "");
                      setShowDetailModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {complaint.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{complaint.customer_name}</h3>
                            <Badge className={priorityBadge.color}>{priorityBadge.label}</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{complaint.customer_email}</p>
                          <p className="text-sm text-slate-600">{complaint.customer_phone}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-slate-500">Complaint about:</span>
                            <span className="text-sm font-medium">{complaint.store_icon} {complaint.store_name}</span>
                          </div>
                          {complaint.order_id && (
                            <p className="text-sm text-slate-500">Order: {complaint.order_id}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={typeBadge.color}>{typeBadge.label}</Badge>
                        <Badge className={statusBadge.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-slate-900">{complaint.subject}</h4>
                      <p className="text-sm text-slate-600 mt-1">{complaint.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        {complaint._created_at ? new Date(complaint._created_at * 1000).toLocaleDateString() : "N/A"}
                      </p>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {filteredComplaints.length === 0 && (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No complaints found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaint Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>Full complaint information and resolution</DialogDescription>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-4">
              {/* Customer Information */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-600">Name</Label>
                    <p className="font-medium">{selectedComplaint.customer_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Email</Label>
                    <p className="font-medium">{selectedComplaint.customer_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Phone</Label>
                    <p className="font-medium">{selectedComplaint.customer_phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Store</Label>
                    <p className="font-medium">{selectedComplaint.store_icon} {selectedComplaint.store_name}</p>
                  </div>
                </div>
              </div>

              {/* Complaint Details */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Complaint Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-slate-600">Type:</Label>
                    <Badge className={getComplaintTypeBadge(selectedComplaint.complaint_type).color}>
                      {getComplaintTypeBadge(selectedComplaint.complaint_type).label}
                    </Badge>
                    <Badge className={getPriorityBadge(selectedComplaint.priority).color}>
                      {getPriorityBadge(selectedComplaint.priority).label}
                    </Badge>
                    <Badge className={getStatusBadge(selectedComplaint.status).color}>
                      {getStatusBadge(selectedComplaint.status).label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Subject</Label>
                    <p className="font-medium">{selectedComplaint.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Description</Label>
                    <p className="text-sm">{selectedComplaint.description}</p>
                  </div>
                  {selectedComplaint.order_id && (
                    <div>
                      <Label className="text-sm text-slate-600">Order ID</Label>
                      <p className="font-mono text-sm">{selectedComplaint.order_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution */}
              {selectedComplaint.status !== 'resolved' ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Resolve Complaint</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Resolution Details</Label>
                      <Textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Describe how this complaint was resolved..."
                        className="min-h-20"
                      />
                    </div>
                    <div>
                      <Label>Admin Notes (Internal)</Label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Internal notes about this complaint..."
                        className="min-h-16"
                      />
                    </div>
                    <Button 
                      onClick={handleUpdateComplaint}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!resolution}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Resolution</h3>
                  <p className="text-sm">{selectedComplaint.resolution}</p>
                  {selectedComplaint.admin_notes && (
                    <div className="mt-3">
                      <Label className="text-sm text-slate-600">Admin Notes</Label>
                      <p className="text-xs text-slate-600">{selectedComplaint.admin_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintManagement;