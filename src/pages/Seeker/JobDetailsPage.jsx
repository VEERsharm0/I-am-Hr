import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building, MapPin, DollarSign, Clock, Calendar, CheckCircle, Share2, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './JobDetailsPage.css';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user, userRole } = useAuth();
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    applicantName: user?.fullName || '',
    applicantEmail: user?.email || '',
    applicantPhone: '',
    coverLetter: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch('/api/jobs'); // Fetch all active jobs and find it (for now)
        if (!response.ok) throw new Error('Failed to fetch job');
        const jobs = await response.json();
        const foundJob = jobs.find(j => j._id === id);
        
        if (!foundJob) throw new Error('Job not found');
        setJob(foundJob);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check if they already applied
    const checkAppliedStatus = async () => {
      if (userRole === 'seeker') {
        try {
          const token = localStorage.getItem('access_token');
          const res = await fetch('/api/applications/seeker', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const apps = await res.json();
            if (apps.some(app => app.jobId._id === id || app.jobId === id)) {
              setApplied(true);
            }
          }
        } catch (e) {
          console.error("Could not verify status");
        }
      }
    };

    fetchJob();
    checkAppliedStatus();
  }, [id, userRole]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/applications/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="section-padding text-center">Loading job details...</div>;
  if (error) return <div className="section-padding text-center" style={{color: 'red'}}>{error}</div>;
  if (!job) return <div className="section-padding text-center">Job not found</div>;

  return (
    <div className="job-details-page bg-light animate-fade-in">
      {/* Header Banner */}
      <div className="job-details-header">
        <div className="container">
          <div className="job-details-title-row">
            <div className="job-company-logo-large">
              {job.companyName ? job.companyName.charAt(0) : 'C'}
            </div>
            <div className="job-title-info">
              <h1>{job.title}</h1>
              <div className="job-company-name">
                <Building size={18} /> {job.companyName}
              </div>
            </div>
            <div className="job-actions">
              <button className="icon-btn"><Share2 size={20}/></button>
              <button className="icon-btn"><Bookmark size={20}/></button>
              
              {userRole === 'seeker' ? (
                !applied ? (
                  <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
                    Apply Now
                  </button>
                ) : (
                  <button className="btn btn-success" disabled>
                    <CheckCircle size={18} /> Applied
                  </button>
                )
              ) : (
                <button className="btn btn-outline" disabled title="Only job seekers can apply">
                  Employer View
                </button>
              )}
            </div>
          </div>

          <div className="job-quick-stats glass-panel">
            <div className="stat-item">
              <MapPin className="stat-icon" />
              <div>
                <span className="stat-label">Location</span>
                <span className="stat-value">{job.location}</span>
              </div>
            </div>
            <div className="stat-item">
              <DollarSign className="stat-icon" />
              <div>
                <span className="stat-label">Salary</span>
                <span className="stat-value">
                  {job.minSalary && job.maxSalary 
                    ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                    : 'Not specified'}
                </span>
              </div>
            </div>
            <div className="stat-item">
              <Clock className="stat-icon" />
              <div>
                <span className="stat-label">Job Type</span>
                <span className="stat-value">{job.type}</span>
              </div>
            </div>
            <div className="stat-item">
              <Calendar className="stat-icon" />
              <div>
                <span className="stat-label">Experience</span>
                <span className="stat-value">{job.experienceLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container section-padding">
        <div className="job-content-grid">
          <div className="job-main-content">
            <section className="detail-section">
              <h2>Job Description</h2>
              <p>{job.description}</p>
            </section>

            <section className="detail-section">
              <h2>Required Skills</h2>
              <div className="job-skills-large">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill, idx) => (
                    <span key={idx} className="skill-pill-large">{skill}</span>
                  ))
                ) : (
                  <span className="text-muted">No specific skills listed.</span>
                )}
              </div>
            </section>
          </div>

          <div className="job-sidebar">
            <div className="company-info-card glass-panel">
              <h3>About {job.companyName}</h3>
              <p className="company-desc">Join our growing team and work on high-impact projects.</p>
              <Link to="/companies" className="btn btn-outline btn-sm view-company-btn">View All Companies</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h3>Apply for {job.title}</h3>
              <button className="close-btn" onClick={() => setShowApplyModal(false)}>&times;</button>
            </div>
            {applyError && <div style={{color: 'red', marginBottom: '1rem', padding: '0 1.5rem'}}>{applyError}</div>}
            
            <form onSubmit={handleApply} className="apply-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.applicantName}
                  onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  required 
                  value={formData.applicantEmail}
                  onChange={(e) => setFormData({...formData, applicantEmail: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  required 
                  placeholder="+1 234 567 890"
                  value={formData.applicantPhone}
                  onChange={(e) => setFormData({...formData, applicantPhone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Cover Letter / Additional Details</label>
                <textarea 
                  className="input-field" 
                  rows="4" 
                  placeholder="Include a link to your portfolio or resume here, and tell us why you are a great fit..."
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
