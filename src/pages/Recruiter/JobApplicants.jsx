import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Mail, CheckCircle, XCircle } from 'lucide-react';
import './JobApplicants.css';

const JobApplicants = () => {
  const { jobId } = useParams();
  
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`/api/applications/job/${jobId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch applicants');
        
        const data = await res.json();
        setApplicants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error('Failed to update status');

      setApplicants(applicants.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      ));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="applicants-page bg-light section-padding">
      <div className="container">
        
        <div className="mb-4">
          <Link to="/recruiter/manage-jobs" className="back-link">
            <ArrowLeft size={16} /> Back to Manage Jobs
          </Link>
        </div>

        <div className="dashboard-header mb-4">
          <div>
            <h1>Applicants Review</h1>
            <p className="text-muted">Reviewing candidates for Job ID: {jobId}</p>
          </div>
          <div className="applicants-stats">
            <div className="stat-pill">Total: {applicants.length}</div>
            <div className="stat-pill success">Interviewing: {applicants.filter(a => a.status === 'Interviewing').length}</div>
          </div>
        </div>

        <div className="glass-panel applicants-content">
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '2rem'}}>Loading applicants...</div>
          ) : error ? (
            <div style={{textAlign: 'center', padding: '2rem', color: 'red'}}>{error}</div>
          ) : applicants.length === 0 ? (
            <div className="empty-state">
              <p>No applicants yet for this position.</p>
            </div>
          ) : (
            <div className="applicants-list">
              {applicants.map(applicant => (
                <div key={applicant._id} className="applicant-card">
                  <div className="applicant-header">
                    <div className="applicant-info">
                      <div className="applicant-avatar">
                        {applicant.applicantName.charAt(0)}
                      </div>
                      <div>
                        <h3>{applicant.applicantName}</h3>
                        <p className="text-muted text-sm">{applicant.applicantEmail} {applicant.applicantPhone && `• ${applicant.applicantPhone}`}</p>
                      </div>
                    </div>
                    <div className="applicant-score">
                      <div className={`score-ring ${applicant.matchScore > 80 ? 'high' : 'medium'}`}>
                        {applicant.matchScore}%
                      </div>
                      <span className="text-sm text-muted">AI Match</span>
                    </div>
                  </div>

                  <div className="applicant-details">
                    <div className="detail-item" style={{flex: '1 1 100%', marginBottom: '1rem'}}>
                      <span className="detail-label">Cover Letter / Details</span>
                      <p className="text-sm" style={{marginTop: '0.25rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                        {applicant.coverLetter || 'No cover letter provided.'}
                      </p>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Applied Date</span>
                      <span className="detail-value">{new Date(applicant.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Current Status</span>
                      <span className={`status-badge ${applicant.status.toLowerCase()}`}>
                        {applicant.status}
                      </span>
                    </div>
                  </div>

                  <div className="applicant-actions">
                    <button className="btn btn-outline btn-icon-text">
                      <Mail size={16} /> Contact
                    </button>
                    
                    <div className="action-group">
                      {applicant.status !== 'Rejected' && (
                        <button 
                          className="btn btn-outline danger btn-icon-text"
                          onClick={() => handleUpdateStatus(applicant._id, 'Rejected')}
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      )}
                      
                      {applicant.status === 'Pending' && (
                        <button 
                          className="btn btn-primary btn-icon-text"
                          onClick={() => handleUpdateStatus(applicant._id, 'Interviewing')}
                        >
                          <CheckCircle size={16} /> Move to Interview
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicants;
