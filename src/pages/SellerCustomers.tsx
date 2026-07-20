import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Users, TrendingUp, ShoppingBag, 
  ChevronRight, Star, Award
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import db from "@/lib/shared/kliv-database.js";
import auth from "@/lib/shared/kliv-auth.js";

const SellerCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const currentUser = await auth.getUser();
      if (!currentUser) return;

      // Load seller's store
      const stores = await db.query("stores", {
        owner_uuid: `eq.${currentUser.userUuid}`
      });
      
      if (stores.length > 0) {
        // Get orders to extract unique customers
        const orders = await db.query("orders", {
          store_id: `eq.${stores[0]._row_id}`,
          order: "_created_at.desc"
        });

        // Extract unique customers
        const uniqueCustomers = new Map();
        orders.forEach(order => {
          if (!uniqueCustomers.has(order.customer_email)) {
            uniqueCustomers.set(order.customer_email, {
              email: order.customer_email,
              name: order.customer_name || "Customer",
              totalOrders: 0,
              totalSpent: 0,
              lastOrder: order._created_at
            });
          }
          const customer = uniqueCustomers.get(order.customer_email);
          customer.totalOrders += 1;
          customer.totalSpent += parseFloat(order.total) || 0;
        });

        setCustomers(Array.from(uniqueCustomers.values()));
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading customers...</p>
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
            <Link to="/dashboard/seller" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Seller Customers</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Customer Insights</h1>
          <p className="text-slate-600">{customers.length} total customers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">{customers.length}</div>
              <div className="text-sm text-slate-600">Total Customers</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(0) : 0}
              </div>
              <div className="text-sm text-slate-600">Total Revenue</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {customers.length > 0 ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(0) : 0}
              </div>
              <div className="text-sm text-slate-600">Avg. Customer Value</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Customers List */}
        {filteredCustomers.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No customers found</h2>
              <p className="text-slate-600">
                {searchQuery ? "Try adjusting your search" : "You haven't had any customers yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                      {customer.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    {customer.totalOrders >= 5 && (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <Award className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-1">{customer.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{customer.email}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Orders</span>
                      <span className="font-semibold">{customer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Spent</span>
                      <span className="font-semibold text-orange-600">{formatPrice(customer.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Order</span>
                      <span className="text-slate-500">
                        {new Date(customer.lastOrder).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    View Details
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCustomers;
