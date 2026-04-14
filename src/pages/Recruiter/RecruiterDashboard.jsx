import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, TrendingUp } from 'lucide-react';
import JobCard from '../../components/jobs/JobCard';
import './RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        const [jobsRes, appsRes] = await Promise.all([
          fetch('/api/jobs/recruiter', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/applications/recruiter', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setRecruiterJobs(jobsData.slice(0, 3));
        }

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setRecentApps(appsData.slice(0, 5)); // Show up to 5 recent applications
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Simple stats
  const stats = [
    { label: 'Active Jobs', value: 12, icon: Briefcase, color: 'var(--primary)' },
    { label: 'Total Applicants', value: 348, icon: Users, color: 'var(--secondary)' },
    { label: 'New Resumes', value: 45, icon: FileText, color: 'var(--success)' },
    { label: 'Profile Views', value: '2.4k', icon: TrendingUp, color: 'var(--warning)' }
  ];

  return (
    <div className="recruiter-dashboard bg-light section-padding">
      <div className="container">
        
        <div className="dashboard-header">
          <div>
            <h1>Employer Dashboard</h1>
            <p className="text-muted">Welcome back! Here's an overview of your recruitment pipeline.</p>
          </div>
          <Link to="/recruiter/post-job" className="btn btn-primary">
            + Post a New Job
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

        {/* Recent Jobs Pipeline */}
        <div className="dashboard-section glass-panel">
          <div className="section-header-row">
            <h2>Your Recent Job Postings</h2>
            <Link to="/recruiter/manage-jobs" className="btn btn-outline btn-sm">View All Jobs</Link>
          </div>
          
          <div className="recruiter-jobs-list">
            {isLoading ? (
               <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your jobs...</div>
            ) : recruiterJobs.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>You haven't posted any jobs yet.</div>
            ) : recruiterJobs.map(job => (
              <JobCard key={job._id} job={{...job, id: job._id}} isRecruiterView={true} />
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="dashboard-section glass-panel">
          <h2>Recent Applicants</h2>
          <div className="applicants-table-wrapper">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Applied For</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                      No recent applications.
                    </td>
                  </tr>
                ) : (
                  recentApps.map(app => (
                    <tr key={app._id}>
                      <td>{app.applicantName}</td>
                      <td>{app.jobId?.title || 'Unknown Job'}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <Link 
                          to={`/recruiter/applicants/${app.jobId?._id || ''}`} 
                          className="btn btn-outline btn-sm"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;
