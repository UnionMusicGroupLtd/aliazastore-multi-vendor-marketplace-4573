import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, Search, Send, Clock, Check,
  ChevronRight, User, ArrowLeft
} from "lucide-react";
import db from "@/lib/shared/kliv-database.js";
import auth from "@/lib/shared/kliv-auth.js";

const SellerMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const user = await auth.getUser();
      if (!user) {
        setMessages([]);
        return;
      }

      // Load real messages from database
      const sellerMessages = await db.query('seller_messages', {
        seller_uuid: `eq.${user.userUuid}`,
        order: 'created_at.desc'
      });

      if (!sellerMessages) {
        console.error("Error loading messages:");
        setMessages([]);
        return;
      }

      // Transform database data to match expected format
      const transformedMessages = sellerMessages.map((msg: any) => ({
        id: msg._row_id,
        customer_name: msg.customer_name,
        customer_email: msg.customer_email,
        message: msg.message,
        timestamp: new Date(msg.created_at * 1000).toISOString(),
        unread: msg.unread === 1,
        product_id: msg.product_id,
        product_name: msg.product_name,
        reply_history: msg.reply_history ? JSON.parse(msg.reply_history) : []
      }));

      setMessages(transformedMessages);

      // Auto-create sample messages if empty (for new users)
      if (transformedMessages.length === 0) {
        if (user.userUuid) {
          await createSampleMessages(user.userUuid);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const createSampleMessages = async (sellerUuid: string) => {
    const sampleMessages = [
      {
        seller_uuid: sellerUuid,
        customer_name: "Maria Garcia",
        customer_email: "maria.garcia@email.com",
        message: "Hi! Is this product still available?",
        unread: 1,
        product_id: 1,
        product_name: "Premium Wireless Headphones",
        reply_history: JSON.stringify([])
      },
      {
        seller_uuid: sellerUuid,
        customer_name: "Jose Santos",
        customer_email: "jose.santos@email.com",
        message: "Can you offer a discount for bulk orders?",
        unread: 1,
        product_id: 2,
        product_name: "Smart Fitness Watch",
        reply_history: JSON.stringify([])
      },
      {
        seller_uuid: sellerUuid,
        customer_name: "Ana Reyes",
        customer_email: "ana.reyes@email.com",
        message: "Thank you for the quick shipping!",
        unread: 0,
        product_id: 3,
        product_name: "Designer Leather Bag",
        reply_history: JSON.stringify([])
      }
    ];

    for (const msg of sampleMessages) {
      try {
        await db.insert('seller_messages', msg);
      } catch (error) {
        console.error("Error creating sample message:", error);
      }
    }

    // Reload messages after creating samples
    await loadMessages();
  };

  const markAsRead = async (messageId: number) => {
    try {
      const user = await auth.getUser();
      if (!user) return;

      await db.update('seller_messages', 
        { _row_id: `eq.${messageId}`, seller_uuid: `eq.${user.userUuid}` },
        { 
          unread: 0,
          read_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000)
        }
      );

      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, unread: false } : msg
      ));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = await auth.getUser();
      if (!user) return;

      const unreadMessages = messages.filter(msg => msg.unread);
      
      for (const msg of unreadMessages) {
        await db.update('seller_messages',
          { _row_id: `eq.${msg.id}`, seller_uuid: `eq.${user.userUuid}` },
          {
            unread: 0,
            read_at: Math.floor(Date.now() / 1000),
            updated_at: Math.floor(Date.now() / 1000)
          }
        );
      }

      // Update local state
      setMessages(messages.map(msg => ({ ...msg, unread: false })));
    } catch (error) {
      console.error("Error marking all messages as read:", error);
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
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/dashboard/seller")}
                className="hover:bg-orange-50"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Link to="/dashboard/seller" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Seller Messages</span>
              </Link>
            </div>
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

        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 relative mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search messages..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {messages.filter(m => m.unread).length > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="flex items-center space-x-2"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
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
                        <Link 
                          to={`/dashboard/seller/messages/reply/${message.id}`}
                          onClick={() => message.unread && markAsRead(message.id)}
                        >
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
