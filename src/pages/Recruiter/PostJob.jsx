import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [location, setLocation] = useState('');
  const [workSetup, setWorkSetup] = useState('Remote');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          type,
          experienceLevel,
          location,
          workSetup,
          minSalary: minSalary ? Number(minSalary) : undefined,
          maxSalary: maxSalary ? Number(maxSalary) : undefined,
          description,
          skills: skills ? skills.split(',').map(s => s.trim()) : [],
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post job');
      }

      navigate('/recruiter');
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-job-page bg-light section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="post-job-header">
          <h1>Post a New Job</h1>
          <p className="text-muted">Fill out the details below to publish your opening to thousands of job seekers.</p>
        </div>

        <div className="glass-panel post-job-form-container">
          <form onSubmit={handleSubmit} className="post-job-form">
            
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label>Job Title*</label>
                <input type="text" className="input-field" required placeholder="e.g. Senior Product Designer" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label>Job Type*</label>
                  <select className="input-field" required value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Select type...</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="form-group half">
                  <label>Experience Level*</label>
                  <select className="input-field" required value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                    <option value="">Select experience...</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Director">Director+</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Location & Salary</h3>
              <div className="form-row">
                <div className="form-group half">
                  <label>Location*</label>
                  <input type="text" className="input-field" required placeholder="e.g. New York, NY or Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="form-group half">
                  <label>Work Setup</label>
                  <select className="input-field" value={workSetup} onChange={(e) => setWorkSetup(e.target.value)}>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Minimum Salary</label>
                  <input type="number" className="input-field" placeholder="e.g. 80000" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
                </div>
                <div className="form-group half">
                  <label>Maximum Salary</label>
                  <input type="number" className="input-field" placeholder="e.g. 120000" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Job Details</h3>
              <div className="form-group">
                <label>Job Description*</label>
                <textarea className="input-field text-area" rows="6" required placeholder="Describe the role, responsibilities, and ideal candidate..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>

              <div className="form-group">
                <label>Required Skills (Comma separated)</label>
                <input type="text" className="input-field" placeholder="e.g. React, Node.js, TypeScript" value={skills} onChange={(e) => setSkills(e.target.value)}/>
              </div>
            </div>

            <div className="form-actions border-top pt-4">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/recruiter')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Job'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
