import React from 'react';
import { MapPin, DollarSign, Clock, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job, isRecruiterView = false }) => {
  const companyName = job.companyName || job.company || 'Unknown Company';
  const displaySalary = job.minSalary && job.maxSalary ? `$${job.minSalary/1000}k - $${job.maxSalary/1000}k` : (job.salary || 'Salary Not Disclosed');
  const displaySkills = job.skills || [];

  return (
    <div className="job-card glass-panel animate-fade-in">
      <div className="job-card-header">
        <div className="job-company-logo">
          {companyName.charAt(0)}
        </div>
        <div className="job-basic-info">
          <h3 className="job-title">
            {!isRecruiterView ? (
              <Link to={`/jobs/${job._id || job.id}`}>{job.title}</Link>
            ) : (
              <span>{job.title}</span>
            )}
          </h3>
          <div className="job-company-location">
            <span className="job-company"><Building size={14} /> {companyName}</span>
            <span className="job-location"><MapPin size={14} /> {job.location}</span>
          </div>
        </div>
        {!isRecruiterView && (
          <button className="btn btn-outline btn-sm job-save-btn">Save</button>
        )}
      </div>

      <div className="job-card-body">
        <div className="job-meta">
          <span className="meta-tag"><DollarSign size={14} /> {displaySalary}</span>
          <span className="meta-tag"><Clock size={14} /> {job.type}</span>
          <span className="meta-tag">{job.experienceLevel || job.experience}</span>
        </div>
        
        <p className="job-excerpt">{job.description}</p>
        
        <div className="job-skills">
          {displaySkills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="skill-pill">{skill}</span>
          ))}
          {displaySkills.length > 3 && (
            <span className="skill-pill">+{displaySkills.length - 3}</span>
          )}
        </div>
      </div>

      <div className="job-card-footer">
        <span className="posted-time">Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : job.postedAt}</span>
        
        {!isRecruiterView ? (
          <Link to={`/jobs/${job._id || job.id}`} className="btn btn-primary btn-sm">View Details</Link>
        ) : (
          <div className="recruiter-actions">
            <Link to={`/recruiter/applicants/${job._id || job.id}`} className="btn btn-primary btn-sm">
              {job.applicantsCount || 0} Applicants
            </Link>
            <button className="btn btn-outline btn-sm edit-btn">Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
