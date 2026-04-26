import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, User, Briefcase, ShoppingBag, 
  MessageSquare, Settings, Bell, Plus, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getImageUrl } from '../utils/helpers';

const DashboardLayout = () => {
  const { user, loading, logout, isFreelancer, isClient } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, show: true },
    { label: 'Create Gig', path: '/dashboard/create-gig', icon: Plus, show: isFreelancer },
    { label: 'My Gigs', path: '/dashboard/my-gigs', icon: Briefcase, show: isFreelancer },
    { label: 'My Orders', path: '/dashboard/my-orders', icon: ShoppingBag, show: isClient || isFreelancer },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare, show: true },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell, show: true },
    { label: 'Profile', path: '/dashboard/profile', icon: User, show: true },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings, show: true },
  ].filter(item => item.show);

  return (
    <div className="pt-16 min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-surface-card border-r border-surface-border
                        md:min-h-[calc(100vh-64px)] sticky top-16 z-30">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <img
              src={getImageUrl(user.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-12 h-12 rounded-full border-2 border-primary-500/30 object-cover"
            />
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-surface-border">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
