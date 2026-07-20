import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, Plus, Edit, Trash2, CheckCircle, XCircle, 
  TrendingUp, Globe, RefreshCw
} from "lucide-react";
import { loadCurrencies, formatPrice, invalidateCurrencyCache } from "@/lib/currency";
import db from "@/lib/shared/kliv-database.js";

const CurrencyManagement = () => {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCurrency, setEditingCurrency] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // New currency form
  const [newCurrency, setNewCurrency] = useState({
    code: "",
    name: "",
    symbol: "",
    exchange_rate: 1.0,
    display_order: 0
  });

  useEffect(() => {
    loadCurrenciesData();
  }, []);

  const loadCurrenciesData = async () => {
    setLoading(true);
    try {
      const data = await loadCurrencies();
      setCurrencies(data);
    } catch (error) {
      console.error("Error loading currencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrency = async (currency: any) => {
    setSaving(true);
    try {
      if (currency._row_id) {
        // Update existing currency
        await db.update("currencies", { _row_id: `eq.${currency._row_id}` }, {
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
          exchange_rate: currency.exchange_rate,
          is_active: currency.is_active,
          display_order: currency.display_order
        });
      } else {
        // Add new currency
        await db.insert("currencies", {
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
          exchange_rate: currency.exchange_rate,
          is_active: true,
          display_order: currency.display_order
        });
      }

      // Invalidate cache and reload
      invalidateCurrencyCache();
      await loadCurrenciesData();
      setEditingCurrency(null);
      setShowAddForm(false);
      setNewCurrency({
        code: "",
        name: "",
        symbol: "",
        exchange_rate: 1.0,
        display_order: 0
      });
    } catch (error) {
      console.error("Error saving currency:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCurrency = async (currencyId: number) => {
    if (!confirm("Are you sure you want to delete this currency?")) {
      return;
    }

    try {
      await db.delete("currencies", { _row_id: `eq.${currencyId}` });
      invalidateCurrencyCache();
      await loadCurrenciesData();
    } catch (error) {
      console.error("Error deleting currency:", error);
    }
  };

  const handleToggleActive = async (currency: any) => {
    try {
      await db.update("currencies", { _row_id: `eq.${currency._row_id}` }, {
        is_active: !currency.is_active
      });
      invalidateCurrencyCache();
      await loadCurrenciesData();
    } catch (error) {
      console.error("Error toggling currency:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading currencies...</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Admin Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <span className="font-medium">Currency Management</span>
            </div>
            <Button 
              variant="outline" 
              onClick={loadCurrenciesData}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Currency Management</h1>
            <p className="text-slate-600">Manage supported currencies and exchange rates</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <Plus className="mr-2 w-4 h-4" />
            Add Currency
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Active Currencies</p>
                  <p className="text-3xl font-bold">{currencies.filter(c => c.is_active).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Currencies</p>
                  <p className="text-3xl font-bold">{currencies.length}</p>
                </div>
                <Globe className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Base Currency</p>
                  <p className="text-3xl font-bold">PHP</p>
                </div>
                <DollarSign className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Exchange Rates</p>
                  <p className="text-3xl font-bold">Live</p>
                </div>
                <TrendingUp className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Currency Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Add New Currency</CardTitle>
              <CardDescription>Add a new currency to the marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency Code</Label>
                  <Input
                    placeholder="USD"
                    value={newCurrency.code}
                    onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency Name</Label>
                  <Input
                    placeholder="US Dollar"
                    value={newCurrency.name}
                    onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency Symbol</Label>
                  <Input
                    placeholder="$"
                    value={newCurrency.symbol}
                    onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exchange Rate (to PHP)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.018"
                    value={newCurrency.exchange_rate}
                    onChange={(e) => setNewCurrency({ ...newCurrency, exchange_rate: parseFloat(e.target.value) || 1.0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={newCurrency.display_order}
                    onChange={(e) => setNewCurrency({ ...newCurrency, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCurrency({ code: "", name: "", symbol: "", exchange_rate: 1.0, display_order: 0 });
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSaveCurrency(newCurrency)}
                  disabled={saving || !newCurrency.code || !newCurrency.name}
                  className="bg-gradient-to-r from-purple-500 to-purple-600"
                >
                  {saving ? "Saving..." : "Add Currency"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Currencies List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>All Currencies</CardTitle>
            <CardDescription>Manage supported marketplace currencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currencies.map((currency) => (
                <div key={currency._row_id} className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  {editingCurrency?._row_id === currency._row_id ? (
                    // Edit Mode
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Currency Code</Label>
                        <Input
                          value={editingCurrency.code}
                          onChange={(e) => setEditingCurrency({ ...editingCurrency, code: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Currency Name</Label>
                        <Input
                          value={editingCurrency.name}
                          onChange={(e) => setEditingCurrency({ ...editingCurrency, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Currency Symbol</Label>
                        <Input
                          value={editingCurrency.symbol}
                          onChange={(e) => setEditingCurrency({ ...editingCurrency, symbol: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Exchange Rate (to PHP)</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={editingCurrency.exchange_rate}
                          onChange={(e) => setEditingCurrency({ ...editingCurrency, exchange_rate: parseFloat(e.target.value) || 1.0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={editingCurrency.display_order}
                          onChange={(e) => setEditingCurrency({ ...editingCurrency, display_order: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingCurrency.is_active}
                          onChange={(e) => setEditingCurrency({ ...editingCurrency, is_active: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label>Active</Label>
                      </div>
                      <div className="flex justify-end space-x-2 sm:col-span-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingCurrency(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleSaveCurrency(editingCurrency)}
                          disabled={saving}
                          className="bg-gradient-to-r from-purple-500 to-purple-600"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                          {currency.symbol}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{currency.name}</h3>
                            <Badge className={currency.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                              {currency.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {currency.code === "PHP" && (
                              <Badge className="bg-purple-100 text-purple-700">
                                Base
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-1">Code: {currency.code}</p>
                          <p className="text-sm text-slate-600">
                            Exchange Rate: {formatPrice(currency.exchange_rate)} PHP = {currency.symbol}1.00
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCurrency(currency)}
                          title="Edit currency"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(currency)}
                          title={currency.is_active ? "Deactivate" : "Activate"}
                        >
                          {currency.is_active ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                        {currency.code !== "PHP" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCurrency(currency._row_id)}
                            title="Delete currency"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Store Currency Settings Info */}
        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Store Currency Settings</CardTitle>
            <CardDescription>Configure default currency for individual stores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Individual stores can be configured to use different default currencies based on their location. 
                Store owners can set their preferred currency in their store settings, and all product prices will be displayed in that currency.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/dashboard/admin/stores">
                <Button variant="outline" className="w-full">
                  Manage Store Currencies <DollarSign className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyManagement;
