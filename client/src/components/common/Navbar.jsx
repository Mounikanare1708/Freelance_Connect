import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Menu, X, ChevronDown, Sun, Moon,
  User, Settings, LogOut, Briefcase, ShoppingBag, Plus, Zap
} from 'lucide-react';
import { getImageUrl } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isFreelancer, isClient } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Browse Gigs', href: '/gigs' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-xl shadow-card border-b border-surface-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white hidden sm:block">
              Freelance<span className="text-gradient">Connect</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gigs, skills, categories..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-elevated border border-surface-border
                           text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500
                           focus:ring-1 focus:ring-primary-500/30 text-sm transition-all"
              />
            </div>
          </form>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`btn-ghost text-sm ${location.pathname === link.href ? 'text-primary-400' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2 rounded-lg"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <>
                {/* Create Gig Button (Freelancers) */}
                {isFreelancer && (
                  <Link to="/dashboard/create-gig" className="btn-primary py-2 px-4 text-sm hidden sm:flex">
                    <Plus className="w-4 h-4" /> Post Gig
                  </Link>
                )}

                {/* Notifications */}
                <Link to="/dashboard/notifications" className="btn-ghost p-2 rounded-lg relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <img
                      src={getImageUrl(user.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-500/50"
                    />
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-surface-card border border-surface-border
                                   rounded-2xl shadow-card overflow-hidden"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-surface-border">
                          <p className="font-semibold text-white text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                          <span className="badge-primary mt-1 capitalize">{user.role}</span>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:text-primary-400 hover:bg-white/5 transition-colors">
                            <User className="w-4 h-4" /> Dashboard
                          </Link>
                          {isFreelancer && (
                            <Link to="/dashboard/my-gigs" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:text-primary-400 hover:bg-white/5 transition-colors">
                              <Briefcase className="w-4 h-4" /> My Gigs
                            </Link>
                          )}
                          {isClient && (
                            <Link to="/dashboard/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:text-primary-400 hover:bg-white/5 transition-colors">
                              <ShoppingBag className="w-4 h-4" /> My Orders
                            </Link>
                          )}
                          <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:text-primary-400 hover:bg-white/5 transition-colors">
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                        </div>

                        <div className="border-t border-surface-border py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-ghost p-2 lg:hidden"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-surface-border overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-4 mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search gigs..."
                      className="input pl-10 py-2 text-sm"
                    />
                  </div>
                </form>

                {navLinks.map((link) => (
                  <Link key={link.href} to={link.href} className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2 transition-colors">
                    {link.label}
                  </Link>
                ))}

                {!user && (
                  <div className="flex gap-2 px-4 pt-2">
                    <Link to="/login" className="btn-secondary flex-1 justify-center text-sm py-2">Sign In</Link>
                    <Link to="/register" className="btn-primary flex-1 justify-center text-sm py-2">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
