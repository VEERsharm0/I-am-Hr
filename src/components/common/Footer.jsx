import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MessageCircle, Share2, Mail, Globe } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <Link to="/" className="brand">
              <Briefcase className="brand-icon" size={28} />
              <span className="brand-text">I am HR</span>
            </Link>
            <p className="footer-desc">
              Your ultimate destination for finding the perfect job or the ideal candidate. Matching talent with opportunity worldwide.
            </p>
            <div className="social-links">
              <a href="#" aria-label="X"><MessageCircle size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Share2 size={20} /></a>
              <a href="#" aria-label="Contact"><Mail size={20} /></a>
              <a href="#" aria-label="Website"><Globe size={20} /></a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="footer-col">
            <h4 className="footer-heading">For Job Seekers</h4>
            <ul className="footer-links">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/companies">Top Companies</Link></li>
              <li><Link to="/dashboard">Candidate Dashboard</Link></li>
              <li><Link to="/alerts">Job Alerts</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="footer-col">
            <h4 className="footer-heading">For Employers</h4>
            <ul className="footer-links">
              <li><Link to="/recruiter/post-job">Post a Job</Link></li>
              <li><Link to="/recruiter/manage-jobs">Manage Jobs</Link></li>
              <li><Link to="/pricing">Pricing Plans</Link></li>
              <li><Link to="/products">Recruiter Products</Link></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div className="footer-col">
            <h4 className="footer-heading">About Us</h4>
            <ul className="footer-links">
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} I am HR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
