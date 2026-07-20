import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, Search, Send, Clock, Check,
  ChevronRight, User
} from "lucide-react";
import db from "@/lib/shared/kliv-database.js";
import auth from "@/lib/shared/kliv-auth.js";

const SellerMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      // Simulated messages data
      const simulatedMessages = [
        {
          id: 1,
          customer_name: "Maria Garcia",
          customer_email: "maria.garcia@email.com",
          message: "Hi! Is this product still available?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          unread: true,
          product_id: 1,
          product_name: "Premium Wireless Headphones"
        },
        {
          id: 2,
          customer_name: "Jose Santos",
          customer_email: "jose.santos@email.com",
          message: "Can you offer a discount for bulk orders?",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          unread: true,
          product_id: 2,
          product_name: "Smart Fitness Watch"
        },
        {
          id: 3,
          customer_name: "Ana Reyes",
          customer_email: "ana.reyes@email.com",
          message: "Thank you for the quick shipping!",
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          unread: false,
          product_id: 3,
          product_name: "Designer Leather Bag"
        },
        {
          id: 4,
          customer_name: "Carlos Mendoza",
          customer_email: "carlos.mendoza@email.com",
          message: "What's the warranty period for this item?",
          timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          unread: false,
          product_id: 4,
          product_name: "Organic Skincare Set"
        },
        {
          id: 5,
          customer_name: "Luz Fernandez",
          customer_email: "luz.fernandez@email.com",
          message: "Do you ship to provincial areas?",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          unread: true,
          product_id: 1,
          product_name: "Premium Wireless Headphones"
        }
      ];
      setMessages(simulatedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => 
    message.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading messages...</p>
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
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Seller Messages</span>
            </Link>
            <Badge className="bg-orange-500 text-white">
              {messages.filter(m => m.unread).length} unread
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Customer Messages</h1>
          <p className="text-slate-600">{messages.length} total conversations</p>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search messages..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No messages found</h2>
              <p className="text-slate-600">
                {searchQuery ? "Try adjusting your search" : "No customer messages yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card key={message.id} className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm ${message.unread ? 'border-l-4 border-l-orange-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-slate-900">{message.customer_name}</h3>
                          {message.unread && (
                            <Badge className="bg-orange-100 text-orange-700">New</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-slate-500 text-sm">
                          <Clock className="w-3 h-3" />
                          {new Date(message.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2">{message.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          Re: <Link to={`/products/${message.product_id}`} className="text-orange-600 hover:underline">{message.product_name}</Link>
                        </div>
                        <Link to={`/dashboard/seller/messages/reply/${message.id}`}>
                          <Button variant="outline" size="sm">
                            Reply
                            <ChevronRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerMessages;
