import { Link } from 'react-router-dom';
import { Heart, Shield, Truck, Award, Users, Clock } from 'lucide-react';

const About = () => {
  const milestones = [
    {
      year: "2000",
      title: "ifudda Founded",
      description: "Established as UK's first premium adult wellness company focused on discretion and quality."
    },
    {
      year: "2005",
      title: "Expansion",
      description: "Grew from mail-order to nationwide UK delivery with guaranteed discreet packaging."
    },
    {
      year: "2010",
      title: "Online Launch",
      description: "Launched e-commerce platform with age verification and secure online payments."
    },
    {
      year: "2015",
      title: "Premium Range",
      description: "Introduced exclusive premium products and partnerships with leading brands."
    },
    {
      year: "2020",
      title: "500K Customers",
      description: "Reached milestone of 500,000 satisfied customers across the UK."
    },
    {
      year: "2026",
      title: "Digital Excellence",
      description: "Enhanced online experience with improved age verification and customer service."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Discretion Guaranteed",
      description: "Plain packaging, discreet billing, and privacy-first approach since 2000."
    },
    {
      icon: Heart,
      title: "Quality Assurance",
      description: "Only body-safe, tested products from reputable manufacturers."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "500,000+ customers served with excellent support and satisfaction."
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description: "Fast, discreet UK shipping with plain packaging guaranteed."
    }
  ];

  const stats = [
    { value: "26+", label: "Years Experience" },
    { value: "500K+", label: "Happy Customers" },
    { value: "10K+", label: "Products Available" },
    { value: "4.9★", label: "Customer Rating" }
  ];

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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">ifudda</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            UK's trusted adult wellness retailer since 2000. Premium products, discreet service, and customer satisfaction.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Founded in 2000, ifudda has been the UK's trusted source for premium adult wellness products for over 26 years. 
                What started as a small mail-order service has evolved into a comprehensive online retailer serving over 500,000 customers nationwide.
              </p>
              <p>
                Our mission has always been simple: provide high-quality, body-safe adult products with complete discretion and exceptional customer service. 
                We understand the importance of privacy, which is why every order is delivered in plain packaging with no indication of contents.
              </p>
              <p>
                Today, we continue to uphold our founding principles while expanding our product range and improving our online experience. 
                Our commitment to quality, discretion, and customer satisfaction remains unchanged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Journey</h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1 rounded-lg font-bold">
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{milestone.title}</h3>
                    <p className="text-gray-400">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
                <value.icon className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-red-500/10 to-pink-600/10 rounded-2xl p-8 border border-red-500/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Choose ifudda?</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <Award className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold">26 Years of Trust</h4>
                  <p className="text-gray-400">Serving UK customers since 2000 with reliability and discretion.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Body-Safe Products Only</h4>
                  <p className="text-gray-400">All products tested and verified for safety and quality.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Discreet Delivery Guaranteed</h4>
                  <p className="text-gray-400">Plain packaging with no indication of contents, delivered promptly.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold">24/7 Customer Support</h4>
                  <p className="text-gray-400">Expert support available around the clock for all inquiries.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Commitment to You</h2>
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
            <p className="text-gray-300 text-lg mb-6">
              "At ifudda, we're committed to providing the best adult wellness shopping experience in the UK. 
              Our customers trust us for our quality products, discreet service, and expert support. 
              We've been doing this for 26 years, and we're just getting started."
            </p>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-white font-semibold">ifudda Team</p>
              <p className="text-gray-400 text-sm">UK-Based Adult Wellness Experts Since 2000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">i</span>
              </div>
              <span className="text-xl font-bold text-white">ifudda</span>
            </div>
            <p className="text-gray-400 mb-2">UK's trusted adult wellness retailer since 2000</p>
            <div className="flex justify-center space-x-6 mb-4">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
            <p className="text-gray-500 text-sm">© 2000-2026 ifudda. All rights reserved. | Age Verification Required</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;