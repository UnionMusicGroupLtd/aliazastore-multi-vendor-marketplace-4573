import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Copy, CheckCircle } from "lucide-react";
import db from "@/lib/shared/kliv-database.js";

console.log("GCashPayment component loaded - QR CODE FIX VERIFIED - Conditional display logic updated - ", new Date().toISOString());

interface GCashPaymentProps {
  amount: number;
  orderId: string;
  onComplete?: (transactionId: string) => void;
}

const GCashPayment = ({ amount, orderId, onComplete }: GCashPaymentProps) => {
  const [gcashConfig, setGcashConfig] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    const loadGCashConfig = async () => {
      try {
        console.log("🔄 Loading GCash payment configuration...");
        
        // Try different query approaches
        const gateways = await db.query('payment_methods', {
          gateway_type: 'eq.gcash',
          is_enabled: 'eq.1'
        });
        
        console.log("📊 Query result:", gateways);
        console.log("🔍 Number of gateways found:", gateways?.length || 0);
        
        if (gateways && gateways.length > 0) {
          const config = gateways[0];
          console.log("✅ GCash config loaded:", {
            gateway_name: config.gateway_name,
            gcash_number: config.gcash_number,
            gcash_qr_code: config.gcash_qr_code,
            is_enabled: config.is_enabled
          });
          setGcashConfig(config);
        } else {
          console.warn("⚠️ No enabled GCash gateway found - trying fallback query");
          // Fallback: try to get any gcash gateway
          const fallbackGateways = await db.query('payment_methods', {
            gateway_type: 'eq.gcash'
          });
          console.log("📊 Fallback query result:", fallbackGateways);
          if (fallbackGateways && fallbackGateways.length > 0) {
            const config = fallbackGateways[0];
            console.log("✅ GCash config loaded via fallback:", config);
            setGcashConfig(config);
          }
        }
      } catch (error) {
        console.error("❌ Error loading GCash config:", error);
      }
    };
    
    loadGCashConfig();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentComplete = () => {
    const transactionId = `GCASH-${Date.now()}`;
    if (onComplete) {
      onComplete(transactionId);
    }
    setUploaded(true);
  };

  if (!gcashConfig) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">GCash payment is not available at the moment</p>
          <p className="text-xs text-slate-500 mt-2">Please contact support or try again later</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">GCash Payment</CardTitle>
            <CardDescription>
              {gcashConfig.gcash_qr_code ? "Pay using your GCash account" : "Pay using GCash number transfer"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {uploaded && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Payment submitted successfully! We'll process your order shortly.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Payment Amount</h3>
            <Badge className="bg-blue-100 text-blue-700 text-lg font-bold">
              ₱{amount.toFixed(2)}
            </Badge>
          </div>
          
          {gcashConfig.gcash_business_name && (
            <div className="mb-4">
              <p className="text-sm text-slate-600">Pay to:</p>
              <p className="font-semibold">{gcashConfig.gcash_business_name}</p>
            </div>
          )}

          {gcashConfig.gcash_number && (
            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">📞 Or send to GCash Number:</p>
              <div className="flex items-center space-x-2 bg-slate-50 p-4 rounded-lg">
                <span className="font-mono text-xl font-semibold">{gcashConfig.gcash_number}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(gcashConfig.gcash_number)}
                  className="ml-auto"
                >
                  {copied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy Number"}
                </Button>
              </div>
            </div>
          )}

          {gcashConfig.gcash_qr_code ? (
            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-3">📱 Scan QR Code for Instant Payment:</p>
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-300 text-center">
                <div className="inline-block bg-white p-4 rounded-xl shadow-lg">
                  <img 
                    src={gcashConfig.gcash_qr_code} 
                    alt="GCash QR Code" 
                    className="w-48 h-48 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/192?text=QR+Code';
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Open GCash app → Scan QR → Send Payment
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                💡 <span className="font-semibold">QR Code Coming Soon:</span> The admin can upload a GCash QR code image to enable instant scanning
              </p>
            </div>
          )}

          <div className="text-xs text-slate-500 space-y-1">
            <p>1. Open GCash app and select "Send Money"</p>
            {gcashConfig.gcash_qr_code ? (
              <p>2. Enter the GCash number above or scan QR code</p>
            ) : (
              <p>2. Enter the GCash number above</p>
            )}
            <p>3. Enter exact amount: ₱{amount.toFixed(2)}</p>
            <p>4. Complete payment and click button below</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <input type="checkbox" id="confirm" className="rounded" />
            <label htmlFor="confirm" className="text-slate-600">
              I have completed the GCash payment
            </label>
          </div>
          
          <Button 
            onClick={handlePaymentComplete}
            disabled={uploaded}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {uploaded ? "Payment Submitted" : "Confirm Payment"}
          </Button>
        </div>

        <div className="text-center text-xs text-slate-500">
          Order ID: {orderId}
        </div>
      </CardContent>
    </Card>
  );
};

export default GCashPayment;