import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Star, MessageSquare, Search, Trash2, Eye, EyeOff, 
  CheckCircle, AlertTriangle, Store
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import db from "@/lib/shared/kliv-database.js";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'approve' | 'hide' | 'delete' | null;
    review: any;
  }>({ open: false, type: null, review: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsData, storesData] = await Promise.all([
        db.query("shop_reviews", {
          order: "_created_at.desc",
          limit: "500"
        }),
        db.query("stores", {
          status: "eq.active",
          limit: "100"
        })
      ]);
      
      // Enrich reviews with store information
      const enrichedReviews = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const store = (storesData || []).find((s: any) => s._row_id === review.store_id);
          return {
            ...review,
            store_name: store?.name || "Unknown Store",
            store_icon: store?.icon || "🏪"
          };
        })
      );
      
      setReviews(enrichedReviews);
      setStores(storesData || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchQuery || 
      review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.store_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "visible" && review.is_visible) ||
      (statusFilter === "hidden" && !review.is_visible) ||
      (statusFilter === "pending" && !review.admin_approved);
    
    const matchesRating = ratingFilter === "all" || review.rating === parseInt(ratingFilter);
    const matchesStore = selectedStore === "all" || review.store_id === parseInt(selectedStore);
    
    return matchesSearch && matchesStatus && matchesRating && matchesStore;
  });

  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating === 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusBadge = (review: any) => {
    if (!review.admin_approved) {
      return <Badge className="bg-orange-100 text-orange-700">Pending Approval</Badge>;
    }
    if (!review.is_visible) {
      return <Badge className="bg-gray-100 text-gray-700">Hidden</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700">Visible</Badge>;
  };

  const handleReviewAction = async () => {
    try {
      const { type, review } = actionDialog;
      
      if (type === 'delete') {
        await db.delete("shop_reviews", { _row_id: `eq.${review._row_id}` });
      } else if (type === 'approve') {
        await db.update("shop_reviews", { _row_id: `eq.${review._row_id}` }, {
          admin_approved: 1,
          is_visible: 1
        });
      } else if (type === 'hide') {
        await db.update("shop_reviews", { _row_id: `eq.${review._row_id}` }, {
          is_visible: 0
        });
      }
      
      setActionDialog({ open: false, type: null, review: null });
      loadData();
    } catch (error) {
      console.error("Error handling review action:", error);
    }
  };

  const getStats = () => {
    const totalReviews = reviews.length;
    const visibleReviews = reviews.filter(r => r.is_visible && r.admin_approved).length;
    const pendingReviews = reviews.filter(r => !r.admin_approved).length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (totalReviews || 1);
    
    return { totalReviews, visibleReviews, pendingReviews, avgRating };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard/admin" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">AliazaStore</span>
                  <Badge className="ml-2 bg-purple-100 text-purple-700">Admin</Badge>
                </div>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-semibold">Review Management</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold">{stats.totalReviews}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Visible Reviews</p>
                  <p className="text-3xl font-bold">{stats.visibleReviews}</p>
                </div>
                <Eye className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold">{stats.pendingReviews}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Average Rating</p>
                  <p className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</p>
                </div>
                <Star className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-filter">Status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="rating-filter">Rating:</Label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="store-filter">Store:</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Stores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map(store => (
                      <SelectItem key={store._row_id} value={store._row_id.toString()}>
                        {store.icon} {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Shop Reviews</CardTitle>
            <CardDescription>Manage customer reviews for all shops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review._row_id} className="p-6 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{review.customer_name}</h3>
                          {review.is_verified_purchase && (
                            <Badge className="bg-green-100 text-green-700 text-xs">Verified Purchase</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{review.customer_email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-slate-500">Reviewing:</span>
                          <span className="text-sm font-medium">{review.store_icon} {review.store_name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-1">
                        {getStarRating(review.rating)}
                      </div>
                      {getStatusBadge(review)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-slate-900">{review.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{review.review_text}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      {review._created_at ? new Date(review._created_at * 1000).toLocaleDateString() : "N/A"}
                    </p>
                    <div className="flex items-center space-x-2">
                      {!review.admin_approved && (
                        <Button
                          size="sm"
                          onClick={() => setActionDialog({ open: true, type: 'approve', review })}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {review.admin_approved && review.is_visible && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActionDialog({ open: true, type: 'hide', review })}
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          Hide
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setActionDialog({ open: true, type: 'delete', review })}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredReviews.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No reviews found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'delete' ? 'Delete Review' : 
               actionDialog.type === 'approve' ? 'Approve Review' : 'Hide Review'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'delete' ? 
                'Are you sure you want to delete this review? This action cannot be undone.' :
                actionDialog.type === 'approve' ?
                'This will make the review visible on the shop page.' :
                'This will hide the review from the shop page while keeping it in the database.'}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.review && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-1 mb-2">
                {getStarRating(actionDialog.review.rating)}
              </div>
              <h4 className="font-medium">{actionDialog.review.title}</h4>
              <p className="text-sm text-slate-600 mt-1">{actionDialog.review.review_text}</p>
              <p className="text-xs text-slate-500 mt-2">By {actionDialog.review.customer_name}</p>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setActionDialog({ open: false, type: null, review: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReviewAction}
              className={actionDialog.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {actionDialog.type === 'delete' ? 'Delete' : 
               actionDialog.type === 'approve' ? 'Approve' : 'Hide'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewManagement;