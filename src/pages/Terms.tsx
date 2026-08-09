import { Link } from 'react-router-dom';
import { FileText, Shield, Users, CreditCard, AlertCircle } from 'lucide-react';

const Terms = () => {
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
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
            <p className="text-gray-400">Last updated: January 2026 | UK Law Compliant</p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">🔞 Age Requirement & Verification (UK Law)</h2>
              <div className="space-y-2 text-gray-400">
                <p><strong className="text-white">18+ Only:</strong> ifudda is strictly for adults aged 18 and over. By using our website, you confirm that you are 18+.</p>
                <p><strong className="text-white">UK Legal Requirement:</strong> Under UK law, it is illegal to sell age-restricted products to minors. We comply with all relevant UK legislation including the Video Recordings Act 1984 and the Intoxicating Substances Act 1972.</p>
                <p><strong className="text-white">Age Verification:</strong> We use robust age verification systems to ensure compliance with UK law. Providing false information is a breach of these terms and may be reported to authorities.</p>
                <p><strong className="text-white">Enforcement:</strong> We actively prevent underage access and cooperate with UK authorities including Trading Standards and the Police.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Account Terms
              </h2>
              <div className="space-y-2 text-gray-400">
                <ul className="list-disc ml-6 space-y-1">
                  <li>You must be 18+ to create an account</li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain account security and password confidentiality</li>
                  <li>One account per person - no duplicate accounts</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>You are responsible for all activity under your account</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Products & Services (UK Compliant)</h2>
              <div className="space-y-2 text-gray-400">
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong className="text-white">Adult Wellness Products:</strong> We sell age-restricted products for adult wellness and intimate use</li>
                  <li><strong className="text-white">UK Safety Standards:</strong> All products comply with UK safety regulations and CE marking requirements</li>
                  <li><strong className="text-white">Product Accuracy:</strong> We comply with UK Consumer Rights Act 2015 for accurate descriptions, images, and pricing</li>
                  <li><strong className="text-white">Availability:</strong> Products subject to stock availability - UK warehouse stock</li>
                  <li><strong className="text-white">Body-Safe Materials:</strong> Products comply with UK REACH regulations for materials safety</li>
                  <li><strong className="text-white">Medical Devices:</strong> Some products may be CE marked as medical devices under UK Medical Devices Regulations 2002</li>
                  <li><strong className="text-white">Electrical Safety:</strong> Electrical products comply with UK Electrical Equipment (Safety) Regulations 2016</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Pricing & Payment
              </h2>
              <div className="space-y-2 text-gray-400">
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong className="text-white">GBP Currency:</strong> All prices are in British Pounds (£)</li>
                  <li><strong className="text-white">Secure Payment:</strong> Payments processed through secure PCI DSS compliant payment providers</li>
                  <li><strong className="text-white">Discreet Billing:</strong> Charges appear as "IFD" on your statement</li>
                  <li><strong className="text-white">Payment Security:</strong> We never store your full payment card details</li>
                  <li><strong className="text-white">Price Accuracy:</strong> Prices confirmed at checkout - errors will be corrected</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Shipping & Delivery</h2>
              <div className="space-y-2 text-gray-400">
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong className="text-white">UK Shipping:</strong> We ship throughout the United Kingdom</li>
                  <li><strong className="text-white">Discreet Packaging:</strong> Plain packaging with no indication of contents</li>
                  <li><strong className="text-white">Delivery Times:</strong> Standard 3-5 days, Express 1-2 days (subject to availability)</li>
                  <li><strong className="text-white">Shipping Costs:</strong> Free UK delivery on orders over £50</li>
                  <li><strong className="text-white">Signature Required:</strong> Some orders may require signature upon delivery</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Returns & Refunds (UK Consumer Rights Act 2015)</h2>
              <div className="space-y-2 text-gray-400">
                <p><strong className="text-white">Your UK Consumer Rights:</strong> Under the Consumer Rights Act 2015, you have the right to reject goods that are unsatisfactory quality, unfit for purpose, or not as described.</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong className="text-white">30-Day Returns:</strong> Unopened items can be returned within 30 days as per UK distance selling regulations</li>
                  <li><strong className="text-white">Consumer Rights:</strong> Your statutory rights are not affected - faulty items can be returned for up to 6 months</li>
                  <li><strong className="text-white">Hygiene Exception:</strong> Opened intimate products cannot be returned for hygiene reasons (per UK regulations)</li>
                  <li><strong className="text-white">Faulty Products:</strong> Full refund for defective items including opened items within 30 days of delivery</li>
                  <li><strong className="text-white">Refund Method:</strong> Refunds processed within 14 days to original payment method as required by UK law</li>
                  <li><strong className="text-white">Return Costs:</strong> Customer pays return postage unless item is faulty - UK standard return rates apply</li>
                  <li><strong className="text-white">Alternative Dispute Resolution:</strong> We offer alternative dispute resolution for UK consumer complaints</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Prohibited Activities</h2>
              <div className="space-y-2 text-gray-400">
                <ul className="list-disc ml-6 space-y-1">
                  <li>Attempting to bypass age verification systems</li>
                  <li>Using fraudulent payment methods</li>
                  <li>Placing fake orders or abusing the return policy</li>
                  <li>Reproducing or redistributing our content without permission</li>
                  <li>Using our platform for illegal purposes</li>
                  <li>Interfering with website security or operation</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Data Protection
              </h2>
              <div className="space-y-2 text-gray-400">
                <p>We comply with UK GDPR and data protection laws. Your privacy is protected through:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure payment processing (PCI DSS compliant)</li>
                  <li>Discreet billing and packaging</li>
                  <li>No sharing of your data with third parties (except payment processors)</li>
                  <li>Your rights under UK GDPR (access, correction, deletion, objection)</li>
                </ul>
                <p className="mt-2">See our <Link to="/privacy" className="text-red-500 underline">Privacy Policy</Link> for full details.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Limitation of Liability
              </h2>
              <div className="space-y-2 text-gray-400">
                <p>ifudda provides adult wellness products on an "as is" basis. We are not liable for:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Product misuse or improper use</li>
                  <li>Allergic reactions to materials (please check product descriptions)</li>
                  <li>Delays caused by shipping carriers</li>
                  <li>Indirect or consequential damages</li>
                </ul>
                <p className="mt-2">Our total liability is limited to the purchase price of the product.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Governing Law & Jurisdiction (UK)</h2>
              <div className="space-y-2 text-gray-400">
                <p>These terms are governed by the laws of <strong className="text-white">England and Wales</strong>. Any disputes shall be resolved in UK courts under English law.</p>
                <p className="mt-2"><strong className="text-white">UK Consumer Protection:</strong> Your statutory rights as a UK consumer under the Consumer Rights Act 2015, Consumer Protection from Unfair Trading Regulations 2008, and other UK consumer protection laws are not affected by these terms.</p>
                <p className="mt-2"><strong className="text-white">Alternative Dispute Resolution:</strong> If you have a complaint that cannot be resolved with us, you may use the European Commission Online Dispute Resolution (ODR) platform or UK-based alternative dispute resolution services.</p>
                <p className="mt-2"><strong className="text-white">Regulatory Bodies:</strong> We cooperate with UK regulatory bodies including Trading Standards, the Information Commissioner's Office (ICO), and the Financial Conduct Authority (FCA) for payment services.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Terms Updates</h2>
              <div className="space-y-2 text-gray-400">
                <p>We may update these terms from time to time. Continued use of the website after changes constitutes acceptance of the updated terms.</p>
                <p className="mt-2">Significant changes will be communicated via website notice or email.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">UK Government Resources</h2>
              <div className="space-y-2 text-gray-400">
                <p>For UK consumer protection, data protection, and regulatory information:</p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mt-3 space-y-2">
                  <p><strong className="text-white">Information Commissioner's Office (ICO):</strong></p>
                  <p className="text-sm">Data protection regulator | <a href="https://ico.org.uk" className="text-red-500 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a> | Phone: 0303 123 1113</p>
                  
                  <p className="mt-2"><strong className="text-white">Citizens Advice Bureau:</strong></p>
                  <p className="text-sm">Consumer rights advice | <a href="https://citizensadvice.org.uk" className="text-red-500 underline" target="_blank" rel="noopener noreferrer">citizensadvice.org.uk</a></p>
                  
                  <p className="mt-2"><strong className="text-white">Trading Standards:</strong></p>
                  <p className="text-sm">Consumer protection enforcement | Contact via your local council</p>
                  
                  <p className="mt-2"><strong className="text-white">UK Government Consumer Rights:</strong></p>
                  <p className="text-sm">Official guidance | <a href="https://gov.uk/consumer-rights" className="text-red-500 underline" target="_blank" rel="noopener noreferrer">gov.uk/consumer-rights</a></p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Contact Information</h2>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300 mb-2">For questions about these Terms & Conditions:</p>
                <p className="text-white"><strong>Email:</strong> legal@ifudda.co.uk</p>
                <p className="text-white"><strong>Website:</strong> www.ifudda.co.uk</p>
                <p className="text-white"><strong>Operating as:</strong> UK Company since 2000</p>
                <p className="text-gray-400 text-sm mt-2">Registered in England & Wales | VAT registration available on request</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">© 2000-2026 ifudda. All rights reserved. | UK Company | Age Verification Required</p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;