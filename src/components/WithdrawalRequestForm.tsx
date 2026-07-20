import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import db from "@/lib/shared/kliv-database.js";
import { notifyWithdrawalRequest } from "@/lib/notifications";

const WithdrawalRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    amount: "",
    withdrawalMethod: "gcash",
    accountDetails: "",
    notes: ""
  });

  // Sample shop data - in real app, this would come from auth
  const shopData = {
    storeName: "My Awesome Store",
    ownerName: "John Doe",
    ownerEmail: "john@example.com",
    availableBalance: 15000
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      
      if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid amount");
        setLoading(false);
        return;
      }

      if (amount > shopData.availableBalance) {
        setError(`Insufficient balance. Available: ${formatPrice(shopData.availableBalance)}`);
        setLoading(false);
        return;
      }

      // Create withdrawal request
      const withdrawalData = {
        shop_owner_id: "current_store_id", // In real app, get from auth
        amount: amount,
        withdrawal_method: formData.withdrawalMethod,
        account_details: formData.accountDetails,
        notes: formData.notes,
        status: "pending",
        request_date: new Date().toISOString()
      };

      await db.insert("withdrawals", withdrawalData);
      
      console.log("Withdrawal request created:", withdrawalData);
      
      // Send notification to admin
      await notifyWithdrawalRequest({
        storeName: shopData.storeName,
        ownerName: shopData.ownerName,
        ownerEmail: shopData.ownerEmail,
        amount: amount.toFixed(2),
        withdrawalMethod: formData.withdrawalMethod,
        methodDetails: formData.accountDetails,
        requestId: `WR-${Date.now()}`
      });

      setSuccess("Withdrawal request submitted successfully!");
      setFormData({
        amount: "",
        withdrawalMethod: "gcash",
        accountDetails: "",
        notes: ""
      });
      
    } catch (err: any) {
      console.error("Withdrawal request error:", err);
      setError(err.message || "Failed to submit withdrawal request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-green-600" />
            Request Withdrawal
          </CardTitle>
          <CardDescription>
            Submit a withdrawal request to transfer your earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Available Balance */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Available Balance</p>
                <p className="text-2xl font-bold text-green-800">{formatPrice(shopData.availableBalance)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₱)</Label>
              <Input
                id="amount"
                type="number"
                min="100"
                max={shopData.availableBalance}
                step="0.01"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              <p className="text-sm text-slate-500 mt-1">
                Minimum withdrawal: ₱100.00 | Maximum: {formatPrice(shopData.availableBalance)}
              </p>
            </div>

            <div>
              <Label htmlFor="withdrawalMethod">Withdrawal Method</Label>
              <Select 
                value={formData.withdrawalMethod} 
                onValueChange={(value) => setFormData({ ...formData, withdrawalMethod: value })}
              >
                <SelectTrigger id="withdrawalMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accountDetails">
                {formData.withdrawalMethod === "gcash" ? "GCash Number" :
                 formData.withdrawalMethod === "bank" ? "Bank Account Details" :
                 "PayPal Email"}
              </Label>
              <Input
                id="accountDetails"
                placeholder={
                  formData.withdrawalMethod === "gcash" ? "09XX XXX XXXX" :
                  formData.withdrawalMethod === "bank" ? "Bank Name, Account Number" :
                  "your-email@example.com"
                }
                value={formData.accountDetails}
                onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any additional information..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>⏱️ Processing Time:</strong> Withdrawal requests are typically processed within 3-5 business days.
                You will receive a notification once your request is approved.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Withdrawal Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawalRequestForm;