import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import WithdrawalRequestForm from "@/components/WithdrawalRequestForm";

const SellerWithdrawalRequest = () => {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      // In a real app, this would load from auth and database
      setStore({
        storeName: "My Store",
        availableBalance: 15000
      });
    } catch (error) {
      console.error("Error loading store data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
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
              <Link to="/dashboard/seller" className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Request Withdrawal</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="w-6 h-6 mr-2 text-green-600" />
              Withdraw Your Earnings
            </CardTitle>
            <CardDescription>
              Submit a withdrawal request to transfer your available balance to your preferred payment method.
              Requests are typically processed within 3-5 business days.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Withdrawal Form */}
        <WithdrawalRequestForm />

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">💡 Withdrawal Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Minimum withdrawal amount: ₱100</li>
                <li>• Processing time: 3-5 business days</li>
                <li>• Available methods: GCash, Bank Transfer, PayPal</li>
                <li>• No withdrawal fees</li>
                <li>• Withdraw to registered accounts only</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">📋 Processing Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>1. Submit your withdrawal request</li>
                <li>2. Admin reviews your request</li>
                <li>3. Request is approved/rejected</li>
                <li>4. Funds are transferred to your account</li>
                <li>5. You'll receive confirmation notification</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerWithdrawalRequest;