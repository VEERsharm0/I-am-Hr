import React, { useState } from 'react';
import { Search, MapPin, Laptop, Megaphone, Briefcase, Palette, TrendingUp, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../../components/jobs/JobCard';
import { MOCK_JOBS, MOCK_CATEGORIES, MOCK_COMPANIES } from '../../data/mockData';
import './HomePage.css';

const IconMap = { Laptop, Megaphone, Briefcase, Palette, TrendingUp };

const HomePage = () => {
  const featuredJobs = MOCK_JOBS.slice(0, 3);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (locationQuery.trim()) params.append('location', locationQuery.trim());
    
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Dream Job Today</h1>
            <p className="hero-subtitle">Connect with top employers and discover opportunities that match your skills and passion.</p>
            
            <form className="search-box glass-panel" onSubmit={handleSearch}>
              <div className="search-input-group">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="search-divider"></div>
              <div className="search-input-group">
                <MapPin className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="City or remote" 
                  className="search-input" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary search-btn">Search Jobs</button>
            </form>
            
            <div className="popular-searches">
              <span>Popular:</span>
              <Link to="/jobs?q=frontend">Frontend</Link>
              <Link to="/jobs?q=backend">Backend</Link>
              <Link to="/jobs?q=designer">Designer</Link>
              <Link to="/jobs?q=remote">Remote</Link>
            </div>
          </div>
        </div>
        <div className="hero-bg-shape"></div>
      </section>

      {/* Categories Section */}
      <section className="categories-section container section-padding">
        <div className="section-header">
          <h2 className="section-title">Explore by Category</h2>
          <Link to="/jobs" className="view-all-link">All Categories <ChevronRight size={16} /></Link>
        </div>
        
        <div className="categories-grid">
          {MOCK_CATEGORIES.map(cat => {
            const Icon = IconMap[cat.icon];
            return (
              <div 
                key={cat.id} 
                className="category-card" 
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="category-icon-wrapper">
                  {Icon && <Icon size={24} />}
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.count} Open Positions</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs-section section-bg section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Jobs</h2>
            <Link to="/jobs" className="view-all-link">Browse All Jobs <ChevronRight size={16} /></Link>
          </div>
          
          <div className="jobs-grid">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="companies-section container section-padding">
        <div className="section-header">
          <h2 className="section-title">Top Companies Hiring Now</h2>
        </div>
        
        <div className="companies-grid">
          {MOCK_COMPANIES.map(company => (
            <div key={company.id} className="company-card">
              <div className="company-logo-large">{company.logo}</div>
              <h3>{company.name}</h3>
              <p className="open-jobs-badge">{company.openJobs} Open Jobs</p>
              <Link to={`/companies/${company.id}`} className="btn btn-outline btn-sm company-btn">View Profile</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-container">
          <div className="cta-content glass-panel">
            <h2>Ready to take the next step?</h2>
            <p>Create an account to save jobs, apply with one click, and get personalized job alerts.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">Create Account</Link>
              <Link to="/recruiter/post-job" className="btn btn-outline">I'm an Employer</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
