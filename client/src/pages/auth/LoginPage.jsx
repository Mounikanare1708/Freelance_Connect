import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      client: { email: 'emma@demo.com', password: 'password123' },
      freelancer: { email: 'alex@demo.com', password: 'password123' },
      both: { email: 'marcus@demo.com', password: 'password123' },
    };
    setFormData(demoAccounts[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue to Freelance Connect</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between">
                <label className="input-label mb-0">Password</label>
                <Link to="#" className="text-xs text-primary-400 hover:text-primary-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="btn-primary w-full justify-center py-3.5 text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Login Shortcuts */}
          <div className="mt-8 pt-6 border-t border-surface-border">
            <p className="text-xs text-center text-gray-500 mb-4">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleDemoLogin('client')} className="btn-secondary text-xs px-2 py-2">
                <User className="w-3 h-3 mr-1" /> Client
              </button>
              <button onClick={() => handleDemoLogin('freelancer')} className="btn-secondary text-xs px-2 py-2">
                <User className="w-3 h-3 mr-1" /> Freelancer
              </button>
              <button onClick={() => handleDemoLogin('both')} className="btn-secondary text-xs px-2 py-2 text-primary-400 border-primary-500/30">
                <User className="w-3 h-3 mr-1" /> Both
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold inline-flex items-center gap-1">
              Sign up <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
