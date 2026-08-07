import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, Wallet, CheckCircle, XCircle, Clock, 
  ArrowLeft, Search, Filter, Download, Eye, AlertCircle
} from "lucide-react";

const AdminWithdrawals = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample withdrawal requests
  const withdrawals = [
    {
      id: "WDR-2026-001",
      seller: "Adult Pleasure UK",
      sellerId: "seller-001",
      amount: "£250.00",
      method: "GCash",
      gcashNumber: "09172345678",
      bankName: "",
      accountNumber: "",
      status: "pending",
      requestDate: "2026-08-07",
      transactionId: "",
      rejectionReason: ""
    },
    {
      id: "WDR-2026-002",
      seller: "Wellness Store Ltd",
      sellerId: "seller-002",
      amount: "£500.00",
      method: "Bank Transfer",
      gcashNumber: "",
      bankName: "Lloyds Bank",
      accountNumber: "****1234",
      status: "processing",
      requestDate: "2026-08-06",
      transactionId: "TXN-2026-BANK-001",
      rejectionReason: ""
    },
    {
      id: "WDR-2026-003",
      seller: "Intimate Products",
      sellerId: "seller-003",
      amount: "£150.00",
      method: "PayPal",
      gcashNumber: "",
      bankName: "",
      accountNumber: "",
      status: "approved",
      requestDate: "2026-08-05",
      transactionId: "TXN-2026-PPL-001",
      rejectionReason: ""
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-800", label: "Pending" },
      processing: { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-800", label: "Processing" },
      approved: { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-800", label: "Approved" },
      rejected: { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-800", label: "Rejected" }
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} ${badge.border} border`}>
        {badge.label}
      </span>
    );
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
                <Wallet className="w-6 h-6 text-red-500" />
                <h1 className="text-xl font-bold text-white">Withdrawal Management</h1>
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
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Processing</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-white">1</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Total Amount</p>
                  <p className="text-3xl font-bold text-white">£900.00</p>
                </div>
                <Wallet className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search withdrawals by ID, seller..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Download className="mr-2 w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawals Table */}
        <Card className="border-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Withdrawal Requests</CardTitle>
            <CardDescription className="text-gray-400">
              Process seller withdrawal requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Wallet className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-white">{withdrawal.id}</h3>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Seller</p>
                          <p className="text-white font-medium">{withdrawal.seller}</p>
                          <p className="text-gray-500 text-xs">{withdrawal.sellerId}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Amount & Method</p>
                          <p className="text-green-400 font-semibold text-lg">{withdrawal.amount}</p>
                          <p className="text-white">{withdrawal.method}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Payment Details</p>
                          {withdrawal.method === 'GCash' && withdrawal.gcashNumber && (
                            <p className="text-white">GCash: {withdrawal.gcashNumber}</p>
                          )}
                          {withdrawal.method === 'Bank Transfer' && (
                            <>
                              <p className="text-white">{withdrawal.bankName}</p>
                              <p className="text-white">{withdrawal.accountNumber}</p>
                            </>
                          )}
                          {withdrawal.method === 'PayPal' && (
                            <p className="text-white">PayPal Transfer</p>
                          )}
                          <p className="text-gray-500 text-xs">{withdrawal.requestDate}</p>
                        </div>
                      </div>

                      {withdrawal.transactionId && (
                        <div className="mt-3 p-2 bg-green-900/20 border border-green-800 rounded">
                          <p className="text-green-400 text-sm">Transaction ID: {withdrawal.transactionId}</p>
                        </div>
                      )}

                      {withdrawal.rejectionReason && (
                        <div className="mt-3 p-2 bg-red-900/20 border border-red-800 rounded">
                          <p className="text-red-400 text-sm">Reason: {withdrawal.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Eye className="mr-2 w-4 h-4" />
                        View Details
                      </Button>
                      {withdrawal.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminWithdrawals;