import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, MessageSquare, Clock, CheckCircle, ShoppingBag } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatPrice, timeAgo, getStatusClass, getStatusLabel, getImageUrl } from '../../utils/helpers';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../context/AuthContext';

const MyOrdersPage = () => {
  const { isFreelancer, isClient } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewRole, setViewRole] = useState(isClient ? 'client' : 'freelancer'); // Toggle between buying/selling

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, viewRole]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/my?role=${viewRole}&status=${filterStatus}`);
      setOrders(data.orders);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders(); // Refresh to get updated timeline
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => ['accepted', 'in-progress'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl">Manage Orders</h1>
          <p className="text-gray-400 mt-1">Track your active projects and past deliveries.</p>
        </div>

        {/* Role Toggle for users who are both */}
        {isFreelancer && isClient && (
          <div className="flex bg-surface-elevated rounded-xl p-1 border border-surface-border w-fit shrink-0">
            <button
              onClick={() => setViewRole('client')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                viewRole === 'client' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Buying
            </button>
            <button
              onClick={() => setViewRole('freelancer')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                viewRole === 'freelancer' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Selling
            </button>
          </div>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-surface-border bg-surface-elevated/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending' },
              { id: 'accepted', label: 'Active' }, 
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  filterStatus === f.id
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">Filter applied</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <TableRowSkeleton rows={5} />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
              <p className="text-gray-400 mb-6">
                {filterStatus === 'all' 
                  ? (viewRole === 'client' ? 'You haven\'t ordered anything yet.' : 'You don\'t have any orders yet.') 
                  : `No ${filterStatus} orders found.`}
              </p>
              {viewRole === 'client' && filterStatus === 'all' && (
                <Link to="/gigs" className="btn-primary">Browse Gigs</Link>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-elevated text-xs uppercase tracking-wider text-gray-500 border-b border-surface-border">
                  <th className="p-4 font-medium min-w-[250px]">{viewRole === 'client' ? 'Gig / Freelancer' : 'Gig / Client'}</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium min-w-[120px]">Date</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {orders.map((order) => {
                  const otherParty = viewRole === 'client' ? order.freelancerId : order.clientId;
                  
                  return (
                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-start gap-4">
                          <img 
                            src={getImageUrl(order.gigId?.images?.[0])} 
                            alt="" 
                            className="w-12 h-10 rounded object-cover border border-surface-border flex-shrink-0"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100'; }}
                          />
                          <div>
                            <p className="font-medium text-white line-clamp-1 mb-1">{order.gigTitle}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <img 
                                src={otherParty?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParty?.name}`} 
                                className="w-4 h-4 rounded-full" 
                                alt="" 
                              />
                              <span>{otherParty?.name}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={getStatusClass(order.status)}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-sm">
                          <span className="text-gray-300">{timeAgo(order.createdAt)}</span>
                          <span className="text-xs text-gray-500 mt-0.5">{order.gigId?.deliveryTime}d delivery</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Actions based on role and status */}
                          {viewRole === 'freelancer' && order.status === 'pending' && (
                            <button onClick={() => handleStatusUpdate(order._id, 'accepted')} className="btn-primary py-1.5 px-3 text-xs">
                              Accept
                            </button>
                          )}
                          {viewRole === 'freelancer' && order.status === 'accepted' && (
                            <button onClick={() => handleStatusUpdate(order._id, 'in-progress')} className="btn-secondary border-purple-500/50 text-purple-400 hover:bg-purple-500/10 py-1.5 px-3 text-xs">
                              Start Work
                            </button>
                          )}
                          {viewRole === 'freelancer' && order.status === 'in-progress' && (
                            <button onClick={() => handleStatusUpdate(order._id, 'completed')} className="btn-primary bg-emerald-600 hover:bg-emerald-500 py-1.5 px-3 text-xs">
                              Deliver
                            </button>
                          )}
                          {viewRole === 'client' && order.status === 'completed' && (
                            <Link to={`/dashboard/orders/${order._id}`} className="btn-ghost text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 py-1.5 px-3 border border-amber-400/20">
                              Review
                            </Link>
                          )}
                          
                          <Link
                            to={`/dashboard/orders/${order._id}`}
                            className="p-2 text-gray-400 hover:text-white bg-surface-elevated hover:bg-surface-border rounded-lg transition-colors border border-surface-border"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
