import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, Wallet, Smartphone, Building2, Settings, 
  ArrowLeft, CheckCircle, XCircle, Edit, Eye, AlertCircle
} from "lucide-react";

const AdminPayments = () => {
  const navigate = useNavigate();
  const [editingGateway, setEditingGateway] = useState<string | null>(null);

  // Payment gateways data
  const [gateways, setGateways] = useState([
    {
      id: "gcash",
      name: "GCash Payment",
      type: "gcash",
      enabled: true,
      icon: Smartphone,
      color: "from-blue-600 to-blue-800",
      fee: "1.5% + £5",
      minAmount: "£100",
      maxAmount: "£50,000",
      gcashNumber: "09912633528",
      gcashQRCode: "/content/gcash-qr-codes/gcash-inipay-real.jpg",
      apiKey: "gcash_live_12345",
      apiSecret: "••••••••••••••••"
    },
    {
      id: "stripe",
      name: "Stripe Payments",
      type: "stripe",
      enabled: true,
      icon: CreditCard,
      color: "from-purple-600 to-purple-800",
      fee: "2.9% + £3.50",
      minAmount: "£100",
      maxAmount: "£100,000",
      merchantId: "acct_1A2B3C4D5E6F",
      apiKey: "sk_live_51AbCd...",
      apiSecret: "••••••••••••••••"
    },
    {
      id: "paypal",
      name: "PayPal",
      type: "paypal",
      enabled: true,
      icon: Wallet,
      color: "from-yellow-600 to-yellow-800",
      fee: "3.4% + £15",
      minAmount: "£500",
      maxAmount: "£75,000",
      clientId: "AX1234AbCd5678EfGh...",
      clientSecret: "••••••••••••••••"
    },
    {
      id: "bank",
      name: "Bank Transfer",
      type: "bank_transfer",
      enabled: true,
      icon: Building2,
      color: "from-green-600 to-green-800",
      fee: "0%",
      minAmount: "£1,000",
      maxAmount: "£500,000",
      accountName: "ifudda Ltd",
      accountNumber: "12-34-56-78901234",
      sortCode: "12-34-56"
    }
  ]);

  const toggleGateway = (gatewayId: string) => {
    setGateways(prev => prev.map(gw => 
      gw.id === gatewayId ? { ...gw, enabled: !gw.enabled } : gw
    ));
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
                <CreditCard className="w-6 h-6 text-red-500" />
                <h1 className="text-xl font-bold text-white">Payment Gateway Management</h1>
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
                  <p className="text-green-400 text-sm font-medium">Active</p>
                  <p className="text-3xl font-bold text-white">{gateways.filter(g => g.enabled).length}</p>
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
                  <p className="text-3xl font-bold text-white">{gateways.filter(g => !g.enabled).length}</p>
                </div>
                <XCircle className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Payment Methods</p>
                  <p className="text-3xl font-bold text-white">4</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Avg. Fee</p>
                  <p className="text-3xl font-bold text-white">1.95%</p>
                </div>
                <Wallet className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gateways.map((gateway) => {
            const Icon = gateway.icon;
            const isEditing = editingGateway === gateway.id;
            
            return (
              <Card 
                key={gateway.id} 
                className={`border-0 bg-gray-900/50 backdrop-blur-sm ${gateway.enabled ? 'border-green-800/50' : 'border-gray-800/50'} border`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gateway.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{gateway.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {gateway.enabled ? 'Active' : 'Inactive'}
                        </CardDescription>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gateway.enabled}
                        onChange={() => toggleGateway(gateway.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Fee and Limits */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Processing Fee</p>
                      <p className="text-white font-semibold">{gateway.fee}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Minimum</p>
                      <p className="text-white font-semibold">{gateway.minAmount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Maximum</p>
                      <p className="text-white font-semibold">{gateway.maxAmount}</p>
                    </div>
                  </div>

                  {/* Gateway Specific Config */}
                  {gateway.type === 'gcash' && (
                    <div className="space-y-3 p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">GCash Number</p>
                        <p className="text-white font-medium">{gateway.gcashNumber}</p>
                      </div>
                      {gateway.gcashQRCode && (
                        <div>
                          <p className="text-gray-400 text-xs mb-2">QR Code</p>
                          <div className="w-32 h-32 bg-white rounded-lg p-2">
                            <img 
                              src={gateway.gcashQRCode} 
                              alt="GCash QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {gateway.type === 'stripe' && (
                    <div className="space-y-2 p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Merchant ID</p>
                        <p className="text-white font-medium text-sm">{gateway.merchantId}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">API Key</p>
                        <p className="text-white font-mono text-xs">{gateway.apiKey}</p>
                      </div>
                    </div>
                  )}

                  {gateway.type === 'paypal' && (
                    <div className="space-y-2 p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Client ID</p>
                        <p className="text-white font-mono text-xs">{gateway.clientId}</p>
                      </div>
                    </div>
                  )}

                  {gateway.type === 'bank_transfer' && (
                    <div className="space-y-2 p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Account Name</p>
                        <p className="text-white font-medium">{gateway.accountName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Account Number</p>
                        <p className="text-white font-mono">{gateway.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Sort Code</p>
                        <p className="text-white font-mono">{gateway.sortCode}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Edit className="mr-2 w-4 h-4" />
                      Configure
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add New Gateway */}
        <Card className="mt-6 border-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
                <CreditCard className="mr-2 w-4 h-4" />
                Add Payment Gateway
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPayments;