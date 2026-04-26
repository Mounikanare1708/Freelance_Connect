import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Clock, RotateCcw, ShoppingCart } from 'lucide-react';
import StarRating from '../common/StarRating';
import { formatPrice, getImageUrl, truncate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const GigCard = ({ gig, index = 0 }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(user?.savedGigs?.includes(gig._id));
  const [savingState, setSavingState] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to save gigs');
      return;
    }
    setSavingState(true);
    try {
      const { data } = await api.post(`/users/save-gig/${gig._id}`);
      setSaved(data.saved);
      toast.success(data.message);
    } catch {
      toast.error('Failed to save gig');
    } finally {
      setSavingState(false);
    }
  };

  const imageUrl = !imgError && gig.images?.[0]
    ? getImageUrl(gig.images[0])
    : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/gigs/${gig._id}`} className="block group">
        <div className="card-hover h-full flex flex-col">
          {/* Image */}
          <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-surface-elevated">
            <img
              src={imageUrl}
              alt={gig.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={savingState}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                         backdrop-blur-md border transition-all duration-200
                         ${saved
                           ? 'bg-red-500/30 border-red-500/50 text-red-400'
                           : 'bg-black/30 border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400'
                         }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-red-400' : ''}`} />
            </button>

            {/* Category badge */}
            <div className="absolute bottom-3 left-3">
              <span className="badge-primary backdrop-blur-md text-xs">{gig.category}</span>
            </div>
          </div>

          {/* Freelancer info */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={gig.freelancerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${gig.freelancerName}`}
              alt={gig.freelancerName}
              className="w-7 h-7 rounded-full object-cover border border-primary-500/30"
            />
            <span className="text-sm text-gray-400 font-medium">{gig.freelancerName}</span>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-sm mb-3 group-hover:text-primary-400 transition-colors leading-snug flex-1">
            {truncate(gig.title, 80)}
          </h3>

          {/* Rating */}
          {gig.reviewsCount > 0 && (
            <StarRating rating={gig.rating} count={gig.reviewsCount} />
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {gig.deliveryTime}d delivery
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> {gig.revisions === 99 ? '∞' : gig.revisions} revisions
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-border">
            <div>
              <span className="text-xs text-gray-500">Starting at</span>
              <p className="font-bold text-white text-lg">{formatPrice(gig.price)}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20
                            flex items-center justify-center text-primary-400
                            group-hover:bg-primary-500 group-hover:text-white transition-all">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GigCard;
