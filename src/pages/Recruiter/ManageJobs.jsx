import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import './ManageJobs.css';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/api/jobs/recruiter', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      // In real scenario we would hit DELETE /api/jobs/:id here
      setJobs(jobs.filter(job => job._id !== id));
    }
  };

  return (
    <div className="manage-jobs-page bg-light section-padding">
      <div className="container">
        
        <div className="dashboard-header">
          <div>
            <h1>Manage Jobs</h1>
            <p className="text-muted">View, edit, and keep track of all your job postings.</p>
          </div>
          <Link to="/recruiter/post-job" className="btn btn-primary">
            + Post a New Job
          </Link>
        </div>

        <div className="glass-panel manage-jobs-content">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading jobs...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>{error}</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Briefcase size={48} color="var(--text-muted)" />
              </div>
              <h3>No Jobs Posted Yet</h3>
              <p className="text-muted">You haven't posted any jobs. Start building your team today!</p>
              <Link to="/recruiter/post-job" className="btn btn-primary mt-3">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Status</th>
                    <th>Posted Date</th>
                    <th>Applications</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id}>
                      <td>
                        <div className="job-title-col">
                          <strong>{job.title}</strong>
                          <span className="text-muted text-sm">{job.location} • {job.type}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${job.status?.toLowerCase() || 'active'}`}>{job.status || 'Active'}</span>
                      </td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/recruiter/applicants/${job._id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                          <div className="applications-count" style={{cursor: 'pointer'}}>
                            <strong>Review</strong>
                            <span className="text-muted text-sm" style={{marginLeft:'4px'}}>applicants</span>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/jobs/${job._id}`} className="btn-icon" title="View">
                            <Eye size={18} />
                          </Link>
                          <button className="btn-icon" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(job._id)}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageJobs;
