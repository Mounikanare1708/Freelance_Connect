import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye, Plus, Search, MoreVertical, Briefcase } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatPrice, formatDate, getImageUrl } from '../../utils/helpers';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import StarRating from '../../components/common/StarRating';

const MyGigsPage = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      const { data } = await api.get('/gigs/user/my-gigs');
      setGigs(data.gigs);
    } catch (err) {
      toast.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
      try {
        await api.delete(`/gigs/${id}`);
        setGigs(gigs.filter(g => g._id !== id));
        toast.success('Gig deleted successfully');
      } catch (err) {
        toast.error('Failed to delete gig');
      }
    }
    setActionMenuOpen(null);
  };

  const filteredGigs = gigs.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl">My Gigs</h1>
          <p className="text-gray-400 mt-1">Manage your service offerings and track performance.</p>
        </div>
        <Link to="/dashboard/create-gig" className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Create New Gig
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-border bg-surface-elevated/50 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search your gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="text-sm text-gray-400">
            Total: <span className="text-white font-medium">{filteredGigs.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <TableRowSkeleton rows={4} />
            </div>
          ) : filteredGigs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No gigs found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 'No gigs match your search.' : 'You haven\'t created any gigs yet.'}
              </p>
              {!searchTerm && (
                <Link to="/dashboard/create-gig" className="btn-primary">Create Your First Gig</Link>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-elevated text-xs uppercase tracking-wider text-gray-500 border-b border-surface-border">
                  <th className="p-4 font-medium min-w-[300px]">Gig Title</th>
                  <th className="p-4 font-medium">Impressions</th>
                  <th className="p-4 font-medium">Orders</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredGigs.map((gig) => (
                  <tr key={gig._id} className={`hover:bg-white/5 transition-colors ${!gig.isActive ? 'opacity-50' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-12 rounded-lg bg-surface-elevated overflow-hidden flex-shrink-0">
                          {gig.images?.[0] && (
                            <img src={getImageUrl(gig.images[0])} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <Link to={`/gigs/${gig._id}`} className="font-medium text-white hover:text-primary-400 line-clamp-1 mb-1">
                            {gig.title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400">{gig.category}</span>
                            <span className="text-gray-600">•</span>
                            <span className="font-semibold text-emerald-400">{formatPrice(gig.price)}</span>
                            {!gig.isActive && (
                              <>
                                <span className="text-gray-600">•</span>
                                <span className="text-red-400 font-medium">Inactive</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300">{gig.views || 0}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{gig.ordersCount || 0}</td>
                    <td className="p-4">
                      {gig.reviewsCount > 0 ? (
                        <div className="flex flex-col">
                          <StarRating rating={gig.rating} size="sm" showCount={false} />
                          <span className="text-xs text-gray-500 mt-0.5">{gig.reviewsCount} reviews</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No reviews</span>
                      )}
                    </td>
                    <td className="p-4 text-right relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === gig._id ? null : gig._id)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-surface-elevated transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {actionMenuOpen === gig._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpen(null)} />
                          <div className="absolute right-8 top-10 w-36 bg-surface-elevated border border-surface-border rounded-xl shadow-xl z-20 overflow-hidden py-1">
                            <Link
                              to={`/gigs/${gig._id}`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors w-full text-left"
                            >
                              <Eye className="w-4 h-4" /> View
                            </Link>
                            <Link
                              to={`/dashboard/edit-gig/${gig._id}`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors w-full text-left"
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(gig._id)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGigsPage;
