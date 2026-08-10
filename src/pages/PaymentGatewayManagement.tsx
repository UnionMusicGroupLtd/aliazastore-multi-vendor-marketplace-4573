import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CreditCard, DollarSign, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import db from "@/lib/shared/kliv-database.js";

const PaymentGatewayManagement = () => {
  const [gateways, setGateways] = useState<Array<{
    id: string;
    name: string;
    icon: any;
    color: string;
    enabled: boolean;
    publicKey?: string;
    secretKey: string;
    description: string;
    fees: string;
    clientId?: string;
  }>>([
    {
      id: "stripe",
      name: "Stripe",
      icon: CreditCard,
      color: "from-purple-600 to-indigo-600",
      enabled: false,
      publicKey: "",
      secretKey: "",
      description: "Credit/Debit cards and bank transfers",
      fees: "2.9% + 30p per transaction"
    },
    {
      id: "paypal",
      name: "PayPal", 
      icon: DollarSign,
      color: "from-blue-600 to-cyan-600",
      enabled: false,
      clientId: "",
      secretKey: "",
      description: "PayPal wallet and card payments",
      fees: "3.4% + 20p per transaction"
    }
  ]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    try {
      console.log("🔄 Loading payment gateways...");
      
      // Load Stripe
      const stripeResult = await db.query("payment_methods", { gateway_type: "eq.stripe" });
      const paypalResult = await db.query("payment_methods", { gateway_type: "eq.paypal" });

      const updatedGateways = [...gateways];
      
      if (stripeResult && stripeResult.length > 0) {
        const stripe = stripeResult[0] as any;
        updatedGateways[0] = {
          ...updatedGateways[0],
          enabled: stripe.is_enabled === 1,
          publicKey: stripe.public_key || "",
          secretKey: stripe.secret_key || ""
        };
        console.log("✅ Stripe loaded:", stripe);
      }

      if (paypalResult && paypalResult.length > 0) {
        const paypal = paypalResult[0] as any;
        updatedGateways[1] = {
          ...updatedGateways[1],
          enabled: paypal.is_enabled === 1,
          clientId: paypal.client_id || "",
          secretKey: paypal.secret_key || ""
        };
        console.log("✅ PayPal loaded:", paypal);
      }

      setGateways(updatedGateways);
    } catch (err) {
      console.error("❌ Error loading gateways:", err);
    }
  };

  const handleToggleGateway = async (gatewayId: string) => {
    try {
      setError("");
      setSuccess("");
      
      const gatewayIndex = gateways.findIndex(g => g.id === gatewayId);
      const gateway = gateways[gatewayIndex];
      const newEnabledState = !gateway.enabled;

      console.log(`🔄 ${gateway.name}: ${newEnabledState ? 'Enabling' : 'Disabling'}...`);

      // Check if gateway exists
      const existing = await db.query("payment_methods", { gateway_type: `eq.${gatewayId}` });
      
      if (existing && existing.length > 0) {
        // Update existing
        await db.update("payment_methods", { _row_id: `eq.${existing[0]._row_id}` }, {
          is_enabled: newEnabledState ? 1 : 0
        });
      } else {
        // Create new gateway
        await db.insert("payment_methods", {
          gateway_type: gatewayId,
          gateway_name: gateway.name,
          is_enabled: newEnabledState ? 1 : 0,
          public_key: gateway.publicKey || "",
          secret_key: gateway.secretKey || "",
          min_amount: 100,
          max_amount: 100000
        });
      }

      // Update local state
      const updatedGateways = [...gateways];
      updatedGateways[gatewayIndex] = {
        ...updatedGateways[gatewayIndex],
        enabled: newEnabledState
      };
      setGateways(updatedGateways);

      setSuccess(`✅ ${gateway.name} ${newEnabledState ? 'enabled' : 'disabled'} successfully!`);
      console.log(`✅ ${gateway.name} ${newEnabledState ? 'enabled' : 'disabled'}`);
      
    } catch (err) {
      const errorMsg = `Failed to toggle ${gatewayId}: ` + (err as Error).message;
      setError(errorMsg);
      console.error("❌ Toggle error:", err);
    }
  };

  const handleSaveConfig = async (gatewayId: string) => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const gateway = gateways.find(g => g.id === gatewayId);
      if (!gateway) return;

      console.log(`💾 Saving ${gateway.name} configuration...`);

      // Check if gateway exists
      const existing = await db.query("payment_methods", { gateway_type: `eq.${gatewayId}` });
      
      if (existing && existing.length > 0) {
        // Update existing
        await db.update("payment_methods", { _row_id: `eq.${existing[0]._row_id}` }, {
          public_key: gateway.publicKey || "",
          secret_key: gateway.secretKey || "",
          client_id: gateway.clientId || ""
        });
      } else {
        // Create new gateway
        await db.insert("payment_methods", {
          gateway_type: gatewayId,
          gateway_name: gateway.name,
          is_enabled: gateway.enabled ? 1 : 0,
          public_key: gateway.publicKey || "",
          secret_key: gateway.secretKey || "",
          client_id: gateway.clientId || "",
          min_amount: 100,
          max_amount: 100000
        });
      }

      setSuccess(`✅ ${gateway.name} configuration saved successfully!`);
      console.log(`✅ ${gateway.name} configuration saved`);
      
    } catch (err) {
      const errorMsg = `Save failed: ` + (err as Error).message;
      setError(errorMsg);
      console.error("❌ Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfig = async (gatewayId: string) => {
    try {
      setError("");
      setSuccess("");

      const gateway = gateways.find(g => g.id === gatewayId);
      if (!gateway) return;

      if (!confirm(`Are you sure you want to delete ${gateway.name} configuration?`)) {
        return;
      }

      console.log(`🗑️ Deleting ${gateway.name} configuration...`);

      // Delete gateway
      await db.delete("payment_methods", { gateway_type: `eq.${gatewayId}` });

      // Reset local state
      const gatewayIndex = gateways.findIndex(g => g.id === gatewayId);
      const updatedGateways = [...gateways];
      updatedGateways[gatewayIndex] = {
        ...updatedGateways[gatewayIndex],
        enabled: false,
        publicKey: "",
        secretKey: "",
        clientId: ""
      };
      setGateways(updatedGateways);

      setSuccess(`✅ ${gateway.name} configuration deleted successfully!`);
      console.log(`✅ ${gateway.name} configuration deleted`);
      
    } catch (err) {
      const errorMsg = `Delete failed: ` + (err as Error).message;
      setError(errorMsg);
      console.error("❌ Delete error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <span className="text-xl font-bold">Payment Gateway Management</span>
              <p className="text-sm text-slate-600">Configure Stripe and PayPal payment methods</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Success</p>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Payment Gateway Cards */}
        <div className="space-y-6">
          {gateways.map((gateway) => (
            <Card key={gateway.id} className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${gateway.color} rounded-xl flex items-center justify-center`}>
                      <gateway.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{gateway.name}</h3>
                      <p className="text-sm text-gray-600">{gateway.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{gateway.fees}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      gateway.enabled 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}>
                      {gateway.enabled ? "Enabled" : "Disabled"}
                    </span>
                    <Button
                      onClick={() => handleToggleGateway(gateway.id)}
                      variant={gateway.enabled ? "outline" : "default"}
                      className={gateway.enabled ? "border-red-300 text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                    >
                      {gateway.enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>

                {/* Configuration Fields */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Configuration</h4>
                  
                  {gateway.id === "stripe" && (
                    <>
                      <div>
                        <Label className="text-sm font-medium">Public Key</Label>
                        <Input
                          value={gateway.publicKey}
                          onChange={(e) => {
                            const updated = gateways.map(g => 
                              g.id === "stripe" ? {...g, publicKey: e.target.value} : g
                            );
                            setGateways(updated);
                          }}
                          placeholder="pk_test_..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Secret Key</Label>
                        <Input
                          value={gateway.secretKey}
                          onChange={(e) => {
                            const updated = gateways.map(g => 
                              g.id === "stripe" ? {...g, secretKey: e.target.value} : g
                            );
                            setGateways(updated);
                          }}
                          type="password"
                          placeholder="sk_test_..."
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}

                  {gateway.id === "paypal" && (
                    <>
                      <div>
                        <Label className="text-sm font-medium">Client ID</Label>
                        <Input
                          value={gateway.clientId}
                          onChange={(e) => {
                            const updated = gateways.map(g => 
                              g.id === "paypal" ? {...g, clientId: e.target.value} : g
                            );
                            setGateways(updated);
                          }}
                          placeholder="AXX..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Secret Key</Label>
                        <Input
                          value={gateway.secretKey}
                          onChange={(e) => {
                            const updated = gateways.map(g => 
                              g.id === "paypal" ? {...g, secretKey: e.target.value} : g
                            );
                            setGateways(updated);
                          }}
                          type="password"
                          placeholder="EKA..."
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => handleDeleteConfig(gateway.id)}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Configuration
                    </Button>
                    <Button
                      onClick={() => handleSaveConfig(gateway.id)}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Configuration
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📘 {gateway.name} Setup Instructions</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    {gateway.id === "stripe" && (
                      <>
                        <li>Log in to your Stripe Dashboard</li>
                        <li>Go to "Developers" → "API keys"</li>
                        <li>Copy your "Publishable key" (starts with pk_)</li>
                        <li>Copy your "Secret key" (starts with sk_)</li>
                        <li>Paste both keys above and save configuration</li>
                      </>
                    )}
                    {gateway.id === "paypal" && (
                      <>
                        <li>Log in to your PayPal Developer Dashboard</li>
                        <li>Create a new REST API app</li>
                        <li>Copy your "Client ID" (starts with AXX)</li>
                        <li>Copy your "Secret" (starts with EKA)</li>
                        <li>Paste both credentials above and save configuration</li>
                      </>
                    )}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-3">💳 Payment Gateway Information</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p><strong>Stripe:</strong> Accepts credit/debit cards and bank transfers. Standard 2.9% + 30p per transaction.</p>
              <p><strong>PayPal:</strong> Accepts PayPal wallet payments and cards. Standard 3.4% + 20p per transaction.</p>
              <p className="text-slate-400 mt-4">💡 Tip: Enable multiple payment methods to give customers more options and increase conversions.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentGatewayManagement;
