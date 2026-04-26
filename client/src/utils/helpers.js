/**
 * Format price with $ prefix
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '$0';
  return `$${Number(price).toLocaleString()}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date to relative time (e.g. "2 days ago")
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

/**
 * Truncate text to a max length
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Get status badge class
 */
export const getStatusClass = (status) => {
  const map = {
    pending: 'status-pending',
    accepted: 'status-accepted',
    rejected: 'status-rejected',
    'in-progress': 'status-in-progress',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
  };
  return map[status] || 'badge';
};

/**
 * Get status display label
 */
export const getStatusLabel = (status) => {
  const map = {
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
};

/**
 * Render star rating (returns array of filled/half/empty)
 */
export const getRatingStars = (rating) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('full');
    else if (i === full && half) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

/**
 * Get image URL (handle both local uploads and external URLs)
 */
export const getImageUrl = (src) => {
  if (!src) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop';
  if (src.startsWith('http')) return src;
  const backendUrl = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || '')
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
  return `${backendUrl}${src}`;
};

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const CATEGORIES = [
  'Programming & Tech',
  'Design & Creative',
  'Writing & Translation',
  'Digital Marketing',
  'Video & Animation',
  'Music & Audio',
  'Data & Analytics',
  'Business & Finance',
];

export const CATEGORY_ICONS = {
  'Programming & Tech': '💻',
  'Design & Creative': '🎨',
  'Writing & Translation': '✍️',
  'Digital Marketing': '📱',
  'Video & Animation': '🎬',
  'Music & Audio': '🎵',
  'Data & Analytics': '📊',
  'Business & Finance': '💼',
};
