import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft, Plus, Trash2, Edit } from "lucide-react";

const Payments = () => {
  const navigate = useNavigate();

  const paymentMethods = [
    {
      _row_id: 1,
      type: "gcash",
      name: "GCash",
      number: "09172345678",
      is_default: true,
      logo: "🟱"
    },
    {
      _row_id: 2,
      type: "card",
      name: "Credit Card",
      number: "**** **** **** 4532",
      expiry: "12/25",
      is_default: false,
      logo: "💳"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AliazaStore</span>
            </Link>
            
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/customer")}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Methods</h1>
            <p className="text-slate-600">Manage your payment options</p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method._row_id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                      {method.logo}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{method.name}</h3>
                        {method.is_default && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-slate-600">{method.number}</p>
                      {method.expiry && <p className="text-sm text-slate-500">Expires: {method.expiry}</p>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
          <CardHeader>
            <CardTitle>Accepted Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-2xl">🟱</span>
                <span className="text-sm font-medium">GCash</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-2xl">💳</span>
                <span className="text-sm font-medium">Credit Cards</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-2xl">🏦</span>
                <span className="text-sm font-medium">Bank Transfer</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-2xl">🅿️</span>
                <span className="text-sm font-medium">PayPal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;