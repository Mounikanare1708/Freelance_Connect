import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, MapPin, Briefcase, Plus, X, Phone, Link as LinkIcon, User, Save, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/helpers';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    skills: user?.skills?.join(', ') || '',
    role: user?.role || 'client',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('avatar', file);

      const res = await api.put('/users/profile', data);

      updateUser(res.data.user);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/profile', { removeAvatar: 'true' });
      updateUser(res.data.user);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Profile photo removed!');
    } catch (err) {
      toast.error('Failed to remove photo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put('/users/profile', formData);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="section-title text-2xl">Profile Settings</h1>
        <p className="text-gray-400 mt-1">Manage your public profile and personal information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="card flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-surface-elevated overflow-hidden bg-surface-elevated">
              <img 
                src={avatarPreview || getImageUrl(user?.avatar)} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`; }}
              />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold text-white mb-1">Profile Photo</h2>
            <p className="text-sm text-gray-400 mb-3">JPG, PNG or WEBP. Max size of 5MB.</p>
            <div className="flex gap-3 justify-center sm:justify-start">
              <label className="btn-secondary text-sm px-4 py-2 cursor-pointer">
                Upload New
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
              {user?.avatar && !user.avatar.includes('dicebear') && (
                <button 
                  type="button" 
                  onClick={handleRemoveAvatar}
                  disabled={loading}
                  className="btn-ghost text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="card space-y-5">
          <h2 className="text-lg font-semibold text-white border-b border-surface-border pb-3 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="input-label">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input opacity-50 cursor-not-allowed"
                title="Email cannot be changed"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="client">Client</option>
                <option value="freelancer">Freelancer</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="form-group md:col-span-2">
              <label className="input-label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="input pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="card space-y-5">
          <h2 className="text-lg font-semibold text-white border-b border-surface-border pb-3 mb-4">Professional Details</h2>
          
          <div className="form-group">
            <label className="input-label">Bio</label>
            <textarea
              name="bio"
              rows={4}
              maxLength={500}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself..."
              className="input resize-none"
            />
            <p className="text-xs text-gray-500 text-right mt-1">{formData.bio.length}/500</p>
          </div>

          <div className="form-group">
            <label className="input-label">Skills (comma separated)</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, UI Design"
                className="input pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-8">
            {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
