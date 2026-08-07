import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShoppingBag, Heart, Lock, Truck, Star, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const IfuddaHome = () => {
  const [ageVerified, setAgeVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(true);
  const { getCartCount } = useCart();

  useEffect(() => {
    // Check if user has already verified age
    const verified = localStorage.getItem('ifudda_age_verified');
    if (verified === 'true') {
      setAgeVerified(true);
      setShowVerification(false);
    }
  }, []);

  const handleAgeVerification = (isOver18: boolean) => {
    if (isOver18) {
      setAgeVerified(true);
      localStorage.setItem('ifudda_age_verified', 'true');
      setShowVerification(false);
      // Log verification
      console.log('Age verification passed - User confirmed 18+');
    } else {
      // Redirect to a safe site
      window.location.href = 'https://www.google.com';
    }
  };

  const categories = [
    { name: 'Vibrators', image: 'https://images.pexels.com/photos/11482458/pexels-photo-11482458.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', count: 45 },
    { name: 'Couples Toys', image: 'https://images.pexels.com/photos/33538414/pexels-photo-33538414.png?auto=compress&cs=tinysrgb&h=300&w=300', count: 32 },
    { name: 'Lingerie', image: 'https://images.pexels.com/photos/12456285/pexels-photo-12456285.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', count: 28 },
    { name: 'Massage', image: 'https://images.pexels.com/photos/33538415/pexels-photo-33538415.png?auto=compress&cs=tinysrgb&h=300&w=300', count: 19 },
    { name: 'Bondage', image: 'https://images.pexels.com/photos/36339062/pexels-photo-36339062.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', count: 24 },
    { name: 'Lubricants', image: 'https://images.pexels.com/photos/33525723/pexels-photo-33525723.jpeg?auto=compress&cs=tinysrgb&h=300&w=300', count: 15 },
  ];

  const features = [
    { icon: Lock, title: 'Discreet Delivery', description: 'Plain packaging with no indication of contents' },
    { icon: Shield, title: 'Age Verified', description: 'Strict 18+ verification and security checks' },
    { icon: Truck, title: 'Fast UK Shipping', description: 'Next day delivery available across the UK' },
    { icon: CheckCircle, title: 'Quality Guaranteed', description: 'Only genuine, body-safe products' },
  ];

  const whyChooseUs = [
    '26 years of trusted service since 2000',
    'Over 500,000 satisfied customers across the UK',
    'Discreet billing and packaging guaranteed',
    'Expert customer support available 24/7',
    'Free delivery on orders over £50',
    '30-day hassle-free returns policy',
  ];

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/95 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">🔞 Age Verification Required</h1>
            <p className="text-gray-400">This website contains adult content. By entering, you confirm that you are 18 years or older.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleAgeVerification(true)}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
              I am 18 or older - Enter Site
            </button>
            
            <button
              onClick={() => handleAgeVerification(false)}
              className="w-full bg-gray-800 text-gray-400 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
            >
              I am under 18 - Leave
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 Your privacy is protected. Secure SSL encryption.</p>
            <p className="mt-2">By entering this site, you agree to our Terms & Conditions.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <span className="text-2xl font-bold text-white">ifudda</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link to="/cart" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <ShoppingBag className="w-5 h-5 mr-1" />
                {getCartCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
            </nav>

            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="md:hidden">
              <Link to="/login" className="text-white text-sm">Sign In</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Premium Adult 
            <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent"> Wellness</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discreet delivery • Quality guaranteed • UK trusted since 2000
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
            >
              Learn More
            </Link>
            <Link
              to="/login"
              className="bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
              <feature.icon className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Shop by Category</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to="/products"
              className="group bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all duration-200"
            >
              <div className="aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-center">{category.name}</h3>
                <p className="text-gray-400 text-sm text-center">{category.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-red-500/10 to-pink-600/10 rounded-2xl p-8 border border-red-500/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose ifudda?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center space-x-2 text-gray-400">
            <Shield className="w-6 h-6" />
            <span>SSL Secure</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Lock className="w-6 h-6" />
            <span>Discreet Billing</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Heart className="w-6 h-6" />
            <span>Body Safe</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Star className="w-6 h-6" />
            <span>4.9★ Rating</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">i</span>
                </div>
                <span className="text-xl font-bold text-white">ifudda</span>
              </div>
              <p className="text-gray-400 text-sm">Premium adult wellness products. UK trusted since 2000.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">Products</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
                <li><Link to="/cart" className="text-gray-400 hover:text-white text-sm">Shopping Cart</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white text-sm">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">support@ifudda.co.uk</p>
              <p className="text-gray-400 text-sm mt-2">24/7 Customer Support</p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">© 2000-2026 ifudda. All rights reserved. | UK Company | Age Verification Required</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IfuddaHome;