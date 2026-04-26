import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import GigCard from '../../components/gigs/GigCard';
import { GigCardSkeleton } from '../../components/common/Skeleton';
import api from '../../utils/api';
import { CATEGORIES, debounce } from '../../utils/helpers';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const BrowseGigsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filter state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
  });

  const fetchGigs = useCallback(async (params) => {
    setLoading(true);
    try {
      const queryString = Object.entries(params)
        .filter(([, v]) => v !== '' && v !== null && v !== undefined)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');

      const { data } = await api.get(`/gigs?${queryString}`);
      setGigs(data.gigs);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGigs(filters);
  }, [filters]);

  // Sync URL params on search/category change
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    setSearchParams(params, { replace: true });
  }, [filters.search, filters.category]);

  const debouncedSearch = useCallback(
    debounce((val) => setFilters(prev => ({ ...prev, search: val, page: 1 })), 400),
    []
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });
    setSearchParams({});
  };

  const activeFilterCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort !== 'newest',
  ].filter(Boolean).length;

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <div className="container-app">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="section-title">Browse Services</h1>
          <p className="text-gray-400 mt-2">
            {loading ? 'Searching...' : `${pagination.total.toLocaleString()} services available`}
          </p>
        </div>

        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              defaultValue={filters.search}
              onChange={(e) => debouncedSearch(e.target.value)}
              placeholder="Search services, skills, categories..."
              className="input pl-12"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input pr-10 appearance-none cursor-pointer min-w-[180px]"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-surface-card">{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`btn-secondary relative ${activeFilterCount > 0 ? 'border-primary-500 text-primary-400' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View Mode */}
          <div className="flex border border-surface-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="btn-ghost text-sm text-red-400">
                      <X className="w-4 h-4" /> Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category */}
                  <div className="form-group">
                    <label className="input-label">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c} className="bg-surface-card">{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Min Price */}
                  <div className="form-group">
                    <label className="input-label">Min Price ($)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="input"
                    />
                  </div>

                  {/* Max Price */}
                  <div className="form-group">
                    <label className="input-label">Max Price ($)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="10000"
                      min="0"
                      className="input"
                    />
                  </div>

                  {/* Apply */}
                  <div className="form-group">
                    <label className="input-label">&nbsp;</label>
                    <button
                      onClick={() => {
                        fetchGigs(filters);
                        setFiltersOpen(false);
                      }}
                      className="btn-primary w-full"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>

                {/* Category Chips */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-surface-border">
                  <span className="text-sm text-gray-400 mr-2">Quick:</span>
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => handleFilterChange('category', filters.category === c ? '' : c)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all border ${
                        filters.category === c
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-surface-elevated text-gray-400 border-surface-border hover:border-primary-500/40 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Pills */}
        {(filters.category || filters.minPrice || filters.maxPrice) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.category && (
              <span className="badge-primary flex items-center gap-1.5">
                {filters.category}
                <button onClick={() => handleFilterChange('category', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.minPrice && (
              <span className="badge-primary flex items-center gap-1.5">
                Min ${filters.minPrice}
                <button onClick={() => handleFilterChange('minPrice', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="badge-primary flex items-center gap-1.5">
                Max ${filters.maxPrice}
                <button onClick={() => handleFilterChange('maxPrice', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Gig Grid / List */}
        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 12 }).map((_, i) => <GigCardSkeleton key={i} />)}
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">No gigs found</h3>
            <p className="text-gray-400 mb-8">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 max-w-3xl'}`}>
              {gigs.map((gig, i) => (
                <GigCard key={gig._id} gig={gig} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                >
                  ← Previous
                </button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      filters.page === p
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={filters.page >= pagination.pages}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseGigsPage;
