import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, MessageSquare, CheckCircle, 
  XCircle, AlertCircle, FileText, Download, Star, Plus
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatPrice, formatDate, timeAgo, getStatusClass, getStatusLabel, getImageUrl } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { user, isClient, isFreelancer } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryFiles, setDeliveryFiles] = useState([]);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
      
      // If completed, check for existing review
      if (data.order.status === 'completed') {
        const reviewRes = await api.get(`/reviews/${data.order.gigId._id}`);
        const userReview = reviewRes.data.reviews.find(r => r.userId._id === user._id || r.userId === user._id);
        if (userReview) setExistingReview(userReview);
      }
    } catch (err) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdating(true);
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status: newStatus });
      setOrder(data.order);
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (reviewData.comment.trim().length < 10) {
      toast.error('Review comment must be at least 10 characters long');
      return;
    }
    setReviewSubmitting(true);
    try {
      const { data } = await api.post('/reviews', {
        gigId: order.gigId._id,
        orderId: order._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      setExistingReview(data.review);
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeliver = async (e) => {
    e.preventDefault();
    if (!deliveryNote.trim()) {
      toast.error('Please add a delivery note');
      return;
    }
    
    if (deliveryFiles.length === 0) {
      toast.error('You must attach at least one picture with your delivery');
      return;
    }
    
    setStatusUpdating(true);
    try {
      const formData = new FormData();
      formData.append('status', 'completed');
      formData.append('note', deliveryNote);
      deliveryFiles.forEach(file => {
        formData.append('attachments', file);
      });

      const { data } = await api.put(`/orders/${id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOrder(data.order);
      setShowDeliveryModal(false);
      setDeliveryNote('');
      setDeliveryFiles([]);
      toast.success('Order delivered successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deliver order');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <div className="pt-8"><LoadingSpinner /></div>;
  if (!order) return <div className="text-center py-12">Order not found.</div>;

  const role = user._id === order.clientId._id ? 'client' : 'freelancer';
  const otherParty = role === 'client' ? order.freelancerId : order.clientId;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard/my-orders" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-white">Order #{order._id.substring(0, 8)}</h1>
            <span className={getStatusClass(order.status)}>{getStatusLabel(order.status)}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        
        {/* Action Buttons based on status & role */}
        <div className="flex flex-wrap gap-2">
          {role === 'freelancer' && order.status === 'pending' && (
            <>
              <button disabled={statusUpdating} onClick={() => handleStatusUpdate('rejected')} className="btn-secondary text-red-400 hover:text-red-300">Reject</button>
              <button disabled={statusUpdating} onClick={() => handleStatusUpdate('accepted')} className="btn-primary">Accept Order</button>
            </>
          )}
          {role === 'freelancer' && order.status === 'accepted' && (
            <button disabled={statusUpdating} onClick={() => handleStatusUpdate('in-progress')} className="btn-primary">Start Work</button>
          )}
          {role === 'freelancer' && order.status === 'in-progress' && (
            <button disabled={statusUpdating} onClick={() => setShowDeliveryModal(true)} className="btn-primary bg-emerald-600 hover:bg-emerald-500">Deliver Order</button>
          )}
          {role === 'client' && ['pending', 'accepted'].includes(order.status) && (
            <button disabled={statusUpdating} onClick={() => handleStatusUpdate('cancelled')} className="btn-secondary text-red-400 hover:text-red-300">Cancel Order</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gig Details */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-surface-border pb-3">Gig Details</h2>
            <div className="flex gap-4">
              <img 
                src={getImageUrl(order.gigId?.images?.[0])} 
                alt="" 
                className="w-24 h-20 rounded-lg object-cover border border-surface-border"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200'; }}
              />
              <div className="flex-1">
                <Link to={`/gigs/${order.gigId._id}`} className="font-medium text-white hover:text-primary-400 text-lg line-clamp-2 mb-2">
                  {order.gigTitle}
                </Link>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400 flex items-center gap-1"><Clock className="w-4 h-4" /> {order.gigId.deliveryTime} Days</span>
                  <span className="font-bold text-emerald-400">{formatPrice(order.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Initial Requirement Message */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-surface-border pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" /> Client Requirements
            </h2>
            <div className="bg-surface-elevated p-4 rounded-xl text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
              {order.message}
            </div>
          </div>

          {/* Timeline / Status Updates */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-surface-border pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-400" /> Timeline
            </h2>
            <div className="space-y-6 pl-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Dot */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow
                    ${event.status === 'completed' ? 'bg-emerald-500' : 
                      event.status === 'cancelled' || event.status === 'rejected' ? 'bg-red-500' : 
                      event.status === 'in-progress' ? 'bg-purple-500' : 'bg-primary-500'}`}>
                    {event.status === 'completed' ? <CheckCircle className="w-4 h-4 text-white" /> :
                     event.status === 'cancelled' || event.status === 'rejected' ? <XCircle className="w-4 h-4 text-white" /> :
                     <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-elevated p-4 rounded-xl border border-surface-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold uppercase ${event.status === 'completed' ? 'text-emerald-400' : 'text-primary-400'}`}>
                        {getStatusLabel(event.status)}
                      </span>
                      <time className="text-xs text-gray-500 font-mono">{timeAgo(event.changedAt)}</time>
                    </div>
                    <div className="text-gray-300 text-sm">{event.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Note */}
          {order.status === 'completed' && order.freelancerNote && (
            <div className="card border-emerald-500/30">
              <h2 className="text-lg font-semibold text-emerald-400 mb-4 border-b border-surface-border pb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Delivery Note
              </h2>
              <div className="bg-surface-elevated p-4 rounded-xl text-gray-300 whitespace-pre-wrap text-sm leading-relaxed border border-surface-border">
                {order.freelancerNote}
                
                {order.attachments && order.attachments.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {order.attachments.map((img, idx) => (
                      <a key={idx} href={getImageUrl(img)} target="_blank" rel="noreferrer">
                        <img 
                          src={getImageUrl(img)} 
                          alt={`Delivery ${idx + 1}`} 
                          className="w-full h-32 object-cover rounded-lg border border-surface-border hover:opacity-75 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Review Section (Client only, Completed only) */}
          {role === 'client' && order.status === 'completed' && (
            <div className="card border-primary-500/30">
              <h2 className="text-lg font-semibold text-white mb-4 border-b border-surface-border pb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" /> 
                {existingReview ? 'Your Review' : 'Leave a Review'}
              </h2>
              
              {existingReview ? (
                <div className="bg-surface-elevated p-4 rounded-xl border border-surface-border">
                  <StarRating rating={existingReview.rating} size="md" showCount={false} />
                  <p className="text-gray-300 mt-3 text-sm">{existingReview.comment}</p>
                  {existingReview.freelancerReply && (
                    <div className="mt-3 pl-3 border-l-2 border-primary-500 text-sm text-gray-400">
                      <span className="text-primary-400 text-xs mb-1 block">Freelancer reply:</span>
                      {existingReview.freelancerReply}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({...reviewData, rating: star})}
                          className="focus:outline-none"
                        >
                          <Star className={`w-8 h-8 ${star <= reviewData.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Your Feedback</label>
                    <textarea
                      required
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                      placeholder="How was your experience working with this freelancer?"
                      className="input min-h-[100px] resize-y"
                    />
                  </div>
                  <button type="submit" disabled={reviewSubmitting} className="btn-primary">
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Party Info */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-surface-border pb-3">
              {role === 'client' ? 'Freelancer Details' : 'Client Details'}
            </h2>
            <div className="flex flex-col items-center text-center">
              <img 
                src={otherParty?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParty?.name}`} 
                alt="" 
                className="w-20 h-20 rounded-full border-2 border-primary-500/30 mb-3 object-cover"
              />
              <h3 className="font-semibold text-white text-lg">{otherParty?.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{otherParty?.email}</p>
              <Link to={`/dashboard/messages?user=${otherParty?._id}`} className="btn-secondary w-full justify-center flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Message {role === 'client' ? 'Freelancer' : 'Client'}
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-surface-border pb-3">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID</span>
                <span className="text-white font-mono">{order._id.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between border-t border-surface-border pt-3 mt-3">
                <span className="text-gray-300 font-medium">Total Amount</span>
                <span className="text-emerald-400 font-bold text-lg">{formatPrice(order.amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-elevated rounded-2xl max-w-lg w-full p-6 border border-surface-border">
            <h3 className="text-xl font-display font-bold text-white mb-4">Deliver Work</h3>
            <form onSubmit={handleDeliver}>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Delivery Note / Link to Work</label>
                <textarea
                  required
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Here is the final delivery. You can access the files at..."
                  className="input min-h-[120px]"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Attachments (Images)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {deliveryFiles.map((file, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-surface-border">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setDeliveryFiles(deliveryFiles.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {deliveryFiles.length < 10 && (
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-surface-border flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setDeliveryFiles([...deliveryFiles, ...files].slice(0, 10));
                        }}
                      />
                      <Plus className="w-6 h-6 text-gray-500" />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-gray-500">You must upload at least 1 image. Maximum 10 images allowed.</p>
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowDeliveryModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={statusUpdating} className="btn-primary bg-emerald-600 hover:bg-emerald-500">
                  {statusUpdating ? 'Delivering...' : 'Submit Delivery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
