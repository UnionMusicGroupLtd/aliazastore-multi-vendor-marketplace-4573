/**
 * Subscription Status Checker Utility
 * Checks if a store has an active subscription/trial and what features are available
 */

export interface SubscriptionStatus {
  status: 'trial' | 'active' | 'trial_ended' | 'subscription_expired' | 'suspended' | 'cancelled';
  canAddProducts: boolean;
  canReceiveOrders: boolean;
  storeVisible: boolean;
  showSubscribeNotice: boolean;
  icon: any;
  color: string;
  message: string;
  actionText: string;
  daysRemaining: number;
  trialEndDate?: Date;
  subscriptionEndDate?: Date;
}

export const checkSubscriptionStatus = (storeData: any): SubscriptionStatus => {
  if (!storeData) {
    return {
      status: 'trial',
      canAddProducts: true,
      canReceiveOrders: true,
      storeVisible: true,
      showSubscribeNotice: false,
      icon: null,
      color: "bg-purple-100 text-purple-700",
      message: "No store data available",
      actionText: "Subscribe Now",
      daysRemaining: 0
    };
  }

  const now = new Date();
  const trialEnd = storeData.trial_end_date ? new Date(storeData.trial_end_date) : null;
  const subscriptionEnd = storeData.subscription_end_date ? new Date(storeData.subscription_end_date) : null;

  // Import icons dynamically to avoid circular dependencies
  const icons = {
    Gift: 'Gift',
    CheckCircle: 'CheckCircle', 
    Lock: 'Lock',
    Clock: 'Clock',
    XCircle: 'XCircle',
    AlertCircle: 'AlertCircle'
  };

  // Check if store is suspended or cancelled
  if (storeData.subscription_status === "suspended" || storeData.subscription_status === "cancelled") {
    return {
      status: "suspended",
      canAddProducts: false,
      canReceiveOrders: false,
      storeVisible: false,
      showSubscribeNotice: true,
      icon: icons.XCircle,
      color: "bg-red-100 text-red-700",
      message: "Your subscription has been suspended. Subscribe to continue selling.",
      actionText: "Reactivate Subscription",
      daysRemaining: 0
    };
  }

  // Check trial status
  if (trialEnd && trialEnd > now) {
    const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: "trial",
      canAddProducts: true,
      canReceiveOrders: true,
      storeVisible: true,
      showSubscribeNotice: daysRemaining <= 3, // Show notice in last 3 days
      icon: icons.Gift,
      color: "bg-purple-100 text-purple-700",
      message: `Free Trial - ${daysRemaining} days remaining`,
      actionText: "Subscribe Now",
      daysRemaining,
      trialEndDate: trialEnd
    };
  }

  // Check if trial ended
  if (trialEnd && trialEnd <= now && !subscriptionEnd) {
    return {
      status: "trial_ended",
      canAddProducts: false,
      canReceiveOrders: false,
      storeVisible: false,
      showSubscribeNotice: true,
      icon: icons.Lock,
      color: "bg-red-100 text-red-700",
      message: "Trial ended. Subscribe to continue selling.",
      actionText: "Subscribe Now",
      daysRemaining: 0,
      trialEndDate: trialEnd
    };
  }

  // Check subscription status
  if (subscriptionEnd && subscriptionEnd > now) {
    const daysRemaining = Math.ceil((subscriptionEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: "active",
      canAddProducts: true,
      canReceiveOrders: true,
      storeVisible: true,
      showSubscribeNotice: daysRemaining <= 3, // Show notice in last 3 days
      icon: icons.CheckCircle,
      color: "bg-green-100 text-green-700",
      message: `Subscription active - ${daysRemaining} days remaining`,
      actionText: "Manage Subscription",
      daysRemaining,
      subscriptionEndDate: subscriptionEnd
    };
  }

  // Check if subscription expired
  if (subscriptionEnd && subscriptionEnd <= now) {
    return {
      status: "subscription_expired",
      canAddProducts: false,
      canReceiveOrders: false,
      storeVisible: false,
      showSubscribeNotice: true,
      icon: icons.Clock,
      color: "bg-red-100 text-red-700",
      message: "Subscription expired. Subscribe to continue selling.",
      actionText: "Renew Subscription",
      daysRemaining: 0,
      subscriptionEndDate: subscriptionEnd
    };
  }

  // Default to trial active (for new stores without dates set)
  return {
    status: "trial",
    canAddProducts: true,
    canReceiveOrders: true,
    storeVisible: true,
    showSubscribeNotice: false,
    icon: icons.Gift,
    color: "bg-purple-100 text-purple-700",
    message: "Free trial period",
    actionText: "Subscribe Now",
    daysRemaining: 14
  };
};

/**
 * Check if store can add new products
 */
export const canAddProducts = (storeData: any): boolean => {
  const status = checkSubscriptionStatus(storeData);
  return status.canAddProducts;
};

/**
 * Check if store can receive new orders
 */
export const canReceiveOrders = (storeData: any): boolean => {
  const status = checkSubscriptionStatus(storeData);
  return status.canReceiveOrders;
};

/**
 * Check if store should be visible to customers
 */
export const isStoreVisible = (storeData: any): boolean => {
  const status = checkSubscriptionStatus(storeData);
  return status.storeVisible;
};

/**
 * Get days remaining in trial/subscription
 */
export const getDaysRemaining = (storeData: any): number => {
  const status = checkSubscriptionStatus(storeData);
  return status.daysRemaining;
};

/**
 * Check if subscription notice should be shown
 */
export const shouldShowSubscribeNotice = (storeData: any): boolean => {
  const status = checkSubscriptionStatus(storeData);
  return status.showSubscribeNotice;
};