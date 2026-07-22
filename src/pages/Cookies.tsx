import { Link } from "react-router-dom";
import { Shield, Cookie as CookieIcon, Eye, X, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-orange-600 hover:text-orange-700 transition-colors">
            ← Back to Home
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <CookieIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Cookie Policy</CardTitle>
                <CardDescription>Last updated: January 2025</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                What Are Cookies
              </h2>
              <div className="text-slate-600 space-y-3">
                <p>
                  Cookies are small text files that are placed on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and 
                  understanding how you use our platform.
                </p>
                <p>
                  At AliazaStore, we use cookies to enhance your browsing experience, analyze site traffic, 
                  and personalize content and advertisements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-orange-600" />
                How We Use Cookies
              </h2>
              <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Essential Cookies</h3>
                    <p className="text-sm text-slate-600">Required for the website to function properly, including authentication and security features.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Analytics Cookies</h3>
                    <p className="text-sm text-slate-600">Help us understand how visitors interact with our website to improve user experience.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CookieIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Preference Cookies</h3>
                    <p className="text-sm text-slate-600">Remember your settings and preferences to provide personalized features.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Settings className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Marketing Cookies</h3>
                    <p className="text-sm text-slate-600">Used to deliver relevant advertisements and measure campaign effectiveness.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-orange-600" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-3 text-slate-600">
                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">Session Cookies</h3>
                  <p className="text-sm">Temporary cookies that expire when you close your browser. Essential for maintaining your session while navigating.</p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">Persistent Cookies</h3>
                  <p className="text-sm">Stay on your device for a set period or until you delete them. Help remember your preferences for future visits.</p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">Third-Party Cookies</h3>
                  <p className="text-sm">Set by external services we use, such as analytics tools and payment processors.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <X className="w-5 h-5 mr-2 text-orange-600" />
                Managing Cookies
              </h2>
              <div className="text-slate-600 space-y-3">
                <p>
                  You have the right to decide whether to accept or reject cookies. You can set or amend 
                  your web browser preferences to refuse cookies. If you choose to reject cookies, you may 
                  still use our website, though your access to some functionality and areas may be restricted.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Browser Settings</h3>
                  <p className="text-sm text-blue-800">
                    Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-blue-800">
                    <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                    <li>• <strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li>• <strong>Edge:</strong> Settings → Cookies and site permissions → Manage cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Your Cookie Rights
              </h2>
              <div className="text-slate-600 space-y-3">
                <p>
                  Under Philippine law (Data Privacy Act of 2012) and general privacy regulations, you have the right to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Know what cookies are being used and their purpose</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Accept or reject non-essential cookies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Delete cookies from your device at any time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Receive clear information about cookie usage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Opt-out of marketing and analytics cookies</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-orange-600" />
                Updates to This Policy
              </h2>
              <div className="text-slate-600 space-y-3">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors. We encourage you to review this policy 
                  regularly to stay informed about how we use cookies.
                </p>
                <p className="text-sm">
                  <strong>Effective Date:</strong> January 2025
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <div className="text-slate-600 space-y-3">
                <p>
                  If you have any questions about our use of cookies, please contact us through:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/contact">
                    <Button variant="outline">
                      Contact Support
                    </Button>
                  </Link>
                  <Link to="/help">
                    <Button variant="outline">
                      Help Center
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/privacy" className="block">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900">Privacy Policy</h3>
                <p className="text-sm text-slate-600">Learn how we protect your personal information</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/terms" className="block">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900">Terms of Service</h3>
                <p className="text-sm text-slate-600">Review our terms and conditions</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cookies;