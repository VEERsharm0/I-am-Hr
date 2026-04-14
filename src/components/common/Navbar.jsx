import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut, Menu, X, Bell, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { userRole, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const ThemeToggleBtn = () => (
    <button onClick={toggleTheme} className="icon-btn theme-toggle" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} style={{ display: 'flex', alignItems: 'center' }}>
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <Briefcase className="brand-icon" size={28} />
          <span className="brand-text">I am HR</span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          {userRole === 'guest' && (
            <>
              <Link to="/jobs" className="nav-link">Jobs</Link>
              <Link to="/companies" className="nav-link">Companies</Link>
              <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ThemeToggleBtn />
                <Link to="/login" className="btn btn-outline nav-btn">Log In</Link>

              </div>
            </>
          )}

          {userRole === 'seeker' && (
            <>
              <Link to="/jobs" className="nav-link">Find Jobs</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="user-profile-menu">
                <ThemeToggleBtn />
                <Bell size={20} className="icon-btn" />
                <Link to="/profile" className="profile-dropdown-trigger" style={{textDecoration: 'none', color: 'inherit'}}>
                  <div className="avatar">{user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}</div>
                  <span>{user?.fullName || user?.name || 'User'}</span>
                </Link>
                <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}

          {userRole === 'recruiter' && (
            <>
              <Link to="/recruiter" className="nav-link">Dashboard</Link>
              <Link to="/recruiter/manage-jobs" className="nav-link">Manage Jobs</Link>
              <Link to="/recruiter/applications" className="nav-link">Applications</Link>
              <div className="user-profile-menu">
                <Link to="/recruiter/post-job" className="btn btn-primary nav-btn">Post a Job</Link>
                <ThemeToggleBtn />
                <Bell size={20} className="icon-btn" />
                <Link to="/profile" className="profile-dropdown-trigger" style={{textDecoration: 'none', color: 'inherit'}}>
                  <div className="avatar recruiter-avatar">{user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}</div>
                  <span>{user?.fullName || user?.name || 'User'}</span>
                </Link>
                <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-actions">
          <div className="mobile-theme-toggle" style={{ display: 'flex' }}>
            <ThemeToggleBtn />
          </div>
          <button className="mobile-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu animate-fade-in">
          {userRole === 'guest' && (
            <>
              <Link to="/jobs" className="mobile-link" onClick={toggleMenu}>Jobs</Link>
              <Link to="/companies" className="mobile-link" onClick={toggleMenu}>Companies</Link>
              <Link to="/login" className="mobile-link" onClick={toggleMenu}>Log In</Link>
              <Link to="/login?mock=recruiter" className="mobile-link text-primary" onClick={toggleMenu}>Post a Job</Link>
            </>
          )}
          {userRole === 'seeker' && (
            <>
              <Link to="/jobs" className="mobile-link" onClick={toggleMenu}>Find Jobs</Link>
              <Link to="/dashboard" className="mobile-link" onClick={toggleMenu}>Dashboard</Link>
              <button className="mobile-link logout-mobile" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</button>
            </>
          )}
          {userRole === 'recruiter' && (
            <>
              <Link to="/recruiter" className="mobile-link" onClick={toggleMenu}>Dashboard</Link>
              <Link to="/recruiter/manage-jobs" className="mobile-link" onClick={toggleMenu}>Manage Jobs</Link>
              <Link to="/recruiter/applications" className="mobile-link" onClick={toggleMenu}>Applications</Link>
              <Link to="/recruiter/post-job" className="mobile-link text-primary" onClick={toggleMenu}>Post a Job</Link>
              <button className="mobile-link logout-mobile" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
