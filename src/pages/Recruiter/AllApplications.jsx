import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Briefcase, FileText, CheckCircle, XCircle } from 'lucide-react';
import './JobApplicants.css'; // We can reuse the applicant css styles

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        // Fetch all applications across all jobs for this recruiter
        const res = await fetch('/api/applications/recruiter', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch applications');
        
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

      // Update local state
      setApplications(applications.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      ));
    } catch (e) {
      alert(e.message);
    }
  };

  // Filter based on candidate name or job title
  const filteredApps = applications.filter(app => {
    const term = searchTerm.toLowerCase();
    return app.applicantName.toLowerCase().includes(term) || 
           (app.jobId?.title && app.jobId.title.toLowerCase().includes(term));
  });

  return (
    <div className="applicants-page bg-light section-padding">
      <div className="container">
        <div className="mb-4">
          <Link to="/recruiter" className="back-link">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div className="dashboard-header mb-4">
          <div>
            <h1>All Incoming Applications</h1>
            <p className="text-muted">Review every candidate applying across all your active jobs.</p>
          </div>
          
          <div className="jobs-search-bar glass-panel" style={{margin: 0, padding: '0.5rem 1rem', maxWidth: '400px'}}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search candidate or job role..." 
              className="jobs-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-panel applicants-content">
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '2rem'}}>Loading applications...</div>
          ) : error ? (
            <div style={{textAlign: 'center', padding: '2rem', color: 'red'}}>{error}</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={48} color="var(--text-muted)" />
              </div>
              <p>You haven't received any applications yet.</p>
            </div>
          ) : filteredApps.length === 0 ? (
             <div className="empty-state">
              <p>No applications match your search query.</p>
            </div>
          ) : (
            <div className="applicants-list">
              {filteredApps.map(applicant => (
                <div key={applicant._id} className="applicant-card">
                  <div className="applicant-header">
                    <div className="applicant-info">
                      <div className="applicant-avatar">
                        {applicant.applicantName.charAt(0).toUpperCase()}
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
                    <div className="detail-item" style={{flex: '1 1 100%', marginBottom: '1rem', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                        <Briefcase size={16} className="text-primary" />
                        <strong>Applying For: {applicant.jobId?.title || 'Unknown Job'}</strong>
                      </div>
                      <span className="detail-label">Cover Letter / Details provided:</span>
                      <p className="text-sm" style={{marginTop: '0.25rem', color: 'var(--text-color)'}}>
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
                    <Link to={`/recruiter/applicants/${applicant.jobId?._id}`} className="btn btn-outline btn-icon-text">
                       Go To Job Pipeline
                    </Link>
                    
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

export default AllApplications;
