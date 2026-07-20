import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, Eye, Lock, UserCheck, Cookie, Bell, 
  Globe, ShoppingBag, CheckCircle
} from "lucide-react";

// Force rebuild to fix icon import
const Privacy = () => {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      color: "from-blue-500 to-blue-600",
      content: [
        "Personal Information: Name, email, phone, shipping address",
        "Account Information: Username, password, preferences",
        "Payment Information: Processed securely through third-party providers",
        "Store Information: Business details, products, sales data",
        "Usage Data: Pages visited, features used, time spent",
        "Device Information: IP address, browser type, device characteristics"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      color: "from-green-500 to-green-600",
      content: [
        "Process and fulfill orders and payments",
        "Create and manage your seller account",
        "Provide customer support and respond to inquiries",
        "Send transactional and promotional communications",
        "Improve our platform and develop new features",
        "Prevent fraud and ensure platform security",
        "Comply with legal obligations"
      ]
    },
    {
      icon: Lock,
      title: "Data Security & Protection",
      color: "from-purple-500 to-purple-600",
      content: [
        "SSL/TLS encryption for all data transmissions",
        "Secure password hashing and authentication",
        "Regular security audits and vulnerability assessments",
        "Access controls and authentication requirements",
        "Data backups and disaster recovery procedures",
        "Third-party security certifications and compliance"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Privacy Rights under Philippine Law",
      color: "from-orange-500 to-orange-600",
      content: [
        "Right to access your personal data (RA 10173, Sec. 12)",
        "Right to correct inaccurate data (RA 10173, Sec. 13)",
        "Right to delete your personal data (RA 10173, Sec. 16)",
        "Right to data portability (RA 10173 IRR)",
        "Right to opt-out of marketing communications",
        "Right to object to data processing (RA 10173, Sec. 14)",
        "Right to file complaint with National Privacy Commission"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      color: "from-cyan-500 to-cyan-600",
      content: [
        "Essential cookies for platform functionality",
        "Analytics cookies to understand user behavior",
        "Marketing cookies for personalized content",
        "Preference cookies for saved settings",
        "Third-party cookies for payment processing",
        "Cookie management through browser settings"
      ]
    },
    {
      icon: Globe,
      title: "Data Transfers & Security Measures",
      color: "from-red-500 to-red-600",
      content: [
        "Data stored and processed in accordance with Philippine laws",
        "Appropriate safeguards for all data transfers",
        "Compliance with Data Privacy Act of 2012 requirements",
        "Security measures as required by NPC regulations",
        "Regular privacy impact assessments and compliance audits"
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
      <section className="py-16 px-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 opacity-50" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/90 mb-2">Last Updated: January 2025</p>
          <p className="text-white/80">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173).
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                At AliazaStore, we believe that privacy is a fundamental right protected by Philippine law. We are committed to protecting 
                your personal information and being transparent about our data practices in compliance with the Data Privacy Act of 2012 
                (Republic Act No. 10173) and its implementing rules and regulations. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our marketplace.
              </p>
              <p className="text-slate-600 leading-relaxed">
                By using AliazaStore, you agree to the collection and use of information in accordance with 
                this policy and Philippine data protection laws. If you disagree with any part of this policy, please do not use our platform.
              </p>
            </div>
          </div>

          {/* Privacy Sections */}
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

      {/* Children's Privacy */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
            <CardContent className="p-8">
              <Bell className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Children's Privacy</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Our platform is not intended for children under the age of 18. We do not knowingly collect 
                personal information from children under 18 without parental consent in accordance with 
                the Data Privacy Act of 2012.
              </p>
              <p className="text-white/90 leading-relaxed">
                If we discover that we have collected personal information from a child under 18 without 
                verifiable parental consent, we will take immediate steps to remove that information from our servers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Updates to Policy */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Updates to This Privacy Policy</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-slate-600 leading-relaxed">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this 
              Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-orange-600" />
          <h3 className="text-3xl font-bold mb-4">Your Data Protection Rights</h3>
          <p className="text-xl text-slate-600 mb-8">
            You have rights under Philippine law regarding your personal information.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">Access & Correction</h4>
              <p className="text-sm text-slate-600">
                You may request access to your personal data and correction of inaccurate information.
              </p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">Deletion & Portability</h4>
              <p className="text-sm text-slate-600">
                You may request deletion of your data or transfer to another service.
              </p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">Object to Processing</h4>
              <p className="text-sm text-slate-600">
                You may object to processing of your personal data under certain conditions.
              </p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">File NPC Complaint</h4>
              <p className="text-sm text-slate-600">
                You may file complaints with the National Privacy Commission.
              </p>
            </Card>
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

export default Privacy;