import React, { useState } from 'react';
import { Search, MapPin, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_COMPANIES } from '../../data/mockData';
import './CompaniesPage.css';

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = MOCK_COMPANIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.industry && c.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="companies-page bg-light animate-fade-in">
      <div className="companies-page-header">
        <div className="container text-center">
          <h1 className="page-title">Top Companies Hiring on I am HR</h1>
          <p className="page-subtitle">Discover great places to work, read reviews, and explore open jobs.</p>
          
          <div className="companies-search-bar glass-panel">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search for companies by name or industry..." 
              className="companies-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary search-submit">Search</button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="companies-grid-large">
          {filteredCompanies.map(company => (
            <div key={company.id} className="company-profile-card glass-panel">
              <div className="company-card-header">
                <div className="company-logo-large">{company.logo}</div>
                <div>
                  <h3 className="company-name">{company.name}</h3>
                  <div className="company-meta-tags">
                    {company.industry && <span className="category-tag"><Globe size={14} /> {company.industry}</span>}
                    {company.location && <span className="category-tag"><MapPin size={14} /> {company.location}</span>}
                  </div>
                </div>
              </div>
              
              <div className="company-card-body">
                <p className="company-excerpt">
                  Innovating the future of {company.industry || 'technology'} by building products that empower users worldwide.
                </p>
                <div className="job-count">
                  <span className="open-jobs-badge">{company.openJobs} Open Jobs</span>
                </div>
              </div>

              <div className="company-card-footer">
                <Link to={`/companies/${company.id}`} className="btn btn-outline btn-sm follow-btn">View Profile</Link>
                <Link to={`/jobs?company=${company.name}`} className="btn btn-primary btn-sm">See Jobs</Link>
              </div>
            </div>
          ))}
          {filteredCompanies.length === 0 && (
            <div className="no-results">
              <p>No companies found matching "{searchTerm}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
