import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, RotateCcw, Star, MapPin, Calendar, Shield,
  Heart, Share2, Flag, ChevronRight, CheckCircle, ArrowLeft,
  MessageSquare, User
} from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import GigCard from '../../components/gigs/GigCard';
import { GigDetailSkeleton } from '../../components/common/Skeleton';
import api from '../../utils/api';
import { formatPrice, formatDate, timeAgo, getImageUrl, getStatusClass } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const GigDetailPage = () => {
  const { id } = useParams();
  const { user, isClient } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [similarGigs, setSimilarGigs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [gigRes, reviewsRes] = await Promise.all([
          api.get(`/gigs/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setGig(gigRes.data.gig);
        setSimilarGigs(gigRes.data.similarGigs || []);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        toast.error('Gig not found');
        navigate('/gigs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      navigate('/login');
      return;
    }
    if (!isClient) {
      toast.error('Switch to client role to place orders');
      return;
    }
    if (!orderMessage.trim()) {
      toast.error('Please describe your requirements');
      return;
    }

    setOrderLoading(true);
    try {
      const { data } = await api.post('/orders', {
        gigId: gig._id,
        message: orderMessage,
      });
      toast.success('Order placed successfully! 🎉');
      setShowOrderModal(false);
      navigate('/dashboard/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-20">
        <div className="container-app">
          <GigDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!gig) return null;

  const images = gig.images?.length > 0
    ? gig.images
    : ['https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop'];

  const freelancer = typeof gig.freelancerId === 'object' ? gig.freelancerId : null;

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <div className="container-app">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/gigs" className="hover:text-primary-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Browse Gigs
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">{gig.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white truncate max-w-xs">{gig.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge-primary">{gig.category}</span>
                {gig.isFeatured && <span className="badge-warning">⭐ Featured</span>}
              </div>
              <h1 className="text-3xl font-display font-bold text-white leading-snug mb-4">
                {gig.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <StarRating rating={gig.rating} count={gig.reviewsCount} size="md" />
                <span>{gig.ordersCount || 0} orders</span>
                <span>{gig.views || 0} views</span>
              </div>
            </div>

            {/* Freelancer Info */}
            {freelancer && (
              <Link to={`/freelancer/${freelancer._id}`} className="flex items-center gap-4 group">
                <img
                  src={freelancer.avatar || gig.freelancerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${gig.freelancerName}`}
                  alt={gig.freelancerName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-500/40"
                />
                <div>
                  <p className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {gig.freelancerName}
                  </p>
                  {freelancer.bio && (
                    <p className="text-sm text-gray-400 max-w-sm">{freelancer.bio.substring(0, 80)}...</p>
                  )}
                  {freelancer.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {freelancer.location}
                    </p>
                  )}
                </div>
              </Link>
            )}

            {/* Image Gallery */}
            <div>
              <div className="rounded-2xl overflow-hidden aspect-video bg-surface-elevated mb-3">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={getImageUrl(images[activeImage])}
                  alt={gig.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop';
                  }}
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-primary-500' : 'border-transparent hover:border-white/20'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&auto=format&fit=crop';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-display font-bold text-white mb-4">About This Gig</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{gig.description}</p>
            </div>

            {/* Tags */}
            {gig.tags?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/gigs?search=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 rounded-full bg-surface-elevated border border-surface-border
                                 text-sm text-gray-400 hover:text-primary-400 hover:border-primary-500/30 transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Freelancer Stats */}
            {freelancer && (
              <div className="card">
                <h2 className="text-xl font-display font-bold text-white mb-6">About the Freelancer</h2>
                <div className="flex items-start gap-6">
                  <img
                    src={freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${gig.freelancerName}`}
                    alt={gig.freelancerName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-500/30 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{gig.freelancerName}</h3>
                    {freelancer.bio && <p className="text-gray-400 text-sm mb-4 leading-relaxed">{freelancer.bio}</p>}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { icon: Star, label: 'Rating', value: `${gig.rating} (${gig.reviewsCount} reviews)` },
                        { icon: Calendar, label: 'Member Since', value: formatDate(freelancer.createdAt) },
                        { icon: MapPin, label: 'Location', value: freelancer.location || 'Global' },
                        { icon: CheckCircle, label: 'Delivery Time', value: `${gig.deliveryTime} days` },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-2 text-sm">
                          <Icon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">{label}</p>
                            <p className="text-gray-200">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {freelancer.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.map(skill => (
                          <span key={skill} className="badge-primary">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white">
                  Reviews {reviews.length > 0 && `(${reviews.length})`}
                </h2>
                {gig.rating > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-white">{Number(gig.rating).toFixed(1)}</span>
                    <div>
                      <StarRating rating={gig.rating} size="md" showCount={false} />
                      <p className="text-xs text-gray-500">{gig.reviewsCount} reviews</p>
                    </div>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review._id} className="pb-6 border-b border-surface-border last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.userId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId?.name}`}
                          alt={review.userId?.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="font-semibold text-white text-sm">{review.userId?.name}</span>
                              {review.isVerifiedPurchase && (
                                <span className="ml-2 badge-success text-xs">✓ Verified</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{timeAgo(review.createdAt)}</span>
                          </div>
                          <StarRating rating={review.rating} size="sm" showCount={false} />
                          <p className="text-gray-300 text-sm mt-2 leading-relaxed">{review.comment}</p>
                          {review.freelancerReply && (
                            <div className="mt-3 pl-4 border-l-2 border-primary-500/30">
                              <p className="text-xs text-primary-400 font-medium mb-1">Freelancer's Reply:</p>
                              <p className="text-gray-400 text-sm">{review.freelancerReply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar – Order Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card border-primary-500/20 shadow-glow-sm">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-gray-400 text-sm">Starting at</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-bold text-white">{formatPrice(gig.price)}</span>
                  </div>
                </div>

                {/* Gig details */}
                <div className="space-y-3 mb-6 pb-6 border-b border-surface-border">
                  {[
                    { icon: Clock, label: 'Delivery Time', value: `${gig.deliveryTime} days` },
                    { icon: RotateCcw, label: 'Revisions', value: gig.revisions === 99 ? 'Unlimited' : gig.revisions },
                    { icon: Shield, label: 'Secure Payment', value: 'Money-back guarantee' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-400">
                        <Icon className="w-4 h-4 text-primary-400" /> {label}
                      </span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Order Button */}
                {user?._id?.toString() === gig.freelancerId?._id?.toString() || user?._id?.toString() === gig.freelancerId?.toString() ? (
                  <Link to={`/dashboard/edit-gig/${gig._id}`} className="btn-secondary w-full justify-center">
                    Edit This Gig
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) { navigate('/login'); return; }
                      setShowOrderModal(true);
                    }}
                    className="btn-primary w-full justify-center text-base py-4"
                  >
                    Continue to Order →
                  </button>
                )}

                <div className="flex items-center justify-center gap-4 mt-4">
                  <button className="btn-ghost text-sm gap-1.5">
                    <Heart className="w-4 h-4" /> Save
                  </button>
                  <button className="btn-ghost text-sm gap-1.5">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button className="btn-ghost text-sm gap-1.5 text-gray-500">
                    <Flag className="w-4 h-4" /> Report
                  </button>
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t border-surface-border">
                  <p className="text-xs text-gray-500 text-center mb-3">Protected by Freelance Connect</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> Secure</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> Verified</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Rated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Gigs */}
        {similarGigs.length > 0 && (
          <section className="mt-20">
            <h2 className="section-title mb-8">Similar Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarGigs.slice(0, 4).map((g, i) => (
                <GigCard key={g._id} gig={g} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">Place Your Order</h2>
              <button onClick={() => setShowOrderModal(false)} className="btn-ghost p-2">✕</button>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-surface-elevated rounded-xl">
              <img
                src={getImageUrl(gig.images?.[0])}
                alt={gig.title}
                className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{gig.title}</p>
                <p className="text-gray-400 text-xs">{gig.freelancerName} · {gig.deliveryTime} days delivery</p>
              </div>
              <span className="font-bold text-white">{formatPrice(gig.price)}</span>
            </div>

            <div className="form-group mb-6">
              <label className="input-label">Describe Your Requirements *</label>
              <textarea
                value={orderMessage}
                onChange={(e) => setOrderMessage(e.target.value)}
                rows={5}
                placeholder="Tell the freelancer what you need, any specific requirements, deadlines, or examples..."
                className="input resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{orderMessage.length}/1000 characters</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                disabled={orderLoading || !orderMessage.trim()}
                className="btn-primary flex-1 justify-center"
              >
                {orderLoading ? 'Placing...' : `Place Order • ${formatPrice(gig.price)}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GigDetailPage;
