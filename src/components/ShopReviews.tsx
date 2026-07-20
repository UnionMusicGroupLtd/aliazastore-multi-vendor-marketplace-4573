import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, MessageSquare, Send, CheckCircle, AlertCircle
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import db from "@/lib/shared/kliv-database.js";

interface ShopReviewsProps {
  storeId: number;
  storeName: string;
}

const ShopReviews = ({ storeId, storeName }: ShopReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    review_text: "",
    customer_name: "",
    customer_email: ""
  });
  
  const [newComplaint, setNewComplaint] = useState({
    complaint_type: "product_quality",
    subject: "",
    description: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    order_id: ""
  });

  useEffect(() => {
    loadReviews();
  }, [storeId]);

  const loadReviews = async () => {
    try {
      const reviewsData = await db.query("shop_reviews", {
        store_id: `eq.${storeId}`,
        is_visible: "eq.1",
        admin_approved: "eq.1",
        order: "_created_at.desc",
        limit: "50"
      });
      
      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const reviewData = {
        store_id: storeId,
        customer_id: `cust_${Date.now()}`,
        customer_name: newReview.customer_name,
        customer_email: newReview.customer_email,
        rating: newReview.rating,
        title: newReview.title,
        review_text: newReview.review_text,
        is_verified_purchase: 0,
        is_visible: 1,
        admin_approved: 0 // Requires admin approval
      };
      
      await db.insert("shop_reviews", reviewData);
      
      setSubmitted(true);
      setNewReview({
        rating: 5,
        title: "",
        review_text: "",
        customer_name: "",
        customer_email: ""
      });
      
      setTimeout(() => {
        setShowReviewModal(false);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleSubmitComplaint = async () => {
    try {
      const complaintData = {
        store_id: storeId,
        customer_id: `cust_${Date.now()}`,
        customer_name: newComplaint.customer_name,
        customer_email: newComplaint.customer_email,
        customer_phone: newComplaint.customer_phone,
        complaint_type: newComplaint.complaint_type,
        subject: newComplaint.subject,
        description: newComplaint.description,
        order_id: newComplaint.order_id || null,
        status: "pending",
        priority: "normal"
      };
      
      await db.insert("shop_complaints", complaintData);
      
      setSubmitted(true);
      setNewComplaint({
        complaint_type: "product_quality",
        subject: "",
        description: "",
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        order_id: ""
      });
      
      setTimeout(() => {
        setShowComplaintModal(false);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  const getStarRating = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
            onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>See what customers are saying about {storeName}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>Share your experience with {storeName}</DialogDescription>
                  </DialogHeader>
                  
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Review Submitted!</h3>
                      <p className="text-slate-600">Your review is awaiting admin approval.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Your Rating *</Label>
                        <div className="mt-2">
                          {getStarRating(newReview.rating, true, (rating) => 
                            setNewReview({ ...newReview, rating })
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Your Name *</Label>
                        <Input
                          value={newReview.customer_name}
                          onChange={(e) => setNewReview({ ...newReview, customer_name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label>Your Email *</Label>
                        <Input
                          type="email"
                          value={newReview.customer_email}
                          onChange={(e) => setNewReview({ ...newReview, customer_email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label>Review Title *</Label>
                        <Input
                          value={newReview.title}
                          onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                          placeholder="Great products!"
                        />
                      </div>
                      <div>
                        <Label>Your Review *</Label>
                        <Textarea
                          value={newReview.review_text}
                          onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                          placeholder="Share your experience..."
                          className="min-h-24"
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitReview}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                        disabled={!newReview.title || !newReview.review_text || !newReview.customer_name || !newReview.customer_email}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Review
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              <Dialog open={showComplaintModal} onOpenChange={setShowComplaintModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-red-600 hover:bg-red-700 text-white border-0">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    File Complaint
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>File a Complaint</DialogTitle>
                    <DialogDescription>Report an issue with {storeName}</DialogDescription>
                  </DialogHeader>
                  
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Complaint Filed!</h3>
                      <p className="text-slate-600">We will review your complaint shortly.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Complaint Type *</Label>
                        <Select 
                          value={newComplaint.complaint_type} 
                          onValueChange={(value) => setNewComplaint({ ...newComplaint, complaint_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product_quality">Product Quality</SelectItem>
                            <SelectItem value="shipping">Shipping</SelectItem>
                            <SelectItem value="customer_service">Customer Service</SelectItem>
                            <SelectItem value="payment">Payment</SelectItem>
                            <SelectItem value="fraud">Fraud</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Your Name *</Label>
                        <Input
                          value={newComplaint.customer_name}
                          onChange={(e) => setNewComplaint({ ...newComplaint, customer_name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label>Your Email *</Label>
                        <Input
                          type="email"
                          value={newComplaint.customer_email}
                          onChange={(e) => setNewComplaint({ ...newComplaint, customer_email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label>Your Phone *</Label>
                        <Input
                          type="tel"
                          value={newComplaint.customer_phone}
                          onChange={(e) => setNewComplaint({ ...newComplaint, customer_phone: e.target.value })}
                          placeholder="+63 912 345 6789"
                        />
                      </div>
                      <div>
                        <Label>Order ID (if applicable)</Label>
                        <Input
                          value={newComplaint.order_id}
                          onChange={(e) => setNewComplaint({ ...newComplaint, order_id: e.target.value })}
                          placeholder="ORD-2025-001"
                        />
                      </div>
                      <div>
                        <Label>Subject *</Label>
                        <Input
                          value={newComplaint.subject}
                          onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                          placeholder="Brief description of the issue"
                        />
                      </div>
                      <div>
                        <Label>Description *</Label>
                        <Textarea
                          value={newComplaint.description}
                          onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                          placeholder="Detailed description of your complaint..."
                          className="min-h-24"
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitComplaint}
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={!newComplaint.subject || !newComplaint.description || !newComplaint.customer_name || !newComplaint.customer_email || !newComplaint.customer_phone}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Complaint
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mt-1">
                {getStarRating(Math.round(averageRating))}
              </div>
              <p className="text-sm text-slate-600 mt-1">{reviews.length} reviews</p>
            </div>
            
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star as keyof typeof distribution];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600 w-8">{star} star</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._row_id} className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{review.customer_name}</h3>
                        {review.is_verified_purchase && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Verified Purchase</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {getStarRating(review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {review._created_at ? new Date(review._created_at * 1000).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900">{review.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{review.review_text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-slate-600 mb-4">Be the first to review {storeName}!</p>
            <Button onClick={() => setShowReviewModal(true)} className="bg-gradient-to-r from-blue-500 to-blue-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Write First Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShopReviews;