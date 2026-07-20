import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, Users, ShoppingCart, Shield, AlertCircle, 
  Ban, CheckCircle, Scale, DollarSign, ShoppingBag
} from "lucide-react";

// Force rebuild for Philippine compliance updates
const Terms = () => {
  const sections = [
    {
      icon: Users,
      title: "Account Terms",
      color: "from-blue-500 to-blue-600",
      content: [
        "You must be at least 18 years old to create an account",
        "Provide accurate and complete information during registration",
        "Maintain the security of your password and account",
        "One account per person - no duplicate accounts allowed",
        "Notify us immediately of unauthorized account access",
        "You are responsible for all activity under your account"
      ]
    },
    {
      icon: ShoppingCart,
      title: "Seller Responsibilities",
      color: "from-green-500 to-green-600",
      content: [
        "List only genuine products you own or are authorized to sell",
        "Provide accurate product descriptions and images",
        "Maintain adequate inventory for listed products",
        "Ship orders within the specified timeframe",
        "Accept returns according to our return policy",
        "Pay the monthly subscription fee of ₱200",
        "Comply with all applicable laws and regulations"
      ]
    },
    {
      icon: CheckCircle,
      title: "Buyer Responsibilities",
      color: "from-purple-500 to-purple-600",
      content: [
        "Provide accurate shipping and payment information",
        "Pay for all purchased items promptly",
        "Review products honestly after purchase",
        "Follow our community guidelines in reviews",
        "Respect seller policies and return procedures",
        "Contact sellers directly for order issues first",
        "Return items according to Philippine consumer laws"
      ]
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      color: "from-red-500 to-red-600",
      content: [
        "Listing counterfeit or fraudulent products",
        "Manipulating prices, ratings, or reviews",
        "Using automated bots to scrape the platform",
        "Interfering with platform security or operation",
        "Spamming or sending unsolicited communications",
        "Reselling platform accounts or seller privileges",
        "Engaging in fraud, money laundering, or illegal activities"
      ]
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      color: "from-orange-500 to-orange-600",
      content: [
        "Sellers must own or have rights to all content listed",
        "Brand names and trademarks require authorization",
        "Product images must be original or properly licensed",
        "We reserve rights to remove infringing content",
        "Repeat infringers will be permanently banned",
        "DMCA takedown procedures will be followed"
      ]
    },
    {
      icon: Scale,
      title: "Dispute Resolution",
      color: "from-cyan-500 to-cyan-600",
      content: [
        "Contact the other party first for direct resolution",
        "Use our resolution center for mediation assistance",
        "Follow our decision-making process for disputes",
        "Provide evidence and documentation for claims",
        "Mediation available for dispute resolution",
        "Follow Philippine Alternative Dispute Resolution procedures",
        "Small Claims Court option for disputes under P400,000",
        "Consumer protection rights under Philippine law"
      ]
    },
    {
      icon: DollarSign,
      title: "Fees & Payments",
      color: "from-yellow-500 to-yellow-600",
      content: [
        "Seller subscription: ₱200/month after 14-day free trial",
        "No commission fees on any sales - keep 100% revenue",
        "Payment processing through secure third-party providers",
        "Subscription fees billed monthly in advance",
        "No refunds for partial months of service",
        "Prices subject to change with 30-day notice"
      ]
    },
    {
      icon: AlertCircle,
      title: "Platform Termination",
      color: "from-pink-500 to-pink-600",
      content: [
        "We may suspend accounts for policy violations",
        "Serious violations result in permanent termination",
        "We may remove any listing without prior notice",
        "Terminated users forfeit all account privileges",
        "Outstanding fees remain due after termination",
        "You may cancel your account at any time"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AliazaStore</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 mx-auto mb-6 opacity-50" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-white/90 mb-2">Last Updated: January 2025</p>
          <p className="text-white/80">
            By using AliazaStore, you agree to these terms compliant with Philippine laws. Please read them carefully.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
            <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                These Terms of Service govern your use of AliazaStore, the marketplace platform operating 
                in accordance with Philippine laws including the E-Commerce Act of 2000 (Republic Act No. 8792), 
                Consumer Act of the Philippines (Republic Act No. 7394), and other applicable laws.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                By accessing or using our platform, you agree to be bound by these terms. If you do not agree 
                with these terms, please do not use our platform. These terms constitute a legally binding agreement.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Your continued use of the platform 
                after changes constitutes acceptance of the updated terms.
              </p>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center mb-4`}>
                    <section.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white overflow-hidden">
            <CardContent className="p-8">
              <AlertCircle className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Limitation of Liability</h3>
              <div className="space-y-4 text-white/90">
                <p>
                  AliazaStore shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including lost profits, data loss, or business interruption.
                </p>
                <p>
                  We are not responsible for the conduct of sellers or buyers on our platform. We act 
                  as a marketplace venue and do not guarantee the quality or safety of products listed.
                </p>
                <p>
                  Our total liability shall not exceed the amount you paid to us in the twelve (12) months 
                  preceding the claim.
                </p>
                <p className="text-sm text-white/70 mt-4">
                  Some jurisdictions do not allow the exclusion of certain warranties or limitation of 
                  liability, so these exclusions may not apply to you.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Governing Law & Jurisdiction</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              These terms are governed by the laws of the Republic of the Philippines. Any disputes arising 
              from these terms or your use of the platform shall be resolved in accordance with Philippine laws,
              including the Electronic Commerce Act and Consumer Act of the Philippines.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For consumer disputes, you may avail of alternative dispute resolution mechanisms including 
              the Department of Trade and Industry (DTI) and Small Claims Court for disputes under P400,000.
            </p>
          </div>
        </div>
      </section>

      {/* Consumer Rights */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-orange-600" />
          <h3 className="text-3xl font-bold mb-4">Your Consumer Rights</h3>
          <p className="text-xl text-slate-600 mb-8">
            As a consumer in the Philippines, you have specific rights and protections.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">Right to Information</h4>
              <p className="text-sm text-slate-600">
                Clear information about products, prices, and seller details before purchase.
              </p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">Right to Safety</h4>
              <p className="text-sm text-slate-600">
                Protection against defective products and fraudulent practices.
              </p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">Right to Choose</h4>
              <p className="text-sm text-slate-600">
                Freedom to select from various products and sellers in our marketplace.
              </p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">Right to Redress</h4>
              <p className="text-sm text-slate-600">
                Fair settlement of legitimate complaints through proper channels.
              </p>
            </Card>
          </div>
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
            <h4 className="font-semibold mb-3">Government Resources</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p>• Department of Trade and Industry (DTI): <span className="text-orange-600">dti.gov.ph</span></p>
              <p>• Consumer Protection Group: <span className="text-orange-600">1244 DTI (Call Center)</span></p>
              <p>• National Privacy Commission: <span className="text-orange-600">privacy.gov.ph</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">AliazaStore</span>
          </div>
          <p className="text-slate-400 mb-4">
            Your trusted global marketplace since 2008.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</Link>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 AliazaStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;