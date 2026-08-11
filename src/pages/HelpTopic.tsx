import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, MessageCircle } from "lucide-react";

const HelpTopic = () => {
  const { slug } = useParams<{ slug: string }>();

  // Help topic content database
  const topicContent: Record<string, {
    title: string;
    category: string;
    content: string[];
    relatedTopics?: Array<{ title: string; slug: string }>;
  }> = {
    "track-my-order": {
      title: "How to Track My Order",
      category: "Buying & Orders",
      content: [
        "To track your order, follow these simple steps:",
        "",
        "1. **Log in to your account** - Visit the website and sign in with your credentials",
        "2. **Go to My Orders** - Navigate to 'My Account' > 'Orders' or click the cart icon",
        "3. **Find your order** - Look for the order you want to track in your order history",
        "4. **Click 'Track Order'** - Each order has a 'Track Order' button that shows real-time updates",
        "5. **View tracking details** - See current status, estimated delivery date, and tracking number",
        "",
        "**Order Status Meanings:**",
        "- *Processing*: Your order is being prepared",
        "- *Shipped*: Your order is on the way",
        "- *Out for Delivery*: Your order will arrive today",
        "- *Delivered*: Your order has been delivered",
        "",
        "If you don't see tracking updates within 24 hours of shipment, please contact our support team."
      ],
      relatedTopics: [
        { title: "Return or Refund Request", slug: "return-or-refund-request" },
        { title: "Delivery Delay", slug: "delivery-delay" },
        { title: "Wrong Item Received", slug: "wrong-item-received" }
      ]
    },
    "return-or-refund-request": {
      title: "Return or Refund Request",
      category: "Buying & Orders",
      content: [
        "We offer a **2-5 day return policy** for most items. Here's how to request a return or refund:",
        "",
        "**Eligibility for Returns:**",
        "- Items must be unused and in original packaging",
        "- Return request must be made within 2-5 days of delivery",
        "- Certain items (personal care products) may not be eligible for return due to hygiene reasons",
        "",
        "**How to Request a Return:**",
        "1. **Go to My Orders** - Log in and navigate to your order history",
        "2. **Select the order** - Find the order containing the item you want to return",
        "3. **Click 'Request Return'** - This button is available for eligible items",
        "4. **Select a reason** - Choose why you're returning the item from the dropdown",
        "5. **Submit request** - Our team will review your request within 24-48 hours",
        "",
        "**Refund Process:**",
        "- Once approved, return instructions will be sent to your email",
        "- Refunds are processed within **5-10 business days** after we receive the returned item",
        "- Refunds are issued to the original payment method",
        "",
        "**Still Need Help?**",
        "Contact our support team through live chat or the contact form for assistance with your return."
      ],
      relatedTopics: [
        { title: "Track My Order", slug: "track-my-order" },
        { title: "Payment Failed", slug: "payment-failed" },
        { title: "Wrong Item Received", slug: "wrong-item-received" }
      ]
    },
    "payment-failed": {
      title: "Payment Failed",
      category: "Buying & Orders",
      content: [
        "If your payment failed during checkout, here's what to do:",
        "",
        "**Common Reasons for Payment Failure:**",
        "- Insufficient funds in your account",
        "- Incorrect card details or expiration date",
        "- Card declined by bank (security reasons)",
        "- Network connectivity issues",
        "- Payment gateway timeout",
        "",
        "**What to Do When Payment Fails:**",
        "1. **Check your payment details** - Verify card number, expiry, and CVV are correct",
        "2. **Try alternative payment method** - We accept Stripe and PayPal",
        "3. **Contact your bank** - Sometimes banks block online transactions for security",
        "4. **Wait a few minutes** - Temporary network issues can resolve themselves",
        "5. **Try again** - Most payment failures are temporary",
        "",
        "**If Payment Keeps Failing:**",
        "- Try using a different card or payment method",
        "- Clear your browser cache and cookies",
        "- Try using a different browser or device",
        "- Contact our support team for assistance",
        "",
        "**Is My Payment Safe?**",
        "Yes! We use secure payment gateways (Stripe & PayPal) and never store your card details. Failed payments are never charged to your account."
      ],
      relatedTopics: [
        { title: "Track My Order", slug: "track-my-order" },
        { title: "Return or Refund Request", slug: "return-or-refund-request" }
      ]
    },
    "wrong-item-received": {
      title: "Wrong Item Received",
      category: "Buying & Orders",
      content: [
        "If you received the wrong item, we apologize and will make it right!",
        "",
        "**What to Do:**",
        "1. **Check your order** - Verify what you ordered vs what you received",
        "2. **Take photos** - Photos of the incorrect item help us resolve issues faster",
        "3. **Contact us immediately** - Use live chat or the contact form to report the issue",
        "4. **Keep the packaging** - Don't throw away anything until the issue is resolved",
        "",
        "**How We'll Fix It:**",
        "- We'll send you the correct item at no additional cost",
        "- You can keep the wrong item (if it's of similar or lesser value)",
        "- Or we'll arrange return pickup for the wrong item",
        "- Full refund if the correct item is unavailable",
        "",
        "**Timeframe:**",
        "- We resolve wrong-item issues within 24-48 hours",
        "- Correct items are shipped within 1-2 business days",
        "- Express shipping provided for urgent replacements",
        "",
        "**Prevention for Future Orders:**",
        "We review all wrong-item reports to improve our picking and packing accuracy."
      ],
      relatedTopics: [
        { title: "Return or Refund Request", slug: "return-or-refund-request" },
        { title: "Track My Order", slug: "track-my-order" }
      ]
    },
    "delivery-delay": {
      title: "Delivery Delay",
      category: "Buying & Orders",
      content: [
        "We understand waiting for your order is frustrating. Here's what to know about delivery delays:",
        "",
        "**UK Delivery Timeframes:**",
        "- Standard Delivery: 3-5 business days",
        "- Express Delivery: 1-2 business days",
        "- Next Day Delivery: 1 business day (when available)",
        "",
        "**Common Delay Reasons:**",
        "- High order volume during sale periods",
        "- Weather conditions affecting courier services",
        "- Incorrect or incomplete address details",
        "- Failed delivery attempts (no one available to sign)",
        "- Customs delays (for international orders)",
        "",
        "**What to Do About Delays:**",
        "1. **Track your order** - Check the latest status in 'My Orders'",
        "2. **Check tracking details** - See where your package is in transit",
        "3. **Contact the courier** - Sometimes they can provide more specific information",
        "4. **Wait a bit longer** - Most delays resolve within 1-2 additional days",
        "",
        "**When to Contact Us:**",
        "- If your order hasn't moved in 3+ days",
        "- If estimated delivery date has passed",
        "- If tracking shows 'delivered' but you haven't received it",
        "",
        "We'll work with the courier to resolve the issue and may offer compensation for significant delays."
      ],
      relatedTopics: [
        { title: "Track My Order", slug: "track-my-order" },
        { title: "Return or Refund Request", slug: "return-or-refund-request" }
      ]
    },
    "cancel-order": {
      title: "Cancel Order",
      category: "Buying & Orders",
      content: [
        "Need to cancel your order? Here's what you need to know:",
        "",
        "**Cancellation Policy:**",
        "- Orders can be cancelled within **1 hour** of placing them",
        "- After 1 hour, orders begin processing and cannot be cancelled",
        "- Once shipped, orders cannot be cancelled (use return process instead)",
        "",
        "**How to Cancel:**",
        "1. **Act quickly** - Go to 'My Orders' immediately",
        "2. **Find your order** - Look for the most recent order",
        "3. **Click 'Cancel Order'** - This button disappears after 1 hour",
        "4. **Confirm cancellation** - You'll receive a confirmation email",
        "",
        "**If You Can't Cancel:**",
        "- **Order processing**: Wait for delivery and initiate a return",
        "- **Already shipped**: Use our return process once received",
        "- **Need urgent help**: Contact support via live chat",
        "",
        "**Refund Timeline:**",
        "- Cancellations are refunded within 3-5 business days",
        "- Refunds go to the original payment method",
        "- You'll receive an email when refund is processed"
      ],
      relatedTopics: [
        { title: "Return or Refund Request", slug: "return-or-refund-request" },
        { title: "Track My Order", slug: "track-my-order" }
      ]
    },
    "login-issues": {
      title: "Login Issues",
      category: "Account Management",
      content: [
        "Having trouble logging in? Here are solutions to common login problems:",
        "",
        "**Can't Log In?**",
        "1. **Check your credentials** - Ensure email and password are correct",
        "2. **Reset your password** - Use 'Forgot Password' link on login page",
        "3. **Clear browser cache** - Old login data can cause issues",
        "4. **Try different browser** - Chrome, Firefox, or Edge work best",
        "5. **Check caps lock** - Passwords are case-sensitive",
        "",
        "**Account Locked?**",
        "- Too many failed login attempts will temporarily lock your account",
        "- Wait 15 minutes before trying again",
        "- Or use 'Forgot Password' to reset",
        "",
        "**Social Login Issues:**",
        "- If you signed up via Google/Facebook, use the same method to log in",
        "- Link your email in settings for password login access",
        "",
        "**Still Can't Log In?**",
        "- Contact our support team via live chat",
        "- Provide your email address and describe the issue",
        "- We'll help you regain access within 24 hours"
      ],
      relatedTopics: [
        { title: "Password Reset", slug: "password-reset" },
        { title: "Account Security", slug: "account-security" }
      ]
    },
    "password-reset": {
      title: "Password Reset",
      category: "Account Management",
      content: [
        "Need to reset your password? Follow these steps:",
        "",
        "**How to Reset Your Password:**",
        "1. **Go to the login page** - Click 'Sign In' in the header",
        "2. **Click 'Forgot Password?'** - This link is below the password field",
        "3. **Enter your email** - Use the email address associated with your account",
        "4. **Check your email** - You'll receive a password reset link within minutes",
        "5. **Create new password** - Click the link and set a strong new password",
        "6. **Log in** - Use your new password to access your account",
        "",
        "**Email Not Arriving?**",
        "- Check your spam/junk folder",
        "- Wait up to 10 minutes for delivery",
        "- Ensure you entered the correct email address",
        "- Try requesting another reset email",
        "",
        "**Password Requirements:**",
        "- Minimum 8 characters",
        "- At least one uppercase letter",
        "- At least one number",
        "- At least one special character (!@#$%^&*)",
        "",
        "**Security Tips:**",
        "- Use a unique password for your account",
        "- Don't reuse passwords from other sites",
        "- Consider using a password manager"
      ],
      relatedTopics: [
        { title: "Login Issues", slug: "login-issues" },
        { title: "Account Security", slug: "account-security" }
      ]
    },
    "update-profile": {
      title: "Update Profile",
      category: "Account Management",
      content: [
        "Keep your account information up to date for the best experience:",
        "",
        "**How to Update Your Profile:**",
        "1. **Log in to your account** - Go to the website and sign in",
        "2. **Access Account Settings** - Click your name/avatar, select 'Settings'",
        "3. **Edit your information** - Update name, email, phone, address",
        "4. **Save changes** - Click 'Save' to apply updates",
        "",
        "**What You Can Update:**",
        "- **Personal Information**: Name, date of birth, gender",
        "- **Contact Details**: Email address, phone number",
        "- **Addresses**: Shipping and billing addresses",
        "- **Preferences**: Email notifications, marketing preferences",
        "",
        "**Email Address Changes:**",
        "- You'll need to verify your new email address",
        "- A confirmation email will be sent to the new address",
        "- Old email will remain active until verified",
        "",
        "**Why Keep Your Profile Updated?**",
        "- Ensures accurate delivery of orders",
        "- Important account communications reach you",
        "- Personalized recommendations based on your preferences"
      ],
      relatedTopics: [
        { title: "Account Security", slug: "account-security" },
        { title: "Close Account", slug: "close-account" }
      ]
    },
    "close-account": {
      title: "Close Account",
      category: "Account Management",
      content: [
        "We're sorry to see you go! Here's what you need to know about closing your account:",
        "",
        "**Before Closing Your Account:**",
        "- Complete any pending orders",
        "- Download or save any order history you need",
        "- Use any remaining store credits or rewards",
        "- Update email subscriptions if you want to keep receiving marketing emails",
        "",
        "**How to Close Your Account:**",
        "1. **Log in to your account**",
        "2. **Go to Account Settings** - Navigate to 'Settings' from your profile",
        "3. **Find 'Close Account'** - This option is at the bottom of the settings page",
        "4. **Read the information** - Review what happens when you close your account",
        "5. **Confirm closure** - You'll need to enter your password to confirm",
        "",
        "**What Happens When You Close Your Account:**",
        "- You'll be logged out immediately",
        "- Your account data will be deleted within 30 days",
        "- You'll lose access to order history and account features",
        "- Email preferences will be unsubscribed",
        "",
        "**Can I Reopen My Account?**",
        "- Yes! You can create a new account anytime",
        "- However, your previous account data won't be restored",
        "- Order history from closed accounts is not recoverable"
      ],
      relatedTopics: [
        { title: "Update Profile", slug: "update-profile" },
        { title: "Account Security", slug: "account-security" }
      ]
    },
    "email-verification": {
      title: "Email Verification",
      category: "Account Management",
      content: [
        "Email verification helps secure your account and ensures you receive important communications.",
        "",
        "**Why Verify Your Email?**",
        "- **Security**: Confirms you own the email address",
        "- **Account Access**: Some features require verified email",
        "- **Order Confirmations**: Ensures you receive order updates",
        "- **Password Reset**: Required for password recovery",
        "",
        "**How to Verify Your Email:**",
        "1. **Check your inbox** - Look for an email from ifudda",
        "2. **Click the verification link** - This link expires in 24 hours",
        "3. **Confirmation** - You'll see a success message after clicking",
        "",
        "**Email Not Received?**",
        "- Check your spam/junk folder",
        "- Add noreply@ifudda.com to your contacts",
        "- Request a new verification email from settings",
        "- Ensure you entered the correct email address",
        "",
        "**Verification Link Expired?**",
        "- Request a new verification email from account settings",
        "- Links expire after 24 hours for security",
        "",
        "**Already Verified?**",
        "- You'll see a verified badge in your account settings",
        "- No further action needed"
      ],
      relatedTopics: [
        { title: "Login Issues", slug: "login-issues" },
        { title: "Account Security", slug: "account-security" }
      ]
    },
    "account-security": {
      title: "Account Security",
      category: "Account Management",
      content: [
        "Protecting your account is important to us. Here are security best practices:",
        "",
        "**Password Security:**",
        "- Use a strong, unique password for your account",
        "- Don't reuse passwords from other websites",
        "- Change your password periodically (every 3-6 months)",
        "- Never share your password with anyone",
        "- Use a password manager to generate and store passwords",
        "",
        "**Two-Factor Authentication (2FA):**",
        "- Enable 2FA in account settings for extra security",
        "- Requires both password and a code sent to your phone",
        "- Highly recommended for all accounts",
        "",
        "**Recognize Phishing Attempts:**",
        "- We'll never ask for your password via email",
        "- Check email sender addresses carefully",
        "- Don't click suspicious links in emails",
        "- Verify website URLs before entering credentials",
        "",
        "**Secure Browsing:**",
        "- Always ensure the URL starts with https://",
        "- Look for the padlock icon in your browser",
        "- Avoid using public Wi-Fi for sensitive transactions",
        "- Log out after using shared devices",
        "",
        "**What We Do to Protect You:**",
        "- Industry-standard encryption for all data",
        "- Regular security audits and updates",
        "- Payment information never stored on our servers",
        "- 24/7 monitoring for suspicious activity"
      ],
      relatedTopics: [
        { title: "Password Reset", slug: "password-reset" },
        { title: "Login Issues", slug: "login-issues" }
      ]
    },
    "product-information": {
      title: "Product Information",
      category: "Product Information",
      content: [
        "Find detailed information about our products:",
        "",
        "**Where to Find Product Details:**",
        "- **Product Page** - Full description, specifications, and images",
        "- **Customer Reviews** - Real feedback from other customers",
        "- **Q&A Section** - Questions answered by our community and staff",
        "",
        "**Product Information Includes:**",
        "- **Detailed Description** - Features, benefits, and usage",
        "- **Specifications** - Size, materials, technical details",
        "- **Ingredients/Materials** - Full disclosure for safety",
        "- **Usage Instructions** - How to use the product safely",
        "- **Safety Warnings** - Important precautions",
        "- **Country of Origin** - Where the product was manufactured",
        "",
        "**How to Get More Information:**",
        "- Use the product Q&A section to ask questions",
        "- Contact our support team via live chat",
        "- Check the product reviews for customer experiences",
        "- Download product manuals (when available)",
        "",
        "**Product Accuracy:**",
        "- We strive to provide accurate and complete information",
        "- Details are regularly reviewed and updated",
        "- Report any discrepancies to our support team"
      ],
      relatedTopics: [
        { title: "Stock Availability", slug: "stock-availability" },
        { title: "Product Quality", slug: "product-quality" }
      ]
    },
    "stock-availability": {
      title: "Stock Availability",
      category: "Product Information",
      content: [
        "Check product availability and stock status:",
        "",
        "**Stock Status Indicators:**",
        "- **In Stock** - Item is available and ready to ship",
        "- **Low Stock** - Limited quantity available (order soon!)",
        "- **Out of Stock** - Currently unavailable, restocking soon",
        "- **Discontinued** - No longer available, will not restock",
        "",
        "**How to Check Stock:**",
        "1. **Visit the product page** - Stock status shown near price",
        "2. **Add to cart** - If out of stock, this option will be disabled",
        "3. **Select quantity** - Maximum quantity reflects available stock",
        "",
        "**Back-in-Stock Notifications:**",
        "- Click 'Notify Me' on out-of-stock products",
        "- Enter your email address",
        "- Receive email notification when item is back in stock",
        "- First-come, first-served when restocked",
        "",
        "**Pre-Order Items:**",
        "- Some items can be ordered before they're in stock",
        "- Estimated shipping date shown on product page",
        "- You'll be charged at time of purchase",
        "- Shipped as soon as stock becomes available",
        "",
        "**Reservations:**",
        "- Items in your cart are reserved for 30 minutes",
        "- After 30 minutes, items return to available stock",
        "- Complete checkout promptly to secure your items"
      ],
      relatedTopics: [
        { title: "Product Information", slug: "product-information" },
        { title: "Track My Order", slug: "track-my-order" }
      ]
    },
    "product-quality": {
      title: "Product Quality",
      category: "Product Information",
      content: [
        "We're committed to offering only high-quality products:",
        "",
        "**Quality Standards:**",
        "- All products meet UK safety regulations",
        "- CE certification for electronic products",
        "- Materials tested for safety and durability",
        "- Regular quality inspections of incoming stock",
        "",
        "**Authentic Products:**",
        "- We source directly from manufacturers or authorized distributors",
        "- No counterfeit or replica products",
        "- All products are genuine and authentic",
        "- Proof of authenticity available upon request",
        "",
        "**Quality Issues:**",
        "- **Defective products?** - Contact us for immediate replacement",
        "- **Not as described?** - Return for full refund",
        "- **Damaged in transit?** - We'll replace at no cost",
        "- **Quality concerns?** - Report via product review or contact form",
        "",
        "**Quality Assurance Process:**",
        "- Pre-shipment inspection of all orders",
        "- Customer feedback reviewed regularly",
        "- Issues reported to suppliers for improvement",
        "- Underperforming products discontinued",
        "",
        "**Your Feedback Matters:**",
        "- Leave reviews about product quality",
        "- Report quality issues via our contact form",
        "- Help us maintain high standards"
      ],
      relatedTopics: [
        { title: "Return or Refund Request", slug: "return-or-refund-request" },
        { title: "Product Information", slug: "product-information" }
      ]
    },
    "age-verification": {
      title: "Age Verification",
      category: "Product Information",
      content: [
        "Age verification is required to access our adult wellness products:",
        "",
        "**Why Age Verification?**",
        "- Legal requirement for adult products in the UK",
        "- Compliance with UK regulations (Video Recordings Act 1984)",
        "- Protecting minors from age-restricted content",
        "- Responsible retail practices",
        "",
        "**How Age Verification Works:**",
        "1. **Age confirmation** - You'll confirm you're 18+ before accessing the site",
        "2. **Delivery verification** - Couriers may check ID upon delivery",
        "3. **Account verification** - Payment methods may be age-verified",
        "",
        "**Delivery Age Check:**",
        "- UK law requires ID check for age-restricted deliveries",
        "- Have a valid ID ready (passport, driving license)",
        "- Someone 18+ must be available to receive the delivery",
        "- Failed ID checks result in return to sender",
        "",
        "**Accepted Forms of ID:**",
        "- Passport (UK or international)",
        "- UK Driving License (provisional or full)",
        "- EU National Identity Card",
        "- PASS card from the Proof of Age Standards Scheme",
        "",
        "**Privacy:**",
        "- Verification data is processed securely",
        "- No ID details stored beyond verification period",
        "- GDPR compliant verification processes"
      ],
      relatedTopics: [
        { title: "Account Security", slug: "account-security" },
        { title: "Trust & Safety", slug: "trust-safety" }
      ]
    },
    "discreet-packaging": {
      title: "Discreet Packaging",
      category: "Product Information",
      content: [
        "Your privacy is important to us. Here's how we ensure discreet delivery:",
        "",
        "**Packaging Standards:**",
        "- **Plain outer packaging** - No logos or product names visible",
        "- **Neutral description** - Customs label describes as 'health products'",
        "- **Secure sealing** - Tamper-evident but not obvious",
        "- **Return address** - Shows company name, not product type",
        "",
        "**What's Visible on Package:**",
        "- Your address and return address",
        "- Shipping label and tracking barcode",
        "- Courier branding (normal courier labels)",
        "- No indication of contents or product category",
        "",
        "**Label Information:**",
        "- Sender: 'IFD Logistics' (not descriptive)",
        "- Description: 'Health & Wellness Products'",
        "- No product names or categories listed",
        "",
        "**Delivery Privacy:**",
        "- Couriers don't know package contents",
        "- Signature may be required for security",
        "- Packages left in safe location still discreet",
        "- Neighbours won't see product descriptions",
        "",
        "**International Orders:**",
        "- Customs declaration uses generic descriptions",
        "- Complies with local regulations while remaining discreet",
        "- No product details on external packaging"
      ],
      relatedTopics: [
        { title: "Track My Order", slug: "track-my-order" },
        { title: "Delivery Delay", slug: "delivery-delay" }
      ]
    },
    "product-safety": {
      title: "Product Safety",
      category: "Product Information",
      content: [
        "Product safety is our top priority. Here's what you need to know:",
        "",
        "**Safety Certifications:**",
        "- **CE Mark** - Meets EU safety requirements",
        "- **UKCA Mark** - UK Conformity Assessed (post-Brexit)",
        "- **RoHS Compliant** - No hazardous materials",
        "- **REACH Compliant** - Chemical safety standards",
        "",
        "**Safety Information Provided:**",
        "- **Product warnings** - Clearly marked on packaging",
        "- **Usage instructions** - Step-by-step safe use guide",
        "- **Material composition** - Full ingredient/material disclosure",
        "- **Contraindications** - When NOT to use the product",
        "",
        "**Safety Testing:**",
        "- Independent laboratory testing",
        "- Quality control before shipping",
        "- Batch testing for consistency",
        "- Regular supplier audits",
        "",
        "**Reporting Safety Issues:**",
        "- If you experience any adverse reaction, stop use immediately",
        "- Contact us via the contact form with details",
        "- Include product name, batch number (if available), and issue description",
        "- We'll investigate and provide a resolution",
        "",
        "**Recall Procedures:**",
        "- In case of safety concerns, customers are notified immediately",
        "- Full refunds provided for recalled products",
        "- Return shipping covered for safety recalls"
      ],
      relatedTopics: [
        { title: "Product Quality", slug: "product-quality" },
        { title: "Return or Refund Request", slug: "return-or-refund-request" }
      ]
    },
    "privacy-policy": {
      title: "Privacy Policy",
      category: "Trust & Safety",
      content: [
        "Your privacy is important to us. Here's a summary of our privacy practices:",
        "",
        "**Data We Collect:**",
        "- **Account Information** - Name, email, delivery address",
        "- **Order Information** - Purchase history, payment details",
        "- **Usage Data** - Pages visited, features used",
        "- **Device Information** - IP address, browser type",
        "",
        "**How We Use Your Data:**",
        "- Process and deliver your orders",
        "- Provide customer support",
        "- Improve our website and services",
        "- Send important order updates",
        "- Comply with legal obligations",
        "",
        "**Data Protection:**",
        "- **GDPR Compliant** - Full compliance with UK GDPR",
        "- **Secure Storage** - Encrypted data storage",
        "- **Access Control** - Limited employee access",
        "- **Regular Audits** - Security reviews and updates",
        "",
        "**Your Rights:**",
        "- **Access** - See what data we have about you",
        "- **Correction** - Update incorrect information",
        "- **Deletion** - Request deletion of your data",
        "- **Portability** - Export your data",
        "- **Objection** - Opt out of marketing communications",
        "",
        "**Third-Party Sharing:**",
        "- We never sell your personal data",
        "- Payment processors handle payment data (PCI DSS compliant)",
        "- Couriers receive delivery information only",
        "- Analytics tools help us improve our service",
        "",
        "**Full Privacy Policy:**",
        "- Read our complete Privacy Policy for detailed information"
      ],
      relatedTopics: [
        { title: "Data Protection", slug: "data-protection" },
        { title: "Account Security", slug: "account-security" }
      ]
    },
    "data-protection": {
      title: "Data Protection",
      category: "Trust & Safety",
      content: [
        "How we protect your personal data under GDPR and UK data protection laws:",
        "",
        "**Legal Framework:**",
        "- **UK GDPR** - UK General Data Protection Regulation",
        "- **Data Protection Act 2018** - UK data protection legislation",
        "- **PECR** - Privacy and Electronic Communications Regulations",
        "",
        "**Data Protection Principles:**",
        "- **Lawful, fair, transparent** - Clear basis for processing your data",
        "- **Purpose limitation** - Only use data for stated purposes",
        "- **Data minimization** - Only collect necessary data",
        "- **Accuracy** - Keep data up to date and accurate",
        "- **Storage limitation** - Don't keep data longer than needed",
        "- **Integrity and confidentiality** - Secure data processing",
        "",
        "**Security Measures:**",
        "- **Encryption** - All data encrypted in transit and at rest",
        "- **Access Controls** - Multi-factor authentication for staff",
        "- **Regular Testing** - Security audits and penetration testing",
        "- **Breach Response** - Incident response plan ready",
        "",
        "**Your GDPR Rights:**",
        "- **Right to be informed** - Clear privacy notices",
        "- **Right of access** - Data Subject Access Requests (DSAR)",
        "- **Right to rectification** - Correct inaccurate data",
        "- **Right to erasure** - 'Right to be forgotten'",
        "- **Right to restrict processing** - Limit how we use your data",
        "- **Right to data portability** - Receive your data in machine-readable format",
        "- **Right to object** - Opt out of certain processing",
        "",
        "**Making a Request:**",
        "- Contact our Data Protection Officer (DPO)",
        "- Use the contact form or email dpo@ifudda.com",
        "- Response within 30 days (often sooner)"
      ],
      relatedTopics: [
        { title: "Privacy Policy", slug: "privacy-policy" },
        { title: "Account Security", slug: "account-security" }
      ]
    },
    "secure-payments": {
      title: "Secure Payments",
      category: "Trust & Safety",
      content: [
        "Your payment security is guaranteed through industry-standard measures:",
        "",
        "**Payment Security Features:**",
        "- **SSL/TLS Encryption** - All payment data encrypted",
        "- **PCI DSS Compliance** - Payment card industry standards",
        "- **Tokenization** - Card details replaced with secure tokens",
        "- **3D Secure** - Additional verification for card payments",
        "",
        "**Payment Methods:**",
        "- **Stripe** - PCI Level 1 certified payment processor",
        "- **PayPal** - Trusted third-party payment processor",
        "- No card details stored on our servers",
        "",
        "**What We DON'T Do:**",
        "- We never see or store your full card number",
        "- We never store CVV/CVC security codes",
        "- We never share payment details with third parties",
        "- We never charge hidden fees",
        "",
        "**Fraud Prevention:**",
        "- Address verification (AVS)",
        "- CVV verification",
        "- 3D Secure authentication",
        "- Real-time fraud monitoring",
        "- Automated transaction screening",
        "",
        "**Chargebacks & Disputes:**",
        "- Full disclosure of transaction details",
        "- Evidence provided for dispute resolution",
        "- Fair resolution process",
        "- Customer-friendly policies",
        "",
        "**Payment Confirmation:**",
        "- Immediate confirmation email with order details",
        "- Receipt with payment breakdown",
        "- Order tracking from payment to delivery"
      ],
      relatedTopics: [
        { title: "Payment Failed", slug: "payment-failed" },
        { title: "Account Security", slug: "account-security" }
      ]
    },
    "trust-safety": {
      title: "Trust & Safety",
      category: "Trust & Safety",
      content: [
        "Your trust and safety are fundamental to our business:",
        "",
        "**Our Commitment:**",
        "- **Honesty** - Accurate product descriptions and policies",
        "- **Transparency** - Clear pricing, policies, and processes",
        "- **Security** - Industry-standard data and payment protection",
        "- **Privacy** - GDPR compliant, privacy-first approach",
        "- **Quality** - Only authentic, high-quality products",
        "",
        "**Safety Measures:**",
        "- **Age Verification** - Compliant with UK law",
        "- **Discreet Packaging** - Privacy-respecting delivery",
        "- **Product Safety** - All products meet UK safety standards",
        "- **Secure Payments** - PCI DSS compliant payment processing",
        "- **Data Protection** - UK GDPR compliant data handling",
        "",
        "**Building Trust:**",
        "- **Customer Reviews** - Genuine feedback from verified buyers",
        "- **Clear Policies** - Easy-to-understand terms and conditions",
        "- **Responsive Support** - 24/7 customer service availability",
        "- **Easy Returns** - Hassle-free return and refund process",
        "- **No Hidden Fees** - Transparent pricing throughout",
        "",
        "**Responsible Business Practices:**",
        "- **Environmental Responsibility** - Sustainable packaging where possible",
        "- **Ethical Sourcing** - Products from ethical suppliers",
        "- **Community Guidelines** - Respectful community standards",
        "- **Regulatory Compliance** - All UK regulations followed",
        "",
        "**Your Safety Resources:**",
        "- Product safety information available on all product pages",
        "- Security features clearly explained",
        "- Easy access to support when needed",
        "- Transparent company information available"
      ],
      relatedTopics: [
        { title: "Privacy Policy", slug: "privacy-policy" },
        { title: "Account Security", slug: "account-security" }
      ]
    },
    "safety-tips": {
      title: "Safety Tips",
      category: "Trust & Safety",
      content: [
        "Important safety tips for using our platform and products:",
        "",
        "**Online Safety:**",
        "- Protect your login credentials - never share passwords",
        "- Use strong, unique passwords for your account",
        "- Enable two-factor authentication when available",
        "- Be cautious of phishing emails impersonating us",
        "- Always verify you're on the official ifudda.com website",
        "",
        "**Payment Safety:**",
        "- Never share payment details via email or chat",
        "- Only use payment methods through our secure checkout",
        "- Verify order details before completing payment",
        "- Keep payment confirmations for your records",
        "- Monitor payment statements for unfamiliar charges",
        "",
        "**Product Safety:**",
        "- Read all product instructions before use",
        "- Follow safety warnings and guidelines",
        "- Check for allergies to ingredients/materials",
        "- Stop use if you experience adverse reactions",
        "- Keep products away from children as appropriate",
        "",
        "**Delivery Safety:**",
        "- Be available to receive age-restricted deliveries",
        "- Have ID ready for age verification when required",
        "- Inspect packaging before accepting delivery",
        "- Check products for damage or tampering before use",
        "- Report delivery issues immediately",
        "",
        "**Account Safety:**",
        "- Log out after using shared devices",
        "- Review account activity regularly",
        "- Keep contact information updated",
        "- Use secure networks (avoid public Wi-Fi for transactions)",
        "- Report suspicious activity immediately"
      ],
      relatedTopics: [
        { title: "Account Security", slug: "account-security" },
        { title: "Product Safety", slug: "product-safety" }
      ]
    },
    "report-concerns": {
      title: "Report Concerns",
      category: "Trust & Safety",
      content: [
        "Help us keep our platform safe - report any concerns:",
        "",
        "**What to Report:**",
        "- **Suspicious Activity** - Unusual account behavior or transactions",
        "- **Product Issues** - Safety concerns, quality issues, counterfeit products",
        "- **Policy Violations** - Breaches of our terms or community guidelines",
        "- **Security Issues** - Potential vulnerabilities or breaches",
        "- **Inappropriate Content** - Content that violates our standards",
        "",
        "**How to Report:**",
        "1. **Use the Contact Form** - Select 'Report Issue' as category",
        "2. **Live Chat** - Speak directly with our support team",
        "3. **Email** - Send details to concerns@ifudda.com",
        "4. **Include Details** - What, when, where, and who (if applicable)",
        "",
        "**Information to Include:**",
        "- Clear description of the concern",
        "- When the issue occurred (date/time if known)",
        "- Usernames or order numbers (if applicable)",
        "- Screenshots or evidence (if available)",
        "- Contact information for follow-up",
        "",
        "**What Happens Next:**",
        "- **Acknowledgment** - You'll receive confirmation within 24 hours",
        "- **Investigation** - Our team will investigate the reported concern",
        "- **Action** - Appropriate action taken (may include account suspension, product removal, etc.)",
        "- **Follow-up** - We'll inform you of the outcome (privacy permitting)",
        "",
        "**Confidentiality:**",
        "- Reports are treated confidentially",
        "- Your identity protected when possible",
        "- Details shared only with relevant staff",
        "- Retaliation against reporters is prohibited",
        "",
        "**Urgent Safety Concerns:**",
        "- Use live chat for immediate assistance",
        "- Mark as 'Urgent' in subject line",
        "- We'll prioritize and respond within hours"
      ],
      relatedTopics: [
        { title: "Account Security", slug: "account-security" },
        { title: "Trust & Safety", slug: "trust-safety" }
      ]
    }
  };

  const topic = topicContent[slug || ""];

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Help Topic Not Found</h1>
          <p className="text-slate-600 mb-8">The help topic you're looking for doesn't exist or has been moved.</p>
          <Link to="/help">
            <Button className="bg-gradient-to-r from-red-500 to-pink-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">ifudda</span>
            </Link>
            <Link to="/help">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Topic Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
          <Link to="/help" className="hover:text-red-600">Help Center</Link>
          <span>/</span>
          <span className="text-slate-900">{topic.category}</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <Badge className="bg-red-100 text-red-700 mb-4">{topic.category}</Badge>
          <h1 className="text-4xl font-bold mb-4">{topic.title}</h1>
        </div>

        {/* Content */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="prose prose-slate max-w-none">
              {topic.content.map((paragraph, index) => {
                // Handle markdown-like formatting
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h3 key={index} className="text-xl font-bold mt-8 mb-4">
                      {paragraph.replace(/\*\*/g, "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={index} className="ml-4">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }
                if (paragraph.match(/^\d+\./)) {
                  return (
                    <li key={index} className="ml-4">
                      {paragraph}
                    </li>
                  );
                }
                if (paragraph === "") {
                  return <br key={index} />;
                }
                return (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Related Topics */}
        {topic.relatedTopics && topic.relatedTopics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Related Topics</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {topic.relatedTopics.map((related, index) => (
                <Link
                  key={index}
                  to={`/help/topic/${related.slug}`}
                  className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 hover:border-red-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{related.title}</span>
                    <span className="text-slate-400">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Still Need Help */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
            <p className="text-white/90 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
              <a
                href="https://tawk.to/chat/61f5d540b9e4e21181bc91ce/1fqk4i1k2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Start Live Chat
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">ifudda</span>
          </div>
          <p className="text-slate-400 mb-4">
            We're here to help 24/7. Your satisfaction is our priority.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</Link>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 ifudda. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HelpTopic;