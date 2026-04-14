import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Briefcase, Calendar, MapPin, Camera } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, userRole, updateProfile, uploadAvatar } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.user_metadata?.full_name || '',
        location: user.location || user.user_metadata?.location || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });
    try {
      await uploadAvatar(file);
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload image' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const profileImageUrl = user?.profileImage || user.user_metadata?.profile_image;

  // Calculate join date if createdAt exists
  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="profile-page bg-light section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="dashboard-header mb-4">
          <h1>My Profile</h1>
          <p className="text-muted">Manage your personal information and account settings.</p>
        </div>

        <div className="glass-panel profile-content">
          <div className="profile-header">
            <div className="profile-avatar-large-wrapper">
              <div className="profile-avatar-large">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="avatar-img" />
                ) : (
                  user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                )}
                <label htmlFor="avatar-upload" className="avatar-upload-overlay">
                  <Camera size={24} />
                  <span>{isUploading ? '...' : 'Update'}</span>
                </label>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  hidden 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
            <div className="profile-titles">
              {isEditing ? (
                <div className="edit-title-group">
                  <input 
                    type="text" 
                    name="fullName"
                    className="form-control h2-input"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter Full Name"
                  />
                </div>
              ) : (
                <h2>{user?.fullName || user.user_metadata?.full_name || 'User'}</h2>
              )}
              <span className={`status-badge ${userRole === 'recruiter' ? 'draft' : 'active'}`}>
                {userRole === 'recruiter' ? 'Employer / Recruiter' : 'Job Seeker'}
              </span>
            </div>
          </div>

          <div className="profile-sections">
            <div className="profile-section">
              <div className="section-header-row">
                <h3>Personal Information</h3>
                {!isEditing && (
                  <button className="btn btn-sm btn-outline" onClick={() => setIsEditing(true)}>Edit</button>
                )}
              </div>
              
              {message.text && (
                <div className={`alert alert-${message.type}`} style={{ 
                  padding: '10px', 
                  borderRadius: '8px', 
                  marginBottom: '15px',
                  backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: message.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {message.text}
                </div>
              )}

              <div className="info-grid">
                {/* Full Name removed from grid as requested, since it's in the header */}
                
                <div className="info-item">
                  <div className="info-icon">
                    <Mail size={18} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{user?.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">{joinDate}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="info-text">
                    <span className="info-label">Location</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="location"
                        className="form-control"
                        placeholder="e.g. New York, USA"
                        value={formData.location}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '5px' }}
                      />
                    ) : (
                      <span className="info-value">{user?.location || user.user_metadata?.location || 'Update your location'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="section-header-row">
                <h3>Account Activity</h3>
              </div>
              <div className="activity-stats">
                {userRole === 'recruiter' ? (
                  <>
                    <div className="stat-box">
                      <Briefcase size={24} color="var(--primary)" />
                      <div className="stat-text">
                        <strong>Jobs Posted</strong>
                        <span>View your dashboard to manage postings</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat-box">
                      <Briefcase size={24} color="var(--primary)" />
                      <div className="stat-text">
                        <strong>Jobs Applied</strong>
                        <span>Keep track of your applications</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="profile-actions">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
