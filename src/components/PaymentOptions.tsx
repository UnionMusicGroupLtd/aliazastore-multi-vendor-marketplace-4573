import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

interface PaymentOption {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  fees: string;
  features: string[];
}

interface PaymentOptionsProps {
  amount: number;
  orderId?: string;
  onSelect: (paymentMethod: string, transactionId: string) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ amount, orderId, onSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const paymentMethods: PaymentOption[] = [
    {
      id: "stripe",
      name: "Stripe",
      icon: CreditCard,
      color: "from-purple-600 to-indigo-600",
      description: "Credit & Debit Cards",
      fees: "2.9% + 30p per transaction",
      features: [
        "All major credit cards accepted",
        "Secure SSL encryption",
        "Instant payment confirmation",
        "Bank transfer support"
      ]
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: DollarSign,
      color: "from-blue-600 to-cyan-600",
      description: "PayPal Wallet & Cards",
      fees: "3.4% + 20p per transaction",
      features: [
        "PayPal wallet payments",
        "Card payments via PayPal",
        "Buyer protection included",
        "Quick checkout process"
      ]
    }
  ];

  const handleSelectMethod = async (methodId: string) => {
    try {
      setError("");
      setSelectedMethod(methodId);
      setLoading(true);

      // Simulate payment processing
      console.log(`💳 Processing ${methodId} payment of £${amount.toFixed(2)}...`);
      
      // Generate transaction ID
      const transactionId = `${methodId.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`✅ Payment completed: ${transactionId}`);
      onSelect(methodId, transactionId);
      
    } catch (err) {
      const errorMsg = `Payment failed: ` + (err as Error).message;
      setError(errorMsg);
      console.error("❌ Payment error:", err);
      setSelectedMethod(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Payment Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Choose your payment method:</strong> Both Stripe and PayPal are secure payment providers. Your payment information is protected with SSL encryption.
        </p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <Card 
              key={method.id}
              className={`transition-all cursor-pointer border-2 ${
                isSelected 
                  ? "border-green-500 shadow-lg" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <Badge className="mt-1 text-xs bg-gray-100 text-gray-700 border-gray-300">
                        {method.fees}
                      </Badge>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <ul className="text-xs text-gray-600 space-y-1">
                    {method.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleSelectMethod(method.id)}
                  disabled={loading || isSelected}
                  className={`w-full ${
                    isSelected 
                      ? "bg-green-600 hover:bg-green-700" 
                      : `bg-gradient-to-r ${method.color} hover:opacity-90`
                  } text-white`}
                >
                  {loading && selectedMethod === method.id ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </span>
                  ) : isSelected ? (
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Payment Complete
                    </span>
                  ) : (
                    `Pay £${amount.toFixed(2)} with ${method.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
        <h4 className="font-medium text-slate-900 mb-2">🔒 Security & Privacy</h4>
        <ul className="text-xs text-slate-600 space-y-1">
          <li>• All payments are encrypted with SSL technology</li>
          <li>• Your payment details are never stored on our servers</li>
          <li>• Both Stripe and PayPal are PCI DSS compliant</li>
          <li>• 24/7 fraud protection monitoring</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentOptions;
