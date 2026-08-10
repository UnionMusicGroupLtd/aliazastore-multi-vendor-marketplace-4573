import { useState } from 'react';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * DIRECT ADMIN ACCESS PAGE
 * Bypasses all auth checks for emergency admin access
 */
export default function AdminDirectAccess() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDirectAccess = () => {
    // Simple access code for testing
    if (accessCode === 'admin2026') {
      console.log('🛡️ DIRECT ADMIN ACCESS GRANTED');
      // Set a temporary admin flag in localStorage
      localStorage.setItem('ifudda_admin_access', 'true');
      navigate('/admin');
    } else if (accessCode === '') {
      setError('Please enter an access code');
    } else {
      setError('Invalid access code. Try "admin2026"');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-white/80 text-sm">Direct Dashboard Entry</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-blue-300 text-sm font-semibold mb-1">Emergency Admin Access</p>
                <p className="text-blue-200/70 text-xs">
                  This page bypasses normal authentication for direct admin dashboard access.
                  Use access code: <span className="text-blue-300 font-mono">admin2026</span>
                </p>
              </div>
            </div>
          </div>

          {/* Access Code Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Access Code
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter admin access code"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleDirectAccess()}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Access Button */}
            <button
              onClick={handleDirectAccess}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              Access Admin Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-300 text-xs mb-2 font-semibold">Quick Instructions:</p>
            <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside">
              <li>Enter access code: <span className="text-red-400 font-mono">admin2026</span></li>
              <li>Click "Access Admin Dashboard" button</li>
              <li>You'll be redirected to /admin immediately</li>
              <li>No login required - direct access</li>
            </ol>
          </div>

          {/* Alternative Access */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-3">Alternative access methods:</p>
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="text-red-400 hover:text-red-300 text-sm underline"
              >
                Regular Admin Login
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-gray-300 text-sm underline"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800/50 border-t border-gray-700 p-4 text-center">
          <p className="text-gray-500 text-xs">
            🔐 Secure Admin Access • ifudda Platform • UK Since 2000
          </p>
        </div>
      </div>
    </div>
  );
}