import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Briefcase, ShoppingBag, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice, timeAgo, getStatusClass, getStatusLabel } from '../../utils/helpers';
import { DashboardStatSkeleton, TableRowSkeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../context/AuthContext';

const DashboardOverview = () => {
  const { user, isFreelancer, isClient } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/users/dashboard-stats');
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
    <div className="card border-l-4 border-l-primary-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-display font-bold text-white">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <p className="text-xs text-emerald-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {trend}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="section-title text-2xl">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <DashboardStatSkeleton key={i} />)}
        </div>
        <div className="card">
          <div className="skeleton h-6 w-32 rounded mb-6" />
          <TableRowSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title text-2xl">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your account today.</p>
        </div>
        {isFreelancer && (
          <Link to="/dashboard/create-gig" className="btn-primary">
            Create New Gig
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isFreelancer && stats?.freelancer && (
          <>
            <StatCard
              title="Total Earnings"
              value={formatPrice(stats.freelancer.earnings)}
              icon={DollarSign}
              colorClass="bg-emerald-500/20 text-emerald-400"
              trend="+12% this month"
            />
            <StatCard
              title="Active Orders"
              value={stats.freelancer.active}
              icon={Clock}
              colorClass="bg-blue-500/20 text-blue-400"
            />
            <StatCard
              title="Completed Orders"
              value={stats.freelancer.completed}
              icon={CheckCircle}
              colorClass="bg-purple-500/20 text-purple-400"
            />
            <StatCard
              title="Active Gigs"
              value={stats.freelancer.totalGigs}
              icon={Briefcase}
              colorClass="bg-primary-500/20 text-primary-400"
            />
          </>
        )}

        {isClient && !isFreelancer && stats?.client && (
          <>
            <StatCard
              title="Total Spent"
              value={formatPrice(stats.client.totalSpent)}
              icon={DollarSign}
              colorClass="bg-emerald-500/20 text-emerald-400"
            />
            <StatCard
              title="Active Orders"
              value={stats.client.active}
              icon={Clock}
              colorClass="bg-blue-500/20 text-blue-400"
            />
            <StatCard
              title="Pending Requests"
              value={stats.client.pending}
              icon={AlertCircle}
              colorClass="bg-amber-500/20 text-amber-400"
            />
            <StatCard
              title="Total Orders"
              value={stats.client.totalOrders}
              icon={ShoppingBag}
              colorClass="bg-primary-500/20 text-primary-400"
            />
          </>
        )}
      </div>

      {/* Recent Activity / Orders */}
      <div className="card overflow-hidden p-0">
        <div className="p-6 border-b border-surface-border flex justify-between items-center bg-surface-elevated">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-400" /> Recent Activity
          </h2>
          <Link to="/dashboard/my-orders" className="text-sm text-primary-400 hover:text-primary-300">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-elevated/50 text-xs uppercase tracking-wider text-gray-500 border-b border-surface-border">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.client?.recentOrders?.length > 0 ? (
                stats.client.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-surface-border last:border-0 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-elevated overflow-hidden border border-surface-border flex-shrink-0">
                          {order.gigId?.images?.[0] ? (
                            <img src={order.gigId.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Briefcase className="w-5 h-5 m-2.5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <Link to={`/dashboard/orders/${order._id}`} className="font-medium text-white hover:text-primary-400">
                            {order.gigTitle}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">ID: {order._id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={getStatusClass(order.status)}>{getStatusLabel(order.status)}</span>
                    </td>
                    <td className="p-4 font-medium text-white">{formatPrice(order.amount)}</td>
                    <td className="p-4 text-sm text-gray-400">{timeAgo(order.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
