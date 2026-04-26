import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, DollarSign, Clock, Tags } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../../utils/helpers';

const CreateGigPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    description: '',
    price: '',
    deliveryTime: '',
    revisions: 1,
    tags: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      images.forEach(image => {
        data.append('images', image);
      });

      await api.post('/gigs', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Gig published successfully!');
      navigate('/dashboard/my-gigs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="section-title text-2xl">Create a New Gig</h1>
        <p className="text-gray-400 mt-1">Offer your services to the Freelance Connect community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card space-y-5">
          <h2 className="text-lg font-semibold text-white border-b border-surface-border pb-3 mb-4">Basic Information</h2>
          
          <div className="form-group">
            <label className="input-label">Gig Title *</label>
            <input
              type="text"
              name="title"
              required
              minLength={10}
              maxLength={100}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. I will design a modern minimalist logo for your business"
              className="input text-lg font-medium"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Must start with "I will..." for better visibility</span>
              <span>{formData.title.length}/100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="input-label">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-surface-card">{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Search Tags (comma separated)</label>
              <div className="relative">
                <Tags className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. logo, branding, minimalist"
                  className="input pl-10"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Description *</label>
            <textarea
              name="description"
              required
              minLength={50}
              maxLength={2000}
              rows={8}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service in detail. What's included? What do you need from the client to get started?"
              className="input resize-y min-h-[150px]"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{formData.description.length}/2000</p>
          </div>
        </div>

        {/* Pricing & Scope */}
        <div className="card space-y-5">
          <h2 className="text-lg font-semibold text-white border-b border-surface-border pb-3 mb-4">Pricing & Scope</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="form-group">
              <label className="input-label">Price (USD) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  required
                  min={5}
                  max={10000}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5"
                  className="input pl-10 text-lg font-bold text-emerald-400"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">Delivery Time (Days) *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="deliveryTime"
                  required
                  min={1}
                  max={90}
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  placeholder="3"
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">Revisions Included *</label>
              <select
                name="revisions"
                required
                value={formData.revisions}
                onChange={handleChange}
                className="input"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n} className="bg-surface-card">{n}</option>
                ))}
                <option value={99} className="bg-surface-card">Unlimited</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="card space-y-5">
          <div className="flex justify-between items-end border-b border-surface-border pb-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Gig Gallery *</h2>
              <p className="text-xs text-gray-400 mt-1">Upload up to 5 images (JPG, PNG). The first image will be your gig's cover.</p>
            </div>
            <span className="text-xs font-medium bg-surface-elevated px-2 py-1 rounded">{images.length}/5</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Upload Button */}
            {images.length < 5 && (
              <label className="aspect-video md:aspect-square flex flex-col items-center justify-center gap-2 
                              border-2 border-dashed border-surface-border hover:border-primary-500/50 
                              rounded-xl cursor-pointer bg-surface-elevated/50 hover:bg-surface-elevated transition-colors">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Browse Images</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Previews */}
            {imagePreviews.map((preview, index) => (
              <div key={preview} className="relative aspect-video md:aspect-square rounded-xl overflow-hidden group">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                {index === 0 && (
                  <div className="absolute top-2 left-2 badge-primary text-[10px] px-1.5 py-0.5">Cover</div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-surface-border">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading ? 'Publishing...' : 'Publish Gig'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGigPage;
