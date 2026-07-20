import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle, Package, Store, User, CreditCard, Shield, Settings, Key, Smartphone, FileText, AlertTriangle, RefreshCw, UserCheck, Lock, ChevronRight, HelpCircle } from "lucide-react";

const HelpTopic = () => {
  // Get topic from URL
  const topicSlug = window.location.pathname.split('/help/topic/')[1] || 'general';
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const topicContent: { [key: string]: any } = {
    'track-my-order': {
      title: "How to Track My Order",
      icon: Package,
      category: "Buying & Orders",
      content: [
        {
          section: "Order Tracking Basics",
          icon: CheckCircle,
          items: [
            "Log in to your account",
            "Go to 'My Orders' in your dashboard",
            "Find your order by order number or date",
            "Click on the order to see tracking details",
            "Copy the tracking number and check with the courier"
          ]
        },
        {
          section: "What Tracking Shows",
          icon: Package,
          items: [
            "Current order status (Processing, Shipped, Delivered)",
            "Shipping progress and estimated delivery date",
            "Courier contact information",
            "Order items and shipping address"
          ]
        },
        {
          section: "If Tracking Not Available",
          icon: AlertCircle,
          items: [
            "Contact the seller directly through messaging",
            "Allow 1-2 business days for tracking to update",
            "Check your email for shipping confirmation",
            "Verify your shipping address is correct"
          ]
        }
      ]
    },
    'start-selling-guide': {
      title: "Start Selling Guide",
      icon: Store,
      category: "Selling Help",
      content: [
        {
          section: "Getting Started",
          icon: CheckCircle,
          items: [
            "Create your seller account on AliazaStore",
            "Complete your store profile and add business details",
            "Upload government ID and store logo for verification",
            "Add your first products with clear descriptions and images",
            "Set your shipping and return policies"
          ]
        },
        {
          section: "Store Setup",
          icon: Store,
          items: [
            "Choose a memorable store name",
            "Write a compelling store description",
            "Add high-quality product images",
            "Set competitive pricing",
            "Configure your payment methods"
          ]
        },
        {
          section: "Subscription & Fees",
          icon: CreditCard,
          items: [
            "14-day free trial for new sellers",
            "₱200/month subscription fee after trial",
            "No commission fees on any sales",
            "Keep 100% of your revenue",
            "Cancel anytime through your dashboard"
          ]
        }
      ]
    },
    'password-reset': {
      title: "Password Reset Help",
      icon: User,
      category: "Account Management",
      content: [
        {
          section: "Reset Your Password",
          icon: CheckCircle,
          items: [
            "Go to the login page",
            "Click 'Forgot Password' link",
            "Enter your registered email address",
            "Check your email for reset instructions",
            "Follow the link to create a new password"
          ]
        },
        {
          section: "Password Requirements",
          icon: Shield,
          items: [
            "Minimum 8 characters",
            "At least one uppercase letter",
            "At least one number or special character",
            "Cannot be the same as previous passwords",
            "Should not contain personal information"
          ]
        },
        {
          section: "If Reset Link Doesn't Work",
          icon: AlertCircle,
          items: [
            "Check your spam/junk folder",
            "Wait 10-15 minutes for the email to arrive",
            "Ensure you're using the correct email address",
            "Request a new reset link if needed",
            "Contact support if issues persist"
          ]
        }
      ]
    },
    'platform-not-working': {
      title: "Platform Not Working",
      icon: Settings,
      category: "Technical Support",
      content: [
        {
          section: "Common Solutions",
          icon: CheckCircle,
          items: [
            "Refresh your browser page (F5 or Ctrl+R)",
            "Clear your browser cache and cookies",
            "Try a different browser (Chrome, Firefox, Safari)",
            "Disable browser extensions temporarily",
            "Check your internet connection"
          ]
        },
        {
          section: "If Problems Persist",
          icon: AlertCircle,
          items: [
            "Check our social media for platform status updates",
            "Try accessing from a different device",
            "Take a screenshot of the error",
            "Contact our support team with detailed information",
            "Include your browser type and version in your report"
          ]
        },
        {
          section: "Mobile Issues",
          icon: Package,
          items: [
            "Update the AliazaStore app to the latest version",
            "Clear app cache in your device settings",
            "Uninstall and reinstall the app",
            "Check for iOS/Android system updates",
            "Ensure you have sufficient storage space"
          ]
        }
      ]
    },
    'subscription-billing': {
      title: "Subscription & Billing",
      icon: CreditCard,
      category: "Payments & Billing",
      content: [
        {
          section: "Understanding Your Subscription",
          icon: CheckCircle,
          items: [
            "₱200/month flat fee for sellers",
            "14-day free trial for new accounts",
            "No commission fees on sales",
            "Billing cycle: Monthly from signup date",
            "Auto-renewal unless cancelled"
          ]
        },
        {
          section: "Payment Methods",
          icon: CreditCard,
          items: [
            "GCash (Philippines)",
            "Credit/Debit cards",
            "Bank transfer",
            "PayPal (where available)",
            "All payments processed securely"
          ]
        },
        {
          section: "Billing Issues",
          icon: AlertCircle,
          items: [
            "Check your payment method in dashboard settings",
            "Update expired payment information",
            "Contact support for failed payments",
            "Review invoice history in billing section",
            "Request refunds for billing errors"
          ]
        }
      ]
    },
    'login-issues': {
      title: "Login Issues",
      icon: User,
      category: "Account Management",
      content: [
        {
          section: "Common Login Problems",
          icon: AlertCircle,
          items: [
            "Incorrect email or password - check for typos",
            "Caps Lock might be on - passwords are case sensitive",
            "Using wrong email address - verify your registered email",
            "Browser issues - clear cache and try again",
            "Account locked due to too many failed attempts"
          ]
        },
        {
          section: "Quick Solutions",
          icon: CheckCircle,
          items: [
            "Reset your password if you don't remember it",
            "Check your email inbox for account verification",
            "Try logging in from a different browser or device",
            "Ensure you're on the correct login page",
            "Contact support if you continue having issues"
          ]
        },
        {
          section: "Account Security",
          icon: Lock,
          items: [
            "We temporarily lock accounts after 5 failed login attempts",
            "Account locks automatically expire after 30 minutes",
            "You can request password reset anytime",
            "We never ask for your password via email or phone",
            "Report suspicious login activity immediately"
          ]
        }
      ]
    },
    'update-profile': {
      title: "Update Profile",
      icon: User,
      category: "Account Management",
      content: [
        {
          section: "Profile Information",
          icon: UserCheck,
          items: [
            "Go to Account Settings in your dashboard",
            "Update personal information (name, phone, address)",
            "Upload a profile picture for better recognition",
            "Add business information for seller accounts",
            "Save changes to update your profile"
          ]
        },
        {
          section: "Email Changes",
          icon: Key,
          items: [
            "Email changes require verification for security",
            "You'll receive a confirmation email at the new address",
            "Click the verification link to confirm the change",
            "Old email remains active until verification is complete",
            "Keep your email updated for important notifications"
          ]
        },
        {
          section: "Password Updates",
          icon: Lock,
          items: [
            "Change password regularly for better security",
            "Use strong passwords with letters, numbers, and symbols",
            "Don't reuse passwords from other accounts",
            "Enable two-factor authentication if available",
            "Never share your password with anyone"
          ]
        }
      ]
    },
    'add-payment-method': {
      title: "Add Payment Method",
      icon: CreditCard,
      category: "Payments & Billing",
      content: [
        {
          section: "Available Payment Methods",
          icon: CreditCard,
          items: [
            "GCash - Most popular for Philippine users",
            "Credit/Debit cards - Visa, Mastercard, JCB",
            "Bank transfer - Direct from your bank account",
            "PayPal - For international transactions",
            "All methods are secure and encrypted"
          ]
        },
        {
          section: "Adding GCash",
          icon: Smartphone,
          items: [
            "Go to Payment Settings in your dashboard",
            "Select 'Add Payment Method' and choose GCash",
            "Enter your GCash mobile number",
            "Verify your number via SMS confirmation",
            "Your GCash account is now linked"
          ]
        },
        {
          section: "Adding Cards",
          icon: CreditCard,
          items: [
            "Select 'Add Payment Method' and choose Card",
            "Enter card number, expiry date, and CVV",
            "Card information is encrypted and secure",
            "Cards are verified by small test transaction",
            "Use verified cards for instant payments"
          ]
        }
      ]
    },
    'view-invoices': {
      title: "View Invoices",
      icon: FileText,
      category: "Payments & Billing",
      content: [
        {
          section: "Access Your Invoices",
          icon: FileText,
          items: [
            "Go to Billing section in your dashboard",
            "All invoices are listed by date and status",
            "Click on any invoice to view details",
            "Download invoices as PDF for your records",
            "Invoices include subscription fees and charges"
          ]
        },
        {
          section: "Invoice Information",
          icon: CheckCircle,
          items: [
            "Each invoice has a unique invoice number",
            "Shows billing period and payment due date",
            "Includes detailed breakdown of charges",
            "Payment status is clearly indicated",
            "Receipt available after payment completion"
          ]
        },
        {
          section: "Payment History",
          icon: RefreshCw,
          items: [
            "View all past payments in Payment History",
            "Filter by date range or payment type",
            "Export payment history for accounting",
            "Track subscription payments over time",
            "Request official receipts for business purposes"
          ]
        }
      ]
    },
    'payment-declined': {
      title: "Payment Declined",
      icon: AlertTriangle,
      category: "Payments & Billing",
      content: [
        {
          section: "Common Reasons",
          icon: AlertCircle,
          items: [
            "Insufficient funds in your account",
            "Expired card or payment method",
            "Incorrect card details entered",
            "Bank security flags on transactions",
            "Daily transaction limits exceeded"
          ]
        },
        {
          section: "How to Fix",
          icon: RefreshCw,
          items: [
            "Verify sufficient balance in your account",
            "Check card expiry date and update if needed",
            "Confirm card details are entered correctly",
            "Contact your bank to authorize transactions",
            "Try a different payment method as alternative"
          ]
        },
        {
          section: "Subscription Payments",
          icon: CreditCard,
          items: [
            "We retry failed subscription payments automatically",
            "3 retry attempts over 7 days before account suspension",
            "Update payment method before suspension occurs",
            "Grace period of 3 days after final failed attempt",
            "Reactivate anytime by updating payment details"
          ]
        }
      ]
    },
    'report-fraud': {
      title: "Report Fraud",
      icon: Shield,
      category: "Trust & Safety",
      content: [
        {
          section: "How to Report Fraud",
          icon: AlertCircle,
          items: [
            "Take screenshots of suspicious messages or listings",
            "Note the seller/buyer username and order details",
            "Go to Help Center and select 'Report Issue'",
            "Choose fraud/scam as the issue type",
            "Submit evidence and receive a reference number"
          ]
        },
        {
          section: "Common Fraud Types",
          icon: AlertTriangle,
          items: [
            "Fake sellers asking for direct payment outside platform",
            "Counterfeit or different products than advertised",
            "Phishing attempts to steal your login details",
            "Buyers who cancel payments after receiving items",
            "Identity theft using stolen photos and information"
          ]
        },
        {
          section: "Protect Yourself",
          icon: Shield,
          items: [
            "Never pay outside the AliazaStore platform",
            "Verify seller ratings and customer reviews",
            "Check product photos match descriptions",
            "Use our secure messaging for all communications",
            "Report suspicious activity immediately"
          ]
        }
      ]
    },
    'policy-violation': {
      title: "Policy Violation",
      icon: Shield,
      category: "Trust & Safety",
      content: [
        {
          section: "Common Violations",
          icon: AlertCircle,
          items: [
            "Selling prohibited items (counterfeits, illegal goods)",
            "Fake reviews or rating manipulation",
            "Inappropriate content or language",
            "Price gouging or unfair practices",
            "Circumventing platform fees and payments"
          ]
        },
        {
          section: "Reporting Violations",
          icon: AlertTriangle,
          items: [
            "Document the violation with screenshots",
            "Include item listings or message transcripts",
            "Submit through Help Center with 'Report Issue'",
            "All reports are investigated within 48 hours",
            "Confidential reporting - your identity is protected"
          ]
        },
        {
          section: "Consequences",
          icon: Lock,
          items: [
            "Warning issued for first-time minor violations",
            "Listing removal for policy violations",
            "Account suspension for repeated offenses",
            "Permanent ban for serious violations",
            "Legal action for illegal activities"
          ]
        }
      ]
    },
    'account-hacked': {
      title: "Account Hacked",
      icon: Shield,
      category: "Trust & Safety",
      content: [
        {
          section: "Immediate Actions",
          icon: AlertCircle,
          items: [
            "Change your password immediately",
            "Enable two-factor authentication if available",
            "Check for unauthorized orders or messages",
            "Review connected payment methods",
            "Contact support to secure your account"
          ]
        },
        {
          section: "How Hacks Happen",
          icon: AlertTriangle,
          items: [
            "Weak passwords that are easy to guess",
            "Phishing emails that look like official messages",
            "Using the same password across multiple sites",
            "Public Wi-Fi networks without proper security",
            "Malicious links in messages or emails"
          ]
        },
        {
          section: "Prevention Tips",
          icon: Shield,
          items: [
            "Use strong, unique passwords for each account",
            "Never click suspicious links in emails",
            "Enable login notifications and alerts",
            "Log out from devices you're not actively using",
            "Keep your email account secure as well"
          ]
        }
      ]
    },
    'platform-errors': {
      title: "Platform Errors",
      icon: Settings,
      category: "Technical Support",
      content: [
        {
          section: "Common Errors",
          icon: AlertCircle,
          items: [
            "Page not loading or showing blank screens",
            "Forms not submitting or buttons not working",
            "Images not displaying properly",
            "Search or filter functions not responding",
            "Shopping cart errors during checkout"
          ]
        },
        {
          section: "Quick Fixes",
          icon: RefreshCw,
          items: [
            "Refresh the page (F5 or Ctrl+R)",
            "Clear browser cache and cookies",
            "Disable browser extensions temporarily",
            "Try a different browser (Chrome, Firefox, Safari)",
            "Check your internet connection stability"
          ]
        },
        {
          section: "Report Technical Issues",
          icon: Settings,
          items: [
            "Take a screenshot of the error message",
            "Note what you were doing when the error occurred",
            "Include your browser type and version",
            "Report through Help Center with details",
            "Our technical team investigates all reports"
          ]
        }
      ]
    },
    'mobile-app-issues': {
      title: "Mobile App Issues",
      icon: Smartphone,
      category: "Technical Support",
      content: [
        {
          section: "Common App Problems",
          icon: AlertCircle,
          items: [
            "App crashing or freezing unexpectedly",
            "Slow loading or performance issues",
            "Features not working properly",
            "Push notifications not being received",
            "Login issues on mobile devices"
          ]
        },
        {
          section: "Troubleshooting Steps",
          icon: RefreshCw,
          items: [
            "Close and restart the app completely",
            "Clear app cache in your device settings",
            "Update to the latest app version",
            "Uninstall and reinstall the app",
            "Check for available iOS/Android system updates"
          ]
        },
        {
          section: "Device Compatibility",
          icon: Smartphone,
          items: [
            "iOS 12.0 or higher required for iPhone/iPad",
            "Android 8.0 or higher required for Android devices",
            "App works best on devices with 2GB+ RAM",
            "Stable internet connection required for most features",
            "Some features may vary by device capability"
          ]
        }
      ]
    },
    'website-problems': {
      title: "Website Problems",
      icon: Settings,
      category: "Technical Support",
      content: [
        {
          section: "Browser Issues",
          icon: AlertCircle,
          items: [
            "Pages not loading or displaying incorrectly",
            "Forms or buttons not responding",
            "Images or videos not playing",
            "Checkout process not completing",
            "Payment processing errors"
          ]
        },
        {
          section: "Browser Solutions",
          icon: RefreshCw,
          items: [
            "Try clearing your browser cache and cookies",
            "Disable browser extensions and add-ons",
            "Update your browser to the latest version",
            "Try a different browser to isolate the issue",
            "Check that JavaScript is enabled in browser settings"
          ]
        },
        {
          section: "Connection Issues",
          icon: Settings,
          items: [
            "Verify your internet connection is stable",
            "Try switching between WiFi and mobile data",
            "Check if other websites are working normally",
            "Restart your router or modem if needed",
            "Contact your internet service provider if issues persist"
          ]
        }
      ]
    }
  };

  const topic = topicContent[topicSlug] || topicContent['track-my-order'];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/help" className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center`}>
                  <topic.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Help Center</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Topic Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{topic.title}</h1>
          <div className="flex items-center space-x-2 text-slate-600">
            <topic.icon className="w-5 h-5" />
            <span>{topic.category}</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {topic.content.map((section: any, index: number) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleSection(section.section)}
              >
                <CardTitle className="flex items-center text-xl">
                  <section.icon className="w-6 h-6 mr-3 text-orange-600" />
                  {section.section}
                  <ChevronRight 
                    className={`w-5 h-5 ml-auto transition-transform ${
                      expandedSection === section.section ? 'rotate-90' : ''
                    }`} 
                  />
                </CardTitle>
              </CardHeader>
              {expandedSection === section.section && (
                <CardContent>
                  <ul className="space-y-3">
                    {section.items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Help */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">Still Need Help?</h3>
                  <p className="text-slate-600 mb-4">
                    If you couldn't find the answer you're looking for, please contact our support team.
                  </p>
                  <Link to="/help">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpTopic;