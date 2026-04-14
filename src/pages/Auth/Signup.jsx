import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase } from 'lucide-react';
import './Login.css';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('seeker');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mock') === 'recruiter') {
      setRole('recruiter');
    }
  }, [location]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!fullName.trim()) {
        throw new Error('Please enter your full name');
      }
      if (!email.trim()) {
        throw new Error('Please enter your email');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await signup(email, password, role, fullName);

      // Navigate after successful signup
      if (role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      console.error('Signup error:', err); // Debug log
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container glass-panel animate-fade-in">
        <div className="login-header">
          <Briefcase className="brand-icon" size={36} color="var(--primary)" />
          <h2>Create an account</h2>
          <p>Join us and start your journey</p>
        </div>

        <div className="role-toggle">
          <button
            className={`role-btn ${role === 'seeker' ? 'active' : ''}`}
            onClick={() => setRole('seeker')}
            type="button"
          >
            Job Seeker
          </button>
          <button
            className={`role-btn ${role === 'recruiter' ? 'active' : ''}`}
            onClick={() => setRole('recruiter')}
            type="button"
          >
            Employer
          </button>
        </div>

        {error && (
          <div className="auth-error" style={{
            color: '#ef4444',
            margin: '1rem 0',
            padding: '0.75rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="login-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="input-field"
              required
              placeholder={role === 'seeker' ? "john@example.com" : "hr@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading || !fullName || !email || password.length < 6}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing Up...
              </>
            ) : (
              `Sign Up as ${role === 'seeker' ? 'Job Seeker' : 'Employer'}`
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;