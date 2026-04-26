import { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle, Clock, ShoppingBag, 
  Star, MessageSquare, ShieldAlert, Trash2,
  MoreVertical, CheckCheck
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { timeAgo } from '../../utils/helpers';
import { TableRowSkeleton } from '../../components/common/Skeleton';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/users/notifications');
      setNotifications(data.notifications);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await api.put('/users/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const deleteNotification = (id) => {
    // Backend doesn't have a delete specific notification yet, 
    // but we can filter it out locally for now if we wanted.
    // For now, let's just show a message.
    toast.error('Individual deletion not implemented yet');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-5 h-5 text-blue-400" />;
      case 'review': return <Star className="w-5 h-5 text-amber-400" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-purple-400" />;
      case 'system': return <ShieldAlert className="w-5 h-5 text-emerald-400" />;
      default: return <Bell className="w-5 h-5 text-primary-400" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-500/10';
      case 'review': return 'bg-amber-500/10';
      case 'message': return 'bg-purple-500/10';
      case 'system': return 'bg-emerald-500/10';
      default: return 'bg-primary-500/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl">Notifications</h1>
          <p className="text-gray-400 mt-1">Stay updated with your latest activity.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAsRead}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-surface-elevated" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-elevated rounded w-3/4" />
                  <div className="h-3 bg-surface-elevated rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No notifications yet</h3>
            <p className="text-gray-400">
              When you get orders, reviews, or messages, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {notifications.map((n) => (
              <div 
                key={n._id} 
                className={`p-5 flex gap-4 transition-all hover:bg-white/5 relative group ${!n.isRead ? 'bg-primary-500/[0.03]' : ''}`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${getBg(n.type)}`}>
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-1">
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                      {n.type || 'system'}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${!n.isRead ? 'text-white font-medium' : 'text-gray-300'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(n.createdAt)}
                  </div>
                </div>

                <div className="absolute right-4 top-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteNotification(n._id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <p className="text-center text-xs text-gray-500">
          Showing last 20 notifications
        </p>
      )}
    </div>
  );
};

export default NotificationsPage;
