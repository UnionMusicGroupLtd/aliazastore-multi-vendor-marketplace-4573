import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog-simple";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Download, FileText, BarChart3, Users, Store, ShoppingCart, 
  DollarSign, Package, CheckCircle, X
} from "lucide-react";

interface ReportGenerationModalProps {
  open: boolean;
  onClose: () => void;
}

const ReportGenerationModal = ({ open, onClose }: ReportGenerationModalProps) => {
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [format, setFormat] = useState<string>("pdf");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const reportTypes = [
    { 
      id: "overview", 
      name: "Platform Overview", 
      description: "Comprehensive platform statistics and trends",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600"
    },
    { 
      id: "sales", 
      name: "Sales Report", 
      description: "Revenue, orders, and transaction analysis",
      icon: DollarSign,
      color: "from-green-500 to-green-600"
    },
    { 
      id: "users", 
      name: "User Analytics", 
      description: "User growth, engagement, and demographics",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "stores", 
      name: "Store Performance", 
      description: "Store metrics, products, and performance",
      icon: Store,
      color: "from-orange-500 to-orange-600"
    },
    { 
      id: "orders", 
      name: "Order Analysis", 
      description: "Order trends, fulfillment, and delivery",
      icon: ShoppingCart,
      color: "from-pink-500 to-pink-600"
    },
    { 
      id: "products", 
      name: "Product Insights", 
      description: "Product performance, categories, and trends",
      icon: Package,
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  const dateRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
    { value: "all", label: "All time" }
  ];

  const formats = [
    { value: "pdf", label: "PDF Document" },
    { value: "csv", label: "CSV Spreadsheet" },
    { value: "json", label: "JSON Data" }
  ];

  const handleGenerate = async () => {
    if (!selectedReportType) {
      return;
    }

    try {
      setGenerating(true);
      
      // Simulate report generation (in real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGenerated(true);
      
      // Simulate download (in real app, this would trigger actual download)
      const reportData = {
        type: selectedReportType,
        dateRange,
        format,
        generatedAt: new Date().toISOString(),
        data: generateMockReportData(selectedReportType)
      };
      
      console.log("Generated Report:", reportData);
      
      // Create download link
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AliazaStore_${selectedReportType}_report_${dateRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setGenerating(false);
    }
  };

  const generateMockReportData = (type: string) => {
    // Mock data for demonstration
    const mockData = {
      overview: {
        totalUsers: 15420,
        totalStores: 324,
        totalProducts: 45678,
        totalOrders: 8934,
        totalRevenue: 234567,
        growthRate: 18
      },
      sales: {
        revenue: 234567,
        orders: 8934,
        averageOrderValue: 26.25,
        topCategories: ["Electronics", "Fashion", "Home"],
        growthTrend: "up"
      },
      users: {
        newUsers: 1245,
        activeUsers: 8900,
        retentionRate: 85,
        topDemographics: ["25-34", "35-44", "18-24"]
      },
      stores: {
        totalStores: 324,
        activeStores: 298,
        newStores: 45,
        topPerformingCategories: ["Electronics", "Fashion", "Beauty"]
      },
      orders: {
        totalOrders: 8934,
        pendingOrders: 234,
        completedOrders: 8420,
        averageFulfillmentTime: 2.5
      },
      products: {
        totalProducts: 45678,
        activeProducts: 42156,
        outOfStock: 1234,
        topCategories: ["Electronics", "Fashion", "Home & Garden"]
      }
    };
    
    return mockData[type as keyof typeof mockData] || {};
  };

  const handleClose = () => {
    onClose();
    // Reset state after closing
    setTimeout(() => {
      setSelectedReportType("");
      setDateRange("30d");
      setFormat("pdf");
      setGenerated(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full h-[100dvh] sm:w-auto sm:h-auto sm:max-w-2xl sm:max-h-[calc(100vh-4rem)] sm:overflow-y-auto sm:rounded-lg sm:border bg-white sm:shadow-lg overflow-y-auto flex flex-col">
        <DialogHeader className="flex-shrink-0 px-4 pt-6 pb-2 sm:px-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <DialogTitle className="text-lg sm:text-xl">Generate Platform Report</DialogTitle>
              <DialogDescription className="text-sm">
                Create comprehensive reports for platform analytics and insights
              </DialogDescription>
            </div>
            <button
              onClick={handleClose}
              className="sm:hidden absolute right-4 top-6 rounded-full p-2 bg-gray-100 hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-4 pb-24 sm:px-6 sm:pb-6 space-y-4"> {/* Add padding at bottom for action buttons */}
          {/* Report Type Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Report Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reportTypes.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedReportType === report.id
                      ? "ring-2 ring-purple-500 bg-purple-50"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedReportType(report.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <report.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm">{report.name}</h4>
                        <p className="text-xs text-slate-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Options */}
          {selectedReportType && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((fmt) => (
                        <SelectItem key={fmt.value} value={fmt.value}>
                          {fmt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Report Summary */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-2">Report Summary</h4>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-600">Report Type:</span>
                          <Badge className="bg-purple-100 text-purple-700">
                            {reportTypes.find(r => r.id === selectedReportType)?.name}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-600">Format:</span>
                          <Badge className="bg-blue-100 text-blue-700">
                            {formats.find(f => f.value === format)?.label}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-600">Period:</span>
                          <Badge className="bg-green-100 text-green-700">
                            {dateRanges.find(d => d.value === dateRange)?.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mobile Success Message */}
          {generated && (
            <div className="sm:hidden fixed bottom-20 left-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-center space-x-2 z-50">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Report generated successfully!</span>
            </div>
          )}

          {/* Actions - Fixed at bottom on mobile */}
          <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 border-t gap-3 fixed bottom-0 left-0 right-0 bg-white px-4 py-4 sm:static sm:bg-transparent sm:px-0 sm:py-4 z-50 shadow-2xl sm:shadow-none">
            <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto h-12 sm:h-auto">
              Cancel
            </Button>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {generated && (
                <div className="flex items-center space-x-1 text-green-600 text-sm mr-2 hidden sm:flex">
                  <CheckCircle className="w-4 h-4" />
                  <span>Report generated successfully!</span>
                </div>
              )}
              <Button
                onClick={handleGenerate}
                disabled={!selectedReportType || generating}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 w-full sm:w-auto h-12 sm:h-auto"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate & Download
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportGenerationModal;