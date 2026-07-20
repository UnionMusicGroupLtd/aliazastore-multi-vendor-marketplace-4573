import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, DollarSign, CheckCircle } from "lucide-react";
import db from "@/lib/shared/kliv-database.js";

interface DeliveryOption {
  _row_id: number;
  courier_name: string;
  courier_code: string;
  base_fee: number;
  per_km_fee: number;
  estimated_days: string;
  custom_fee?: number;
}

interface DeliverySelectionProps {
  shopOwnerId: number;
  orderAmount: number;
  onDeliverySelect: (option: DeliveryOption, fee: number) => void;
  selectedOption?: DeliveryOption;
}

const DeliverySelection = ({ shopOwnerId, orderAmount, onDeliverySelect, selectedOption }: DeliverySelectionProps) => {
  const [deliveryOptions, setDeliveryOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DeliveryOption | null>(selectedOption || null);

  useEffect(() => {
    loadDeliveryOptions();
  }, [shopOwnerId]);

  const loadDeliveryOptions = async () => {
    try {
      setLoading(true);
      
      // Load delivery options that are enabled for this shop owner
      const settings = await db.query("shop_owner_delivery_settings", { 
        shop_owner_id: `eq.${shopOwnerId}`,
        enabled: "eq.1"
      });
      
      if (settings && settings.length > 0) {
        // Get the delivery option details
        const optionIds = settings.map((s: any) => s.delivery_option_id);
        const options = await db.query("delivery_options", {
          _row_id: `in.(${optionIds.join(',')})`,
          is_active: "eq.1"
        });
        
        // Enrich with custom fees and settings
        const enrichedOptions = (options || []).map((option: any) => {
          const setting = settings.find((s: any) => s.delivery_option_id === option._row_id);
          return {
            ...option,
            custom_fee: setting?.custom_fee || null,
            minimum_order: setting?.minimum_order || 0,
            free_delivery_above: setting?.free_delivery_above || 0,
            special_instructions: setting?.special_instructions || ""
          };
        });
        
        setDeliveryOptions(enrichedOptions);
      } else {
        // If no custom settings, load all active delivery options (platform defaults)
        const defaultOptions = await db.query("delivery_options", { 
          is_active: "eq.1",
          order: "base_fee.asc"
        });
        setDeliveryOptions(defaultOptions || []);
      }
    } catch (error) {
      console.error("Error loading delivery options:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = (option: any) => {
    // Use custom fee if set, otherwise use base fee
    const baseFee = option.custom_fee || option.base_fee;
    return baseFee;
  };

  const checkFreeDelivery = (option: any) => {
    if (option.free_delivery_above && orderAmount >= option.free_delivery_above) {
      return true;
    }
    return false;
  };

  const handleSelect = (option: any) => {
    setSelected(option);
    const fee = checkFreeDelivery(option) ? 0 : calculateFee(option);
    onDeliverySelect(option, fee);
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading delivery options...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Delivery Options</CardTitle>
        <CardDescription>Select your preferred delivery method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {deliveryOptions.length === 0 ? (
          <div className="text-center py-8">
            <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No delivery options available</p>
          </div>
        ) : (
          deliveryOptions.map((option) => {
            const fee = calculateFee(option);
            const isFree = checkFreeDelivery(option);
            const isSelected = selected?._row_id === option._row_id;
            
            return (
              <div
                key={option._row_id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-blue-500" : "bg-slate-100"
                    }`}>
                      <Truck className={`w-6 h-6 ${isSelected ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{option.courier_name}</h3>
                        {isFree && (
                          <Badge className="bg-green-100 text-green-700">FREE</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{option.estimated_days}</span>
                      </div>
                      
                      {option.special_instructions && (
                        <p className="text-xs text-slate-500 mt-1">{option.special_instructions}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {isFree ? (
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 mr-2">Free delivery</span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold">₱{fee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {option.minimum_order > 0 && orderAmount < option.minimum_order && (
                      <p className="text-xs text-orange-600 mt-1">
                        Min. order: ₱{option.minimum_order.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {selected && (
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Selected delivery:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{selected.courier_name}</span>
                <Badge className="bg-blue-100 text-blue-700">
                  {checkFreeDelivery(selected) ? "FREE" : `₱${calculateFee(selected).toFixed(2)}`}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliverySelection;