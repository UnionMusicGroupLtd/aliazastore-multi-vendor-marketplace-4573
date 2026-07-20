import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, CreditCard, Building2, Wallet } from "lucide-react";
import GCashPayment from "@/components/GCashPayment";
import db from "@/lib/shared/kliv-database.js";

const PaymentOptions = ({ amount, orderId, onPaymentComplete }: { amount: number; orderId: string; onPaymentComplete: (method: string, transactionId: string) => void }) => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const methods = await db.query("payment_methods", { 
        is_enabled: "eq.1",
        order: "_created_at.desc"
      });
      setPaymentMethods(methods || []);
    } catch (error) {
      console.error("Error loading payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "gcash": return <Smartphone className="w-6 h-6 text-blue-600" />;
      case "stripe": return <CreditCard className="w-6 h-6 text-purple-600" />;
      case "paypal": return <Wallet className="w-6 h-6 text-blue-800" />;
      case "bank": return <Building2 className="w-6 h-6 text-green-600" />;
      default: return <CreditCard className="w-6 h-6 text-slate-600" />;
    }
  };

  const getMethodColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "gcash": return "from-blue-500 to-blue-600";
      case "stripe": return "from-purple-500 to-purple-600";
      case "paypal": return "from-blue-600 to-blue-800";
      case "bank": return "from-green-500 to-green-600";
      default: return "from-slate-500 to-slate-600";
    }
  };

  const handlePaymentComplete = (transactionId: string) => {
    if (selectedMethod && onPaymentComplete) {
      onPaymentComplete(selectedMethod, transactionId);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading payment options...</p>
      </div>
    );
  }

  if (selectedMethod === 'gcash') {
    return (
      <div>
        <Button 
          variant="outline" 
          onClick={() => setSelectedMethod(null)}
          className="mb-4"
        >
          ← Back to payment options
        </Button>
        <GCashPayment 
          amount={amount} 
          orderId={orderId} 
          onComplete={handlePaymentComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Select Payment Method</h2>
        <p className="text-slate-600">Choose your preferred payment option</p>
        <Badge className="mt-2 bg-blue-100 text-blue-700 text-lg">
          Total: ₱{amount.toFixed(2)}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <Card 
            key={method._row_id}
            className="cursor-pointer hover:shadow-lg transition-all border-0 bg-white/80 backdrop-blur-sm"
            onClick={() => method.gateway_type === 'gcash' && setSelectedMethod('gcash')}
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getMethodColor(method.gateway_type)} rounded-xl flex items-center justify-center`}>
                  {getMethodIcon(method.gateway_type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{method.gateway_name}</CardTitle>
                  <CardDescription>
                    {method.transaction_fee_percentage}% + ₱{method.fixed_fee} fee
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {method.gateway_type === 'gcash' ? "Instant transfer" : "Secure payment"}
                </div>
                {method.gateway_type === 'gcash' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Pay Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-slate-500 space-y-1">
        <p>🔒 All payments are secure and encrypted</p>
        <p>Order ID: {orderId}</p>
      </div>
    </div>
  );
};

export default PaymentOptions;