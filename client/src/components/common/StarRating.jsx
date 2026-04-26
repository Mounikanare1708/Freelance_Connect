import { Star } from 'lucide-react';
import { getRatingStars } from '../../utils/helpers';

/**
 * Star rating display component
 * @param {number} rating - 0-5
 * @param {number} count - number of reviews
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const StarRating = ({ rating = 0, count, size = 'sm', showCount = true }) => {
  const stars = getRatingStars(Number(rating));
  const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const iconSize = sizeMap[size] || sizeMap.sm;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <Star
            key={i}
            className={`${iconSize} ${
              type === 'full'
                ? 'text-amber-400 fill-amber-400'
                : type === 'half'
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-gray-400">
          {Number(rating).toFixed(1)}
          {count !== undefined && ` (${count})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
