import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import FilterSidebar from '../../components/jobs/FilterSidebar';
import JobCard from '../../components/jobs/JobCard';
import './JobsPage.css';

const JobsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  const initialLocation = searchParams.get('location') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(initialQuery || categoryQuery);
  const [filters, setFilters] = useState({ type: [], experience: [], setup: initialLocation ? [initialLocation] : [] });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    let match = true;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = job.title?.toLowerCase().includes(q);
      const companyMatch = job.companyName?.toLowerCase().includes(q);
      const descMatch = job.description?.toLowerCase().includes(q);
      if (!titleMatch && !companyMatch && !descMatch) match = false;
    }

    if (filters.type.length > 0 && !filters.type.includes(job.type)) match = false;
    if (filters.experience.length > 0 && !filters.experience.includes(job.experienceLevel)) match = false;

    if (filters.setup.length > 0) {
      const isRemote = job.location?.toLowerCase().includes('remote') || job.workSetup?.toLowerCase() === 'remote';
      const isHybrid = job.location?.toLowerCase().includes('hybrid') || job.workSetup?.toLowerCase() === 'hybrid';
      const mappedSetup = isRemote ? 'Remote' : isHybrid ? 'Hybrid' : 'On-site';
      if (!filters.setup.includes(mappedSetup)) match = false;
    }

    return match;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Fix pagination reset effect dependencies
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="jobs-page bg-light">
      <div className="jobs-page-header">
        <div className="container">
          <h1 className="page-title">Find Your Perfect Role</h1>
          <p className="page-subtitle">Browse recent jobs from top companies</p>

          <div className="jobs-search-bar glass-panel">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by job title, company, or keywords..."
              className="jobs-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary search-submit">Search</button>
          </div>
        </div>
      </div>

      <div className="container jobs-page-content section-padding">
        <div className="mobile-filter-toggle">
          <button
            className="btn btn-outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        <div className="jobs-layout">
          <div className={`jobs-sidebar-wrapper ${showMobileFilters ? 'show' : ''}`}>
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          <div className="jobs-list-wrapper">
            <div className="jobs-list-header">
              <h2>All Jobs</h2>
              <div className="sort-dropdown">
                <span>Sort by:</span>
                <select>
                  <option>Most Relevant</option>
                  <option>Newest First</option>
                  <option>Highest Salary</option>
                </select>
              </div>
            </div>

            <div className="jobs-list">
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading jobs...</div>
              ) : currentJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>No jobs found matching your criteria.</div>
              ) : (
                currentJobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`page-number ${currentPage === idx + 1 ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPage(idx + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-outline"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;