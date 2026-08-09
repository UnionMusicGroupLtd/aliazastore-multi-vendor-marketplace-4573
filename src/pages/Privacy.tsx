import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <span className="text-2xl font-bold text-white">ifudda</span>
            </Link>
            
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-gray-400">Your privacy is our priority - Last updated: January 2026</p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Information We Collect
              </h2>
              <div className="space-y-2 text-gray-400">
                <p>At ifudda, we collect information necessary to provide our premium adult wellness services:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong className="text-white">Personal Information:</strong> Name, email address, shipping address, and payment details</li>
                  <li><strong className="text-white">Age Verification:</strong> Confirmation that you are 18+ years old (legal requirement)</li>
                  <li><strong className="text-white">Purchase Information:</strong> Order history, product preferences, and delivery details</li>
                  <li><strong className="text-white">Technical Data:</strong> IP address, browser type, and device information for security</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                How We Protect Your Data
              </h2>
              <div className="space-y-2 text-gray-400">
                <p>We take your privacy seriously with industry-leading security measures:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong className="text-white">SSL Encryption:</strong> All data transmitted is encrypted using 256-bit SSL</li>
                  <li><strong className="text-white">Discreet Billing:</strong> Charges appear as "IFD" on your statement</li>
                  <li><strong className="text-white">Discreet Packaging:</strong> Plain packaging with no indication of contents</li>
                  <li><strong className="text-white">Secure Storage:</strong> Payment details never stored on our servers</li>
                  <li><strong className="text-white">Access Control:</strong> Strict access controls and regular security audits</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">How We Use Your Information</h2>
              <div className="space-y-2 text-gray-400">
                <p>We use your information solely to:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Process and deliver your orders discreetly</li>
                  <li>Provide age verification as required by UK law</li>
                  <li>Send order confirmations and delivery updates</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Improve our products and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Your Rights (UK GDPR & Data Protection Act 2018)</h2>
              <div className="space-y-2 text-gray-400">
                <p>Under the UK GDPR and Data Protection Act 2018, you have the right to:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong className="text-white">Right to Access:</strong> Request a copy of your personal data (Subject Access Request)</li>
                  <li><strong className="text-white">Right to Rectification:</strong> Update inaccurate or incomplete information</li>
                  <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                  <li><strong className="text-white">Right to Object:</strong> Object to processing of your data for direct marketing</li>
                  <li><strong className="text-white">Right to Restrict:</strong> Request restriction of data processing in certain circumstances</li>
                  <li><strong className="text-white">Right to Portability:</strong> Request data transfer to another service</li>
                  <li><strong className="text-white">Right to Withdraw Consent:</strong> Withdraw consent at any time where we rely on consent</li>
                </ul>
                <p className="mt-3">To exercise these rights, contact us at privacy@ifudda.co.uk</p>
                <p className="text-sm text-gray-500 mt-2">You also have the right to complain to the Information Commissioner's Office (ICO) if you believe we have breached your data protection rights.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Children's Privacy</h2>
              <p className="text-gray-400">
                <strong className="text-white">ifudda is strictly for adults 18+ only.</strong> We do not knowingly collect 
                personal information from anyone under 18. Our website includes age verification, and we 
                immediately terminate accounts of underage users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                UK Data Protection Compliance
              </h2>
              <div className="space-y-2 text-gray-400">
                <p>ifudda is fully compliant with UK data protection laws:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong className="text-white">Data Protection Act 2018:</strong> We comply with all UK data protection legislation</li>
                  <li><strong className="text-white">UK GDPR:</strong> We follow the UK General Data Protection Regulation principles</li>
                  <li><strong className="text-white">ICO Registered:</strong> We are registered with the Information Commissioner's Office</li>
                  <li><strong className="text-white">Data Security:</strong> Technical and organizational measures to protect your data</li>
                  <li><strong className="text-white">International Transfers:</strong> Your data is processed and stored within the UK/EEA</li>
                </ul>
                <p className="mt-2">For more information about your data protection rights, you can contact the <strong className="text-white">Information Commissioner's Office (ICO)</strong> at <a href="https://ico.org.uk" className="text-red-500 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a> or phone 0303 123 1113.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Contact Us
              </h2>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300 mb-2">For privacy-related inquiries or to exercise your rights:</p>
                <p className="text-white"><strong>Email:</strong> privacy@ifudda.co.uk</p>
                <p className="text-white"><strong>Website:</strong> www.ifudda.co.uk</p>
                <p className="text-white"><strong>ICO Reference:</strong> Our ICO registration number is available on request</p>
                <p className="text-gray-400 text-sm mt-2">We typically respond within 5 working days as required by UK data protection laws.</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">© 2000-2026 ifudda. All rights reserved. | UK Company</p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;