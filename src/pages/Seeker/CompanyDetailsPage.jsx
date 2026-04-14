import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Users, Briefcase, Calendar, ChevronLeft } from 'lucide-react';
import { MOCK_COMPANIES, MOCK_JOBS } from '../../data/mockData';
import JobCard from '../../components/jobs/JobCard';
import './CompanyDetailsPage.css';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  
  // Find the exact company logic
  const company = MOCK_COMPANIES.find(c => c.id === id);
  
  if (!company) {
    return (
      <div className="container result-not-found">
        <h2>Company not found</h2>
        <p>The company profile you are looking for does not exist.</p>
        <Link to="/companies" className="btn btn-primary">Back to Companies</Link>
      </div>
    );
  }

  // Filter jobs by this exact company name
  const companyJobs = MOCK_JOBS.filter(job => job.company === company.name);

  return (
    <div className="company-details-page animate-fade-in">
      {/* Decorative Header Banner */}
      <div className="company-banner">
        <div className="container">
          <Link to="/companies" className="back-link">
            <ChevronLeft size={20} /> Back to Companies
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="company-details-layout">
          {/* Main Info Box overlaying the banner */}
          <div className="company-main-card glass-panel">
            <div className="company-brand-header">
              <div className="company-logo-giant">{company.logo}</div>
              <div className="company-title-area">
                <h1 className="company-title">{company.name}</h1>
                <div className="company-badges">
                  {company.industry && <span className="badge"><Briefcase size={16}/> {company.industry}</span>}
                  {company.location && <span className="badge"><MapPin size={16}/> {company.location}</span>}
                </div>
              </div>
            </div>

            <div className="company-about-section">
              <h3>About the Company</h3>
              <p className="company-description">{company.description || "No description available for this company."}</p>
            </div>

            <div className="company-stats-grid">
              <div className="stat-card">
                <Globe size={24} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-label">Website</span>
                  <span className="stat-value"><a href={`https://${company.website}`} target="_blank" rel="noreferrer">{company.website}</a></span>
                </div>
              </div>
              <div className="stat-card">
                <Users size={24} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-label">Company Size</span>
                  <span className="stat-value">{company.size || "Unknown"}</span>
                </div>
              </div>
              <div className="stat-card">
                <Calendar size={24} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-label">Founded</span>
                  <span className="stat-value">{company.founded || "Unknown"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Open Jobs Section */}
          <div className="company-open-jobs">
            <div className="jobs-header">
              <h2>Open Positions at {company.name}</h2>
              <span className="jobs-count-pill">{companyJobs.length} Jobs</span>
            </div>
            
            {companyJobs.length > 0 ? (
              <div className="jobs-list">
                {companyJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="empty-state glass-panel">
                <Briefcase size={48} className="empty-icon" />
                <h3>No open positions</h3>
                <p>{company.name} currently has no active job listings on our platform.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
