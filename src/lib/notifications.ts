import functions from '@/lib/shared/kliv-functions.js';

/**
 * Send notification emails to admin for platform events
 */
export const sendNotification = async (notificationType: string, data: any) => {
  try {
    const result = await functions.post('send-notification', {
      notificationType,
      data
    });
    
    console.log('✅ Notification sent successfully:', result);
    return result;
  } catch (error: any) {
    console.error('❌ Failed to send notification:', error);
    // Don't throw error - we don't want to block user actions if notifications fail
    return { success: false, error: error.message };
  }
};

/**
 * Send new order notification
 */
export const notifyNewOrder = async (orderData: any) => {
  return await sendNotification('new_order', {
    orderId: orderData.orderId,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone,
    totalAmount: orderData.totalAmount,
    shippingAddress: orderData.shippingAddress,
    city: orderData.city,
    postalCode: orderData.postalCode,
    paymentMethod: orderData.paymentMethod,
    orderItems: orderData.orderItems,
    orderDate: new Date().toISOString()
  });
};

/**
 * Send new shop registration notification
 */
export const notifyNewShopRegistration = async (shopData: any) => {
  return await sendNotification('new_shop_registration', {
    storeName: shopData.storeName,
    ownerName: shopData.ownerName,
    ownerEmail: shopData.ownerEmail,
    ownerPhone: shopData.ownerPhone,
    businessType: shopData.businessType,
    category: shopData.category,
    storeDescription: shopData.storeDescription,
    registrationDate: new Date().toISOString()
  });
};

/**
 * Send payment received notification
 */
export const notifyPaymentReceived = async (paymentData: any) => {
  return await sendNotification('payment_received', {
    paymentType: paymentData.paymentType,
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    paymentMethod: paymentData.paymentMethod,
    customerName: paymentData.customerName,
    customerEmail: paymentData.customerEmail,
    orderId: paymentData.orderId,
    paymentDate: new Date().toISOString()
  });
};

/**
 * Send withdrawal request notification
 */
export const notifyWithdrawalRequest = async (withdrawalData: any) => {
  return await sendNotification('withdrawal_request', {
    storeName: withdrawalData.storeName,
    ownerName: withdrawalData.ownerName,
    ownerEmail: withdrawalData.ownerEmail,
    amount: withdrawalData.amount,
    withdrawalMethod: withdrawalData.withdrawalMethod,
    methodDetails: withdrawalData.methodDetails,
    requestId: withdrawalData.requestId,
    requestDate: new Date().toISOString()
  });
};