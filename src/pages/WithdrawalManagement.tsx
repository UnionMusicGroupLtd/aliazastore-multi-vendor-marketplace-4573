import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft,
  Building2, Smartphone, Wallet, CreditCard
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";
// Avatar replaced with div-based avatars
import { formatPrice } from "@/lib/currency";
import db from "@/lib/shared/kliv-database.js";

const WithdrawalManagement = () => {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [processFormData, setProcessFormData] = useState({
    action: "approve", // approve or reject
    transaction_id: "",
    notes: "",
    rejection_reason: ""
  });

  useEffect(() => {
    loadWithdrawals();
  }, []);

  useEffect(() => {
    filterWithdrawals();
  }, [withdrawals, searchTerm, statusFilter]);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const withdrawalsData = await db.query("withdrawals", { order: "request_date.desc" });
      
      // Enrich with store owner data
      const enrichedWithdrawals = await Promise.all(
        (withdrawalsData || []).map(async (withdrawal: any) => {
          try {
            const stores = await db.query("stores", { _row_id: `eq.${withdrawal.shop_owner_id}` });
            const store = stores[0];
            return {
              ...withdrawal,
              store_name: store?.store_name || "Unknown Store",
              store_owner_name: store?.owner_name || "Unknown Owner",
              store_owner_email: store?.owner_email || ""
            };
          } catch {
            return withdrawal;
          }
        })
      );
      
      setWithdrawals(enrichedWithdrawals);
    } catch (err) {
      console.error("Error loading withdrawals:", err);
      setError("Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  };

  const filterWithdrawals = () => {
    let filtered = withdrawals;

    if (searchTerm) {
      filtered = filtered.filter(w => 
        w.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.store_owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(w => w.status === statusFilter);
    }

    setFilteredWithdrawals(filtered);
  };

  const handleProcessWithdrawal = async () => {
    try {
      setError("");
      
      const updateData = {
        status: processFormData.action === "approve" ? "approved" : "rejected",
        processed_date: new Date().toISOString(),
        transaction_id: processFormData.transaction_id,
        notes: processFormData.notes,
        rejection_reason: processFormData.rejection_reason
      };

      await db.update("withdrawals", { 
        _row_id: `eq.${selectedWithdrawal._row_id}` 
      }, updateData);

      setSuccess(`Withdrawal ${processFormData.action === "approve" ? "approved" : "rejected"} successfully!`);
      setShowProcessModal(false);
      setSelectedWithdrawal(null);
      resetProcessForm();
      loadWithdrawals();
    } catch (err) {
      console.error("Error processing withdrawal:", err);
      setError("Failed to process withdrawal");
    }
  };

  const openDetailsModal = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailsModal(true);
  };

  const openProcessModal = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    setProcessFormData({
      action: "approve",
      transaction_id: "",
      notes: "",
      rejection_reason: ""
    });
    setShowProcessModal(true);
  };

  const resetProcessForm = () => {
    setProcessFormData({
      action: "approve",
      transaction_id: "",
      notes: "",
      rejection_reason: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "processing": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "processing": return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank": return <Building2 className="w-4 h-4 text-green-600" />;
      case "gcash": return <Smartphone className="w-4 h-4 text-blue-600" />;
      case "paypal": return <Wallet className="w-4 h-4 text-blue-800" />;
      case "card": return <CreditCard className="w-4 h-4 text-purple-600" />;
      default: return <Wallet className="w-4 h-4 text-slate-600" />;
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'SO';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading withdrawals...</p>
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
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Withdrawal Management</span>
                  <p className="text-sm text-slate-600">Process shop owner withdrawal requests</p>
                </div>
              </div>
            </div>
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
                  <p className="text-blue-100 mb-1">Total Requests</p>
                  <p className="text-3xl font-bold">{withdrawals.length}</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 mb-1">Pending</p>
                  <p className="text-3xl font-bold">{withdrawals.filter(w => w.status === "pending").length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Approved</p>
                  <p className="text-3xl font-bold">{withdrawals.filter(w => w.status === "approved").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Processing</p>
                  <p className="text-3xl font-bold">{withdrawals.filter(w => w.status === "processing").length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 mb-1">Rejected</p>
                  <p className="text-3xl font-bold">{withdrawals.filter(w => w.status === "rejected").length}</p>
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
                  <span className="absolute left-3 top-3 text-slate-400">🔍</span>
                  <Input
                    placeholder="Search withdrawals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawals Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
            <CardDescription>Process and manage shop owner withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWithdrawals.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No withdrawal requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-4 font-semibold text-slate-900">Store Owner</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Amount</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Method</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Account Details</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Request Date</th>
                      <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal._row_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {getInitials(withdrawal.store_owner_name)}
                            </div>
                            <div>
                              <p className="font-medium">{withdrawal.store_name}</p>
                              <p className="text-sm text-slate-600">{withdrawal.store_owner_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-green-600">
                          {formatPrice(withdrawal.amount)}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getMethodIcon(withdrawal.withdrawal_method)}
                            {withdrawal.withdrawal_method}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                          {withdrawal.account_details}
                        </td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(withdrawal.status)} flex items-center gap-1`}>
                            {getStatusIcon(withdrawal.status)}
                            {withdrawal.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {new Date(withdrawal.request_date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetailsModal(withdrawal)}
                            >
                              View
                            </Button>
                            {withdrawal.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                onClick={() => openProcessModal(withdrawal)}
                              >
                                Process
                              </Button>
                            )}
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

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Withdrawal Details</DialogTitle>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(selectedWithdrawal.store_owner_name)}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedWithdrawal.store_name}</h3>
                  <p className="text-sm text-slate-600">{selectedWithdrawal.store_owner_name}</p>
                  <p className="text-xs text-slate-500">{selectedWithdrawal.store_owner_email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-slate-600">Amount</p>
                  <p className="font-semibold text-green-600 text-lg">{formatPrice(selectedWithdrawal.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <Badge className={`${getStatusColor(selectedWithdrawal.status)} mt-1`}>
                    {selectedWithdrawal.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Withdrawal Method</p>
                  <p className="font-medium capitalize">{selectedWithdrawal.withdrawal_method}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Request Date</p>
                  <p className="font-medium">{new Date(selectedWithdrawal.request_date).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-600">Account Details</p>
                  <p className="font-medium">{selectedWithdrawal.account_details}</p>
                </div>
                {selectedWithdrawal.transaction_id && (
                  <div>
                    <p className="text-sm text-slate-600">Transaction ID</p>
                    <p className="font-medium">{selectedWithdrawal.transaction_id}</p>
                  </div>
                )}
                {selectedWithdrawal.processed_date && (
                  <div>
                    <p className="text-sm text-slate-600">Processed Date</p>
                    <p className="font-medium">{new Date(selectedWithdrawal.processed_date).toLocaleString()}</p>
                  </div>
                )}
                {selectedWithdrawal.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600">Notes</p>
                    <p className="font-medium">{selectedWithdrawal.notes}</p>
                  </div>
                )}
                {selectedWithdrawal.rejection_reason && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600">Rejection Reason</p>
                    <p className="font-medium text-red-600">{selectedWithdrawal.rejection_reason}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                {selectedWithdrawal.status === "pending" && (
                  <Button 
                    onClick={() => {
                      setShowDetailsModal(false);
                      openProcessModal(selectedWithdrawal);
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    Process Withdrawal
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Process Modal */}
      <Dialog open={showProcessModal} onOpenChange={setShowProcessModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Process Withdrawal</DialogTitle>
            <DialogDescription>
              {selectedWithdrawal && `Process ₱${selectedWithdrawal.amount} withdrawal request from ${selectedWithdrawal.store_name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label>Action</Label>
              <Select 
                value={processFormData.action} 
                onValueChange={(value) => setProcessFormData({...processFormData, action: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve Withdrawal</SelectItem>
                  <SelectItem value="reject">Reject Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {processFormData.action === "approve" && (
              <div>
                <Label>Transaction ID *</Label>
                <Input
                  value={processFormData.transaction_id}
                  onChange={(e) => setProcessFormData({...processFormData, transaction_id: e.target.value})}
                  placeholder="TXN-2025-001234"
                />
              </div>
            )}

            {processFormData.action === "reject" && (
              <div>
                <Label>Rejection Reason *</Label>
                <Input
                  value={processFormData.rejection_reason}
                  onChange={(e) => setProcessFormData({...processFormData, rejection_reason: e.target.value})}
                  placeholder="Explain why this withdrawal is being rejected"
                />
              </div>
            )}

            <div>
              <Label>Admin Notes</Label>
              <Input
                value={processFormData.notes}
                onChange={(e) => setProcessFormData({...processFormData, notes: e.target.value})}
                placeholder="Additional notes for this transaction"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowProcessModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleProcessWithdrawal}
                className={processFormData.action === "approve" 
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                }
              >
                {processFormData.action === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawalManagement;