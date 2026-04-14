import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, FileText, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/jobs/JobCard';
import './SeekerDashboard.css';

const SeekerDashboard = () => {
  const { user } = useAuth();
  
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]); // Will hook up to real saved jobs later
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/api/applications/seeker', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAppliedJobs(data);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const stats = [
    { label: 'Saved Jobs', value: savedJobs.length, icon: Bookmark, color: 'var(--primary)' },
    { label: 'Applications', value: appliedJobs.length, icon: Briefcase, color: 'var(--secondary)' },
    { label: 'Interviews', value: appliedJobs.filter(a => a.status === 'Interviewing').length, icon: CheckCircle, color: 'var(--success)' },
    { label: 'Resumes', value: 1, icon: FileText, color: 'var(--warning)' }
  ];

  return (
    <div className="seeker-dashboard bg-light section-padding">
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted">Welcome back, {user?.fullName || 'User'}! Here is your employment pipeline.</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            Find More Jobs
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="stat-card glass-panel">
                <div className="stat-icon-wrapper" style={{color: stat.color, backgroundColor: `${stat.color}15`}}>
                  <Icon size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dashboard-sections-grid">
          {/* Applications Timeline */}
          <div className="dashboard-section glass-panel">
            <div className="section-header-row mb-4">
              <h2>Recent Applications</h2>
              <Link to="/jobs" className="btn btn-outline btn-sm">View All</Link>
            </div>
            
            <div className="applications-timeline">
              {isLoading ? (
                <div className="empty-state-sm"><p className="text-muted">Loading your pipeline...</p></div>
              ) : appliedJobs.length === 0 ? (
                <div className="empty-state-sm">
                  <p className="text-muted">You haven't applied to any jobs yet.</p>
                </div>
              ) : (
                appliedJobs.map((app) => (
                  <div className="application-item" key={app._id}>
                    <div className="application-logo">
                      {app.jobId?.companyName ? app.jobId.companyName.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="application-details">
                      <h4><Link to={`/jobs/${app.jobId?._id}`}>{app.jobId?.title || 'Unknown Job'}</Link></h4>
                      <p className="text-muted text-sm">{app.jobId?.companyName || 'Unknown Company'} • Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="application-status">
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saved Jobs */}
          <div className="dashboard-section glass-panel">
            <div className="section-header-row mb-4">
              <h2>Saved Jobs</h2>
              <Link to="/jobs" className="btn btn-outline btn-sm">View All</Link>
            </div>
            
            <div className="saved-jobs-list">
              {savedJobs.length === 0 ? (
                <div className="empty-state-sm">
                  <p className="text-muted">No saved jobs.</p>
                </div>
              ) : (
                savedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SeekerDashboard;
