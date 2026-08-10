// Notification System for ifudda Platform
// All notifications sent to admin email: info@unionmusicgroup.co.uk

const ADMIN_EMAIL = 'info@unionmusicgroup.co.uk';

export interface NotificationData {
  type: 'contact_form' | 'new_order' | 'payment_received' | 'withdrawal_request' | 'support_request';
  data: Record<string, any>;
}

/**
 * Send notification to admin email
 * This is a client-side implementation that would be connected to an edge function
 */
export async function sendNotification(type: NotificationData['type'], data: Record<string, any>): Promise<boolean> {
  try {
    console.log(`📧 Sending ${type} notification to ${ADMIN_EMAIL}:`, data);
    
    // In a real implementation, this would call an edge function
    // For now, we'll log it and simulate success
    console.log(`✅ Notification would be sent to ${ADMIN_EMAIL}`);
    console.log(`📋 Notification data:`, JSON.stringify(data, null, 2));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('❌ Notification sending failed:', error);
    return false;
  }
}

/**
 * Send contact form notification
 */
export async function sendContactFormNotification(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  return sendNotification('contact_form', {
    ...formData,
    timestamp: new Date().toISOString(),
    recipient: ADMIN_EMAIL
  });
}

/**
 * Send support request notification
 */
export async function sendSupportRequestNotification(formData: {
  name: string;
  email: string;
  category: string;
  message: string;
}): Promise<boolean> {
  return sendNotification('support_request', {
    ...formData,
    timestamp: new Date().toISOString(),
    recipient: ADMIN_EMAIL
  });
}

export { ADMIN_EMAIL };
