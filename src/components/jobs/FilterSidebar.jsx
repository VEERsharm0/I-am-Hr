import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ filters = {}, setFilters = () => {} }) => {
  const handleCheckboxChange = (category, value) => {
    setFilters(prev => {
      const currentList = prev[category] || [];
      if (currentList.includes(value)) {
        return { ...prev, [category]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };

  const clearFilters = () => {
    setFilters({ type: [], experience: [], setup: [] });
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['Entry Level (0-2 years)', 'Mid Level (3-5 years)', 'Senior Level (5+ years)', 'Director / Executive'];
  const workSetups = ['Remote', 'Hybrid', 'On-site'];

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters" onClick={clearFilters}>Clear All</button>
      </div>

      <div className="filter-group">
        <h4>Job Type</h4>
        {jobTypes.map(type => (
          <label key={type} className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters?.type?.includes(type) || false}
              onChange={() => handleCheckboxChange('type', type)}
            /> {type}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Experience Level</h4>
        {experienceLevels.map(level => (
          <label key={level} className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters?.experience?.includes(level) || false}
              onChange={() => handleCheckboxChange('experience', level)}
            /> {level}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Work Setup</h4>
        {workSetups.map(setup => (
          <label key={setup} className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters?.setup?.includes(setup) || false}
              onChange={() => handleCheckboxChange('setup', setup)}
            /> {setup}
          </label>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
