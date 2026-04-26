import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, Star, Zap, Shield, Clock, TrendingUp,
  Users, Briefcase, CheckCircle, ChevronRight, Sparkles
} from 'lucide-react';
import GigCard from '../components/gigs/GigCard';
import { GigCardSkeleton } from '../components/common/Skeleton';
import api from '../utils/api';
import { CATEGORIES, CATEGORY_ICONS } from '../utils/helpers';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredData, setFeaturedData] = useState({ trending: [], newest: [], topRated: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/gigs/featured');
        setFeaturedData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const stats = [
    { value: '10K+', label: 'Active Freelancers', icon: Users },
    { value: '25K+', label: 'Gigs Completed', icon: CheckCircle },
    { value: '4.9★', label: 'Average Rating', icon: Star },
    { value: '100%', label: 'Secure Payments', icon: Shield },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      desc: 'Get your project started within hours. Our platform connects you instantly.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/20',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      desc: 'Your payments and data are protected with enterprise-grade security.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
    },
    {
      icon: Star,
      title: 'Top Quality',
      desc: 'Every freelancer is verified and rated by real clients. Quality guaranteed.',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      desc: 'Our freelancers are committed to delivering your project on time, every time.',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Startup Founder',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      text: 'Found an amazing developer in minutes. The quality of work was beyond my expectations!',
      rating: 5,
    },
    {
      name: 'Lucas Martin',
      role: 'Marketing Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
      text: 'Freelance Connect saved me so much time. The platform is incredibly intuitive and the talent pool is top-notch.',
      rating: 5,
    },
    {
      name: 'Aisha Chen',
      role: 'Product Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
      text: 'As a freelancer, I\'ve grown my income by 3x since joining. The platform is a game-changer!',
      rating: 5,
    },
  ];

  const displayGigs = featuredData[activeTab] || [];

  return (
    <div className="pt-16">
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="container-app relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Announcement Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary-500/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-gray-400">
                🎉 New: AI-powered gig recommendations are here!
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
            >
              Find Freelance{' '}
              <span className="text-gradient">Talent</span>{' '}
              <br className="hidden sm:block" />
              for Any Task
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with talented students and local professionals. 
              Get your projects done fast, affordable, and with quality guaranteed.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto mb-10"
            >
              <div className="flex gap-3 p-2 glass-card rounded-2xl border border-white/10">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for any skill or service..."
                    className="w-full bg-transparent pl-12 pr-4 py-3.5 text-white placeholder-gray-400
                               focus:outline-none text-base"
                  />
                </div>
                <button type="submit" className="btn-primary rounded-xl px-8 py-3.5">
                  Search <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Popular searches */}
              <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
                <span className="text-gray-500 text-sm">Popular:</span>
                {['React Developer', 'Logo Design', 'Content Writing', 'Python', 'UI/UX'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/gigs?search=${encodeURIComponent(term)}`);
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10
                               text-gray-400 hover:text-primary-400 hover:border-primary-500/30 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.form>

            {/* Stats Row */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Icon className="w-4 h-4 text-primary-600" />
                    <span className="font-display font-bold text-2xl text-white">{value}</span>
                  </div>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-3 rounded-full bg-white/40 animate-float" />
          </div>
        </div>
      </section>

      {/* ── Categories Section ──────────────────────────────────────── */}
      <section className="py-20 bg-surface-card/50">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle mx-auto">
              Find the perfect freelancer across 8+ professional categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  to={`/gigs?category=${encodeURIComponent(cat)}`}
                  className="group card-hover flex flex-col items-center gap-3 py-6 text-center"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {CATEGORY_ICONS[cat]}
                  </span>
                  <span className="text-sm font-medium text-gray-200 group-hover:text-primary-600 transition-colors">
                    {cat}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Gigs Section ────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
          >
            <div>
              <h2 className="section-title">Discover Top Gigs</h2>
              <p className="section-subtitle">Handpicked services from our best freelancers</p>
            </div>
            <Link to="/gigs" className="btn-secondary whitespace-nowrap shrink-0">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar">
            {[
              { key: 'trending', label: '🔥 Trending', icon: TrendingUp },
              { key: 'newest', label: '✨ Newest', icon: Sparkles },
              { key: 'topRated', label: '⭐ Top Rated', icon: Star },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                  ${activeTab === key
                    ? 'bg-primary-600 text-white shadow-glow-sm'
                    : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <GigCardSkeleton key={i} />)}
            </div>
          ) : displayGigs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayGigs.map((gig, i) => (
                <GigCard key={gig._id} gig={gig} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No gigs found. Be the first to post one!</p>
              <Link to="/register" className="btn-primary mt-4">Get Started</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="py-20 bg-surface-card/50">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mx-auto">Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

            {[
              { step: '01', title: 'Find a Service', desc: 'Browse thousands of gigs or search for exactly what you need.', icon: Search, color: 'text-primary-400' },
              { step: '02', title: 'Place Your Order', desc: 'Contact the freelancer, discuss requirements, and place your order securely.', icon: ShoppingCart, color: 'text-violet-400' },
              { step: '03', title: 'Get Delivery', desc: 'Receive your completed work and approve when satisfied.', icon: CheckCircle, color: 'text-emerald-400' },
            ].map(({ step, title, desc, icon: Icon, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card text-center relative"
              >
                <div className={`inline-flex w-16 h-16 rounded-2xl bg-current/10 border border-current/20 items-center justify-center mb-6 ${color}`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <div className="absolute top-4 right-4 text-4xl font-display font-extrabold text-primary-500/10">{step}</div>
                <h3 className="text-xl font-display font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-4">
                Why Choose <span className="text-gradient">Freelance Connect</span>?
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We built Freelance Connect to make hiring and working as a freelancer 
                as smooth and secure as possible. Everything you need in one platform.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map(({ icon: Icon, title, desc, color, bg }) => (
                  <div key={title} className={`card border ${bg} p-5`}>
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <h4 className="font-semibold text-white mb-1">{title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Mock dashboard preview */}
              <div className="card border-primary-500/20 p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-violet-600 p-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                  </div>
                  <span className="text-white text-sm font-medium">Freelance Connect Dashboard</span>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: 'Total Earnings', value: '$3,240', trend: '+12%', color: 'text-emerald-400' },
                    { label: 'Active Orders', value: '8', trend: '+3', color: 'text-blue-400' },
                    { label: 'Rating', value: '4.9 ★', trend: '+0.1', color: 'text-amber-400' },
                  ].map(({ label, value, trend, color }) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-surface-elevated rounded-xl">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                        <p className={`font-bold text-lg ${color}`}>{value}</p>
                      </div>
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{trend}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 card p-3 shadow-glow-sm border-primary-500/30 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white font-semibold">Order Completed!</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-20 bg-surface-card/50">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle mx-auto">Thousands of happy clients and freelancers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-200 leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={name} className="w-10 h-10 rounded-full border-2 border-primary-500/30" />
                  <div>
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 50%, rgba(249,115,22,0.1) 100%)',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            {/* BG effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 badge-primary mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Ready to get started?
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">
                Start Your Journey Today
              </h2>
              <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of students and professionals already earning and hiring on Freelance Connect.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Create Free Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/gigs" className="btn-secondary text-lg px-8 py-4">
                  <Briefcase className="w-5 h-5" /> Browse Services
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Missing import
const ShoppingCart = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

export default HomePage;
