import db from "@/lib/shared/kliv-database.js";

export interface Currency {
  _row_id: number;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  is_active: boolean;
  display_order: number;
}

// Currency cache
let currenciesCache: Currency[] | null = null;

/**
 * Load all active currencies
 */
export const loadCurrencies = async (): Promise<Currency[]> => {
  if (currenciesCache) {
    return currenciesCache;
  }
  
  try {
    const data = await db.query("currencies", {
      is_active: "eq.1",
      order: "display_order.asc"
    });
    currenciesCache = data;
    return data;
  } catch (error) {
    console.error("Error loading currencies:", error);
    return [];
  }
};

/**
 * Get currency by code
 */
export const getCurrency = async (code: string = "PHP"): Promise<Currency | null> => {
  try {
    const currencies = await loadCurrencies();
    return currencies.find(c => c.code === code) || null;
  } catch (error) {
    console.error("Error getting currency:", error);
    return null;
  }
};

/**
 * Format price with currency symbol (defaults to PHP)
 */
export const formatPrice = (
  price: number,
  currency?: Currency
): string => {
  // Default to PHP if no currency provided
  const symbol = currency?.symbol || "₱";
  const rate = currency?.exchange_rate || 1.0;
  
  // Convert to target currency if rate is available
  const convertedPrice = price * rate;
  
  // Format with appropriate decimal places
  const formattedPrice = convertedPrice.toFixed(2);
  
  return `${symbol}${formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

/**
 * Convert price between currencies
 */
export const convertPrice = (
  price: number,
  fromCurrency: string = "PHP",
  toCurrency: string = "USD"
): number => {
  // This would typically use real exchange rates
  // For now, using cached rates from database
  const rates: Record<string, number> = {
    PHP: 1.0,
    USD: 0.018,
    EUR: 0.016,
    GBP: 0.014,
    JPY: 2.65,
    AUD: 0.027,
    CAD: 0.025,
    SGD: 0.024,
    AED: 0.066,
    SAR: 0.068
  };
  
  const fromRate = rates[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || 1.0;
  
  // Convert to PHP first, then to target currency
  const priceInPHP = price / fromRate;
  return priceInPHP * toRate;
};

/**
 * Get currency symbol by code
 */
export const getCurrencySymbol = (currencyCode: string = "PHP"): string => {
  const symbols: Record<string, string> = {
    PHP: "₱",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$",
    AED: "د.إ",
    SAR: "ر.س"
  };
  
  return symbols[currencyCode] || "₱";
};

/**
 * Format price range (for products with price ranges)
 */
export const formatPriceRange = (
  minPrice: number,
  maxPrice: number,
  currency?: Currency
): string => {
  const symbol = currency?.symbol || "₱";
  const rate = currency?.exchange_rate || 1.0;
  
  const convertedMin = minPrice * rate;
  const convertedMax = maxPrice * rate;
  
  const formattedMin = convertedMin.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedMax = convertedMax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return `${symbol}${formattedMin} - ${symbol}${formattedMax}`;
};

// Invalidate cache when currencies are updated
export const invalidateCurrencyCache = () => {
  currenciesCache = null;
};
