import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Send, ChevronLeft, User, Package,
  Clock, CheckCircle, AlertCircle, Phone, Mail
} from "lucide-react";

const SellerMessageReply = () => {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [replyHistory, setReplyHistory] = useState<any[]>([]);

  // Simulated message data (in real app, this would come from database)
  const simulatedMessages: any = {
    '1': {
      id: 1,
      customer_name: "Maria Garcia",
      customer_email: "maria.garcia@email.com",
      message: "Hi! Is this product still available?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unread: true,
      product_id: 1,
      product_name: "Premium Wireless Headphones",
      replies: [
        {
          from: "customer",
          message: "Hi! Is this product still available?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    '2': {
      id: 2,
      customer_name: "Jose Santos",
      customer_email: "jose.santos@email.com",
      message: "Can you offer a discount for bulk orders?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      unread: true,
      product_id: 2,
      product_name: "Smart Fitness Watch",
      replies: [
        {
          from: "customer",
          message: "Can you offer a discount for bulk orders?",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  };

  useEffect(() => {
    loadMessage();
  }, [messageId]);

  const loadMessage = async () => {
    try {
      // In a real app, this would fetch from database
      const messageData = simulatedMessages[messageId || '1'];
      if (messageData) {
        setMessage(messageData);
        setReplyHistory(messageData.replies || []);
      } else {
        // Default message if not found
        setMessage({
          id: 1,
          customer_name: "Maria Garcia",
          customer_email: "maria.garcia@email.com",
          message: "Hi! Is this product still available?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          unread: true,
          product_id: 1,
          product_name: "Premium Wireless Headphones",
          replies: []
        });
        setReplyHistory([]);
      }
    } catch (error) {
      console.error("Error loading message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert("Please enter a reply message");
      return;
    }

    setSending(true);

    try {
      // Simulate sending reply (in real app, this would save to database)
      const newReply = {
        from: "seller",
        message: replyText,
        timestamp: new Date().toISOString()
      };

      setReplyHistory([...replyHistory, newReply]);
      setReplyText("");

      // Show success message
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Error sending reply. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const markAsResolved = () => {
    if (message) {
      setMessage({ ...message, unread: false });
      alert("Conversation marked as resolved");
      navigate("/dashboard/seller/messages");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Message not found</h2>
            <p className="text-slate-600 mb-6">The message you're looking for doesn't exist</p>
            <Link to="/dashboard/seller/messages">
              <Button variant="outline">Back to Messages</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard/seller/messages" className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Message Conversation</span>
            </Link>
            <div className="flex items-center space-x-2">
              {message.unread && (
                <Button variant="outline" size="sm" onClick={markAsResolved}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Conversation</h1>
          <p className="text-slate-600">
            {message.unread ? (
              <span className="flex items-center space-x-2">
                <Badge className="bg-orange-100 text-orange-700">Active</Badge>
                <span>This conversation is ongoing</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                <span>This conversation has been resolved</span>
              </span>
            )}
          </p>
        </div>

        {/* Customer Information Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Customer Name</p>
                <p className="font-medium text-slate-900">{message.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Email Address</p>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-600" />
                  <p className="font-medium text-slate-900">{message.customer_email}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-slate-600 mb-1">Product Inquiry</p>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-orange-600" />
                  <Link to={`/products/${message.product_id}`} className="text-orange-600 hover:underline font-medium">
                    {message.product_name}
                  </Link>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-slate-600 mb-1">First Contact</p>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <p className="text-slate-900">
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span>Conversation History</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {replyHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No conversation history yet</p>
              </div>
            ) : (
              replyHistory.map((reply, index) => (
                <div 
                  key={index} 
                  className={`flex ${reply.from === 'seller' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md ${reply.from === 'seller' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-900'} rounded-lg p-4`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {reply.from === 'customer' ? (
                        <>
                          <User className="w-4 h-4" />
                          <span className="font-medium text-sm">{message.customer_name}</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-medium text-sm">You</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm">{reply.message}</p>
                    <p className={`text-xs mt-2 ${reply.from === 'seller' ? 'text-white/70' : 'text-slate-500'}`}>
                      {new Date(reply.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Reply Form */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="w-5 h-5 text-green-600" />
              <span>Send Reply</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply to the customer..."
                rows={6}
                className="resize-none"
              />
              <p className="text-sm text-slate-500 mt-2">
                Be professional and helpful in your responses
              </p>
            </div>

            {/* Quick Replies */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Quick Replies:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Yes, this product is available!",
                  "Thank you for your interest. Yes, we can offer discounts for bulk orders.",
                  "Your order has been processed and will be shipped soon.",
                  "I'd be happy to help you with that. What would you like to know?",
                  "Thank you for your message. I'll get back to you shortly."
                ].map((quickReply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyText(quickReply)}
                  >
                    {quickReply.substring(0, 30)}...
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Link to="/dashboard/seller/messages">
                <Button variant="outline">
                  Cancel
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setReplyText("")}
                >
                  Clear
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                >
                  {sending ? "Sending..." : "Send Reply"}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerMessageReply;
